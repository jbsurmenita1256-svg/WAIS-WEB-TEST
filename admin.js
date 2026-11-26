// WAIS Admin Table Database Editor 

var CATEGORY_FILES = {
  'Laptop': 'database/laptop.txt',
  'Components': 'database/components.txt',
  'Accessories': 'database/accessories.txt',
  'Gaming Consoles': 'database/gaming_consoles.txt',
  'Users': 'database/users.txt'
};

var currentTable = 'Laptop';
var rows = [];

function makeEl(tag, className, text) {
  var el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

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

function showStatus(text) {
  var box = document.getElementById('adminStatus');
  box.hidden = false;
  box.textContent = text;
}

// Parse product .txt file into table rows
function parseProductRows(text) {
  var lines = text.split('\r').join('').split('\n');
  var list = [];
  var current = null;
  var mode = '';

  function saveCurrent() {
    if (current === null) return;
    list.push(current);
    current = null;
    mode = '';
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line === '' || line[0] === '#') continue;
    var lower = line.toLowerCase();

    if (lower.indexOf('categories:') === 0 || lower.indexOf('category:') === 0) {
      saveCurrent();
      continue;
    }

    if (current !== null) {
      if (lower.indexOf('image:') === 0) {
        current.image = line.slice(line.indexOf(':') + 1).trim();
        mode = '';
        continue;
      }
      if (lower.indexOf('alt:') === 0) {
        current.alt = line.slice(line.indexOf(':') + 1).trim();
        mode = '';
        continue;
      }
      if (lower.indexOf('date:') === 0) {
        current.date = line.slice(line.indexOf(':') + 1).trim();
        mode = '';
        continue;
      }
      if (lower.indexOf('description:') === 0) {
        current.description = line.slice(line.indexOf(':') + 1).trim();
        mode = '';
        continue;
      }
      if (lower.indexOf('pros:') === 0) {
        mode = 'pros';
        continue;
      }
      if (lower.indexOf('cons:') === 0) {
        mode = 'cons';
        continue;
      }
      if ((mode === 'pros' || mode === 'cons') && line.indexOf('- ') === 0) {
        if (mode === 'pros') current.pros.push(line.slice(2).trim());
        if (mode === 'cons') current.cons.push(line.slice(2).trim());
        continue;
      }
    }

    if (line.indexOf('|') !== -1) {
      var parts = line.split('|');
      var name = parts[0].trim();
      var price = Number(parts[1].split('₱').join('').split(',').join('').trim());
      if (name !== '' && !isNaN(price)) {
        saveCurrent();
        current = {
          name: name,
          price: price,
          image: '',
          alt: '',
          date: '',
          description: '',
          pros: [],
          cons: []
        };
      }
    }
  }
  saveCurrent();
  return list;
}

// Parse users.txt into table rows
function parseUserRows(text) {
  var lines = text.split('\r').join('').split('\n');
  var list = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line === '' || line[0] === '#') continue;
    var cols = line.split('|');
    if (cols.length >= 4) {
      list.push({
        email: cols[0].trim(),
        name: cols[1].trim(),
        role: cols[2].trim(),
        hash: cols[3].trim()
      });
    }
  }
  return list;
}

// Convert rows back into clean .txt format
function rowsToTxt() {
  if (currentTable === 'Users') {
    var lines = [
      '# WAIS Computer & Gadgets - Users Database',
      '# Format: Username/Email | Name | Role | PasswordHash'
    ];
    for (var i = 0; i < rows.length; i++) {
      var u = rows[i];
      lines.push(u.email + ' | ' + u.name + ' | ' + u.role + ' | ' + u.hash);
    }
    return lines.join('\n') + '\n';
  }

  var out = ['categories: ' + currentTable, ''];
  for (var i = 0; i < rows.length; i++) {
    var item = rows[i];
    out.push(item.name + ' | ' + item.price);
    out.push('Image: ' + (item.image || ''));
    out.push('Alt: ' + (item.alt || 'Image not yet added'));
    if (item.date) out.push('Date: ' + item.date);
    if (item.description) out.push('Description: ' + item.description);
    if (item.pros.length > 0) {
      out.push('Pros:');
      for (var p = 0; p < item.pros.length; p++) {
        out.push('- ' + item.pros[p]);
      }
    }
    if (item.cons.length > 0) {
      out.push('Cons:');
      for (var c = 0; c < item.cons.length; c++) {
        out.push('- ' + item.cons[c]);
      }
    }
    out.push('');
  }
  return out.join('\n');
}

async function loadTable(useFileOnly) {
  var storageKey = currentTable === 'Users'
    ? 'wais_users_override'
    : 'wais_db_' + currentTable;

  var text = '';
  var saved = useFileOnly ? null : localStorage.getItem(storageKey);

  if (saved !== null) {
    text = saved;
  } else {
    var res = await fetch(CATEGORY_FILES[currentTable], { cache: 'no-store' });
    if (res.ok) {
      text = await res.text();
    }
  }

  if (currentTable === 'Users') {
    rows = parseUserRows(text);
    var extraRaw = localStorage.getItem('wais_users_extra');
    if (extraRaw) {
      var extraList = JSON.parse(extraRaw);
      for (var i = 0; i < extraList.length; i++) {
        var found = false;
        for (var j = 0; j < rows.length; j++) {
          if (rows[j].email === extraList[i].email) found = true;
        }
        if (!found) rows.push(extraList[i]);
      }
    }
  } else {
    rows = parseProductRows(text);
  }

  drawTable();
}

function drawTable() {
  var head = document.getElementById('tableHead');
  var body = document.getElementById('tableBody');
  var prodForm = document.getElementById('addProductForm');
  var userForm = document.getElementById('addUserForm');

  head.textContent = '';
  body.textContent = '';

  if (currentTable === 'Users') {
    prodForm.hidden = true;
    userForm.hidden = false;

    var hr = document.createElement('tr');
    hr.appendChild(makeEl('th', '', 'Username / Email'));
    hr.appendChild(makeEl('th', '', 'Name'));
    hr.appendChild(makeEl('th', '', 'Role'));
    hr.appendChild(makeEl('th', '', 'Action'));
    head.appendChild(hr);

    for (var i = 0; i < rows.length; i++) {
      var u = rows[i];
      var tr = document.createElement('tr');
      tr.appendChild(makeEl('td', '', u.email));
      tr.appendChild(makeEl('td', '', u.name));

      var roleTd = document.createElement('td');
      var roleSel = makeEl('select', 'cell-input');
      roleSel.setAttribute('data-idx', i);
      roleSel.appendChild(makeEl('option', '', 'customer'));
      roleSel.appendChild(makeEl('option', '', 'admin'));
      roleSel.value = u.role;
      roleSel.onchange = function () {
        rows[Number(this.getAttribute('data-idx'))].role = this.value;
      };
      roleTd.appendChild(roleSel);
      tr.appendChild(roleTd);

      var actTd = document.createElement('td');
      var delBtn = makeEl('button', 'btn', 'Delete');
      delBtn.type = 'button';
      delBtn.setAttribute('data-idx', i);
      delBtn.onclick = function () {
        rows.splice(Number(this.getAttribute('data-idx')), 1);
        drawTable();
      };
      actTd.appendChild(delBtn);
      tr.appendChild(actTd);
      body.appendChild(tr);
    }
    return;
  }

  prodForm.hidden = false;
  userForm.hidden = true;

  var hr = document.createElement('tr');
  hr.appendChild(makeEl('th', '', 'Name'));
  hr.appendChild(makeEl('th', '', 'Price (₱)'));
  hr.appendChild(makeEl('th', '', 'Image (src)'));
  hr.appendChild(makeEl('th', '', 'Alt Text'));
  hr.appendChild(makeEl('th', '', 'Date'));
  hr.appendChild(makeEl('th', '', 'Description'));
  hr.appendChild(makeEl('th', '', 'Pros (use ;)'));
  hr.appendChild(makeEl('th', '', 'Cons (use ;)'));
  hr.appendChild(makeEl('th', '', 'Action'));
  head.appendChild(hr);

  for (var i = 0; i < rows.length; i++) {
    var item = rows[i];
    var tr = document.createElement('tr');

    tr.appendChild(makeCellInput(i, 'name', 'text', item.name));
    tr.appendChild(makeCellInput(i, 'price', 'number', item.price));
    tr.appendChild(makeCellInput(i, 'image', 'text', item.image));
    tr.appendChild(makeCellInput(i, 'alt', 'text', item.alt));
    tr.appendChild(makeCellInput(i, 'date', 'date', item.date));
    tr.appendChild(makeCellInput(i, 'description', 'text', item.description));
    tr.appendChild(makeCellInput(i, 'pros', 'text', item.pros.join('; ')));
    tr.appendChild(makeCellInput(i, 'cons', 'text', item.cons.join('; ')));

    var delTd = document.createElement('td');
    var delBtn = makeEl('button', 'btn', 'Delete');
    delBtn.type = 'button';
    delBtn.setAttribute('data-idx', i);
    delBtn.onclick = function () {
      rows.splice(Number(this.getAttribute('data-idx')), 1);
      drawTable();
    };
    delTd.appendChild(delBtn);
    tr.appendChild(delTd);

    body.appendChild(tr);
  }
}

function makeCellInput(rowIndex, field, type, value) {
  var td = document.createElement('td');
  var input = makeEl('input', 'cell-input');
  input.type = type;
  input.value = value;
  input.setAttribute('data-idx', rowIndex);
  input.setAttribute('data-field', field);
  input.oninput = function () {
    var idx = Number(this.getAttribute('data-idx'));
    var key = this.getAttribute('data-field');
    if (key === 'price') {
      rows[idx].price = Number(this.value) || 0;
    } else if (key === 'pros' || key === 'cons') {
      var parts = this.value.split(';');
      var clean = [];
      for (var p = 0; p < parts.length; p++) {
        var s = parts[p].trim();
        if (s !== '') clean.push(s);
      }
      rows[idx][key] = clean;
    } else {
      rows[idx][key] = this.value;
    }
  };
  td.appendChild(input);
  return td;
}

function checkAdminAuth() {
  var raw = sessionStorage.getItem('wais_session');
  var locked = document.getElementById('adminLocked');
  var panel = document.getElementById('adminPanel');
  var who = document.getElementById('adminWho');

  if (!raw) {
    locked.hidden = false;
    panel.hidden = true;
    who.textContent = 'Not signed in';
    return false;
  }

  var user = JSON.parse(raw);
  who.textContent = 'Signed in as ' + user.name + ' (' + user.role + ')';

  if (user.role !== 'admin') {
    locked.hidden = false;
    panel.hidden = true;
    return false;
  }

  locked.hidden = true;
  panel.hidden = false;
  return true;
}

document.getElementById('dbSelect').onchange = function () {
  currentTable = this.value;
  document.getElementById('adminStatus').hidden = true;
  loadTable(false);
};

document.getElementById('addProductForm').onsubmit = function (e) {
  e.preventDefault();
  var name = document.getElementById('newName').value.trim();
  var price = Number(document.getElementById('newPrice').value);
  var image = document.getElementById('newImage').value.trim();
  var alt = document.getElementById('newAlt').value.trim();
  var date = document.getElementById('newDate').value;
  var desc = document.getElementById('newDesc').value.trim();
  var prosRaw = document.getElementById('newPros').value.split(';');
  var consRaw = document.getElementById('newCons').value.split(';');

  var pros = [];
  for (var i = 0; i < prosRaw.length; i++) {
    if (prosRaw[i].trim() !== '') pros.push(prosRaw[i].trim());
  }
  var cons = [];
  for (var j = 0; j < consRaw.length; j++) {
    if (consRaw[j].trim() !== '') cons.push(consRaw[j].trim());
  }

  rows.push({
    name: name,
    price: price,
    image: image,
    alt: alt || 'Image not yet added',
    date: date,
    description: desc,
    pros: pros,
    cons: cons
  });

  document.getElementById('newName').value = '';
  document.getElementById('newPrice').value = '';
  document.getElementById('newImage').value = '';
  document.getElementById('newAlt').value = '';
  document.getElementById('newDesc').value = '';
  document.getElementById('newPros').value = '';
  document.getElementById('newCons').value = '';
  drawTable();
  showStatus('Row added! Click "Save Changes" to update the storefront or "Download .txt".');
};

document.getElementById('addUserForm').onsubmit = async function (e) {
  e.preventDefault();
  var email = document.getElementById('newUserEmail').value.trim().toLowerCase();
  var name = document.getElementById('newUserName').value.trim();
  var role = document.getElementById('newUserRole').value;
  var pass = document.getElementById('newUserPass').value;
  var hash = await hashPassword(pass);

  rows.push({ email: email, name: name, role: role, hash: hash });
  document.getElementById('newUserEmail').value = '';
  document.getElementById('newUserName').value = '';
  document.getElementById('newUserPass').value = '';
  drawTable();
  showStatus('User added! Click "Save Changes" or "Download .txt".');
};

document.getElementById('saveBrowserBtn').onclick = function () {
  var txt = rowsToTxt();
  if (currentTable === 'Users') {
    localStorage.setItem('wais_users_override', txt);
    localStorage.removeItem('wais_users_extra');
  } else {
    localStorage.setItem('wais_db_' + currentTable, txt);
  }
  showStatus('Saved! The storefront now displays your updated ' + currentTable + ' table.');
};

document.getElementById('downloadTxtBtn').onclick = function () {
  var txt = rowsToTxt();
  var fileName = CATEGORY_FILES[currentTable].split('/')[1];
  var blob = new Blob([txt], { type: 'text/plain' });
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
  showStatus('Downloaded ' + fileName + '! Replace database/' + fileName + ' in VS Code to save permanently.');
};

document.getElementById('resetTableBtn').onclick = function () {
  if (currentTable === 'Users') {
    localStorage.removeItem('wais_users_override');
  } else {
    localStorage.removeItem('wais_db_' + currentTable);
  }
  loadTable(true);
  showStatus('Reloaded ' + currentTable + ' from ' + CATEGORY_FILES[currentTable] + '.');
};

document.getElementById('adminLogoutBtn').onclick = function () {
  sessionStorage.removeItem('wais_session');
  window.location.href = 'login.html';
};

document.getElementById('newDate').valueAsDate = new Date();

if (checkAdminAuth()) {
  loadTable(false);
}
