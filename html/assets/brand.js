/* ============================================================
   BRAND CONFIG — change this file (and the colours/fonts at the top of base.css)
   to re-skin the whole site for another dealership or car brand.
   ============================================================ */
window.BRAND = {
  name: 'VELOCE',
  logo: '',                                // path to an SVG/PNG logo; '' shows `name` as a text wordmark
  storeUrl: 'https://your-store.myshopify.com',
  currency: 'USD',
  cartLabel: 'Garage',                     // what the bag is called ("Garage", "Reservations", "Cart" …)
  variantLabel: 'Paint',                   // shown before the chosen option in the garage

  // top utility bar (right side)
  utility: [
    { label: 'Book a test drive', href: 'contact.html#test-drive' },
    { label: 'Finance', href: 'index.html#finance' },
    { label: 'Find a showroom', href: 'contact.html#visit' },
    { label: 'Sign In', href: '#' }
  ],

  // main navigation
  nav: [
    { label: 'Home', href: 'index.html' },
    { label: 'Inventory', href: 'inventory.html' },
    { label: 'Road Run', href: 'index.html#road-run' },
    { label: 'Showroom', href: 'index.html#showroom' },
    { label: 'Finance', href: 'index.html#finance' },
    { label: 'About', href: 'about.html' },
    { label: 'Contact', href: 'contact.html' }
  ],

  // popular searches in the search overlay
  searchTags: ['Electric', 'SUV', 'Coupe', 'Pickup'],

  // words in the scrolling strips
  marquee: ['Electric', 'Performance', 'Test drive today', '0% APR finance', 'Built to move'],

  // contact details (placeholders — replace per client)
  contact: {
    email: 'sales@veloce-motors.com',
    phone: '+1 (000) 000-0000',
    address: '100 Motorway Drive, Your City',
    hours: 'Mon–Sat, 9:00–19:00 · Sun 10:00–16:00'
  },

  social: [
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'TikTok', href: '#', icon: 'tiktok' },
    { label: 'YouTube', href: '#', icon: 'youtube' }
  ],

  footer: [
    { title: 'Vehicles', links: [
      { label: 'All inventory', href: 'inventory.html' },
      { label: 'Electric', href: 'inventory.html?c=electric' },
      { label: 'SUVs', href: 'inventory.html?c=suv' },
      { label: 'Performance', href: 'inventory.html?c=performance' }
    ] },
    { title: 'Explore', links: [
      { label: 'Road Run', href: 'index.html#road-run' },
      { label: 'Showroom wheel', href: 'index.html#showroom' },
      { label: 'Finance calculator', href: 'index.html#finance' },
      { label: 'About us', href: 'about.html' }
    ] },
    { title: 'Help', links: [
      { label: 'Book a test drive', href: 'contact.html#test-drive' },
      { label: 'FAQ', href: 'contact.html#faq' },
      { label: 'Find a showroom', href: 'contact.html#visit' }
    ] }
  ],

  newsletter: {
    title: 'Stay in the fast lane',
    text: 'New arrivals, launch events and finance offers — straight to your inbox.'
  }
};
