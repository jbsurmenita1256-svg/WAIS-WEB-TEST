// WAIS Login & Registration - Simple Beginner JavaScript

var USERS_FILE = 'database/users.txt';
var allUsers = [];

async function hashPassword(password) {
  var data = new TextEncoder().encode(password);
  var hashBuffer = await crypto.subtle.digest('SHA-256', data);
  var hashBytes = new Uint8Array(hashBuffer);
  var hex = '';
  for (var i = 0; i < hashBytes.length; i++) {
    var part = hashBytes[i].toString(16);
    if (part.length === 1) part = '0' + part;
    hex = hex + part;
  }
  return hex;
}

function parseUsersTxt(text) {
  var lines = text.split('\r').join('').split('\n');
  var list = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line === '' || line[0] === '#') continue;
    var cols = line.split('|');
    if (cols.length >= 4) {
      list.push({
        email: cols[0].trim().toLowerCase(),
        name: cols[1].trim(),
        role: cols[2].trim().toLowerCase(),
        hash: cols[3].trim()
      });
    }
  }
  return list;
}

async function loadUsers() {
  allUsers = [];

  var savedOverride = localStorage.getItem('wais_users_override');
  if (savedOverride !== null) {
    allUsers = parseUsersTxt(savedOverride);
  } else {
    try {
      var res = await fetch(USERS_FILE, { cache: 'no-store' });
      if (res.ok) {
        var text = await res.text();
        allUsers = parseUsersTxt(text);
      }
    } catch (err) {
      console.log('Could not load users.txt');
    }
  }

  var extraRaw = localStorage.getItem('wais_users_extra');
  if (extraRaw) {
    var extraList = JSON.parse(extraRaw);
    for (var i = 0; i < extraList.length; i++) {
      var exists = false;
      for (var j = 0; j < allUsers.length; j++) {
        if (allUsers[j].email === extraList[i].email) {
          exists = true;
          break;
        }
      }
      if (!exists) allUsers.push(extraList[i]);
    }
  }

  showCurrentSession();
}

function showCurrentSession() {
  var raw = sessionStorage.getItem('wais_session');
  var box = document.getElementById('sessionBox');
  var logoutBtn = document.getElementById('logoutBtn');
  var goAdminBtn = document.getElementById('goAdminBtn');
  var goShopBtn = document.getElementById('goShopBtn');

  if (!raw) {
    box.hidden = true;
    logoutBtn.hidden = true;
    goAdminBtn.hidden = true;
    goShopBtn.hidden = true;
    return;
  }

  var user = JSON.parse(raw);
  box.hidden = false;
  box.textContent = 'Signed in as ' + user.name + ' (' + user.role + ')';
  logoutBtn.hidden = false;
  goShopBtn.hidden = false;
  goAdminBtn.hidden = user.role !== 'admin';
}

function showMessage(text, isError) {
  var msg = document.getElementById('authMessage');
  msg.textContent = text;
  msg.className = isError ? 'auth-msg err' : 'auth-msg ok';
}

function openLoginTab() {
  document.getElementById('loginForm').hidden = false;
  document.getElementById('registerForm').hidden = true;
  document.getElementById('showLoginTab').classList.add('green');
  document.getElementById('showRegisterTab').classList.remove('green');
  showMessage('', false);
}

function openRegisterTab() {
  document.getElementById('loginForm').hidden = true;
  document.getElementById('registerForm').hidden = false;
  document.getElementById('showRegisterTab').classList.add('green');
  document.getElementById('showLoginTab').classList.remove('green');
  showMessage('', false);
}

document.getElementById('showLoginTab').onclick = openLoginTab;
document.getElementById('showRegisterTab').onclick = openRegisterTab;

// Handle Login -> redirect to admin.html (for admin) or shop.html (for customers)
document.getElementById('loginForm').onsubmit = async function (e) {
  e.preventDefault();
  var username = document.getElementById('loginEmail').value.trim().toLowerCase();
  var password = document.getElementById('loginPass').value;
  var enteredHash = await hashPassword(password);

  var matchedUser = null;
  for (var i = 0; i < allUsers.length; i++) {
    if (allUsers[i].email === username && allUsers[i].hash === enteredHash) {
      matchedUser = allUsers[i];
      break;
    }
  }

  if (!matchedUser) {
    showMessage('Wrong username/email or password.', true);
    return;
  }

  sessionStorage.setItem('wais_session', JSON.stringify({
    email: matchedUser.email,
    name: matchedUser.name,
    role: matchedUser.role
  }));

  document.getElementById('loginPass').value = '';
  showCurrentSession();

  if (matchedUser.role === 'admin') {
    window.location.href = 'admin.html';
  } else {
    window.location.href = 'shop.html';
  }
};

// Handle Registration -> always creates a customer account
document.getElementById('registerForm').onsubmit = async function (e) {
  e.preventDefault();
  var name = document.getElementById('regName').value.trim();
  var username = document.getElementById('regEmail').value.trim().toLowerCase();
  var password = document.getElementById('regPass').value;

  for (var i = 0; i < allUsers.length; i++) {
    if (allUsers[i].email === username) {
      showMessage('That username or email is already taken.', true);
      return;
    }
  }

  var hash = await hashPassword(password);
  var newUser = { email: username, name: name, role: 'customer', hash: hash };

  var extraRaw = localStorage.getItem('wais_users_extra');
  var extraList = extraRaw ? JSON.parse(extraRaw) : [];
  extraList.push(newUser);
  localStorage.setItem('wais_users_extra', JSON.stringify(extraList));
  allUsers.push(newUser);

  sessionStorage.setItem('wais_session', JSON.stringify({
    email: newUser.email,
    name: newUser.name,
    role: 'customer'
  }));

  document.getElementById('regPass').value = '';
  window.location.href = 'shop.html';
};

document.getElementById('logoutBtn').onclick = function () {
  sessionStorage.removeItem('wais_session');
  showCurrentSession();
  showMessage('Signed out.', false);
};

if (window.location.search.indexOf('tab=register') !== -1) {
  openRegisterTab();
}

loadUsers();
