# WAIS Computer & Gadgets — Technical Documentation & Presentation Guide

## 1. Quick 2-Minute Explanation (For Your Demo)

If someone asks **"How does your website work?"**, you can explain it in 4 simple points:

1. **No frameworks, no backend server:** It is built with plain **HTML, CSS, simple JavaScript** (`var`, arrays, `for` loops, and `if/else` statements), and **`.txt` text files** acting as our database.
2. **5 Connected Pages:**
   - `index.html` — Public main homepage with our logo, company info, featured promo ads, and a login gate.
   - `login.html` — Login and Register page. Normal users register as **customers**; the **admin** logs in to manage the database.
   - `shop.html` — The actual store (locked until you log in). Lets users search, filter by category, favorite items, add to cart, compare 2 products side by side, and proceed to payment.
   - `payment.html` — Simple QR payment checkout page (GCash QR, Maya QR, Bank QRPh) that records paid orders into `shop.html`.
   - `admin.html` — A spreadsheet-style table editor (for **admin** only) where you can add/edit/delete products, paste image links, and export updated `.txt` database files.
3. **How the `.txt` Database Works:** Instead of SQL or JSON, each category (`laptop.txt`, `components.txt`, `accessories.txt`, `gaming_consoles.txt`, `users.txt`) is a plain text file. JavaScript fetches the text file, splits it line by line with a `for` loop, and puts the items into an array.
4. **How Product Images & Alt Text Work:**
   - Each product has an `Image:` field and an `Alt:` field.
   - If `Image:` has a valid link/file path, it shows the photo (`<img>`).
   - If `Image:` is left blank (or the photo fails to load), it shows a clean blank box with the fallback `Alt:` text (defaulting to **"Image not yet added"**).

---

## 2. Project File Structure

```text
wais-website/
├── index.html                  # Main landing page (logo, company info, deals ads, login gate)
├── shop.html                   # Storefront page (locked until signed in)
├── payment.html                # QR payment checkout page (GCash, Maya, Bank QRPh)
├── login.html                  # Login & customer registration page
├── admin.html                  # Admin-only table editor for products & users
├── style.css                   # Shared stylesheet for all 5 pages
├── home.js                     # Main page script (loads promo ads & checks login status)
├── shop.js                     # Shop script (reads .txt DBs, search, cart, compare modal)
├── payment.js                  # Payment script (draws 21x21 QR grid & confirms paid orders)
├── login.js                    # Auth script (SHA-256 password hashing & user accounts)
├── admin.js                    # Admin script (table editing, browser save, .txt download)
├── DOCUMENTATION.md            # This guide
├── LINE_BY_LINE_GUIDE.md       # Plain-English line-by-line explanation of all code
├── images/
│   └── PUT_IMAGES_HERE.txt     # Folder where you drop product .jpg / .png photos
├── assets/
│   └── aistudio/
│       └── c6e49720-dfa8-40f7-b671-a284395afc5f_d46242a6.jfif   # WAIS logo & hero background
└── database/
    ├── laptop.txt              # Laptop products
    ├── components.txt          # PC components
    ├── accessories.txt         # Accessories
    ├── gaming_consoles.txt     # Gaming consoles
    └── users.txt               # Login accounts & roles
```

---

## 3. How Each Page Works

### 3.1 Main Page (`index.html` + `home.js`)
- Displays the WAIS hero banner, logo, and `_INSERT TEXT HERE_` blocks for company background, function, and store lot description.
- `loadHomeDeals()` reads the 4 product `.txt` files, finds discounted items listed in `dealNames`, and displays them in the scrolling ticker (`#homeDealsTrack`) and promo cards (`#homeAdsGrid`).
- `updateMainPageAuth()` checks `sessionStorage` (`wais_session`) to either prompt the visitor to log in or show direct buttons to `shop.html` / `admin.html`.

### 3.2 Login & Register (`login.html` + `login.js`)
- `hashPassword()` converts every password into a SHA-256 hash using the browser's built-in `crypto.subtle.digest` so plain passwords are not stored in `users.txt`.
- **Login:** Checks username + password hash against `database/users.txt` (and any newly registered users in `localStorage`).
  - `admin` role redirects to `admin.html`.
  - `customer` role redirects to `shop.html`.
- **Register:** Always creates a `customer` account and saves it in `localStorage` (`wais_users_extra`), then sends the user straight to `shop.html`.

### 3.3 Shop (`shop.html` + `shop.js`)
- **Login Lock (`checkShopAccess()`):** If `wais_session` does not exist in `sessionStorage`, the shop stays hidden and shows a "Shop Access Locked" card.
- **Loading Products (`loadProducts()` + `parseTxtFile()`):** Reads `localStorage` overrides first (if edited in `admin.html`), otherwise fetches the `.txt` files from `database/`.
- **Features:** Live search (`#searchInput`), category filter (`#categorySelect` + sidebar links), Favorites list, Cart + Subscription discount (`Basic` 0%, `Plus` 5%, `Pro` 10%), Compare 2 products (`✋` button opens Pros & Cons modal), Language switch, and Order table.

### 3.4 QR Payment Checkout (`payment.html` + `payment.js`)
- **Access & Empty Check (`loadPaymentPage()`):** Requires an active login (`wais_session`) and pending items (`wais_checkout` saved when clicking **Place Order** in the Cart).
- **QR Method Selector & Canvas (`drawQrCode()`):** Switches between **GCash QR**, **Maya QR**, and **Bank QRPh**, drawing a `21×21` QR matrix (`qrGridBase`) onto `<canvas id="qrCanvas">` using simple `for` loops.
- **Order Confirmation:** Submitting `#payForm` saves the paid order into `sessionStorage` (`wais_orders`), clears `wais_checkout` and `wais_cart`, and links back to `shop.html#orders`.

### 3.5 Admin Table Editor (`admin.html` + `admin.js`)
- **Admin Lock (`checkAdminAuth()`):** Only accessible if logged in with `role === 'admin'`.
- Lets you pick any database (`Laptop`, `Components`, `Accessories`, `Gaming Consoles`, or `Users`), edit cells directly in a table, add new rows (including **Image src** and **Alt text**), delete rows, save immediately to the browser (`localStorage`), or click **Download .txt** to update your files in VS Code.

---

## 4. Database File Formats

### 4.1 Product `.txt` Files

```text
categories: Laptop

Pink Slim 14 | 32990
Image: images/pink-slim-14.jpg
Alt: Pink Slim 14 laptop photo
Date: 2026-11-25
Description: 14-inch display, 8 GB RAM, 512 GB SSD.
Pros:
- Light and easy to carry
- Good for school and office work
Cons:
- 8 GB RAM limits heavy multitasking
- No dedicated graphics card
```

- **First line of each item:** `Product Name | Price`
- **`Image:`** Path or URL to the picture (e.g., `images/laptop.jpg`). Leave blank if there is no picture yet.
- **`Alt:`** Fallback text shown inside the blank box when `Image:` is empty or fails to load. If omitted, it defaults to **`Image not yet added`**.
- **`Date:`**, **`Description:`**, **`Pros:`**, **`Cons:`**: Optional extra info shown on cards and in the Compare popup.

### 4.2 Users `.txt` File (`database/users.txt`)

```text
# Format: Username/Email | Name | Role | PasswordHash
admin | Admin | admin | 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
```

- **Master Admin Credentials:** Username `admin`, Password `admin`.

---

## 5. How Image & Alt Fallback Works in Code

1. **Safety Check (`isSafeImageSrc`):** Checks that `Image:` is not blank and does not start with `javascript:` or `data:`.
2. **Shop Cards (`makeProductThumb` in `shop.js`):**
   - If `Image:` has a link → creates `<img class="product-img" src="..." alt="...">`.
   - If the link is broken (`img.onerror`) → removes the broken `<img>` and shows `<span class="thumb-alt">` with the `Alt:` text.
   - If `Image:` is blank → leaves a clean blank box showing `<span class="thumb-alt">` (`"Image not yet added"` by default).
3. **Homepage Deal Cards & Tickers (`makeHomeAdVisual` and `makeHomeDealThumb` in `home.js`, `makeDealThumb` in `shop.js`):**
   - Same rule: displays the photo if `Image:` is filled in; otherwise shows a blank placeholder box (`"Image not yet added"` / `"No img"`).

---

## 6. How to Run the Demo in VS Code

1. Unzip `wais-vscode.zip` and open the `wais-website` folder in **VS Code**.
2. Open `index.html` with the **Live Server** extension (**Right-click `index.html` → Open with Live Server**). *(Live Server is needed so `fetch('database/*.txt')` works.)*
3. **Demo Walkthrough:**
   - Show `index.html` (logo, company info, deals ads).
   - Register a new customer on `login.html` → opens `shop.html`.
   - Add an item to Cart, click **Place Order** → opens `payment.html`, pick a QR method, confirm payment → view the paid order in `shop.html#orders`.
   - Sign out, log in with `admin` / `admin` → opens `admin.html`.
   - Add or edit a product (with or without an `Image src` link), click **Save Changes**, and refresh `shop.html` to show it live!
