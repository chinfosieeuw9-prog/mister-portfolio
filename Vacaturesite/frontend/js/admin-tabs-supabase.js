import { supabase } from './supabase-client.js';
// Zorg dat de uitlogknop altijd werkt
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('admin-logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            localStorage.removeItem('isAdmin');
            if (typeof showAdminNotification === 'function') showAdminNotification('Je bent uitgelogd.', 'success', 1800);
            setTimeout(() => { window.location.href = 'index.html'; }, 1200);
        };
    }
});
// --- Bestanden-tab: uploaden, downloaden, verwijderen, map-selector ---
async function loadFiles() {
    const list = document.getElementById('file-list');
    if (!list) return;
    list.innerHTML = '<li>Laden...</li>';
    // Haal alle mappen op
    const folders = ['system-tools', 'netwerk-tools', 'security-tools', 'archives', 'software'];
    let allFiles = [];
    for (const folder of folders) {
        const { data, error } = await supabase.storage.from('Bestanden').list(folder, { limit: 100 });
        if (error) continue;
        if (data && data.length > 0) {
            allFiles = allFiles.concat(data.map(f => ({ ...f, folder })));
        }
    }
    // Boomstructuur bouwen: {folder: [files]}
    const tree = {};
    allFiles.forEach(file => {
        if (!tree[file.folder]) tree[file.folder] = [];
        tree[file.folder].push(file);
    });
    Object.keys(tree).forEach(folder => {
        // Map-node
        const folderLi = document.createElement('li');
        folderLi.textContent = '📁 ' + folder;
        folderLi.style.fontWeight = 'bold';
        folderLi.style.marginTop = '10px';
        folderLi.style.listStyle = 'none';
        list.appendChild(folderLi);
        // Bestanden in map
        tree[folder].forEach(file => {
            const li = document.createElement('li');
            li.style.listStyle = 'none';
            li.style.marginLeft = '22px';
            // Bestand-icoon en naam (klikbaar)
            const nameSpan = document.createElement('span');
            nameSpan.textContent = '📄 ' + file.name;
            nameSpan.style.cursor = 'pointer';
            nameSpan.style.color = '#2563eb';
            nameSpan.addEventListener('click', function() {
                showInlinePreview(file);
            });
            li.appendChild(nameSpan);
            // Upload-datum
            if (file.created_at) {
                const date = new Date(file.created_at);
                const dateStr = date.toLocaleDateString('nl-NL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                const dateSpan = document.createElement('span');
                dateSpan.textContent = dateStr;
                dateSpan.style.color = '#aaa';
                dateSpan.style.fontSize = '0.95em';
                dateSpan.style.marginLeft = '8px';
                li.appendChild(dateSpan);
            }
            // Download-link (compat: oude en nieuwe Supabase SDK)
            let publicUrl = '';
            const supabasePath = file.folder + '/' + file.name;
            const publicUrlObj = supabase.storage.from('Bestanden').getPublicUrl(supabasePath);
            if (publicUrlObj.publicUrl) {
                publicUrl = publicUrlObj.publicUrl;
            } else if (publicUrlObj.data && publicUrlObj.data.publicUrl) {
                publicUrl = publicUrlObj.data.publicUrl;
            }
            if (publicUrl && publicUrl.startsWith('https://')) {
                const a = document.createElement('a');
                a.href = publicUrl;
                a.textContent = 'Download';
                a.className = 'admin-btn file-btn';
                a.style.marginLeft = '8px';
                li.appendChild(a);
            }
            folderLi.appendChild(li);
        });
    });
}
// Inline preview functie
function showInlinePreview(file) {
    let previewDiv = document.getElementById('inline-preview');
    if (!previewDiv) {
        previewDiv = document.createElement('div');
        previewDiv.id = 'inline-preview';
        previewDiv.style.position = 'fixed';
        previewDiv.style.top = '60px';
        previewDiv.style.right = '40px';
        previewDiv.style.background = '#fff';
        previewDiv.style.border = '1px solid #ccc';
        previewDiv.style.padding = '18px';
        previewDiv.style.zIndex = 1000;
        previewDiv.style.maxWidth = '420px';
        previewDiv.style.maxHeight = '80vh';
        previewDiv.style.overflow = 'auto';
        document.body.appendChild(previewDiv);
    }
    // Leegmaken
    previewDiv.innerHTML = '';
    // Titel
    const title = document.createElement('div');
    title.textContent = 'Preview: ' + file.name;
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '8px';
    previewDiv.appendChild(title);
    // Ophalen publicUrl
    const supabasePath = file.folder + '/' + file.name;
    const publicUrlObj = supabase.storage.from('Bestanden').getPublicUrl(supabasePath);
    let publicUrl = '';
    if (publicUrlObj.publicUrl) {
        publicUrl = publicUrlObj.publicUrl;
    } else if (publicUrlObj.data && publicUrlObj.data.publicUrl) {
        publicUrl = publicUrlObj.data.publicUrl;
    }
    // Preview type bepalen
    if (publicUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)) {
        const img = document.createElement('img');
        img.src = publicUrl;
        img.style.maxWidth = '400px';
        img.style.maxHeight = '60vh';
        previewDiv.appendChild(img);
    } else if (publicUrl && /\.(txt|md|json|js|css|html)$/i.test(file.name)) {
        fetch(publicUrl)
            .then(r => r.text())
            .then(text => {
                const pre = document.createElement('pre');
                pre.textContent = text.substring(0, 2000) + (text.length > 2000 ? '\n... (ingekort)' : '');
                previewDiv.appendChild(pre);
            });
    } else if (publicUrl) {
        const a = document.createElement('a');
        a.href = publicUrl;
        a.textContent = 'Open bestand';
        a.target = '_blank';
        previewDiv.appendChild(a);
    } else {
        previewDiv.textContent = 'Geen preview beschikbaar.';
    }
    // Sluitknop
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Sluiten';
    closeBtn.style.marginTop = '12px';
    closeBtn.onclick = () => previewDiv.remove();
    previewDiv.appendChild(closeBtn);
}

// Upload bestand naar gekozen map
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('file-upload-form');
    if (uploadForm) {
        uploadForm.onsubmit = async function(e) {
            e.preventDefault();
            const map = document.getElementById('file-upload-map').value;
            const fileInput = document.getElementById('file-upload-input');
            const msg = document.getElementById('file-upload-msg');
            if (!fileInput.files.length) {
                msg.textContent = 'Geen bestand geselecteerd.';
                msg.style.color = '#f87171';
                return;
            }
            const file = fileInput.files[0];
            msg.textContent = 'Uploaden...';
            msg.style.color = '';
            // Upload naar Supabase bucket 'Bestanden' in gekozen map
            const { data, error } = await supabase.storage.from('Bestanden').upload(map + '/' + file.name, file, { upsert: true });
            if (error) {
                msg.textContent = 'Fout bij uploaden: ' + error.message;
                msg.style.color = '#f87171';
                return;
            }
            msg.textContent = 'Upload gelukt!';
            msg.style.color = '#4ade80';
            if (typeof showAdminNotification === 'function') showAdminNotification('Bestand geüpload: ' + file.name, 'success');
            if (typeof addLogboekEntry === 'function') addLogboekEntry('Bestand geüpload: ' + file.name);
            uploadForm.reset();
            await loadFiles();
        };
    }
});
// Supabase CV-bestanden ophalen en tonen in beheer (demo)


async function loadCVFiles() {
    const list = document.getElementById('cv-file-list');
    if (!list) return;
    list.innerHTML = '<li>Laden...</li>';
    const { data, error } = await supabase.storage.from('CV').list('', { limit: 100 });
    if (error) {
        list.innerHTML = '<li>Fout bij laden van bestanden.</li>';
        return;
    }
    if (!data || data.length === 0) {
        list.innerHTML = '<li>Geen CV-bestanden gevonden.</li>';
        return;
    }
    list.innerHTML = '';
    data.forEach(file => {
        const li = document.createElement('li');
        // Bestandsnaam
        const nameSpan = document.createElement('span');
        nameSpan.textContent = file.name;
        li.appendChild(nameSpan);
        // Upload-datum (indien beschikbaar)
        if (file.created_at) {
            const date = new Date(file.created_at);
            const dateStr = date.toLocaleDateString('nl-NL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
            const dateSpan = document.createElement('span');
            dateSpan.textContent = ' (' + dateStr + ')';
            dateSpan.style.color = '#aaa';
            dateSpan.style.fontSize = '0.95em';
            dateSpan.style.marginLeft = '8px';
            li.appendChild(dateSpan);
        }
        // Download link
        const a = document.createElement('a');
        a.href = supabase.storage.from('CV').getPublicUrl(file.name).publicUrl;
        a.textContent = 'Download';
        a.className = 'admin-btn';
        a.style.marginLeft = '10px';
        a.setAttribute('download', file.name);
        li.appendChild(a);
        // Verwijderknop
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Verwijderen';
        delBtn.className = 'admin-btn';
        delBtn.style.background = '#ef4444';
        delBtn.style.marginLeft = '6px';
        delBtn.onclick = async function() {
            if (!confirm('Weet je zeker dat je dit bestand wilt verwijderen?')) return;
            delBtn.disabled = true;
            delBtn.textContent = 'Verwijderen...';
            const { error } = await supabase.storage.from('CV').remove([file.name]);
            if (error) {
                alert('Fout bij verwijderen: ' + error.message);
                delBtn.disabled = false;
                delBtn.textContent = 'Verwijderen';
                return;
            }
            if (typeof showAdminNotification === 'function') showAdminNotification('CV verwijderd: ' + file.name, 'success');
            if (typeof addLogboekEntry === 'function') addLogboekEntry('CV verwijderd: ' + file.name);
            await loadCVFiles();
        };
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}
document.addEventListener('DOMContentLoaded', loadCVFiles);

// Tab-functionaliteit: wissel tussen tabbladen
// ...bestaande tab code...
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.admin-tab-demo');
    const tabContents = document.querySelectorAll('.admin-tab-content-demo');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            tabContents.forEach(tc => tc.style.display = 'none'); // <-- fixed: removed stray semicolon
            btn.classList.add('active');
            const tab = btn.getAttribute('data-tab');
            const content = document.getElementById('tab-' + tab);
            if (content) {
                content.classList.add('active');
                content.style.display = '';
                // Scroll de gekozen sectie in beeld (handig op mobiel)
                try { content.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch {}
            }
        });
    });
    // Initial state: toon de content die hoort bij de EERSTE knop (niet de eerste content in DOM)
    if (tabButtons.length) {
        const firstBtn = tabButtons[0];
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(tc => { tc.classList.remove('active'); tc.style.display = 'none'; });
        firstBtn.classList.add('active');
        const firstTab = firstBtn.getAttribute('data-tab');
        const firstContent = document.getElementById('tab-' + firstTab);
        if (firstContent) { firstContent.classList.add('active'); firstContent.style.display = ''; }
    }
});

// Upload CV-bestand naar Supabase bucket
// (UI: admin-tab-cv uploadformulier)
document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('cv-upload-form');
    if (uploadForm) {
        uploadForm.onsubmit = async function(e) {
            e.preventDefault();
            const fileInput = uploadForm.querySelector('input[type="file"]');
            const msg = document.getElementById('cv-upload-msg');
            if (!fileInput.files.length) {
                msg.textContent = 'Geen bestand geselecteerd.';
                msg.style.color = '#f87171';
                return;
            }
            const file = fileInput.files[0];
            msg.textContent = 'Uploaden...';
            msg.style.color = '';
            // Upload naar Supabase bucket 'CV'
            const { data, error } = await supabase.storage.from('CV').upload(file.name, file, { upsert: true });
            if (error) {
                msg.textContent = 'Fout bij uploaden: ' + error.message;
                msg.style.color = '#f87171';
                return;
            }
            msg.textContent = 'Upload gelukt!';
            msg.style.color = '#4ade80';
            if (typeof showAdminNotification === 'function') showAdminNotification('CV geüpload naar Supabase!', 'success');
            if (typeof addLogboekEntry === 'function') addLogboekEntry('CV geüpload: ' + file.name);
            uploadForm.reset();
            await loadCVFiles();
        };
    }
});
// ...einde script...
