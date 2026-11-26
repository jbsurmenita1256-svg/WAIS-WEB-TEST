// WAIS Main Page Script - Super Simple JavaScript (Arrays, Loops, and If Statements)

var dealFiles = [
  { category: 'Laptop', file: 'database/laptop.txt' },
  { category: 'Components', file: 'database/components.txt' },
  { category: 'Accessories', file: 'database/accessories.txt' },
  { category: 'Gaming Consoles', file: 'database/gaming_consoles.txt' }
];

var dealNames = [
  'pink slim 14', 'wireless earbuds', 'smart watch s2', '1 tb nvme ssd',
  '65w usb-c charger', 'over-ear headphones', 'bluetooth speaker', 'wireless mouse',
  'playstation 5 digital', 'xbox series s', 'nintendo switch oled', 'steam deck oled'
];
var dealPercents = [15, 20, 10, 25, 30, 15, 20, 10, 10, 15, 12, 8];

var dealProducts = [];

function makeEl(tag, className, text) {
  var el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function formatPeso(amount) {
  return '₱' + Math.round(amount).toLocaleString('en-PH');
}

function getDiscountPercent(name) {
  var lower = name.toLowerCase();
  for (var i = 0; i < dealNames.length; i++) {
    if (dealNames[i] === lower) return dealPercents[i];
  }
  return 0;
}

function isSafeImageSrc(src) {
  if (!src) return false;
  var lower = src.trim().toLowerCase();
  if (lower.indexOf('javascript:') === 0 || lower.indexOf('data:') === 0) return false;
  return true;
}

function parseSimpleProducts(text, categoryName) {
  var lines = text.split('\r').join('').split('\n');
  var list = [];
  var current = null;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line === '' || line[0] === '#') continue;

    var lower = line.toLowerCase();
    if (current !== null) {
      if (lower.indexOf('image:') === 0) {
        current.image = line.slice(line.indexOf(':') + 1).trim();
        continue;
      }
      if (lower.indexOf('alt:') === 0) {
        current.alt = line.slice(line.indexOf(':') + 1).trim();
        continue;
      }
      if (lower.indexOf('description:') === 0) {
        current.description = line.slice(line.indexOf(':') + 1).trim();
        continue;
      }
    }

    if (line.indexOf('|') !== -1) {
      var parts = line.split('|');
      var name = parts[0].trim();
      var price = Number(parts[1].split('₱').join('').split(',').join('').trim());
      if (name !== '' && !isNaN(price)) {
        var pct = getDiscountPercent(name);
        if (pct > 0) {
          current = {
            name: name,
            price: price,
            category: categoryName,
            image: '',
            alt: 'Image not yet added',
            discount: pct,
            description: categoryName + ' special deal!'
          };
          list.push(current);
        } else {
          current = null;
        }
      }
    }
  }
  return list;
}

async function loadHomeDeals() {
  dealProducts = [];
  for (var i = 0; i < dealFiles.length; i++) {
    var entry = dealFiles[i];
    var saved = localStorage.getItem('wais_db_' + entry.category);
    var text = '';

    if (saved !== null) {
      text = saved;
    } else {
      try {
        var res = await fetch(entry.file, { cache: 'no-store' });
        if (res.ok) text = await res.text();
      } catch (err) {
        console.log('Could not load ' + entry.file);
      }
    }

    if (text !== '') {
      var found = parseSimpleProducts(text, entry.category);
      for (var j = 0; j < found.length; j++) {
        dealProducts.push(found[j]);
      }
    }
  }

  drawTicker();
  drawAdsGrid();
}

function isUserLoggedIn() {
  return sessionStorage.getItem('wais_session') !== null;
}

function goToShopOrLogin() {
  if (isUserLoggedIn()) {
    window.location.href = 'shop.html';
  } else {
    window.location.href = 'login.html';
  }
}

function makeHomeDealThumb(item) {
  var thumb = makeEl('span', 'dthumb');
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

function makeHomeAdVisual(item) {
  var wrap = makeEl('div', 'ad-visual');
  var altText = item.alt || 'Image not yet added';

  function showFallback() {
    wrap.textContent = '';
    wrap.appendChild(makeEl('div', 'ad-fallback', altText));
  }

  if (isSafeImageSrc(item.image)) {
    var img = document.createElement('img');
    img.className = 'ad-img';
    img.src = item.image;
    img.alt = altText;
    img.onerror = showFallback;
    wrap.appendChild(img);
  } else {
    showFallback();
  }

  return wrap;
}

function drawTicker() {
  var track = document.getElementById('homeDealsTrack');
  track.textContent = '';

  for (var copy = 0; copy < 2; copy++) {
    for (var i = 0; i < dealProducts.length; i++) {
      var item = dealProducts[i];
      var salePrice = Math.round(item.price * (1 - item.discount / 100));

      var btn = makeEl('button', 'deal');
      btn.type = 'button';
      btn.onclick = goToShopOrLogin;

      btn.appendChild(makeHomeDealThumb(item));

      var dtext = makeEl('span', 'dtext');
      dtext.appendChild(makeEl('b', '', item.name));
      var prices = makeEl('span');
      prices.appendChild(makeEl('s', '', formatPeso(item.price) + ' '));
      prices.appendChild(makeEl('strong', '', formatPeso(salePrice)));
      dtext.appendChild(prices);
      btn.appendChild(dtext);

      btn.appendChild(makeEl('span', 'badge', '-' + item.discount + '%'));
      track.appendChild(btn);
    }
  }
}

function drawAdsGrid() {
  var grid = document.getElementById('homeAdsGrid');
  grid.textContent = '';

  var maxAds = 6;
  if (dealProducts.length < maxAds) maxAds = dealProducts.length;

  for (var i = 0; i < maxAds; i++) {
    var item = dealProducts[i];
    var salePrice = Math.round(item.price * (1 - item.discount / 100));

    var card = makeEl('article', 'ad-card');
    card.appendChild(makeEl('span', 'ad-badge', 'SAVE ' + item.discount + '%'));
    card.appendChild(makeHomeAdVisual(item));
    card.appendChild(makeEl('span', 'cat-label', item.category));
    card.appendChild(makeEl('h3', '', item.name));
    card.appendChild(makeEl('p', 'ad-desc', item.description));

    var priceRow = makeEl('div', 'ad-prices');
    priceRow.appendChild(makeEl('s', '', formatPeso(item.price)));
    priceRow.appendChild(makeEl('strong', '', formatPeso(salePrice)));
    card.appendChild(priceRow);

    var cta = makeEl('button', 'btn green', isUserLoggedIn() ? 'View in Shop' : 'Login to Buy');
    cta.type = 'button';
    cta.onclick = goToShopOrLogin;
    card.appendChild(cta);

    grid.appendChild(card);
  }
}

function updateMainPageAuth() {
  var raw = sessionStorage.getItem('wais_session');
  var navAccess = document.getElementById('navAccessLink');
  var navShop = document.getElementById('navShopBtn');
  var navAdmin = document.getElementById('navAdminBtn');
  var heroControls = document.getElementById('heroAuthControls');
  var gateTitle = document.getElementById('gateTitle');
  var gateText = document.getElementById('gateText');
  var gateActions = document.getElementById('gateActions');

  if (!raw) return;

  var user = JSON.parse(raw);
  navAccess.textContent = 'Account (' + user.name + ')';
  navAccess.href = 'login.html';
  navShop.hidden = false;
  if (user.role === 'admin') {
    navAdmin.hidden = false;
  }

  heroControls.textContent = '';
  var enterBtn = makeEl('a', 'btn green', 'Enter Shop');
  enterBtn.href = 'shop.html';
  heroControls.appendChild(enterBtn);

  if (user.role === 'admin') {
    var adminBtn = makeEl('a', 'btn', 'Open Admin Editor');
    adminBtn.href = 'admin.html';
    heroControls.appendChild(adminBtn);
  }

  gateTitle.textContent = 'Welcome back, ' + user.name + '!';
  gateText.textContent = 'You are logged in (' + user.role + '). You now have full access to the WAIS Shop.';
  gateActions.textContent = '';
  var shopLink = makeEl('a', 'btn green', 'Go to Shop');
  shopLink.href = 'shop.html';
  gateActions.appendChild(shopLink);
}

updateMainPageAuth();
loadHomeDeals();
