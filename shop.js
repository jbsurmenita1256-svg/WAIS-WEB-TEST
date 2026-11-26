// WAIS Shop Page - Simple Beginner JavaScript (Arrays, Loops, and If Statements)

var categoryFiles = [
  { category: 'Laptop', file: 'database/laptop.txt' },
  { category: 'Components', file: 'database/components.txt' },
  { category: 'Accessories', file: 'database/accessories.txt' },
  { category: 'Gaming Consoles', file: 'database/gaming_consoles.txt' }
];

var discountNames = [
  'pink slim 14', 'wireless earbuds', 'smart watch s2', '1 tb nvme ssd',
  '65w usb-c charger', 'over-ear headphones', 'bluetooth speaker', 'wireless mouse',
  'playstation 5 digital', 'xbox series s', 'nintendo switch oled', 'steam deck oled'
];
var discountPercents = [15, 20, 10, 25, 30, 15, 20, 10, 10, 15, 12, 8];

var products = [];
var favorites = [];
var savedCartRaw = sessionStorage.getItem('wais_cart');
var cart = savedCartRaw ? JSON.parse(savedCartRaw) : [];
var picked = [];

var currentCategory = 'all';
var searchText = '';
var discountRate = 0;

function makeElement(tag, className, text) {
  var el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function hasItem(list, value) {
  for (var i = 0; i < list.length; i++) {
    if (list[i] === value) return true;
  }
  return false;
}

function toggleInArray(list, value) {
  var nextList = [];
  var found = false;
  for (var i = 0; i < list.length; i++) {
    if (list[i] === value) {
      found = true;
    } else {
      nextList.push(list[i]);
    }
  }
  if (!found) nextList.push(value);
  return nextList;
}

function findProductById(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) return products[i];
  }
  return null;
}

function formatPeso(amount) {
  return '₱' + Math.round(amount).toLocaleString('en-PH');
}

function getDiscount(name) {
  var lower = name.toLowerCase();
  for (var i = 0; i < discountNames.length; i++) {
    if (discountNames[i] === lower) return discountPercents[i];
  }
  return 0;
}

function isSafeImageSrc(src) {
  if (!src) return false;
  var lower = src.trim().toLowerCase();
  if (lower.indexOf('javascript:') === 0 || lower.indexOf('data:') === 0) return false;
  return true;
}

function parseTxtFile(text, defaultCategory) {
  var lines = text.split('\r').join('').split('\n');
  var list = [];
  var activeCategory = defaultCategory;
  var current = null;
  var mode = '';

  function saveCurrent() {
    if (current === null) return;
    if (current.alt === '') current.alt = 'Image not yet added';
    if (current.description === '') current.description = current.category + ' item.';
    if (current.pros.length === 0) current.pros.push('Available in ' + current.category);
    if (current.cons.length === 0) current.cons.push('Check details before ordering');
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
      activeCategory = line.split(':')[1].trim();
      if (activeCategory === '') activeCategory = defaultCategory;
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

    var name = '';
    var priceText = '';

    if (line.indexOf('|') !== -1) {
      var parts = line.split('|');
      name = parts[0].trim();
      priceText = parts[1].trim();
    } else if (line.indexOf(' - ') !== -1) {
      var dashPos = line.lastIndexOf(' - ');
      name = line.slice(0, dashPos).trim();
      priceText = line.slice(dashPos + 3).trim();
    }

    if (name !== '' && priceText !== '') {
      var cleanPrice = priceText.split('₱').join('').split(',').join('').trim();
      var price = Number(cleanPrice);
      if (!isNaN(price)) {
        saveCurrent();
        current = {
          id: activeCategory + '-' + i,
          name: name,
          price: price,
          category: activeCategory,
          image: '',
          alt: '',
          date: '',
          description: '',
          pros: [],
          cons: [],
          discount: getDiscount(name)
        };
      }
    }
  }

  saveCurrent();
  return list;
}

// Show product photo if Image: has a link, otherwise leave a blank box with alt text
function makeProductThumb(item) {
  var thumb = makeElement('div', 'thumb');
  var altText = item.alt || 'Image not yet added';

  if (isSafeImageSrc(item.image)) {
    var img = document.createElement('img');
    img.className = 'product-img';
    img.src = item.image;
    img.alt = altText;
    img.onerror = function () {
      this.remove();
      thumb.appendChild(makeElement('span', 'thumb-alt', altText));
    };
    thumb.appendChild(img);
  } else {
    thumb.appendChild(makeElement('span', 'thumb-alt', altText));
  }

  return thumb;
}

async function loadProducts() {
  products = [];
  for (var i = 0; i < categoryFiles.length; i++) {
    var entry = categoryFiles[i];
    var savedText = localStorage.getItem('wais_db_' + entry.category);
    if (savedText !== null) {
      var savedItems = parseTxtFile(savedText, entry.category);
      for (var s = 0; s < savedItems.length; s++) {
        products.push(savedItems[s]);
      }
      continue;
    }

    try {
      var res = await fetch(entry.file, { cache: 'no-store' });
      if (res.ok) {
        var text = await res.text();
        var items = parseTxtFile(text, entry.category);
        for (var j = 0; j < items.length; j++) {
          products.push(items[j]);
        }
      }
    } catch (err) {
      console.log('Could not load ' + entry.file);
    }
  }
  var topCart = document.getElementById('cartBtn');
  topCart.textContent = cart.length > 0 ? '🛒 Cart (' + cart.length + ')' : '🛒 Cart';
  showDeals();
  showProducts();
  showCart();
}

function showView(viewName) {
  var views = document.getElementsByClassName('view');
  for (var i = 0; i < views.length; i++) {
    views[i].classList.remove('active');
  }
  var target = document.getElementById('view-' + viewName);
  if (target) target.classList.add('active');

  var links = document.querySelectorAll('.sidebar a');
  for (var j = 0; j < links.length; j++) {
    var link = links[j];
    var isSameView = link.getAttribute('data-view') === viewName;
    var linkCat = link.getAttribute('data-cat');
    var isSameCat = !linkCat || linkCat === currentCategory;
    if (isSameView && isSameCat) {
      link.classList.add('current');
    } else {
      link.classList.remove('current');
    }
  }
}

function makeDealThumb(item) {
  var thumb = makeElement('span', 'dthumb');
  var altText = item.alt || 'Image not yet added';
  if (isSafeImageSrc(item.image)) {
    var miniImg = document.createElement('img');
    miniImg.className = 'dthumb-img';
    miniImg.src = item.image;
    miniImg.alt = altText;
    miniImg.onerror = function () {
      thumb.textContent = 'No img';
    };
    thumb.appendChild(miniImg);
  } else {
    thumb.textContent = 'No img';
  }
  return thumb;
}

function showDeals() {
  var track = document.getElementById('dealsTrack');
  track.textContent = '';

  for (var copy = 0; copy < 2; copy++) {
    for (var i = 0; i < products.length; i++) {
      var item = products[i];
      if (item.discount <= 0) continue;

      var salePrice = Math.round(item.price * (1 - item.discount / 100));
      var btn = makeElement('button', 'deal');
      btn.type = 'button';
      btn.setAttribute('data-cat', item.category);
      btn.onclick = function () {
        currentCategory = this.getAttribute('data-cat');
        document.getElementById('categorySelect').value = currentCategory;
        searchText = '';
        document.getElementById('searchInput').value = '';
        showView('inventory');
        showProducts();
      };

      var thumb = makeDealThumb(item);

      var textWrap = makeElement('span', 'dtext');
      var title = makeElement('b', '', item.name);
      var prices = makeElement('span');
      prices.appendChild(makeElement('s', '', formatPeso(item.price) + ' '));
      prices.appendChild(makeElement('strong', '', formatPeso(salePrice)));
      textWrap.appendChild(title);
      textWrap.appendChild(prices);

      btn.appendChild(thumb);
      btn.appendChild(textWrap);
      btn.appendChild(makeElement('span', 'badge', '-' + item.discount + '%'));
      track.appendChild(btn);
    }
  }
}

function showProducts() {
  var grid = document.getElementById('productGrid');
  var titleEl = document.getElementById('inventoryTitle');
  var emptyEl = document.getElementById('noResults');

  grid.textContent = '';
  titleEl.textContent = currentCategory === 'all' ? 'Product Inventory' : currentCategory;

  var query = searchText.trim().toLowerCase();
  var shownCount = 0;

  for (var i = 0; i < products.length; i++) {
    var item = products[i];

    if (currentCategory !== 'all' && item.category !== currentCategory) continue;

    if (query !== '') {
      var combined = (item.name + ' ' + item.category + ' ' + item.description).toLowerCase();
      if (combined.indexOf(query) === -1) continue;
    }

    shownCount++;
    var card = makeElement('article', 'product');

    var thumb = makeProductThumb(item);

    var handBtn = makeElement('button', 'hand', '✋');
    handBtn.type = 'button';
    if (hasItem(picked, item.id)) handBtn.classList.add('picked');
    handBtn.setAttribute('data-id', item.id);
    handBtn.onclick = function () {
      toggleCompare(this.getAttribute('data-id'));
    };
    thumb.appendChild(handBtn);

    var info = makeElement('div', 'info');
    var labelText = item.date ? item.category + ' · ' + item.date : item.category;
    info.appendChild(makeElement('span', 'cat-label', labelText));
    info.appendChild(makeElement('h3', '', item.name));
    info.appendChild(makeElement('span', 'price', formatPeso(item.price)));
    info.appendChild(makeElement('p', '', item.description));

    var actions = makeElement('div', 'actions');

    var isFav = hasItem(favorites, item.id);
    var favBtn = makeElement('button', isFav ? 'fav-on' : '', isFav ? '♥ Favorite' : '♡ Favorite');
    favBtn.type = 'button';
    favBtn.setAttribute('data-id', item.id);
    favBtn.onclick = function () {
      toggleFavorite(this.getAttribute('data-id'));
    };

    var inCart = hasItem(cart, item.id);
    var cartBtn = makeElement('button', inCart ? 'cart-on' : '', inCart ? 'In cart' : 'Add to cart');
    cartBtn.type = 'button';
    cartBtn.setAttribute('data-id', item.id);
    cartBtn.onclick = function () {
      toggleCart(this.getAttribute('data-id'));
    };

    actions.appendChild(favBtn);
    actions.appendChild(cartBtn);
    info.appendChild(actions);
    card.appendChild(thumb);
    card.appendChild(info);
    grid.appendChild(card);
  }

  emptyEl.hidden = shownCount > 0;
}

function toggleFavorite(id) {
  favorites = toggleInArray(favorites, id);
  var topFav = document.getElementById('favBtn');
  topFav.textContent = favorites.length > 0 ? '★ Favorites (' + favorites.length + ')' : '★ Favorites';
  showProducts();
  showFavorites();
}

function showFavorites() {
  var list = document.getElementById('favList');
  var empty = document.getElementById('favEmpty');
  list.textContent = '';

  for (var i = 0; i < favorites.length; i++) {
    var item = findProductById(favorites[i]);
    if (!item) continue;

    var li = document.createElement('li');
    li.appendChild(makeElement('span', '', item.name));
    var right = document.createElement('span');
    right.appendChild(makeElement('b', '', formatPeso(item.price) + ' '));

    var rem = makeElement('button', 'btn', 'Remove');
    rem.type = 'button';
    rem.setAttribute('data-id', item.id);
    rem.onclick = function () {
      toggleFavorite(this.getAttribute('data-id'));
    };
    right.appendChild(rem);
    li.appendChild(right);
    list.appendChild(li);
  }
  empty.hidden = favorites.length > 0;
}

function toggleCart(id) {
  cart = toggleInArray(cart, id);
  sessionStorage.setItem('wais_cart', JSON.stringify(cart));
  var topCart = document.getElementById('cartBtn');
  topCart.textContent = cart.length > 0 ? '🛒 Cart (' + cart.length + ')' : '🛒 Cart';
  showProducts();
  showCart();
}

function showCart() {
  var list = document.getElementById('cartList');
  var empty = document.getElementById('cartEmpty');
  var summary = document.getElementById('cartSummary');
  var totalEl = document.getElementById('cartTotal');
  list.textContent = '';

  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    var item = findProductById(cart[i]);
    if (!item) continue;

    subtotal += item.price;
    var li = document.createElement('li');
    li.appendChild(makeElement('span', '', item.name));
    var right = document.createElement('span');
    right.appendChild(makeElement('b', '', formatPeso(item.price) + ' '));

    var rem = makeElement('button', 'btn', 'Remove');
    rem.type = 'button';
    rem.setAttribute('data-id', item.id);
    rem.onclick = function () {
      toggleCart(this.getAttribute('data-id'));
    };
    right.appendChild(rem);
    li.appendChild(right);
    list.appendChild(li);
  }

  empty.hidden = cart.length > 0;
  summary.hidden = cart.length === 0;
  totalEl.textContent = formatPeso(subtotal * (1 - discountRate));
}

function toggleCompare(id) {
  picked = toggleInArray(picked, id);
  showProducts();
  showCompare();
}

function showCompare() {
  var tray = document.getElementById('compareTray');
  var msg = document.getElementById('compareMsg');
  var modal = document.getElementById('compareModal');
  var grid = document.getElementById('compareGrid');

  tray.hidden = picked.length === 0;
  modal.hidden = picked.length !== 2;

  if (picked.length === 1) msg.textContent = '1 picked. Pick one more product to compare.';
  else if (picked.length === 2) msg.textContent = 'Comparing 2 products.';
  else if (picked.length > 2) msg.textContent = 'Too many picked. Remove one to compare.';

  if (picked.length === 2) {
    grid.textContent = '';
    for (var i = 0; i < picked.length; i++) {
      var item = findProductById(picked[i]);
      if (!item) continue;

      var box = makeElement('section', 'cmp');
      box.appendChild(makeElement('h3', '', item.name));
      box.appendChild(makeElement('p', 'price', formatPeso(item.price)));

      box.appendChild(makeElement('h4', 'pro-h', 'Pros'));
      var proUl = document.createElement('ul');
      for (var p = 0; p < item.pros.length; p++) {
        proUl.appendChild(makeElement('li', '', item.pros[p]));
      }
      box.appendChild(proUl);

      box.appendChild(makeElement('h4', 'con-h', 'Cons'));
      var conUl = document.createElement('ul');
      for (var c = 0; c < item.cons.length; c++) {
        conUl.appendChild(makeElement('li', '', item.cons[c]));
      }
      box.appendChild(conUl);

      var rem = makeElement('button', 'btn', 'Remove');
      rem.type = 'button';
      rem.setAttribute('data-id', item.id);
      rem.onclick = function () {
        toggleCompare(this.getAttribute('data-id'));
      };
      box.appendChild(rem);
      grid.appendChild(box);
    }
  }
}

function clearCompare() {
  picked = [];
  showProducts();
  showCompare();
}

function checkShopAccess() {
  var raw = sessionStorage.getItem('wais_session');
  var locked = document.getElementById('shopLocked');
  var app = document.getElementById('shopApp');

  if (!raw) {
    locked.hidden = false;
    app.hidden = true;
    return false;
  }

  var user = JSON.parse(raw);
  locked.hidden = true;
  app.hidden = false;

  document.getElementById('navAccount').textContent = user.name + ' (' + user.role + ')';
  if (user.role === 'admin') {
    document.getElementById('adminNavItem').hidden = false;
  }
  return true;
}

document.getElementById('searchInput').oninput = function () {
  searchText = this.value;
  showView('inventory');
  showProducts();
};

document.getElementById('categorySelect').onchange = function () {
  currentCategory = this.value;
  showView('inventory');
  showProducts();
};

var navButtons = document.querySelectorAll('[data-view]');
for (var i = 0; i < navButtons.length; i++) {
  navButtons[i].onclick = function (e) {
    e.preventDefault();
    var cat = this.getAttribute('data-cat');
    if (cat) {
      currentCategory = cat;
      document.getElementById('categorySelect').value = cat;
    }
    var view = this.getAttribute('data-view');
    showView(view);
    if (view === 'inventory') showProducts();
  };
}

var planInputs = document.querySelectorAll('input[name="plan"]');
for (var i = 0; i < planInputs.length; i++) {
  planInputs[i].onchange = function () {
    discountRate = Number(this.value);
    showCart();
  };
}

function showSavedOrders() {
  var raw = sessionStorage.getItem('wais_orders');
  if (!raw) return;
  var ordersList = JSON.parse(raw);
  var tbody = document.getElementById('ordersBody');

  for (var i = ordersList.length - 1; i >= 0; i--) {
    var ord = ordersList[i];
    var row = document.createElement('tr');
    row.appendChild(makeElement('td', '', ord.orderId));
    row.appendChild(makeElement('td', '', ord.item));
    row.appendChild(makeElement('td', '', ord.status));
    tbody.insertBefore(row, tbody.firstChild);
  }
}

document.getElementById('checkoutBtn').onclick = function () {
  if (cart.length === 0) return;

  var checkoutItems = [];
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    var item = findProductById(cart[i]);
    if (!item) continue;
    subtotal += item.price;
    checkoutItems.push({ id: item.id, name: item.name, price: item.price });
  }
  if (checkoutItems.length === 0) return;

  var total = Math.round(subtotal * (1 - discountRate));
  sessionStorage.setItem('wais_checkout', JSON.stringify({
    items: checkoutItems,
    subtotal: subtotal,
    discountRate: discountRate,
    total: total
  }));

  window.location.href = 'payment.html';
};

var langInputs = document.querySelectorAll('input[name="lang"]');
for (var i = 0; i < langInputs.length; i++) {
  langInputs[i].onchange = function () {
    var input = document.getElementById('searchInput');
    if (this.value === 'fil') input.placeholder = 'Maghanap ng produkto...';
    else if (this.value === 'ceb') input.placeholder = 'Pangita og produkto...';
    else input.placeholder = 'Search products...';
  };
}

document.getElementById('shopSignOut').onclick = function (e) {
  e.preventDefault();
  sessionStorage.removeItem('wais_session');
  window.location.href = 'index.html';
};

document.getElementById('compareClearBtn').onclick = clearCompare;
document.getElementById('compareCloseBtn').onclick = clearCompare;
document.getElementById('compareBackdrop').onclick = clearCompare;

if (checkShopAccess()) {
  if (window.location.hash === '#orders') {
    showView('orders');
  } else {
    showView('inventory');
  }
  showSavedOrders();
  loadProducts();
}
