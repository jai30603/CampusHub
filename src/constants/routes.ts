export const ROUTES = {
  HOME: '/',
  MARKETPLACE: '/marketplace',
  CATEGORIES: '/categories',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL_SUCCESS: '/verify-email-success',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  WISHLIST: '/wishlist',
  MY_LISTINGS: '/my-listings',
  SELL: '/sell',
  ORDERS: '/orders',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  ADMIN: '/admin',
  NOT_FOUND: '/404',
} as const;

export const PUBLIC_NAV_LINKS = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Marketplace', path: ROUTES.MARKETPLACE },
  { label: 'Categories', path: ROUTES.CATEGORIES },
  { label: 'About', path: ROUTES.ABOUT },
  { label: 'Contact', path: ROUTES.CONTACT },
];

export const USER_NAV_LINKS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'My Listings', path: ROUTES.MY_LISTINGS, icon: 'Package' },
  { label: 'Sell Item', path: ROUTES.SELL, icon: 'PlusCircle' },
  { label: 'Orders', path: ROUTES.ORDERS, icon: 'ShoppingBag' },
  { label: 'Wishlist', path: ROUTES.WISHLIST, icon: 'Heart' },
  { label: 'Messages', path: ROUTES.MESSAGES, icon: 'MessageSquare' },
  { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: 'Bell' },
  { label: 'Profile', path: ROUTES.PROFILE, icon: 'User' },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: 'Settings' },
];

export const ADMIN_NAV_LINKS = [
  { label: 'Admin Overview', path: ROUTES.ADMIN, icon: 'ShieldCheck' },
  { label: 'Users Management', path: `${ROUTES.ADMIN}/users`, icon: 'Users' },
  { label: 'Listings Approval', path: `${ROUTES.ADMIN}/listings`, icon: 'FileText' },
  { label: 'System Settings', path: `${ROUTES.ADMIN}/settings`, icon: 'Sliders' },
];
