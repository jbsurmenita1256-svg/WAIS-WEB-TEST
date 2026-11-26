// WAIS QR Payment Page - Super Simple JavaScript (Arrays, Loops, and If Statements)

// Simple 21x21 QR pattern (1 = black square, 0 = white square)
var qrGridBase = [
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,0,1,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
  [0,1,0,1,1,0,0,1,1,0,0,1,0,1,1,0,1,0,0,1,0],
  [1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1,1,0,1],
  [0,1,0,1,0,0,0,1,0,1,0,0,1,1,0,0,1,0,1,1,0],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,1,0,1,0,0,1],
  [0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,0,1,0,1,1,0],
  [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,0,1,0,0,1],
  [1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,1,0,0,1,1,0],
  [1,0,1,1,1,0,1,0,0,1,1,1,0,1,0,0,1,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,0,0,1,1,0],
  [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,1,0,1,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1,1,0,1,1]
];

var selectedMethod = 'GCash QR';
var checkoutData = null;

function formatPeso(amount) {
  return '₱' + Math.round(amount).toLocaleString('en-PH');
}

function makeEl(tag, className, text) {
  var el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

// Draw the QR squares from qrGridBase onto the canvas using simple for loops
function drawQrCode(methodName) {
  var canvas = document.getElementById('qrCanvas');
  var ctx = canvas.getContext('2d');
  var size = 9;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Pick a simple accent color for the selected wallet
  if (methodName === 'GCash QR') ctx.fillStyle = '#0f3c8c';
  else if (methodName === 'Maya QR') ctx.fillStyle = '#135e3c';
  else ctx.fillStyle = '#101a33';

  for (var row = 0; row < qrGridBase.length; row++) {
    for (var col = 0; col < qrGridBase[row].length; col++) {
      if (qrGridBase[row][col] === 1) {
        ctx.fillRect(col * size, row * size, size, size);
      }
    }
  }
}

function loadPaymentPage() {
  var sessionRaw = sessionStorage.getItem('wais_session');
  var locked = document.getElementById('payLocked');
  var empty = document.getElementById('payEmpty');
  var panel = document.getElementById('payPanel');
  var accountEl = document.getElementById('payAccount');

  if (!sessionRaw) {
    locked.hidden = false;
    empty.hidden = true;
    panel.hidden = true;
    return;
  }

  var user = JSON.parse(sessionRaw);
  accountEl.textContent = 'Paying as: ' + user.name;

  var rawCheckout = sessionStorage.getItem('wais_checkout');
  if (!rawCheckout) {
    locked.hidden = true;
    empty.hidden = false;
    panel.hidden = true;
    return;
  }

  checkoutData = JSON.parse(rawCheckout);
  if (!checkoutData.items || checkoutData.items.length === 0) {
    locked.hidden = true;
    empty.hidden = false;
    panel.hidden = true;
    return;
  }

  locked.hidden = true;
  empty.hidden = true;
  panel.hidden = false;

  var list = document.getElementById('payItemList');
  list.textContent = '';
  for (var i = 0; i < checkoutData.items.length; i++) {
    var item = checkoutData.items[i];
    var li = document.createElement('li');
    li.appendChild(makeEl('span', '', item.name));
    li.appendChild(makeEl('b', '', formatPeso(item.price)));
    list.appendChild(li);
  }

  document.getElementById('paySubtotal').textContent = formatPeso(checkoutData.subtotal);
  document.getElementById('payDiscount').textContent = Math.round(checkoutData.discountRate * 100) + '% off';
  document.getElementById('payTotal').textContent = formatPeso(checkoutData.total);
  document.getElementById('qrAmountText').textContent = 'Amount: ' + formatPeso(checkoutData.total);

  drawQrCode(selectedMethod);
}

var methodRadios = document.querySelectorAll('input[name="qrMethod"]');
for (var i = 0; i < methodRadios.length; i++) {
  methodRadios[i].onchange = function () {
    selectedMethod = this.value;
    document.getElementById('qrMethodLabel').textContent = selectedMethod + ' · WAIS Computer & Gadgets';
    drawQrCode(selectedMethod);
  };
}

document.getElementById('payForm').onsubmit = function (e) {
  e.preventDefault();
  if (!checkoutData || checkoutData.items.length === 0) return;

  var refNo = document.getElementById('payRefInput').value.trim();
  var firstItem = checkoutData.items[0].name;
  var itemText = firstItem;
  if (checkoutData.items.length > 1) {
    itemText = firstItem + ' + ' + (checkoutData.items.length - 1) + ' more';
  }

  var nextNum = Number(sessionStorage.getItem('wais_next_order') || '1004');
  var statusText = 'Paid (' + selectedMethod + ')';
  if (refNo !== '') {
    statusText = 'Paid (' + selectedMethod + ' · Ref: ' + refNo + ')';
  }

  var ordersRaw = sessionStorage.getItem('wais_orders');
  var ordersList = ordersRaw ? JSON.parse(ordersRaw) : [];
  ordersList.unshift({
    orderId: '#' + nextNum,
    item: itemText,
    status: statusText
  });

  sessionStorage.setItem('wais_orders', JSON.stringify(ordersList));
  sessionStorage.setItem('wais_next_order', String(nextNum + 1));
  sessionStorage.removeItem('wais_checkout');
  sessionStorage.removeItem('wais_cart');

  var statusBox = document.getElementById('payStatus');
  statusBox.hidden = false;
  statusBox.textContent = 'Payment confirmed for Order #' + nextNum + ' via ' + selectedMethod + '!';

  document.getElementById('payForm').hidden = true;
  document.getElementById('payDoneActions').hidden = false;
};

loadPaymentPage();
