# WAIS Website — Super Simple Line-by-Line Guide (Zero Coding Knowledge Needed!)

If you have never coded before and need to explain this in a presentation, **this guide translates every single line into normal human English.**

---

## First: What Do These Weird Coding Words Mean?

Before looking at any lines, here is the 30-second cheat sheet for every weird word you'll see:

- **HTML (`index.html`, `shop.html`, etc.)** = The **skeleton** of the page (text, buttons, boxes, input fields).
- **CSS (`style.css`)** = The **paint and clothes** (colors, rounded corners, spacing, grid layout).
- **JavaScript (`home.js`, `shop.js`, etc.)** = The **brain** (what happens when you click a button, type in search, or log in).
- **`.txt` files (`database/*.txt`)** = Our **notebook / spreadsheet** written in plain text instead of an expensive database.
- **`var something = ...`** = Making a labeled **box** to hold information (a word, a number, or a list).
- **`[ ... ]` (Array)** = A **list** of items (like a shopping list).
- **`for (var i = 0; ...)` (For Loop)** = "Go through the list **one item at a time** from top to bottom."
- **`if (...) { ... } else { ... }`** = "**If** this is true, do X; **otherwise**, do Y."
- **`function doThing() { ... }`** = A saved **recipe / mini-command** you can run anytime by calling its name.
- **`document.getElementById('boxName')`** = "Look at the HTML page and **grab the thing** with `id="boxName"`."
- **`.textContent = ...`** = "Put this text inside that box safely."
- **`fetch('file.txt')`** = "Go read that `.txt` file from our folder."
- **`sessionStorage`** = Browser's **short-term memory** (remembers you are logged in until you close the tab or click Sign Out).
- **`localStorage`** = Browser's **long-term memory** (remembers edits you saved in `admin.html` even if you refresh).
- **`hidden`** = An HTML switch that makes a section invisible until JavaScript turns it back on.

---

## 1. `index.html` — The Main Front Page (Lines 1 to 120)

- **Lines 1–2:** `<!doctype html>` and `<html lang="en">` — Tells Chrome/Edge: "Hey, this is an English webpage."
- **Lines 3–9 (`<head>`):** Invisible setup stuff at the top:
  - **Line 4 (`charset="utf-8"`):** Lets the browser show symbols like the Peso sign `₱` instead of weird boxes.
  - **Line 5 (`viewport`):** Stops the site from looking tiny on phones.
  - **Line 6 (`<title>`):** The words shown on the browser tab at the top.
  - **Line 7 (`fonts.googleapis.com`):** Downloads the nice font style from Google.
  - **Line 8 (`style.css`):** Attaches our color & layout file (`style.css`).
- **Line 10 (`<body class="landing-page">`):** Everything inside `<body>` is what people actually see on screen.
- **Lines 12–29 (`<header>`):** The white bar at the very top:
  - **Lines 13–20:** Your clickable WAIS logo picture (`assets/aistudio/...jfif`) + the store name.
  - **Lines 22–28:** The menu links on the right (`Company`, `Great Deals`, `Login / Register`).
  - **Lines 26–27:** Two secret buttons (`Enter Shop` and `Admin Editor`) that have `hidden` on them—`home.js` only unhides them if you are logged in!
- **Lines 31–112 (`<main>`):** The middle part of the page:
  - **Lines 33–52 (`.hero`):** The big banner with your circuit board photo behind it, your logo, `"WAIS Computer & Gadgets"`, `_INSERT TEXT HERE_` slogan spot, and the `Login to Access Shop` / `Create Account` buttons inside `#heroAuthControls`.
  - **Lines 55–57 (`#homeDealsTrack`):** An empty strip that `home.js` fills with the sliding promo deals banner.
  - **Lines 60–85 (`#company`):** Four white boxes (`Who We Are`, `Our Function & Services`, `Store & Lot Description`, `Mission & Customer Promise`) with `_INSERT TEXT HERE_` so you know where to type your company info.
  - **Lines 88–94 (`#deals` / `#homeAdsGrid`):** An empty grid that `home.js` fills with up to 6 deal ad cards.
  - **Lines 97–111 (`#access`):** The "Login or Register to Enter the Shop" box at the bottom.
- **Lines 114–116 (`<footer>`):** Bottom strip for your store address and hours (`_INSERT TEXT HERE_`).
- **Lines 118–120:** `<script src="home.js"></script>` turns on the JavaScript brain for this page, then closes the file.

---

## 2. `login.html` — The Login & Sign-Up Page (Lines 1 to 64)

- **Lines 1–9:** Same invisible `<head>` setup (Peso support, phone sizing, title, font, `style.css`).
- **Lines 10–18:** Top row with a `← Main Page` back button, plus hidden `Enter Shop` and `Admin Editor` buttons that appear once you log in.
- **Lines 20–22:** White card titled `WAIS Account` and `#sessionBox` (a green message bar showing who is signed in).
- **Lines 24–27:** Two tab buttons: `Login` (`#showLoginTab`) and `Register` (`#showRegisterTab`).
- **Lines 30–38 (`#loginForm`):** The Login form with two boxes (`#loginEmail` for username/email, `#loginPass` for password) and a green `Login` button.
- **Lines 41–52 (`#registerForm`):** The Sign-Up form (starts `hidden`) with Full Name (`#regName`), Username/Email (`#regEmail`), Password (`#regPass`, minimum 4 characters), and `Create Account` button. *(Notice there is no "Admin/Customer" dropdown here—normal sign-ups are ALWAYS customers!)*
- **Line 54 (`#authMessage`):** Blank text line where red errors ("Wrong password") or green messages show up.
- **Lines 56–58 (`#logoutBtn`):** `Sign Out` button (hidden unless you are logged in).
- **Line 62:** `<script src="login.js"></script>` loads the login brain.

---

## 3. `shop.html` — The Store Page (Lines 1 to 190)

- **Lines 1–9:** Same `<head>` setup.
- **Lines 12–22 (`#shopLocked`):** A locked-door screen ("Shop Access Locked") that shows up if someone tries to open `shop.html` without logging in first.
- **Lines 25–168 (`#shopApp`):** The actual store (starts `hidden` until `shop.js` confirms you are logged in!):
  - **Lines 26–45 (`<nav class="sidebar">`):** The left-side menu:
    - **Line 27:** `MAIN PAGE` button back to `index.html`.
    - **Lines 29–37:** Category links (`Shop Inventory`, `Laptop`, `Components`, `Accessories`, `Gaming Consoles`).
    - **Lines 38–41:** Links to switch screens (`Help & Settings`, `Language`, `Customer Order`, `Account`).
    - **Line 42 (`#adminNavItem`):** Green `Admin Editor` button (`hidden` unless you are logged in as `admin`).
    - **Line 43 (`#shopSignOut`):** Logs you out and sends you back to `index.html`.
  - **Lines 48–73 (`<header class="topbar">`):** Top bar with mini logo, `#searchInput` search bar, `#categorySelect` dropdown, and `Favorites`, `Subscription`, and `Cart` buttons.
  - **Lines 75–77 (`#dealsTrack`):** Sliding promo deals bar.
  - **Lines 79–166 (`.content`):** All 7 screens live inside here, and JavaScript turns one on at a time:
    - **Lines 81–86 (`#view-inventory`):** Product grid (`#productGrid`) + `"No products match"` message (`#noResults`).
    - **Lines 89–103 (`#view-help`):** Clickable FAQ questions (`<details>` makes them open/close automatically with zero JS!).
    - **Lines 106–113 (`#view-language`):** Radio buttons for English, Filipino, Cebuano.
    - **Lines 116–128 (`#view-orders`):** Orders table (`#ordersBody`) with 3 fake starter orders (`#1001`–`#1003`).
    - **Lines 131–135 (`#view-favorites`):** List of starred favorite items (`#favList`).
    - **Lines 138–146 (`#view-cart`):** Cart list (`#cartList`), total price (`#cartTotal`), and `Place Order` button (`#checkoutBtn`).
    - **Lines 149–165 (`#view-subscription`):** 3 membership cards (`Basic` 0% off, `Plus` 5% off, `Pro` 10% off).
- **Lines 171–180 (`#compareModal`):** The popup window that compares 2 products side by side (hidden until you click `✋` on 2 cards).
- **Lines 183–186 (`#compareTray`):** The floating pill at the bottom of the screen telling you how many items you picked to compare.
- **Line 188:** `<script src="shop.js"></script>` loads the store brain.

---

## 4. `admin.html` — The Admin Spreadsheet Page (Lines 1 to 97)

- **Lines 1–9:** Same `<head>` setup.
- **Lines 12–23:** Top header showing `"Admin Table Database"`, who is logged in (`#adminWho`), links to `Main Page` / `Shop` / `Account`, and `Sign Out`.
- **Lines 26–30 (`#adminLocked`):** "Admin Access Required" blocker if you are not the admin.
- **Lines 33–92 (`#adminPanel`):** The admin editor (hidden unless `role === 'admin'`):
  - **Lines 34–50:** Toolbar with `#dbSelect` (pick which `.txt` database to edit) and 3 buttons: `Save Changes` (saves to browser memory), `Download .txt` (downloads the updated `.txt` file for VS Code), and `Reload from .txt` (undoes browser edits and reloads the original file).
  - **Line 52 (`#adminStatus`):** Green status bar showing confirmation messages.
  - **Lines 55–68 (`#addProductForm`):** Form to add a brand-new product (`Name`, `Price`, `Image src`, `Alt text`, `Date`, `Short description`, `Pros`, `Cons`).
  - **Lines 71–83 (`#addUserForm`):** Form to add a new user (only appears when `Users` is selected).
  - **Lines 86–91 (`#adminTable`):** Empty table skeleton filled by `admin.js` with editable spreadsheet boxes.
- **Line 95:** `<script src="admin.js"></script>` loads the admin brain.

---

## 5. `home.js` — Main Page Brain (Lines 1 to 280)

- **Lines 3–8 (`dealFiles`):** A list telling JS where the 4 product `.txt` files live.
- **Lines 10–15 (`dealNames` & `dealPercents`):** Two matching lists: item #1 in `dealNames` (`'pink slim 14'`) gets discount #1 in `dealPercents` (`15`% off), item #2 gets `20`% off, etc.
- **Line 17 (`dealProducts`):** Empty list that will hold all discounted items we find.
- **Lines 19–24 (`makeEl`):** Shortcut helper: "Make a new HTML tag (like a button or box), give it a CSS class, and put this text inside."
- **Lines 26–28 (`formatPeso`):** Turns `32990` into `₱32,990`.
- **Lines 30–36 (`getDiscountPercent`):** Loops through `dealNames`; if a product name matches, returns its discount %; otherwise returns `0`.
- **Lines 38–43 (`isSafeImageSrc`):** Security check: returns `false` if an image box is empty or someone tried typing sneaky `javascript:` / `data:` code.
- **Lines 45–94 (`parseSimpleProducts`):** Reads a `.txt` file one line at a time:
  - **Line 46:** Chops the big text file into an array of single lines.
  - **Lines 50–52:** Loops line by line and skips empty lines or `#` comment lines.
  - **Lines 55–68:** If we are currently reading a sale item, grabs its `Image:`, `Alt:`, and `Description:` lines.
  - **Lines 70–91:** When it sees `Name | Price`, splits them apart, removes `₱` and commas from the price, checks if it's on sale (`pct > 0`), and if yes, creates a product object (defaulting `alt` to `'Image not yet added'`) and adds it to `list`.
- **Lines 96–124 (`loadHomeDeals`):** Loops through all 4 categories: checks browser memory (`localStorage`) first in case Admin saved changes; if not, uses `fetch()` to read the `.txt` file, collects all deals into `dealProducts`, and calls `drawTicker()` and `drawAdsGrid()`.
- **Lines 126–128 (`isUserLoggedIn`):** Checks `sessionStorage`—returns `true` if someone is signed in.
- **Lines 130–136 (`goToShopOrLogin`):** If you click any deal ad: logged-in people go to `shop.html`, everyone else goes to `login.html`.
- **Lines 138–154 (`makeHomeDealThumb`):** Makes the small `42×42` thumbnail for the scrolling bar—shows the photo if `Image:` has a link, or `'No img'` if blank/broken.
- **Lines 156–177 (`makeHomeAdVisual`):** Makes the big photo box for deal cards—shows the photo if `Image:` has a link, or a blank box showing `Alt:` (`'Image not yet added'` by default) if blank/broken.
- **Lines 179–206 (`drawTicker`):** Loops twice (`copy = 0..1`) to build the endless scrolling deals bar at the top of `index.html`.
- **Lines 208–238 (`drawAdsGrid`):** Picks up to 6 deals (`maxAds = 6`) and builds white promo cards inside `#homeAdsGrid`.
- **Lines 240–277 (`updateMainPageAuth`):** Checks `sessionStorage`: if someone is logged in, changes the top menu and hero buttons from "Login / Register" to "Enter Shop" (plus "Open Admin Editor" if `admin`).
- **Lines 279–280:** Runs `updateMainPageAuth()` and `loadHomeDeals()` as soon as `index.html` opens.

---

## 6. `login.js` — Login & Sign-Up Brain (Lines 1 to 201)

- **Lines 3–4:** Remembers the path `'database/users.txt'` and creates an empty `allUsers` list.
- **Lines 6–17 (`hashPassword`):** Scrambles any password using **SHA-256** (a one-way math scrambler built into browsers) so `"admin"` turns into a 64-letter code instead of storing readable passwords.
- **Lines 19–36 (`parseUsersTxt`):** Reads `users.txt` line by line, splits by `|`, and builds a user object `{ email, name, role, hash }` for each line.
- **Lines 38–72 (`loadUsers`):** Loads users from `localStorage` (`wais_users_override`) if Admin edited them, otherwise fetches `database/users.txt`, then adds any newly registered customers saved in `localStorage` (`wais_users_extra`).
- **Lines 74–95 (`showCurrentSession`):** Checks `sessionStorage` (`wais_session`) and shows/hides the green status bar, `Sign Out`, `Enter Shop`, and `Admin Editor` buttons.
- **Lines 97–101 (`showMessage`):** Shows green success or red error messages under the form.
- **Lines 103–120:** Switches between the Login tab and Register tab when clicked.
- **Lines 122–156 (`#loginForm.onsubmit`):** When you click **Login**:
  - **Lines 124–127:** Stops page refresh, grabs typed username & password, scrambles the password with `hashPassword()`.
  - **Lines 129–140:** Loops through `allUsers` looking for a matching username AND scrambled password; shows an error if wrong.
  - **Lines 142–155:** Saves your login badge into `sessionStorage` (`wais_session`) and sends `admin` to `admin.html` or `customer` to `shop.html`.
- **Lines 158–189 (`#registerForm.onsubmit`):** When you click **Create Account**:
  - **Lines 160–170:** Checks if that username is already taken in `allUsers`.
  - **Lines 172–179:** Scrambles the password, creates a new `'customer'` account, and saves it into `localStorage` (`wais_users_extra`).
  - **Lines 181–188:** Saves your login badge into `sessionStorage` and sends you straight into `shop.html`.
- **Lines 191–195:** Clicking `Sign Out` deletes your `sessionStorage` badge.
- **Lines 197–199:** If the web address ends with `?tab=register`, automatically opens the Register tab.
- **Line 201:** Runs `loadUsers()` right when the page opens.

---

## 7. `shop.js` — Storefront Brain (Lines 1 to 630)

- **Lines 3–8 (`categoryFiles`):** List of the 4 product `.txt` files.
- **Lines 10–15 (`discountNames` & `discountPercents`):** Which products are on sale and by how much %.
- **Lines 17–25:** Loads saved cart IDs from `sessionStorage` (`wais_cart`), creates empty lists for `products`, `favorites`, `picked` (compare picks), plus starting settings (`currentCategory = 'all'`, `searchText = ''`, `discountRate = 0`).
- **Lines 27–32 (`makeElement`):** Shortcut to create HTML tags safely.
- **Lines 34–39 (`hasItem`):** Loops through a list and says `true` or `false` if an ID is in it.
- **Lines 41–53 (`toggleInArray`):** Adds an item ID to a list if it's not there, or removes it if it is (used for Favorites, Cart, and Compare).
- **Lines 55–60 (`findProductById`):** Finds a full product object using its ID.
- **Lines 62–64 (`formatPeso`):** Formats numbers as `₱XX,XXX`.
- **Lines 66–72 (`getDiscount`):** Looks up a product's discount %.
- **Lines 74–79 (`isSafeImageSrc`):** Blocks empty strings and dangerous `javascript:` / `data:` links.
- **Lines 81–185 (`parseTxtFile`):** Reads a `.txt` file line by line and builds complete product objects (with `name`, `price`, `category`, `image`, `alt` defaulting to `'Image not yet added'`, `date`, `description`, `pros`, `cons`, and `discount`).
- **Lines 187–207 (`makeProductThumb`):** Builds the photo box at the top of each product card—puts an `<img>` if `Image:` has a link, or shows a clean blank box with the `Alt:` text (`'Image not yet added'` by default) if blank or broken.
- **Lines 209–240 (`loadProducts`):** Loads all 4 categories (checking `localStorage` first, else `fetch()`ing the `.txt` file), updates the top Cart button count, and draws the banner, products, and cart.
- **Lines 242–262 (`showView`):** Hides all screens except the one you clicked (`inventory`, `cart`, `favorites`, `orders`, `subscription`, `language`, `help`) and underlines the active sidebar link.
- **Lines 264–320 (`makeDealThumb` & `showDeals`):** Builds the scrolling sale banner at the top of the shop; clicking any deal jumps to that category.
- **Lines 322–391 (`showProducts`):** Loops through `products`, skips items that don't match the selected category or search word, and builds every card with its photo/blank box, `✋` button, category/date, name, price, description, `Favorite` button, and `Add to cart` button.
- **Lines 393–426 (`toggleFavorite` & `showFavorites`):** Adds/removes items from Favorites, updates the top button count, and draws `#favList`.
- **Lines 428–469 (`toggleCart` & `showCart`):** Adds/removes items from Cart, saves the cart to `sessionStorage` (`wais_cart`), updates the top button count, adds up prices, and applies the subscription discount (`subtotal * (1 - discountRate)`).
- **Lines 471–530 (`toggleCompare`, `showCompare`, `clearCompare`):** Tracks up to 2 picked items; shows the bottom tray when 1+ are picked, and pops open `#compareModal` with `Pros` and `Cons` when exactly 2 are picked.
- **Lines 532–552 (`checkShopAccess`):** The bouncer at the door—if `wais_session` is missing, hides the shop and shows `#shopLocked`; if `role === 'admin'`, reveals the `Admin Editor` button.
- **Lines 554–587:** Connects the search box, category dropdown, sidebar links, and subscription plan radios.
- **Lines 589–603 (`showSavedOrders`):** Reads any orders paid on `payment.html` from `sessionStorage` (`wais_orders`) and puts them at the top of `#ordersBody`.
- **Lines 605–627 (`#checkoutBtn.onclick`):** When you click **Place Order**, saves your cart items, subtotal, discount, and total into `sessionStorage` (`wais_checkout`) and sends you to `payment.html`.
- **Lines 629–647:** Connects language radios (`en`, `fil`, `ceb`), `Sign Out` button, and compare modal close buttons.
- **Lines 649–657:** Checks login first; if `#orders` is in the URL (coming back from payment) opens the Orders screen, otherwise opens Inventory, loads saved orders, and loads products.

---

## 8. `admin.js` — Admin Spreadsheet Brain (Lines 1 to 477)

- **Lines 3–9 (`CATEGORY_FILES`):** Maps dropdown names (`Laptop`, `Users`, etc.) to their `.txt` files.
- **Lines 11–12:** Tracks which table is open (`currentTable`) and its list of rows (`rows`).
- **Lines 14–19 (`makeEl`):** Shortcut to create HTML elements.
- **Lines 21–32 (`hashPassword`):** SHA-256 scrambles passwords when the admin adds a new user.
- **Lines 34–38 (`showStatus`):** Shows the green confirmation banner.
- **Lines 40–121 (`parseProductRows`):** Turns a product `.txt` file into an array of row objects for the table.
- **Lines 123–141 (`parseUserRows`):** Turns `users.txt` into row objects for the Users table.
- **Lines 143–180 (`rowsToTxt`):** Converts your edited table back into `.txt` text format (defaulting `Alt:` to `'Image not yet added'` if left blank).
- **Lines 182–217 (`loadTable`):** Loads either browser-saved edits (`localStorage`) or the `.txt` file from `database/`, then calls `drawTable()`.
- **Lines 219–313 (`drawTable`):** Draws the spreadsheet table:
  - **Lines 228–270:** If `Users` is picked, shows 4 columns (`Username / Email`, `Name`, editable `Role` dropdown, `Delete`).
  - **Lines 272–312:** If a product table is picked, shows 9 columns (`Name`, `Price`, `Image (src)`, `Alt Text`, `Date`, `Description`, `Pros`, `Cons`, `Delete`).
- **Lines 315–341 (`makeCellInput`):** Creates an editable input box inside a table cell; as soon as you type (`oninput`), it updates `rows` in memory.
- **Lines 343–368 (`checkAdminAuth`):** Checks `wais_session`; blocks anyone whose `role` is not `'admin'`.
- **Lines 370–471 (Buttons & Forms):**
  - **Lines 370–374:** Changing `#dbSelect` switches tables.
  - **Lines 376–416:** Submitting `+ Add Row` pushes a new product row into `rows` and redraws the table.
  - **Lines 418–432:** Submitting `+ Add User` hashes the password and adds a new user row.
  - **Lines 434–443:** `Save Changes` saves `rowsToTxt()` into `localStorage` so `shop.html` and `index.html` show your edits right away.
  - **Lines 445–456:** `Download .txt` packages `rowsToTxt()` into a downloadable `.txt` file so you can overwrite the file in VS Code.
  - **Lines 458–466:** `Reload from .txt` erases browser edits for that table and loads the original `.txt` file again.
  - **Lines 468–471:** `Sign Out` clears `wais_session` and goes to `login.html`.
- **Lines 473–477:** Pre-fills today's date in `#newDate`, verifies admin login, and loads the `Laptop` table.

---

## 9. `payment.html` — The QR Payment Checkout Page (Lines 1 to 88)

- **Lines 1–9:** Same invisible `<head>` setup (Peso support, phone sizing, title, font, `style.css`).
- **Lines 10–15:** Top bar with a `← Back to Shop` link and `#payAccount` (shows your name).
- **Lines 17–22 (`#payLocked`):** Blocker card if someone opens `payment.html` without logging in first.
- **Lines 24–29 (`#payEmpty`):** Shown if someone opens `payment.html` with nothing in their checkout list.
- **Lines 31–83 (`#payPanel`):** The main 2-column payment box (`.pay-grid`):
  - **Lines 37–43 (Left box — Order Summary):** Lists every item (`#payItemList`), `#paySubtotal`, `#payDiscount`, and `#payTotal`.
  - **Lines 45–81 (Right box — QR Method):**
    - **Lines 48–61 (`#qrMethods`):** Radio buttons to choose **GCash QR**, **Maya QR**, or **Bank QRPh**.
    - **Lines 63–67 (`.qr-frame`):** Shows the selected wallet label (`#qrMethodLabel`), the `<canvas id="qrCanvas">` box where JavaScript draws the QR squares, and the exact Peso amount (`#qrAmountText`).
    - **Lines 69–74 (`#payForm`):** Optional Reference Number input (`#payRefInput`) and the green `I Have Paid — Confirm Order` button (`#confirmPayBtn`).
    - **Lines 76–80 (`#payStatus` & `#payDoneActions`):** Hidden until you confirm payment—then shows the green confirmation message and links to **View Customer Orders** (`shop.html#orders`) or **Continue Shopping**.
- **Lines 86–88:** `<script src="payment.js"></script>` loads the payment brain and closes the file.

---

## 10. `payment.js` — QR Payment Brain (Lines 1 to 149)

- **Lines 4–26 (`qrGridBase`):** A `21×21` grid made of `1`s and `0`s (`1` = draw a colored square, `0` = leave white) that draws the QR code pattern.
- **Lines 28–29:** Remembers which wallet is selected (`selectedMethod = 'GCash QR'`) and `checkoutData`.
- **Lines 31–39 (`formatPeso` & `makeEl`):** Same Peso formatter and safe HTML element helper.
- **Lines 41–59 (`drawQrCode`):** Paints a white background on `#qrCanvas`, picks navy/blue/green based on the selected wallet, and uses two nested `for` loops (`row` and `col`) to draw a `9×9` pixel square wherever `qrGridBase[row][col] === 1`.
- **Lines 61–107 (`loadPaymentPage`):**
  - **Lines 68–73:** Checks `sessionStorage` (`wais_session`)—if missing, shows `#payLocked`.
  - **Lines 78–91:** Checks `sessionStorage` (`wais_checkout`)—if empty, shows `#payEmpty`.
  - **Lines 97–106:** Shows `#payPanel`, fills the item list, subtotal, discount, total, and calls `drawQrCode(selectedMethod)`.
- **Lines 109–116 (`methodRadios`):** Listens for clicking GCash/Maya/QRPh, updates `#qrMethodLabel`, and redraws the QR code color.
- **Lines 118–147 (`#payForm.onsubmit`):** When you click **I Have Paid — Confirm Order**:
  - **Lines 122–134:** Builds the item summary text, gets the next order number (`wais_next_order`, starting at `1004`), and creates the status text (including your Reference No. if typed).
  - **Lines 136–144:** Saves the new order into `sessionStorage` (`wais_orders`), increases the order number, and deletes `wais_checkout` and `wais_cart` so the cart is empty again.
  - **Lines 146–150:** Shows the green confirmation message, hides the payment form, and reveals the **View Customer Orders** button.
- **Line 153:** Runs `loadPaymentPage()` right when `payment.html` opens.

---

## 11. `style.css` — Colors, Boxes & Layout (Lines 1 to 1219)

- **Lines 1–11 (`:root`):** Stores our theme colors (`--bg` sky blue, `--ink` dark navy, `--green1` lime green, `--pink`, and `--line` `2px` border) so we don't have to retype color codes everywhere.
- **Lines 13–33:** Makes box widths include borders cleanly (`box-sizing: border-box`), paints the sky-blue page background, sets the font, and adds blue keyboard focus rings.
- **Lines 35–110:** Sets up the 2-column shop layout (`.app`), left sidebar, round `MAIN PAGE` button, underlined current link, green `Admin Editor` badge, and gray category box.
- **Lines 112–185:** Styles the top search bar, dropdown pill, and rounded white/green buttons.
- **Lines 187–290:** Styles the white promo ticker box, scrolling animation (`@keyframes slide-right`, pauses when hovered), `42×42` `.dthumb` boxes, crossed-out prices, and pink `-XX%` badges.
- **Lines 292–570:** Styles the Main Page (`index.html`): top bar, logo, hero banner (line 378 puts your circuit image as the background), dark gradient overlay, promo cards grid (`.ads-grid`), `.ad-img` / `.ad-fallback` (`130px` tall photo or blank alt box), login gate box, and `_INSERT TEXT HERE_` company cards.
- **Lines 572–732:** Styles the Shop product grid (`.grid`), product cards (`.product`), hover pop-up shadow, `120px` blank photo box (`.thumb`), full-size `.product-img`, centered `.thumb-alt` text, floating `✋` button (`.hand`), and pink/green Favorite & Cart buttons.
- **Lines 734–810:** Styles Favorites/Cart lists, FAQ boxes (`details`), Subscription cards (turns green when selected), and Orders table borders.
- **Lines 812–888:** Styles the centered `login.html` card, tabs, form inputs, and green/red status messages.
- **Lines 890–1000:** Styles `admin.html` toolbar, add-row form, horizontally scrollable table, and spreadsheet cell inputs.
- **Lines 1002–1100:** Makes `[hidden]` elements stay invisible, styles the floating Compare tray at the bottom, and styles the Compare popup window with green `Pros` / pink `Cons` badges.
- **Lines 1101–1116:** Mobile layout rule (`@media (max-width: 640px)`) that stacks the shop sidebar and compare cards vertically on narrow phone screens.
- **Lines 1118–1219:** Styles `payment.html` (`.pay-wrap`, `.pay-card`, 2-column `.pay-grid`, wallet choice pills `.qr-choice`, `.qr-frame`, `#qrCanvas` border, `.qr-amount`, and mobile stacking at lines 1215–1219).

---

## 12. `database/*.txt` — Plain-Text Notebooks

### Product `.txt` Files (`laptop.txt`, `components.txt`, `accessories.txt`, `gaming_consoles.txt`)
- `categories: Laptop` — Tells the code what category this file belongs to.
- `Product Name | 32990` — Starts a new item (`|` separates the name and price).
- `Image: images/photo.jpg` — Path to the product photo (leave blank if there is no photo yet).
- `Alt: ...` — Text shown inside the blank box when there is no photo (defaults to `Image not yet added`).
- `Date:`, `Description:`, `Pros:`, `Cons:` — Extra details shown on cards and in the Compare popup.

### Users File (`database/users.txt`)
- Lines starting with `#` are just human notes (ignored by code).
- Account lines look like: `admin | Admin | admin | <scrambled SHA-256 password>`.
