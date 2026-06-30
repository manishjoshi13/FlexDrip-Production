# Developer Documentation: Profile Completion, Cart & User Navigation

This document explains the technical implementation of user profile completion, roles locking, shopping cart operations, guest redirects, and the user navigation dropdown menu.

---

## 👤 1. Profile Completion & Role Locking

To support Google authentication where users have `profileCompleted: false` initially, we implemented a dynamic profile completion system.

### Backend Controller (`auth.controller.js`)
* **Endpoint:** `PUT /api/auth/update-profile`
* **Rules:**
  1. Full Name and Phone Number are required.
  2. Phone number must be exactly a 10-digit number.
  3. Role selector is **locked** and cannot be changed if `user.profileCompleted` is already `true`.
  4. Auto-provisions an empty `Cart` if the user registers/completes profile as a `buyer`.

```javascript
// PUT /api/auth/update-profile
export const updateProfile = asyncHandler(async (req, res) => {
    const { fullName, phone, role } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.profileCompleted) {
        if (role) user.role = role; // Lock role once completed
    }
    user.fullName = fullName;
    user.phone = Number(phone);
    user.profileCompleted = true;
    await user.save();
    
    if (user.role === "buyer") {
        // Create cart if none exists
    }
});
```

### Profile View (`Profile.jsx`)
* Form allows editing `fullName` and `phone`.
* If `profileCompleted === false`, it lets the user select their account type (`buyer` vs `seller`).
* If `profileCompleted === true`, the selector is disabled, locking the role.

---

## 🛍️ 2. Cart Operations & Population

We integrated the mongoose `Cart` model with dynamic population so that the frontend receives complete product objects (images, title, prices) on query rather than just ObjectIDs.

### Populating Product Data (`cart.controller.js`)
All cart-related operations (`getMyCart`, `addCartItem`, `removeCartItem`, `clearCart`) call `.populate("items.productId")` before returning.
```javascript
export const getMyCart = asyncHandler(async(req,res)=>{
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id });
    await cart.populate("items.productId");
    res.status(200).json({ success: true, data: cart });
});
```

### Guest Add-To-Bag Redirect (`ProductDetails.jsx`)
If a guest user (unauthenticated) attempts to add items to the cart, the button triggers a redirect:
```javascript
const handleAddToCart = async () => {
    if (!user) {
        navigate('/login');
        return;
    }
    // ... dispatch addCartItem api
};
```

---

## 🛒 3. Cart Checkout & Orders Page

Since ordering requires complete user information:
1. If `user.profileCompleted` is `false`, the **Checkout** button on `/cart` is disabled, and an alert notifies the user to complete their details.
2. If `user.profileCompleted` is `true`, checkout is enabled. Clicking checkout:
   * Compiles the items and total price.
   * Logs a simulated order to `localStorage` under `flexdrip_orders` containing an order ID, date, status (`"Dispatched"`), and items list.
   * Calls `clearCart()` to empty the cart database record.
   * Renders a success screen linking to the **My Orders** page.
3. The **My Orders** page (`OrdersPage.jsx`) retrieves simulated orders from `localStorage` and displays them with order statuses and total price summaries.

---

## 🔔 4. Profile Completion Alert Popups

On the buyer storefront **Home Page** (`Home.jsx`):
* A `useEffect` checks if a logged-in user has `profileCompleted === false` (common for new Google Auth logins).
* If so, a glassmorphic popup modal is rendered prompting them to set up their profile.
* Users can click "Complete Now" to redirect directly to `/profile`, or "Remind Later" to dismiss the popup for that session.

---

## 🧭 5. Polished User Icon Dropdown Menu

In the header navigation (`Navbar.jsx`):
* Added a **Cart Shopping Bag icon** next to the user icon displaying a live item quantity count badge (calculated via `cart.items.reduce`).
* Clicking the user icon avatar toggles a floating glassmorphic dropdown card containing:
  * User Name & Email.
  * Links to **My Profile** (`/profile`), **My Orders** (`/orders`), and **My Cart** (`/cart`).
  * A **Seller Dashboard** link (only visible if the user's role is `seller`).
  * A **Logout** button.
* Replaced `user.name` references with `user.fullName` to resolve display naming mismatches.
