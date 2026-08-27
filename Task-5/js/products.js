/* ============================================================
   products.js — Product Data & Management Module
   Task-5 Capstone | Thiranex Internship
   ============================================================ */

const ProductManager = (() => {
  'use strict';

  /* ── product catalogue (18 items) ── */
  const products = [
    /* ─── Electronics ─── */
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 149.99,
      originalPrice: 199.99,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop'
      ],
      rating: 4.7,
      reviewCount: 238,
      description: 'Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for music lovers and professionals alike.',
      specs: { 'Driver Size': '40mm', 'Frequency Response': '20Hz–20kHz', 'Battery Life': '30 hours', 'Connectivity': 'Bluetooth 5.2', 'Weight': '250g', 'Noise Cancellation': 'Active ANC' },
      stock: 45,
      badge: 'Best Seller',
      dateAdded: '2026-06-15',
      reviews: [
        { user: 'Alex M.', rating: 5, text: 'Incredible sound quality and the ANC is top-notch!', date: '2026-07-01' },
        { user: 'Sarah K.', rating: 4, text: 'Very comfortable for long listening sessions.', date: '2026-06-28' }
      ]
    },
    {
      id: 2,
      name: 'Smart Watch Ultra',
      price: 299.99,
      originalPrice: 349.99,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop'
      ],
      rating: 4.5,
      reviewCount: 182,
      description: 'The ultimate smart watch with titanium case, always-on Retina display, advanced health monitoring, GPS, and 72-hour battery life. Water resistant to 100m.',
      specs: { 'Display': '1.9" AMOLED', 'Battery': '72 hours', 'Water Resistance': '100m', 'Sensors': 'Heart Rate, SpO2, ECG', 'Material': 'Titanium', 'OS': 'WatchOS 12' },
      stock: 28,
      badge: 'New',
      dateAdded: '2026-07-01',
      reviews: [
        { user: 'Mike R.', rating: 5, text: 'Best smartwatch I have ever owned. Battery is amazing!', date: '2026-07-05' },
        { user: 'Jenny L.', rating: 4, text: 'Love the health tracking features.', date: '2026-07-03' }
      ]
    },
    {
      id: 3,
      name: 'Portable Bluetooth Speaker',
      price: 79.99,
      originalPrice: 99.99,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&h=600&fit=crop'
      ],
      rating: 4.3,
      reviewCount: 156,
      description: 'Powerful 360° sound in a compact, waterproof design. Perfect for outdoor adventures with 20-hour battery and rugged build quality.',
      specs: { 'Power': '30W', 'Battery': '20 hours', 'Waterproof': 'IP67', 'Weight': '680g', 'Connectivity': 'Bluetooth 5.3' },
      stock: 67,
      badge: '',
      dateAdded: '2026-05-20',
      reviews: [
        { user: 'Tom H.', rating: 4, text: 'Great sound for its size. Took it camping!', date: '2026-06-15' }
      ]
    },
    {
      id: 4,
      name: 'Mechanical Gaming Keyboard',
      price: 129.99,
      originalPrice: 159.99,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=600&fit=crop'
      ],
      rating: 4.6,
      reviewCount: 94,
      description: 'RGB mechanical keyboard with hot-swappable switches, PBT keycaps, and aircraft-grade aluminium frame. N-key rollover for competitive gaming.',
      specs: { 'Switches': 'Hot-swappable', 'Keycaps': 'PBT Double-shot', 'Backlight': 'Per-key RGB', 'Connection': 'USB-C / Wireless', 'Layout': 'TKL (87 keys)' },
      stock: 33,
      badge: '',
      dateAdded: '2026-04-10',
      reviews: [
        { user: 'Chris P.', rating: 5, text: 'The typing feel is phenomenal. Hot-swap is a game changer.', date: '2026-05-12' }
      ]
    },

    /* ─── Clothing ─── */
    {
      id: 5,
      name: 'Premium Denim Jacket',
      price: 89.99,
      originalPrice: 120.00,
      category: 'Clothing',
      image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=600&fit=crop'
      ],
      rating: 4.4,
      reviewCount: 127,
      description: 'Classic denim jacket crafted from premium selvedge denim. Features a tailored fit, copper hardware, and signature hand-distressed finish.',
      specs: { 'Material': '100% Selvedge Denim', 'Fit': 'Tailored', 'Closure': 'Button-front', 'Pockets': '4 external', 'Care': 'Machine wash cold' },
      stock: 52,
      badge: '',
      dateAdded: '2026-03-15',
      reviews: [
        { user: 'Emma W.', rating: 5, text: 'Perfect fit and amazing quality denim!', date: '2026-04-20' }
      ]
    },
    {
      id: 6,
      name: 'Classic Running Sneakers',
      price: 119.99,
      originalPrice: 149.99,
      category: 'Clothing',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop'
      ],
      rating: 4.8,
      reviewCount: 312,
      description: 'Engineered for comfort and performance. Features responsive foam midsole, breathable knit upper, and durable rubber outsole.',
      specs: { 'Upper': 'Flyknit Mesh', 'Midsole': 'React Foam', 'Outsole': 'Rubber', 'Drop': '10mm', 'Weight': '285g' },
      stock: 78,
      badge: 'Popular',
      dateAdded: '2026-06-01',
      reviews: [
        { user: 'David L.', rating: 5, text: 'Most comfortable shoes I have ever run in.', date: '2026-06-20' },
        { user: 'Amy S.', rating: 5, text: 'Great support and super stylish!', date: '2026-06-18' }
      ]
    },
    {
      id: 7,
      name: 'Cashmere Blend Sweater',
      price: 69.99,
      originalPrice: 95.00,
      category: 'Clothing',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop'
      ],
      rating: 4.2,
      reviewCount: 89,
      description: 'Luxuriously soft cashmere-wool blend sweater. Ribbed cuffs and hem, relaxed fit perfect for layering in cooler months.',
      specs: { 'Material': '40% Cashmere, 60% Merino Wool', 'Fit': 'Relaxed', 'Care': 'Dry clean recommended', 'Neckline': 'Crew neck' },
      stock: 41,
      badge: '',
      dateAdded: '2026-02-28',
      reviews: [
        { user: 'Lisa M.', rating: 4, text: 'So soft! A bit pricey but worth it.', date: '2026-03-15' }
      ]
    },

    /* ─── Books ─── */
    {
      id: 8,
      name: 'The Art of Programming',
      price: 34.99,
      originalPrice: 44.99,
      category: 'Books',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop'
      ],
      rating: 4.9,
      reviewCount: 456,
      description: 'A comprehensive guide to mastering modern programming paradigms. Covers algorithms, design patterns, and real-world problem solving with practical examples.',
      specs: { 'Pages': '542', 'Format': 'Hardcover', 'Publisher': 'TechPress', 'Language': 'English', 'ISBN': '978-1234567890' },
      stock: 120,
      badge: 'Best Seller',
      dateAdded: '2026-01-10',
      reviews: [
        { user: 'Dev G.', rating: 5, text: 'Essential reading for every developer.', date: '2026-02-14' },
        { user: 'Rachel T.', rating: 5, text: 'Clear explanations and great examples!', date: '2026-02-10' }
      ]
    },
    {
      id: 9,
      name: 'Design Thinking Handbook',
      price: 28.99,
      originalPrice: 35.00,
      category: 'Books',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=600&fit=crop'
      ],
      rating: 4.3,
      reviewCount: 134,
      description: 'Transform your creative process with design thinking methodologies. Real case studies from leading companies and step-by-step frameworks.',
      specs: { 'Pages': '384', 'Format': 'Paperback', 'Publisher': 'Creative House', 'Language': 'English', 'ISBN': '978-0987654321' },
      stock: 85,
      badge: '',
      dateAdded: '2026-03-22',
      reviews: [
        { user: 'Nina K.', rating: 4, text: 'Great framework for innovation.', date: '2026-04-05' }
      ]
    },
    {
      id: 10,
      name: 'Mindful Leadership',
      price: 24.99,
      originalPrice: 29.99,
      category: 'Books',
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&h=600&fit=crop'
      ],
      rating: 4.1,
      reviewCount: 78,
      description: 'Discover how mindfulness practices can transform your leadership style. Backed by neuroscience research and real executive stories.',
      specs: { 'Pages': '298', 'Format': 'Paperback', 'Publisher': 'Wisdom Press', 'Language': 'English' },
      stock: 63,
      badge: '',
      dateAdded: '2026-04-05',
      reviews: [
        { user: 'James B.', rating: 4, text: 'Changed how I approach team management.', date: '2026-05-01' }
      ]
    },

    /* ─── Home & Kitchen ─── */
    {
      id: 11,
      name: 'Artisan Coffee Maker',
      price: 189.99,
      originalPrice: 249.99,
      category: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop'
      ],
      rating: 4.6,
      reviewCount: 201,
      description: 'Brew café-quality coffee at home with our precision temperature control, built-in grinder, and programmable settings. Stainless steel construction.',
      specs: { 'Capacity': '12 cups', 'Grinder': 'Conical burr', 'Material': 'Stainless Steel', 'Programmable': 'Yes, 24hr', 'Wattage': '1500W' },
      stock: 19,
      badge: 'Limited',
      dateAdded: '2026-05-12',
      reviews: [
        { user: 'Maria C.', rating: 5, text: 'Coffee shop quality at home. Worth every penny!', date: '2026-06-01' }
      ]
    },
    {
      id: 12,
      name: 'Minimalist Desk Lamp',
      price: 59.99,
      originalPrice: 75.00,
      category: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop'
      ],
      rating: 4.4,
      reviewCount: 98,
      description: 'Sleek, adjustable LED desk lamp with touch-sensitive controls, 5 colour temperatures, and wireless charging base. Eye-care certified.',
      specs: { 'Light Source': 'LED', 'Colour Temps': '5 modes', 'Brightness': '10 levels', 'Wireless Charging': 'Qi compatible', 'Material': 'Aluminium' },
      stock: 55,
      badge: '',
      dateAdded: '2026-04-18',
      reviews: [
        { user: 'Kevin S.', rating: 4, text: 'Love the wireless charging feature.', date: '2026-05-10' }
      ]
    },
    {
      id: 13,
      name: 'Ceramic Plant Pot Set',
      price: 39.99,
      originalPrice: 49.99,
      category: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&h=600&fit=crop'
      ],
      rating: 4.5,
      reviewCount: 67,
      description: 'Set of 3 handcrafted ceramic plant pots with drainage holes and bamboo saucers. Matte finish in earthy tones. Perfect for succulents and herbs.',
      specs: { 'Quantity': '3 pots', 'Sizes': 'S (10cm), M (14cm), L (18cm)', 'Material': 'Ceramic + Bamboo', 'Drainage': 'Yes', 'Finish': 'Matte' },
      stock: 72,
      badge: '',
      dateAdded: '2026-06-08',
      reviews: [
        { user: 'Olivia N.', rating: 5, text: 'Beautiful quality and the bamboo trays are a nice touch.', date: '2026-06-22' }
      ]
    },
    {
      id: 14,
      name: 'Smart Air Purifier',
      price: 219.99,
      originalPrice: 279.99,
      category: 'Home & Kitchen',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop'
      ],
      rating: 4.7,
      reviewCount: 143,
      description: 'HEPA-13 air purifier with smart sensors, app control, and whisper-quiet night mode. Covers rooms up to 500 sq ft. Removes 99.97% of airborne particles.',
      specs: { 'Filter': 'True HEPA H13', 'Coverage': '500 sq ft', 'Noise Level': '24dB (sleep mode)', 'Smart Features': 'Wi-Fi, App Control', 'CADR': '320 m³/h' },
      stock: 31,
      badge: 'New',
      dateAdded: '2026-07-02',
      reviews: [
        { user: 'Paul D.', rating: 5, text: 'My allergies have improved dramatically!', date: '2026-07-08' }
      ]
    },

    /* ─── Sports ─── */
    {
      id: 15,
      name: 'Carbon Fibre Yoga Mat',
      price: 49.99,
      originalPrice: 65.00,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1461896836934-bd45ba6343a4?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1461896836934-bd45ba6343a4?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop'
      ],
      rating: 4.5,
      reviewCount: 189,
      description: 'Extra-thick 6mm eco-friendly yoga mat with alignment lines, non-slip texture on both sides, and included carrying strap. Perfect grip even when wet.',
      specs: { 'Thickness': '6mm', 'Material': 'Natural Rubber + TPE', 'Size': '183 x 68 cm', 'Weight': '1.2kg', 'Features': 'Alignment lines, Non-slip' },
      stock: 94,
      badge: '',
      dateAdded: '2026-05-01',
      reviews: [
        { user: 'Sophia R.', rating: 5, text: 'Best grip of any mat I have used. Love the alignment lines!', date: '2026-05-20' }
      ]
    },
    {
      id: 16,
      name: 'Adjustable Dumbbell Set',
      price: 199.99,
      originalPrice: 259.99,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop'
      ],
      rating: 4.8,
      reviewCount: 211,
      description: 'Replace 15 sets of weights with one compact adjustable dumbbell. Quick-change dial system from 5 to 52.5 lbs. Durable steel construction with ergonomic grip.',
      specs: { 'Weight Range': '5–52.5 lbs', 'Increments': '2.5 lbs', 'Material': 'Steel + Rubber', 'Adjustment': 'Dial system', 'Replaces': '15 sets of dumbbells' },
      stock: 22,
      badge: 'Popular',
      dateAdded: '2026-06-20',
      reviews: [
        { user: 'Jason M.', rating: 5, text: 'Replaced my entire weight rack. Space saver!', date: '2026-07-01' },
        { user: 'Kate L.', rating: 5, text: 'Smooth transitions between weights. Very well made.', date: '2026-06-28' }
      ]
    },
    {
      id: 17,
      name: 'Hydration Running Vest',
      price: 64.99,
      originalPrice: 79.99,
      category: 'Sports',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=600&fit=crop'
      ],
      rating: 4.3,
      reviewCount: 76,
      description: 'Lightweight running vest with 2L hydration bladder, 6 storage pockets, and reflective accents for visibility. Adjustable fit for all body types.',
      specs: { 'Capacity': '2L bladder + 6 pockets', 'Material': 'Ripstop Nylon', 'Weight': '340g (empty)', 'Reflective': 'Yes', 'Sizes': 'XS–XL' },
      stock: 48,
      badge: '',
      dateAdded: '2026-05-15',
      reviews: [
        { user: 'Ryan T.', rating: 4, text: 'Great for long trail runs. Fits securely.', date: '2026-06-05' }
      ]
    },
    {
      id: 18,
      name: 'Smart Fitness Tracker Band',
      price: 44.99,
      originalPrice: 59.99,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1510017803434-a899b57c6bce?w=600&h=600&fit=crop'
      ],
      rating: 4.0,
      reviewCount: 165,
      description: 'Slim fitness tracker with AMOLED display, heart rate monitoring, sleep tracking, 14-day battery life, and 50m water resistance. 100+ workout modes.',
      specs: { 'Display': '1.1" AMOLED', 'Battery': '14 days', 'Water Resistance': '50m', 'Sensors': 'HR, SpO2, Accelerometer', 'Workout Modes': '100+' },
      stock: 110,
      badge: 'Sale',
      dateAdded: '2026-06-25',
      reviews: [
        { user: 'Megan F.', rating: 4, text: 'Great value for the features. Battery lasts forever!', date: '2026-07-02' }
      ]
    }
  ];

  /* ── categories ── */
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen', 'Sports'];

  const categoryEmojis = {
    'Electronics': '📱',
    'Clothing': '👕',
    'Books': '📚',
    'Home & Kitchen': '🏠',
    'Sports': '⚽'
  };

  /* ── public helpers ── */
  function getAll() { return [...products]; }

  function getById(id) { return products.find(p => p.id === Number(id)) || null; }

  function getByCategory(cat) {
    if (!cat || cat === 'All') return getAll();
    return products.filter(p => p.category === cat);
  }

  function search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return getAll();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  function filterByPrice(list, min, max) {
    return list.filter(p => p.price >= min && p.price <= max);
  }

  function sort(list, key) {
    const sorted = [...list];
    switch (key) {
      case 'price-asc':  return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
      case 'rating':     return sorted.sort((a, b) => b.rating - a.rating);
      case 'name':       return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':     return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      default:           return sorted;
    }
  }

  function getMaxPrice() { return Math.max(...products.map(p => p.price)); }
  function getMinPrice() { return Math.min(...products.map(p => p.price)); }

  return {
    getAll,
    getById,
    getByCategory,
    search,
    filterByPrice,
    sort,
    getMaxPrice,
    getMinPrice,
    categories,
    categoryEmojis
  };
})();
