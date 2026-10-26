/* ============================================================
   BRAND CONFIG — change this file (and the colours/fonts at the top of base.css)
   to re-skin the whole site for another client.
   ============================================================ */
window.BRAND = {
  name: 'L.O.T CARS',
  logo: '',                                // path to an SVG/PNG logo; '' shows `name` as a text wordmark
  storeUrl: 'https://your-store.myshopify.com',
  currency: 'INR',
  cartLabel: 'Cart',                       // what the cart is called
  addLabel: 'Add to cart',                 // button on product cards
  variantLabel: 'Colour',                  // shown before the chosen option in the cart

  // top utility bar (right side)
  utility: [
    { label: 'Shop all RC cars', href: 'inventory.html' },
    { label: 'Track order', href: 'contact.html' },
    { label: 'Help', href: 'contact.html#faq' }
  ],

  // main navigation
  nav: [
    { label: 'Home', href: 'index.html' },
    { label: 'Shop all', href: 'inventory.html' },
    { label: 'Drift cars', href: 'inventory.html?c=drift' },
    { label: 'Off-road', href: 'inventory.html?c=offroad' },
    { label: 'Road Run', href: 'index.html#road-run' },
    { label: 'About', href: 'about.html' },
    { label: 'Contact', href: 'contact.html' }
  ],

  // popular searches in the search overlay
  searchTags: ['Drift', 'Ghost', 'Off-road', 'Mini', 'Excavator'],

  // words in the scrolling strips
  marquee: ['Drift cars', 'Off-road 4x4', 'Remote included', 'LED underglow', 'Ready to run'],

  // contact details (placeholders — replace per client)
  contact: {
    email: 'hello@lotcars.in',
    phone: '+91 00000 00000',
    address: 'Your store address, Your City',
    hours: 'Mon–Sat, 10:00–20:00'
  },

  social: [
    { label: 'Instagram', href: '#', icon: 'instagram' },
    { label: 'YouTube', href: '#', icon: 'youtube' }
  ],

  footer: [
    { title: 'Shop', links: [
      { label: 'All RC cars', href: 'inventory.html' },
      { label: 'Drift cars', href: 'inventory.html?c=drift' },
      { label: 'Off-road & 4x4', href: 'inventory.html?c=offroad' },
      { label: 'Mini racers', href: 'inventory.html?c=mini' },
      { label: 'Construction', href: 'inventory.html?c=construction' }
    ] },
    { title: 'Explore', links: [
      { label: 'Road Run', href: 'index.html#road-run' },
      { label: 'Garage wheel', href: 'index.html#showroom' },
      { label: 'About us', href: 'about.html' }
    ] },
    { title: 'Help', links: [
      { label: 'Contact', href: 'contact.html' },
      { label: 'FAQ', href: 'contact.html#faq' },
      { label: 'Shipping & returns', href: 'contact.html#faq' }
    ] }
  ],

  newsletter: {
    title: 'Join the pit crew',
    text: 'New drops, restocks and drift-day invites — straight to your inbox.'
  }
};
