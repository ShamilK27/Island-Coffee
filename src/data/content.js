// All copy and media for the site lives here so sections stay presentational.
// Brand facts (products, prices, store, figures) come from islandcoffee.lk.
// Photography is placeholder stock from Unsplash: swap in Island Coffee's own shots.

const img = (name) => `/images/${name}.webp`

export const SHOP_URL = 'https://islandcoffee.lk/shop/'
export const SINCE = 1964
/** Sri Lankan rupees, as the shop shows them */
export const lkr = (n) => `රු${n.toLocaleString('en-LK')}`
export const YEARS = new Date().getFullYear() - SINCE

export const BRAND = {
  name: 'Island Coffee',
  short: 'IC',
  tagline: `Sri Lankan coffee — since ${SINCE}`,
  slogan: `Perfecting the art of coffee since ${SINCE}`,
}

export const NAV_LINKS = [
  { label: 'Journey', href: '#journey' },
  { label: 'Collection', href: '#menu' },
  { label: 'Story', href: '#story' },
  { label: 'Visit', href: '#visit' },
]

export const HERO = {
  background: img('hero-beans'),
}

export const JOURNEY = [
  {
    no: '01',
    title: 'Highlands',
    meta: 'Sri Lanka · hill country',
    text: 'Our beans come from the beautiful highlands of Sri Lanka, where mist, altitude and rich soil shape every cherry.',
    image: img('origin'),
  },
  {
    no: '02',
    title: 'Roasting',
    meta: 'Arabica & Robusta',
    text: 'Our roasting techniques unlock the full flavour of carefully selected Arabica and Robusta beans.',
    image: img('roasting'),
  },
  {
    no: '03',
    title: 'Grinding',
    meta: 'Freshly ground',
    text: 'Ground fresh and packed to hold its aroma, from the classic Island Coffee powder to our flavoured blends.',
    image: img('grinding'),
  },
  {
    no: '04',
    title: 'Brewing',
    meta: 'Vanilla · Caramel · Ginger',
    text: 'Brewed the Sri Lankan way, or with a twist: vanilla, caramel, almond, ginger, cardamom and more.',
    image: img('extraction'),
  },
]

/*
 * The full online shop (islandcoffee.lk/shop): names, pack sizes, LKR prices,
 * descriptions and pack shots are Island Coffee's own. `image` is the
 * ingredient backdrop behind each pack.
 */
const pack = (name) => `/images/packs/${name}.webp`
const product = (slug) => `https://islandcoffee.lk/product/${slug}/`

export const MENU = [
  {
    name: 'Island Coffee Powder',
    label: 'Signature · Robusta',
    text: 'Strength meets sophistication. Crafted from select beans and distinctively roasted, this is Island Coffee’s signature product.',
    notes: ['Robusta', 'Strong', 'Signature'],
    sizes: [{ size: '50g', price: 230 }, { size: '100g', price: 460 }, { size: '200g', price: 880 }],
    image: img('p-powder'),
    pack: pack('island-coffee-powder'),
    url: product('coffee-powder'),
  },
  {
    name: 'Arabica Powder',
    label: 'Arabica · 200g pack',
    text: 'Sourced from exquisite Arabica beans and crafted through our unique roasting and grinding process.',
    notes: ['Arabica', 'Smooth', 'Aromatic'],
    sizes: [{ size: '200g', price: 1900 }],
    image: img('p-arabica'),
    pack: pack('arabica-powder-200g'),
    url: product('arabica-powder'),
  },
  {
    name: 'Arabica Powder Bottle',
    label: 'Arabica · Jar',
    text: 'Our Arabica coffee powder, from exquisite Arabica beans and our unique roasting and grinding process, in a jar for the kitchen shelf.',
    notes: ['Arabica', 'Fine grind', 'Jar'],
    sizes: [{ size: 'Jar', price: 1900 }],
    image: img('f-beans'),
    pack: pack('arabica-powder-bottle'),
    url: product('arabica-powder-bottle'),
  },
  {
    name: 'Arabica Filter Bottle',
    label: 'Arabica · Filter grind',
    text: 'The smoothness of Arabica merged with ground coffee pieces: a textured blend designed with coffee machines in mind.',
    notes: ['Arabica', 'Textured', 'For machines'],
    sizes: [{ size: 'Jar', price: 1900 }],
    image: img('g-roaster'),
    pack: pack('arabica-filter-bottle'),
    url: product('arabica-filter-bottle'),
  },
  {
    name: 'Vanilla Coffee',
    label: 'Flavoured · Ground',
    text: 'Our uniquely roasted coffee powder, infused with the rich aroma and smooth taste of natural vanilla.',
    notes: ['Vanilla', 'Smooth', 'Classic'],
    sizes: [{ size: '50g', price: 270 }, { size: '100g', price: 520 }, { size: '200g', price: 980 }],
    image: img('p-vanilla'),
    pack: pack('vanilla-coffee'),
    url: product('vanilla-coffee'),
  },
  {
    name: 'Caramel Coffee',
    label: 'Flavoured · Ground',
    text: 'Natural caramel infused into our premium coffee powder: robust coffee notes with a subtle sweetness in every sip.',
    notes: ['Caramel', 'Robust', 'Sweet'],
    sizes: [{ size: '50g', price: 250 }, { size: '100g', price: 490 }],
    image: img('p-caramel'),
    pack: pack('caramel-coffee'),
    url: product('caramel-coffee'),
  },
  {
    name: 'Almond Coffee',
    label: 'Flavoured · Ground',
    text: 'A perfect blend of our uniquely roasted coffee powder and natural almond flavour.',
    notes: ['Almond', 'Nutty', 'Mellow'],
    sizes: [{ size: '50g', price: 250 }, { size: '100g', price: 490 }, { size: '200g', price: 950 }],
    image: img('p-almond'),
    pack: pack('almond-coffee'),
    url: product('almond-coffee'),
  },
  {
    name: 'Ginger Coffee',
    label: 'Flavoured · Ground',
    text: 'The exquisite taste of natural ginger, in harmony with our specially roasted coffee.',
    notes: ['Ginger', 'Warming', 'Bold'],
    sizes: [{ size: '50g', price: 270 }, { size: '100g', price: 520 }, { size: '200g', price: 980 }],
    image: img('p-ginger'),
    pack: pack('ginger-coffee'),
    url: product('ginger-coffee'),
  },
  {
    name: 'Cardamom Coffee',
    label: 'Flavoured · Ground',
    text: 'A captivating blend: the exquisite taste of cardamom in harmony with our specially roasted coffee.',
    notes: ['Cardamom', 'Fragrant', 'Spiced'],
    sizes: [{ size: '50g', price: 300 }, { size: '100g', price: 590 }],
    image: img('p-cardamom'),
    pack: pack('cardamom-coffee'),
    url: product('cardamom-coffee'),
  },
  {
    name: 'Cinnamon Coffee',
    label: 'Flavoured · Ground',
    text: 'Our specially roasted coffee warmed with cinnamon, the sweet spice Sri Lanka is famous for.',
    notes: ['Cinnamon', 'Sweet', 'Warm'],
    sizes: [{ size: '50g', price: 250 }, { size: '100g', price: 490 }],
    image: img('p-cinnamon'),
    pack: pack('cinnamon-coffee'),
    url: product('cinnamon-coffee'),
  },
  {
    name: 'Mint Coffee',
    label: 'Flavoured · Ground',
    text: 'Natural mint infused into our premium coffee powder, for a rich aroma with a cool, smooth finish.',
    notes: ['Mint', 'Fresh', 'Smooth'],
    sizes: [{ size: '50g', price: 380 }, { size: '100g', price: 740 }],
    image: img('p-mint'),
    pack: pack('mint-coffee'),
    url: product('mint-coffee'),
  },
  {
    name: 'Spiced Coffee',
    label: 'Flavoured · Ground',
    text: 'Our expertly roasted coffee with a perfect selection of spices, for a captivating and aromatic cup.',
    notes: ['Spices', 'Aromatic', 'Bold'],
    sizes: [{ size: '50g', price: 460 }, { size: '100g', price: 920 }],
    image: img('p-spiced'),
    pack: pack('spiced-coffee'),
    url: product('spiced-coffee'),
  },
  {
    name: 'Jaffna Coffee',
    label: 'Heritage · Ground',
    text: 'The authentic taste of Jaffna: a rich, invigorating blend from the region’s finest beans, roasted to perfection.',
    notes: ['Jaffna', 'Rich', 'Invigorating'],
    sizes: [{ size: '50g', price: 300 }, { size: '100g', price: 590 }],
    image: img('p-jaffna'),
    pack: pack('jaffna-coffee'),
    url: product('jaffna-coffee'),
  },
]

export const STATS = [
  { value: YEARS, suffix: '', label: 'Years of genuine Sri Lankan coffee' },
  { value: 16, suffix: '', label: 'Different types of coffee' },
  { value: 700, suffix: '', label: 'Coffee-growing families supported' },
  { value: 10, suffix: '', label: 'Coffee markets' },
]

export const STORY = {
  manifesto: `Since ${SINCE}, Island Coffee has brought Sri Lanka the taste of its own highlands, with an uncompromising commitment to quality and relationships that now span generations.`,
  images: {
    tall: img('s-cherries'),
    hands: img('story-hands'),
    barista: img('s-branch'),
  },
  pillars: [
    {
      no: 'I',
      title: 'Heritage',
      text: `A market leader in Sri Lanka’s coffee industry since ${SINCE}: a taste that has stood the test of time.`,
    },
    {
      no: 'II',
      title: 'Quality',
      text: 'Beans from the Sri Lankan highlands, bought only from selected suppliers who can meet our standards.',
    },
    {
      no: 'III',
      title: 'Craft',
      text: 'Roasting techniques refined over decades to unlock the full flavour of Arabica and Robusta.',
    },
    {
      no: 'IV',
      title: 'Community',
      text: 'Customer satisfaction comes first, and we’re proud to support around 700 coffee-growing families.',
    },
  ],
}

export const ATMOSPHERE = {
  hero: img('atmos-roasting'),
  tiles: [
    { image: img('atmos-window'), title: 'Galle Road', text: 'Our home in Bambalapitiya.' },
    { image: img('atmos-bar'), title: 'Freshly Ground', text: 'Sixteen coffees to choose from.' },
    { image: img('atmos-sign'), title: 'Island-wide', text: 'In leading supermarkets across Sri Lanka.' },
  ],
}

export const GALLERY = [
  { image: img('g-plant'), caption: 'The harvest', meta: 'Ripening on the branch', span: 'md:col-span-7 md:row-span-2' },
  { image: img('g-green'), caption: 'Green beans', meta: 'Before the roast', span: 'md:col-span-5' },
  { image: img('g-roaster'), caption: 'Out of the drum', meta: 'Cooling after the roast', span: 'md:col-span-5' },
  { image: img('g-portafilter'), caption: 'Freshly ground', meta: 'Highland beans', span: 'md:col-span-4' },
  { image: img('g-bloom'), caption: 'In bloom', meta: 'Coffee blossoms in the hills', span: 'md:col-span-4 md:row-span-2' },
  { image: img('g-beans'), caption: 'The roast', meta: 'Arabica & Robusta', span: 'md:col-span-4' },
  { image: img('g-hands'), caption: 'Held warm', meta: 'Shared moments', span: 'md:col-span-4' },
  { image: img('g-scoop'), caption: 'Scooped', meta: 'Weighed for the roaster', span: 'md:col-span-4' },
  { image: img('g-spoon'), caption: 'A spoonful', meta: 'Measured for the brew', span: 'md:col-span-4' },
]

/*
 * Brand promises drawn from Island Coffee's own copy. Replace with real,
 * attributed customer reviews when available.
 */
export const TESTIMONIALS = [
  {
    quote: 'Discover the exquisite flavours of Sri Lanka’s finest coffee.',
    name: 'Island Coffee',
    role: `Since ${SINCE}`,
  },
  {
    quote: 'With a steadfast commitment to uncompromising quality, we bring you a taste that stands the test of time.',
    name: 'Our promise',
    role: 'Quality',
  },
  {
    quote: 'Customer satisfaction is paramount, and we take pleasure in fostering relationships that span generations.',
    name: 'Our promise',
    role: 'Community',
  },
  {
    quote: 'From the classic richness of Vanilla to Caramel, Almond and Ginger, there is an Island Coffee for every cup.',
    name: 'Our collection',
    role: '16 coffees',
  },
]

export const CONTACT = {
  address: ['No 158, Galle Road', 'Bambalapitiya, Colombo'],
  mapsQuery: 'Island Coffee, 158 Galle Road, Bambalapitiya, Colombo',
  phone: '0112 583 780',
  phoneHref: '+94112583780',
  availability: 'Also available at leading supermarkets across Sri Lanka.',
  links: [
    { label: 'Online shop', href: SHOP_URL },
    { label: 'Buy in bulk', href: 'https://islandcoffee.lk/' },
    { label: 'The coffee blog', href: 'https://islandcoffee.lk/' },
  ],
  image: img('c-sack'),
}

export const FINALE = {
  image: img('f-beans'),
}
