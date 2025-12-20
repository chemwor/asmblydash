export type Role = 'seller' | 'maker' | 'designer' | 'admin';

export interface NavItem {
  label: string;
  icon: string;
  path: string;
}

export const roleNav: { [role in Role]: NavItem[] } = {
  seller: [
    { label: 'Dashboard', icon: 'ri-dashboard-line', path: '/seller' },
    { label: 'Listings', icon: 'ri-list-check', path: '/seller/listings' },
    { label: 'Orders', icon: 'ri-shopping-cart-line', path: '/seller/orders' },
    { label: 'Messages', icon: 'ri-message-3-line', path: '/seller/messages' },
    { label: 'Files', icon: 'ri-file-3-line', path: '/seller/files' },
    { label: 'Payouts', icon: 'ri-money-dollar-circle-line', path: '/seller/payouts' },
    { label: 'Support', icon: 'ri-customer-service-2-line', path: '/seller/support' },
    { label: 'Settings', icon: 'ri-settings-3-line', path: '/seller/settings' },
  ],
  maker: [
    { label: 'Dashboard', icon: 'ri-dashboard-line', path: '/maker' },
    { label: 'Job Board', icon: 'ri-briefcase-line', path: '/maker/jobs' },
    { label: 'Active Jobs', icon: 'ri-play-circle-line', path: '/maker/active' },
    { label: 'Calendar', icon: 'ri-calendar-line', path: '/maker/calendar' },
    { label: 'Messages', icon: 'ri-message-3-line', path: '/maker/messages' },
    { label: 'Files', icon: 'ri-file-3-line', path: '/maker/files' },
    { label: 'Earnings', icon: 'ri-coin-line', path: '/maker/earnings' },
    { label: 'Support', icon: 'ri-customer-service-2-line', path: '/maker/support' },
    { label: 'Settings', icon: 'ri-settings-3-line', path: '/maker/settings' },
  ],
  designer: [
    { label: 'Dashboard', icon: 'ri-dashboard-line', path: '/designer' },
    { label: 'Designs', icon: 'ri-palette-line', path: '/designer/designs' },
    { label: 'Licensing', icon: 'ri-shield-check-line', path: '/designer/licensing' },
    { label: 'Royalties', icon: 'ri-copper-coin-line', path: '/designer/royalties' },
    { label: 'Messages', icon: 'ri-message-3-line', path: '/designer/messages' },
    { label: 'Files', icon: 'ri-file-3-line', path: '/designer/files' },
    { label: 'Support', icon: 'ri-customer-service-2-line', path: '/designer/support' },
    { label: 'Settings', icon: 'ri-settings-3-line', path: '/designer/settings' },
  ],
  admin: [
    { label: 'Dashboard', icon: 'ri-dashboard-line', path: '/dashboard/ecommerce' },
    { label: 'Users', icon: 'ri-user-line', path: '/users' },
    { label: 'Settings', icon: 'ri-settings-line', path: '/settings' },
    { label: 'Analytics', icon: 'ri-bar-chart-line', path: '/analytics' },
  ],
};

export const roleHomeRoute: { [role in Role]: string } = {
  seller: '/seller',
  maker: '/maker',
  designer: '/designer',
  admin: '/dashboard/ecommerce',
};
