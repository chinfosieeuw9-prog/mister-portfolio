// Simpele admin login/logout toggle voor nieuws toevoegen-formulier
window.isAdmin = localStorage.getItem('isAdmin') === 'true';

window.showAdminLogin = function() {
	// Simuleer een login prompt (vervang door echte login indien nodig)
	const wachtwoord = prompt('Voer admin wachtwoord in:');
	if (wachtwoord === 'admin123') { // Vervang door echte check
		window.isAdmin = true;
		localStorage.setItem('isAdmin', 'true');
		showNewsAdminForm(true);
		document.getElementById('admin-login-btn').style.display = 'none';
		alert('Admin login succesvol!');
	} else {
		alert('Wachtwoord onjuist.');
	}
};

window.logoutAdmin = function() {
	window.isAdmin = false;
	localStorage.removeItem('isAdmin');
	showNewsAdminForm(false);
	document.getElementById('admin-login-btn').style.display = '';
	alert('Uitgelogd als admin.');
};

// Voeg een logout knop toe aan de pagina als admin is ingelogd
function updateLogoutButton() {
	let btn = document.getElementById('admin-logout-btn');
	if (window.isAdmin) {
		if (!btn) {
			btn = document.createElement('button');
			btn.id = 'admin-logout-btn';
			btn.textContent = 'Admin uitloggen';
			btn.style = 'margin:12px 0 0 0;padding:8px 18px;background:#ef4444;color:#fff;border:none;border-radius:6px;cursor:pointer;display:block;';
			btn.onclick = window.logoutAdmin;
			document.body.prepend(btn);
		} else {
			btn.style.display = 'block';
		}
	} else if (btn) {
		btn.style.display = 'none';
	}
}

// Hook in op login/logout events
const origShowAdminLogin = window.showAdminLogin;
window.showAdminLogin = function() {
	origShowAdminLogin();
	updateLogoutButton();
};
const origLogoutAdmin = window.logoutAdmin;
window.logoutAdmin = function() {
	origLogoutAdmin();
	updateLogoutButton();
};
