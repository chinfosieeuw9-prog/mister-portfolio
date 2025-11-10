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
    if (allFiles.length === 0) {
        list.innerHTML = '<li>Geen bestanden gevonden.</li>';
        return;
    }
    list.innerHTML = '';
    allFiles.forEach(file => {
        const li = document.createElement('li');
        // Bestandsnaam
        const nameSpan = document.createElement('span');
        nameSpan.textContent = file.name;
        li.appendChild(nameSpan);
        // Map-label
        const folderLabel = document.createElement('span');
        folderLabel.textContent = file.folder;
        folderLabel.style.background = '#23234a';
        folderLabel.style.color = '#4ade80';
        folderLabel.style.fontSize = '0.95em';
        folderLabel.style.padding = '2px 8px';
        folderLabel.style.borderRadius = '8px';
        folderLabel.style.marginLeft = '10px';
        folderLabel.style.marginRight = '4px';
        li.appendChild(folderLabel);
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
        // Download link
        const a = document.createElement('a');
        a.href = supabase.storage.from('Bestanden').getPublicUrl(file.folder + '/' + file.name).publicUrl;
        a.textContent = 'Download';
    a.className = 'admin-btn file-btn';
    a.style.marginLeft = '8px';
    a.style.fontSize = '0.92em';
    a.style.padding = '3px 12px';
    a.style.height = '26px';
    a.setAttribute('download', file.name);
    li.appendChild(a);
    // Verwijderknop
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Verwijderen';
    delBtn.className = 'admin-btn file-btn';
    delBtn.style.background = '#ef4444';
    delBtn.style.marginLeft = '4px';
    delBtn.style.fontSize = '0.92em';
    delBtn.style.padding = '3px 12px';
    delBtn.style.height = '26px';
    delBtn.onclick = async function() {
            if (!confirm('Weet je zeker dat je dit bestand wilt verwijderen?')) return;
            delBtn.disabled = true;
            delBtn.textContent = 'Verwijderen...';
            const { error } = await supabase.storage.from('Bestanden').remove([file.folder + '/' + file.name]);
            if (error) {
                alert('Fout bij verwijderen: ' + error.message);
                delBtn.disabled = false;
                delBtn.textContent = 'Verwijderen';
                return;
            }
            if (typeof showAdminNotification === 'function') showAdminNotification('Bestand verwijderd: ' + file.name, 'success');
            if (typeof addLogboekEntry === 'function') addLogboekEntry('Bestand verwijderd: ' + file.name);
            await loadFiles();
        };
        li.appendChild(delBtn);
        list.appendChild(li);
    });
}
document.addEventListener('DOMContentLoaded', loadFiles);

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
import { supabase } from './supabase-client.js';

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
            }
        });
    });
    tabButtons.forEach((b, i) => {
        if (i === 0) b.classList.add('active');
        else b.classList.remove('active');
    });
    tabContents.forEach((tc, i) => {
        if (i === 0) {
            tc.classList.add('active');
            tc.style.display = '';
        } else {
            tc.classList.remove('active');
            tc.style.display = 'none';
        }
    });
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
