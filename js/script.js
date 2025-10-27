// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
// --- Software Upload Dialog Logic ---
document.addEventListener('DOMContentLoaded', () => {
    // Alleen als upload-dialog bestaat (modal wordt dynamisch toegevoegd)
    document.body.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'upload-software-btn') {
            e.preventDefault();
            handleSoftwareUpload();
        }
    });

    // Drag & drop events op dropzone
    document.body.addEventListener('dragover', function(e) {
        const dz = document.querySelector('#upload-dialog .upload-dropzone');
        if (dz && e.target && dz.contains(e.target)) {
            e.preventDefault();
            dz.classList.add('dragover');
        }
    });
    document.body.addEventListener('dragleave', function(e) {
        const dz = document.querySelector('#upload-dialog .upload-dropzone');
        if (dz && e.target && dz.contains(e.target)) {
            dz.classList.remove('dragover');
        }
    });
    document.body.addEventListener('drop', function(e) {
        const dz = document.querySelector('#upload-dialog .upload-dropzone');
        if (dz && e.target && dz.contains(e.target)) {
            e.preventDefault();
            dz.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files && files.length > 0) {
                document.getElementById('software-file').files = files;
                updateFileDisplay(document.getElementById('software-file'));
            }
        }
    });
});

function updateFileDisplay(input) {
    const dz = input.closest('#upload-dialog').querySelector('.upload-dropzone');
    if (input.files && input.files.length > 0) {
        dz.innerHTML = `<div style="font-size:24px;margin-bottom:8px;">📂</div><div>${input.files[0].name}</div>`;
    } else {
        dz.innerHTML = `<div style="font-size:24px;margin-bottom:8px;">📂</div><div>Klik om te selecteren of sleep een bestand</div><div style='font-size:12px;color:#888;'>.exe, .msi, .zip, .rar, .dmg, .deb</div>`;
    }
}

async function handleSoftwareUpload() {
    const dialog = document.getElementById('upload-dialog');
    const fileInput = dialog.querySelector('#software-file');
    const nameInput = dialog.querySelector('#software-name');
    const catInput = dialog.querySelector('#software-category');
    const descInput = dialog.querySelector('#software-description');
    const progressBar = getOrCreateProgressBar(dialog);

    // Validatie
    if (!fileInput.files || fileInput.files.length === 0) {
        showNotification('Selecteer een bestand om te uploaden.', 'error');
        return;
    }
    if (!nameInput.value.trim()) {
        showNotification('Vul een software naam in.', 'error');
        return;
    }
    if (!catInput.value) {
        showNotification('Selecteer een categorie.', 'error');
        return;
    }

    // Upload
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('name', nameInput.value.trim());
    formData.append('category', catInput.value);
    formData.append('description', descInput.value.trim());

    progressBar.style.display = 'block';
    progressBar.value = 0;
    progressBar.max = 100;
    setProgressLabel(progressBar, 'Uploaden...');

    try {
        const response = await uploadWithProgress('http://localhost:3001/upload', formData, progressBar);
        if (response.success) {
            setProgressLabel(progressBar, '✅ Upload gelukt!');
            showNotification('Upload gelukt! Bestand staat nu op GitHub.', 'success');
            setTimeout(() => { dialog.remove(); }, 1500);
        } else {
            throw new Error(response.error || 'Onbekende fout');
        }
    } catch (err) {
        setProgressLabel(progressBar, '❌ Upload mislukt');
        showNotification('Upload mislukt: ' + err.message, 'error');
    }
}

function getOrCreateProgressBar(dialog) {
    let pb = dialog.querySelector('.upload-progress');
    if (!pb) {
        pb = document.createElement('progress');
        pb.className = 'upload-progress';
        pb.style.cssText = 'width:100%;margin-bottom:12px;height:18px;display:block;';
        pb.value = 0;
        pb.max = 100;
        dialog.querySelector('form, .upload-dropzone').insertAdjacentElement('afterend', pb);
    }
    return pb;
}

function setProgressLabel(pb, text) {
    let label = pb.nextElementSibling;
    if (!label || !label.classList.contains('progress-label')) {
        label = document.createElement('div');
        label.className = 'progress-label';
        label.style = 'color:#ccc;font-size:13px;margin-bottom:8px;';
        pb.insertAdjacentElement('afterend', label);
    }
    label.textContent = text;
}

function uploadWithProgress(url, formData, progressBar) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.onload = function() {
            try {
                const res = JSON.parse(xhr.responseText);
                if (xhr.status === 200) resolve(res);
                else reject(res);
            } catch (e) { reject({ error: 'Ongeldige server respons' }); }
        };
        xhr.onerror = function() { reject({ error: 'Netwerkfout' }); };
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                progressBar.value = Math.round((e.loaded / e.total) * 100);
                setProgressLabel(progressBar, `Uploaden... ${progressBar.value}%`);
            }
        };
        xhr.send(formData);
    });
}
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('Vul alle velden in!', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Voer een geldig email adres in!', 'error');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Versturen...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Bedankt voor je bericht! Ik neem zo snel mogelijk contact met je op.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            line-height: 1;
        }
        .notification-close:hover {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Scroll animations with Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add special animation for stats
            if (entry.target.classList.contains('stat')) {
                animateCounter(entry.target);
            }
        }
    });
}, observerOptions);

// Counter animation for stats
function animateCounter(element) {
    const numberElement = element.querySelector('h3');
    const finalNumber = parseInt(numberElement.textContent);
    let currentNumber = 0;
    const increment = finalNumber / 50; // Adjust speed
    const timer = setInterval(() => {
        currentNumber += increment;
        if (currentNumber >= finalNumber) {
            numberElement.textContent = finalNumber + (numberElement.textContent.includes('+') ? '+' : '') + 
                                      (numberElement.textContent.includes('%') ? '%' : '');
            clearInterval(timer);
        } else {
            numberElement.textContent = Math.floor(currentNumber) + (numberElement.textContent.includes('+') ? '+' : '') + 
                                      (numberElement.textContent.includes('%') ? '%' : '');
        }
    }, 40);
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Upload knop in linker menu koppelen
    const sidebarUploadBtn = document.querySelector('.actions .explorer-btn');
    const uploadDialogSidebar = document.getElementById('upload-dialog');
    if (sidebarUploadBtn && uploadDialogSidebar) {
        sidebarUploadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            uploadDialogSidebar.style.display = 'block';
        });
    }
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .stat');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            typeWriter(heroTitle, heroTitle.textContent, 80);
        }, 500);
    }

    // Upload knop in Software Explorer koppelen
    const uploadBtn = document.getElementById('upload-software-btn');
    const uploadDialog = document.getElementById('upload-dialog');
    if (uploadBtn && uploadDialog) {
        uploadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            uploadDialog.style.display = 'block';
        });
    }
    // Cancel knop koppelen
    const cancelBtn = document.querySelector('.cancel-btn');
    if (cancelBtn && uploadDialog) {
        cancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            uploadDialog.style.display = 'none';
        });
    }
});

// Type writer effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function typing() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    
    typing();
}

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styling
const activeStyle = document.createElement('style');
activeStyle.textContent = `
    .nav-link.active {
        color: #2563eb !important;
        font-weight: 600;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(activeStyle);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Tech tag hover effects
document.addEventListener('DOMContentLoaded', () => {
    const techTags = document.querySelectorAll('.tech-tag');
    techTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            techTags.forEach(otherTag => {
                if (otherTag !== tag) {
                    otherTag.style.opacity = '0.5';
                }
            });
        });
        
        tag.addEventListener('mouseleave', () => {
            techTags.forEach(otherTag => {
                otherTag.style.opacity = '1';
            });
        });
    });
});

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        showNotification('🎉 Easter egg gevonden! Je hebt de Konami code ingevoerd!', 'success');
        
        // Add fun animation
        document.body.style.animation = 'rainbow 2s infinite';
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 4000);
        
        konamiCode = [];
    }
});

console.log('🚀 Mister Portfolio geladen! Probeer de Konami code: ↑↑↓↓←→←→BA');