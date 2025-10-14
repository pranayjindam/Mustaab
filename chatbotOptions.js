export const chatbotOptions = {
  // ============= WELCOME & DEFAULT =============
  welcome: {
    text: "Hi! 👋 Welcome to Mustaab Fashion. How can I help you today?",
    buttons: ["Orders", "Support", "Offers", "Account", "Products", "Shipping"]
  },
  
  default: {
    text: "Sorry, I didn't understand that. Please select an option below:",
    buttons: ["Orders", "Support", "Offers", "Account", "Products", "Shipping"]
  },
  
  // ============= ORDERS =============
  orders: {
    text: "📦 Order Management - Choose what you need:",
    buttons: ["Track Order", "Return Product", "Cancel Order", "Order History", "Invoice", "Back to Main Menu"]
  },
  "track order": {
    text: "🔍 Enter your order ID (e.g., MUS123456) or select:",
    buttons: ["Recent Orders", "All Orders", "Back to Orders Menu"]
  },
  "recent orders": {
    text: "📋 Your recent orders:\n• Order #MUS123456 - Delivered ✅\n• Order #MUS123455 - In Transit 🚚\n• Order #MUS123454 - Processing 📦",
    buttons: ["Track Latest", "View Details", "Back to Orders Menu"]
  },
  "all orders": {
    text: "📚 You can find your complete order history in your account dashboard.",
    buttons: ["Go to Dashboard", "Back to Orders Menu"]
  },
  "track latest": {
    text: "📦 Order #MUS123456:\n• Status: Delivered ✅\n• Date: Jan 20, 2024\n• Location: Delivered at your doorstep",
    buttons: ["View Invoice", "Return Product", "Back to Orders Menu"]
  },
  "view details": {
    text: "📄 Select an order to view complete information:",
    buttons: ["Order #MUS123456", "Order #MUS123455", "Back to Orders Menu"]
  },
  "return product": {
    text: "↩️ Return Process:\n1. Go to 'My Orders'\n2. Select product\n3. Click 'Return'\n4. Choose reason\n5. Schedule pickup\n\n⏰ Return window: 7 days",
    buttons: ["Return Policy", "Refund Status", "Start Return", "Back to Orders Menu"]
  },
  "return policy": {
    text: "📜 Return Policy:\n• 7 days return window\n• Product must be unused with tags\n• Free pickup available\n• Refund in 5-7 business days",
    buttons: ["Return Product", "Back to Orders Menu"]
  },
  "refund status": {
    text: "💰 Check refund status:\nEmail: refunds@mustaab.com with your order ID",
    buttons: ["Email Support", "Back to Orders Menu"]
  },
  "start return": {
    text: "🔄 Starting return process...\nPlease enter your order ID to proceed.",
    buttons: ["Back to Orders Menu"]
  },
  "cancel order": {
    text: "❌ Cancel your order within 1 hour of placing it.\n\nEnter your Order ID to proceed:",
    buttons: ["Cancellation Policy", "Back to Orders Menu"]
  },
  "cancellation policy": {
    text: "⚠️ Cancellation Policy:\n• Free cancellation within 1 hour\n• After 1 hour: ₹50 fee\n• After dispatch: return policy applies\n• Refund in 5-7 days",
    buttons: ["Cancel Order", "Back to Orders Menu"]
  },
  "order history": {
    text: "📋 Your Order History:\n• Total Orders: 47\n• Total Spent: ₹23,450\n\nView complete history in your dashboard.",
    buttons: ["View All", "Track Latest", "Download Invoice", "Back to Orders Menu"]
  },
  "invoice": {
    text: "🧾 To download invoice:\n1. Go to 'My Orders'\n2. Select order\n3. Click 'Download Invoice'\n\nOr email: invoices@mustaab.com",
    buttons: ["Email Invoice", "Back to Orders Menu"]
  },
  "download invoice": {
    text: "📥 Invoice will be sent to your registered email address.",
    buttons: ["Back to Orders Menu"]
  },
  "email invoice": {
    text: "📧 Email invoices@mustaab.com with your order ID. We'll respond within 2 hours.",
    buttons: ["Back to Orders Menu"]
  },
  "go to dashboard": {
    text: "🎯 Redirecting to your account dashboard...",
    buttons: ["Back to Orders Menu"]
  },
  "view all": {
    text: "📚 Redirecting to your order history page...",
    buttons: ["Back to Orders Menu"]
  },

  // ============= SUPPORT =============
  support: {
    text: "💬 How can we assist you today?",
    buttons: ["Email Us", "Call Support", "Live Chat", "FAQs", "Store Locator", "Back to Main Menu"]
  },
  "email us": {
    text: "📧 Email Support:\n• General: support@mustaab.com\n• Orders: orders@mustaab.com\n• Returns: returns@mustaab.com\n\n⏱️ Response time: 2-4 hours",
    buttons: ["Compose Email", "Back to Support"]
  },
  "email": {
    text: "📧 Email Support:\n• General: support@mustaab.com\n• Orders: orders@mustaab.com\n• Returns: returns@mustaab.com\n\n⏱️ Response time: 2-4 hours",
    buttons: ["Compose Email", "Back to Support"]
  },
  "compose email": {
    text: "✉️ Opening your email client...\nPlease send your query to support@mustaab.com",
    buttons: ["Back to Support"]
  },
  "call support": {
    text: "📞 Call us at:\n+1 (800) MUSTAAB\n+1 (800) 687-8222\n\n⏰ Hours:\nMon-Sat: 9 AM - 9 PM\nSun: 10 AM - 6 PM IST",
    buttons: ["Request Callback", "WhatsApp Support", "Back to Support"]
  },
  "phone": {
    text: "📞 Call us at:\n+1 (800) MUSTAAB\n+1 (800) 687-8222\n\n⏰ Hours:\nMon-Sat: 9 AM - 9 PM\nSun: 10 AM - 6 PM IST",
    buttons: ["Request Callback", "WhatsApp Support", "Back to Support"]
  },
  "request callback": {
    text: "📲 Request a callback:\nShare your phone number and preferred time. We'll call within 30 minutes.",
    buttons: ["Back to Support"]
  },
  "whatsapp support": {
    text: "💚 WhatsApp Support:\nChat with us: +91 98765 43210\n\n⏰ Available 24/7",
    buttons: ["Open WhatsApp", "Back to Support"]
  },
  "open whatsapp": {
    text: "💚 Opening WhatsApp...\nManually add: +91 98765 43210",
    buttons: ["Back to Support"]
  },
  "live chat": {
    text: "💬 Starting live chat...\nConnecting to support team. Wait time: 2 minutes.",
    buttons: ["Back to Support"]
  },
  "faqs": {
    text: "❓ Popular FAQs - Select a topic:",
    buttons: ["Shipping Info", "Return Policy", "Payment Options", "Size Guide", "Track Order", "Back to Support"]
  },
  "store locator": {
    text: "🏪 Find Mustaab Stores Near You:\n\nEnter your city or choose:",
    buttons: ["Mumbai Stores", "Delhi Stores", "Bangalore Stores", "All Locations", "Back to Support"]
  },
  "mumbai stores": {
    text: "🏪 Mumbai Stores:\n1. Bandra West - 400050\n2. Andheri East - 400069\n3. Powai - 400076\n\n⏰ Open 10 AM - 9 PM",
    buttons: ["Get Directions", "Back to Support"]
  },
  "delhi stores": {
    text: "🏪 Delhi Stores:\n1. Connaught Place - 110001\n2. Saket - 110017\n3. Rajouri Garden - 110027\n\n⏰ Open 10 AM - 9 PM",
    buttons: ["Get Directions", "Back to Support"]
  },
  "bangalore stores": {
    text: "🏪 Bangalore Stores:\n1. Indiranagar - 560038\n2. Koramangala - 560034\n3. Whitefield - 560066\n\n⏰ Open 10 AM - 9 PM",
    buttons: ["Get Directions", "Back to Support"]
  },
  "all locations": {
    text: "📍 Visit mustaab.com/stores for all store locations.",
    buttons: ["Back to Support"]
  },
  "get directions": {
    text: "🗺️ Opening Google Maps for turn-by-turn directions...",
    buttons: ["Back to Support"]
  },
  "email support": {
    text: "📧 Email: support@mustaab.com\nResponse time: 2-4 hours during business hours.",
    buttons: ["Back to Support"]
  },

  // ============= OFFERS =============
  offers: {
    text: "🎁 Current Offers & Deals - Save Big!",
    buttons: ["New Arrivals", "Sale Items", "Coupons", "Loyalty Program", "Student Discount", "Back to Main Menu"]
  },
  "new arrivals": {
    text: "✨ Fresh Styles Just Dropped!\n• Spring Collection 2024 🌸\n• Summer Essentials ☀️\n• Trending Now 🔥\n\nUp to 30% OFF!",
    buttons: ["Shop Men", "Shop Women", "Shop Kids", "Get Notified", "Back to Offers"]
  },
  "shop men": {
    text: "👔 Men's New Arrivals:\n• Latest shirts\n• Trendy t-shirts\n• Fresh denim\n\n30% OFF!",
    buttons: ["View Collection", "Back to Offers"]
  },
  "shop women": {
    text: "👗 Women's New Arrivals:\n• Latest dresses\n• Trendy tops\n• Fresh kurtas\n\n30% OFF!",
    buttons: ["View Collection", "Back to Offers"]
  },
  "shop kids": {
    text: "👶 Kids New Arrivals:\n• Boys fashion\n• Girls fashion\n• Infant wear\n\n40% OFF!",
    buttons: ["View Collection", "Back to Offers"]
  },
  "get notified": {
    text: "🔔 Get notifications for new arrivals!\nEnter your email to subscribe.",
    buttons: ["Subscribe", "Back to Offers"]
  },
  "subscribe": {
    text: "✅ Subscribed! You'll be first to know about new collections.",
    buttons: ["Back to Offers"]
  },
  "view collection": {
    text: "🛍️ Redirecting to collection page...",
    buttons: ["Back to Offers"]
  },
  "sale items": {
    text: "🔥 MEGA SALE - Up to 70% OFF!\n• Winter Clearance ❄️\n• Flash Deals ⚡\n• Seasonal Sale 🎯",
    buttons: ["Shop Sale", "Set Alert", "Back to Offers"]
  },
  "shop sale": {
    text: "🛍️ Redirecting to sale page...\nDon't miss out on these deals!",
    buttons: ["Back to Offers"]
  },
  "set alert": {
    text: "🔔 Price alert activated! We'll email you when prices drop.",
    buttons: ["Back to Offers"]
  },
  "coupons": {
    text: "🎟️ Active Coupons:\n\n• FIRST20 - 20% off first order\n• SAVE100 - ₹100 off on ₹999+\n• FREE50 - Free shipping on ₹499+\n• FLASH30 - 30% off today!\n• APP15 - Extra 15% on app",
    buttons: ["Apply Coupon", "More Coupons", "Back to Offers"]
  },
  "apply coupon": {
    text: "🎟️ To apply coupon:\n1. Add items to cart\n2. Go to checkout\n3. Enter coupon code\n4. Click 'Apply'",
    buttons: ["Back to Offers"]
  },
  "more coupons": {
    text: "🎉 More Exclusive Coupons:\n• WEEKEND25 - 25% off weekends\n• BUNDLE15 - 15% on 3+ items\n• VIP40 - 40% for VIP members",
    buttons: ["Back to Offers"]
  },
  "loyalty program": {
    text: "⭐ Mustaab Rewards:\n\n• Earn 1 point = ₹1 spent\n• 100 points = ₹100 discount\n• Birthday rewards 🎂\n• Early sale access\n• Free shipping\n\nJoin now, get 500 bonus points!",
    buttons: ["Join Now", "My Points", "Redeem Points", "Back to Offers"]
  },
  "join now": {
    text: "🎉 Welcome to Mustaab Rewards!\n✅ 500 bonus points added\n✅ Free shipping activated\n✅ Birthday reward set",
    buttons: ["Back to Offers"]
  },
  "my points": {
    text: "⭐ Your Rewards:\n• Total Points: 2,450\n• Available: ₹2,450\n• Tier: Gold Member 🥇\n• To Platinum: 550 points",
    buttons: ["Redeem Points", "Earn More", "Back to Offers"]
  },
  "redeem points": {
    text: "💰 Redeem 2,450 points:\n• Use at checkout\n• Convert to coupon\n• Gift to friend\n\nMin: 100 points",
    buttons: ["Redeem Now", "Back to Offers"]
  },
  "redeem now": {
    text: "✅ Points redeemed! Your discount will apply at checkout.",
    buttons: ["Back to Offers"]
  },
  "earn more": {
    text: "💎 Earn more points:\n• Shop (+1 per ₹1)\n• Refer friends (+500)\n• Write reviews (+50)\n• Birthday (+1000)\n• Complete profile (+200)",
    buttons: ["Back to Offers"]
  },
  "student discount": {
    text: "🎓 Student Discount - 15% OFF!\n\nVerify your student status:\n• 15% off all purchases\n• Extra 5% on sale\n• Free shipping\n• Birthday bonus",
    buttons: ["Verify Student ID", "Learn More", "Back to Offers"]
  },
  "verify student id": {
    text: "🎓 Student Verification:\nUpload student ID or use .edu email.\n\nVerification takes 24 hours.",
    buttons: ["Upload ID", "Back to Offers"]
  },
  "upload id": {
    text: "📤 Upload your student ID or enrollment letter. We'll verify within 24 hours.",
    buttons: ["Back to Offers"]
  },
  "learn more": {
    text: "ℹ️ Student Discount:\n• Valid for 4 years\n• Annual verification required\n• College/university students\n• Not combinable with other offers",
    buttons: ["Verify Student ID", "Back to Offers"]
  },

  // ============= ACCOUNT =============
  account: {
    text: "👤 Account Management:",
    buttons: ["Profile", "Addresses", "Payment Methods", "Wishlist", "Preferences", "Back to Main Menu"]
  },
  "profile": {
    text: "👤 Your Profile:\nManage personal information, contact details, and preferences.",
    buttons: ["Edit Profile", "Change Password", "Email Settings", "Back to Account"]
  },
  "edit profile": {
    text: "✏️ Edit profile:\n• Name\n• Email\n• Phone number\n• Date of birth",
    buttons: ["Back to Account"]
  },
  "change password": {
    text: "🔒 Change Password:\nWe'll send a reset link to your registered email.",
    buttons: ["Send Reset Link", "Back to Account"]
  },
  "send reset link": {
    text: "✅ Password reset link sent!\nCheck your inbox and spam folder.",
    buttons: ["Back to Account"]
  },
  "email settings": {
    text: "📧 Email Preferences:\n✅ Order updates\n✅ Promotional emails\n✅ New arrivals\n❌ Partner offers",
    buttons: ["Update Preferences", "Back to Account"]
  },
  "update preferences": {
    text: "✅ Email preferences updated!",
    buttons: ["Back to Account"]
  },
  "addresses": {
    text: "📍 Saved Addresses (3):\n• Home - Hyderabad (Default)\n• Office - Mumbai\n• Parents - Delhi",
    buttons: ["Add New Address", "Edit Address", "Set Default", "Back to Account"]
  },
  "add new address": {
    text: "➕ Adding new address...\nPlease fill in complete details.",
    buttons: ["Back to Account"]
  },
  "edit address": {
    text: "✏️ Select address to edit:\n1. Home - Hyderabad\n2. Office - Mumbai\n3. Parents - Delhi",
    buttons: ["Back to Account"]
  },
  "set default": {
    text: "⭐ Select default delivery address:\n1. Home - Hyderabad (Current)\n2. Office - Mumbai\n3. Parents - Delhi",
    buttons: ["Back to Account"]
  },
  "payment methods": {
    text: "💳 Saved Payment Methods (2):\n• **** 1234 (Visa)\n• **** 5678 (Mastercard)\n\nWe accept: Cards, UPI, Wallets, COD, Net Banking",
    buttons: ["Add Card", "UPI Setup", "EMI Plans", "Back to Account"]
  },
  "add card": {
    text: "💳 Add New Card:\nWe use secure encryption for your card details.",
    buttons: ["Back to Account"]
  },
  "upi setup": {
    text: "📱 UPI Payment:\nPay securely using:\n• Google Pay\n• PhonePe\n• Paytm\n• Other UPI apps",
    buttons: ["Link UPI", "Back to Account"]
  },
  "link upi": {
    text: "🔗 Enter your UPI ID for faster checkout.",
    buttons: ["Back to Account"]
  },
  "emi plans": {
    text: "💰 EMI Options:\n• 3 months - No cost\n• 6 months - 12% p.a.\n• 9 months - 13% p.a.\n• 12 months - 14% p.a.\n\nMin: ₹3,000",
    buttons: ["Calculate EMI", "Back to Account"]
  },
  "calculate emi": {
    text: "🧮 EMI Calculator:\nEnter purchase amount to see monthly installments.",
    buttons: ["Back to Account"]
  },
  "wishlist": {
    text: "❤️ Your Wishlist (15 items):\n• Blue Denim Jacket - ₹2,499\n• Black Formal Shirt - ₹1,299\n• Red Ethnic Kurta - ₹1,799\n\n3 items on sale! 🔥",
    buttons: ["View Wishlist", "Move to Cart", "Share Wishlist", "Back to Account"]
  },
  "view wishlist": {
    text: "🛍️ Redirecting to your wishlist...",
    buttons: ["Back to Account"]
  },
  "move to cart": {
    text: "🛒 Select items to move:\n✅ All items\n☐ Sale items only\n☐ Available items",
    buttons: ["Move All", "Back to Account"]
  },
  "move all": {
    text: "✅ 15 items moved to cart!\nReady for checkout.",
    buttons: ["Checkout", "Back to Account"]
  },
  "checkout": {
    text: "💳 Proceeding to checkout...\nReview cart and complete payment.",
    buttons: ["Back to Account"]
  },
  "share wishlist": {
    text: "🔗 Share your wishlist with friends and family!",
    buttons: ["Generate Link", "Back to Account"]
  },
  "generate link": {
    text: "✅ Wishlist link created:\nmustaab.com/wishlist/abc123\n\nLink copied!",
    buttons: ["Back to Account"]
  },
  "preferences": {
    text: "⚙️ Your Preferences:\n✅ Email notifications\n✅ SMS alerts\n❌ Push notifications\n• Language: English\n• Size: M",
    buttons: ["Manage Notifications", "Language Settings", "Back to Account"]
  },
  "manage notifications": {
    text: "🔔 Notification Settings:\n✅ Order updates\n✅ Delivery notifications\n✅ Promotional offers\n❌ Price drops\n❌ Back in stock",
    buttons: ["Update Settings", "Back to Account"]
  },
  "update settings": {
    text: "✅ Notification preferences updated!",
    buttons: ["Back to Account"]
  },
  "language settings": {
    text: "🌐 Choose Language:\n• English (Current)\n• हिंदी (Hindi)\n• తెలుగు (Telugu)\n• தமிழ் (Tamil)",
    buttons: ["Back to Account"]
  },

  // ============= PRODUCTS =============
  products: {
    text: "🛍️ Browse Our Collections:",
    buttons: ["Men's Fashion", "Women's Fashion", "Kids", "Accessories", "New Arrivals", "Sale", "Back to Main Menu"]
  },
  "men's fashion": {
    text: "👔 Men's Categories:",
    buttons: ["Shirts", "T-Shirts", "Jeans", "Formal Wear", "Ethnic Wear", "Winter Wear", "Back to Products"]
  },
  "shirts": {
    text: "👕 Men's Shirts:\n• Casual Shirts\n• Formal Shirts\n• Denim Shirts\n• Printed Shirts\n\nStarting from ₹499",
    buttons: ["Shop Casual", "Shop Formal", "View All Shirts", "Back to Men's Fashion"]
  },
  "t-shirts": {
    text: "👕 Men's T-Shirts:\n• Round Neck\n• Polo\n• V-Neck\n• Full Sleeve\n\nStarting from ₹299",
    buttons: ["Shop Now", "Back to Men's Fashion"]
  },
  "jeans": {
    text: "👖 Men's Jeans:\n• Slim Fit\n• Regular Fit\n• Skinny Fit\n• Relaxed Fit\n\nStarting from ₹799",
    buttons: ["Shop Now", "Size Guide", "Back to Men's Fashion"]
  },
  "formal wear": {
    text: "🤵 Men's Formal:\n• Suits & Blazers\n• Formal Shirts\n• Formal Trousers\n• Ties & Accessories\n\nStarting from ₹999",
    buttons: ["Shop Suits", "Shop Shirts", "Back to Men's Fashion"]
  },
  "ethnic wear": {
    text: "🕉️ Men's Ethnic:\n• Kurtas\n• Sherwanis\n• Nehru Jackets\n• Dhoti Pants\n\nStarting from ₹699",
    buttons: ["Shop Kurtas", "Shop Sherwanis", "Back to Men's Fashion"]
  },
  "winter wear": {
    text: "🧥 Men's Winter:\n• Jackets\n• Sweaters\n• Hoodies\n• Sweatshirts\n\nStarting from ₹799",
    buttons: ["Shop Jackets", "Shop Sweaters", "Back to Men's Fashion"]
  },
  "women's fashion": {
    text: "👗 Women's Categories:",
    buttons: ["Dresses", "Tops", "Sarees", "Kurtas", "Western Wear", "Ethnic Wear", "Back to Products"]
  }
}