import { getPool } from "./database.js";
import { v4 as uuidv4 } from "uuid";

const seedCategories = [
  {
    id: uuidv4(),
    name: "Eau de Parfum",
    slug: "eau-de-parfum",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
    description: "Intense, long-lasting luxury fragrances with high concentration.",
  },
  {
    id: uuidv4(),
    name: "Eau de Toilette",
    slug: "eau-de-toilette",
    image: "https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=800&auto=format&fit=crop",
    description: "Fresh, elegant everyday scents for a lighter touch.",
  },
  {
    id: uuidv4(),
    name: "Attars & Oils",
    slug: "attars-and-oils",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800&auto=format&fit=crop",
    description: "Pure, concentrated traditional oils with deep cultural roots.",
  }
];

const seedProducts = [
  {
    name: "Royal Oud Absolute",
    slug: "royal-oud-absolute",
    category: "Eau de Parfum",
    price: 12500,
    original_price: 15000,
    description: "A majestic blend of rich agarwood, warm amber, and subtle rose. The ultimate expression of luxury and power.",
    notes: "A powerful, woody fragrance that commands attention.",
    top_notes: "Saffron, Nutmeg, Lavender",
    middle_notes: "Agarwood (Oud), Patchouli",
    base_notes: "Musk, Amber, Vetiver",
    how_to_use: "Apply to pulse points: wrists, neck, and behind ears.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622618991746-fe6004db3a47?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "50ml", price: 12500 }, { size: "100ml", price: 18500 }]),
    gender: "Unisex",
    stock: 50,
    rating: 4.9,
    review_count: 124,
    badge: "Best Seller"
  },
  {
    name: "Velvet Rose & Damask",
    slug: "velvet-rose-damask",
    category: "Eau de Parfum",
    price: 8500,
    original_price: null,
    description: "A dark, rich, and textural rose fragrance wrapped in smoky oud wood. Decadent and alluring.",
    notes: "A deeply romantic and mysterious floral scent.",
    top_notes: "Clove, Praline",
    middle_notes: "Damask Rose",
    base_notes: "Oud Wood, Sandalwood",
    how_to_use: "Spray evenly on skin from 15cm away.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1458538977777-0549b2370168?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "50ml", price: 8500 }]),
    gender: "Women",
    stock: 30,
    rating: 4.8,
    review_count: 89,
    badge: "Featured"
  },
  {
    name: "Sandalwood Noir",
    slug: "sandalwood-noir",
    category: "Attars & Oils",
    price: 4500,
    original_price: 5000,
    description: "Pure, distilled Indian sandalwood oil. A creamy, soft, and long-lasting traditional fragrance.",
    notes: "Classic, creamy woody notes that stay close to the skin.",
    top_notes: "Bergamot",
    middle_notes: "Mysore Sandalwood",
    base_notes: "Musk, Vanilla",
    how_to_use: "Dab a single drop onto wrists and behind the ears.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "12ml", price: 4500 }, { size: "24ml", price: 8000 }]),
    gender: "Unisex",
    stock: 100,
    rating: 4.7,
    review_count: 210,
    badge: "Best Seller"
  },
  {
    name: "Citrus Riviera",
    slug: "citrus-riviera",
    category: "Eau de Toilette",
    price: 6500,
    original_price: null,
    description: "A sparkling, fresh scent inspired by the Mediterranean coast. Bright, uplifting, and energetic.",
    notes: "A burst of sunshine in a bottle.",
    top_notes: "Lemon, Bergamot, Mandarin",
    middle_notes: "Orange Blossom, Jasmine",
    base_notes: "Cedarwood, White Musk",
    how_to_use: "Spray generously for a refreshing start to your day.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "100ml", price: 6500 }]),
    gender: "Unisex",
    stock: 45,
    rating: 4.5,
    review_count: 56,
    badge: "New"
  },
  {
    name: "Midnight Saffron",
    slug: "midnight-saffron",
    category: "Eau de Parfum",
    price: 14000,
    original_price: null,
    description: "A rare blend of Kashmiri saffron and dark spices. Exudes opulence and intense warmth.",
    notes: "Spicy, rich, and highly exotic.",
    top_notes: "Saffron, Black Pepper",
    middle_notes: "Turkish Rose, Cardamom",
    base_notes: "Amber, Leather, Patchouli",
    how_to_use: "Apply lightly; high concentration ensures long wear.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1593487568720-92097fb460fb?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "50ml", price: 14000 }]),
    gender: "Men",
    stock: 15,
    rating: 5.0,
    review_count: 42,
    badge: "Featured"
  },
  {
    name: "Majestic Musk",
    slug: "majestic-musk",
    category: "Attars & Oils",
    price: 3200,
    original_price: 4000,
    description: "A clean, powdery, and deeply comforting musk. Perfect for everyday elegance.",
    notes: "Soft, clean, and intimately inviting.",
    top_notes: "White Lily",
    middle_notes: "Pure White Musk",
    base_notes: "Vanilla Bean",
    how_to_use: "Apply to pulse points.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1594125311687-3b1b3eafa9f4?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "12ml", price: 3200 }]),
    gender: "Unisex",
    stock: 80,
    rating: 4.6,
    review_count: 150,
    badge: "New"
  },
  {
    name: "Oud Ispahan Extract",
    slug: "oud-ispahan-extract",
    category: "Eau de Parfum",
    price: 18000,
    original_price: 20000,
    description: "An intoxicating blend of labdanum, patchouli, and sandalwood. Deep, mysterious, and captivating.",
    notes: "A powerful oriental floral.",
    top_notes: "Labdanum",
    middle_notes: "Patchouli, Rose, Saffron",
    base_notes: "Sandalwood, Agarwood, Cedar",
    how_to_use: "Apply to pulse points.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1595425959632-34f2822322ce?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "50ml", price: 18000 }]),
    gender: "Unisex",
    stock: 20,
    rating: 4.8,
    review_count: 95,
    badge: "Featured"
  },
  {
    name: "Neroli Portofino Aqua",
    slug: "neroli-portofino-aqua",
    category: "Eau de Toilette",
    price: 5500,
    original_price: null,
    description: "Vibrant, sparkling, and transportive. A lighter expression of the Mediterranean.",
    notes: "Crisp citrus and sheer florals.",
    top_notes: "Lemon, Mandarin Orange, Bergamot",
    middle_notes: "Neroli, Orange Blossom",
    base_notes: "Amber, White Musk",
    how_to_use: "Spray lavishly.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1543422655-ac1c6ca993ed?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "100ml", price: 5500 }]),
    gender: "Unisex",
    stock: 60,
    rating: 4.4,
    review_count: 45,
    badge: "New"
  },
  {
    name: "Mukhallat Al Maliki",
    slug: "mukhallat-al-maliki",
    category: "Attars & Oils",
    price: 5000,
    original_price: 6500,
    description: "The royal blend. A traditional Middle Eastern attar featuring the finest Turkish rose and Indian oud.",
    notes: "A majestic and deeply traditional oil.",
    top_notes: "Taif Rose, Saffron",
    middle_notes: "Amber, Musk",
    base_notes: "Indian Agarwood (Oud)",
    how_to_use: "A single drop goes a long way.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1535683577427-740aaac4ec25?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "12ml", price: 5000 }]),
    gender: "Unisex",
    stock: 40,
    rating: 4.9,
    review_count: 180,
    badge: "Best Seller"
  },
  {
    name: "Santal 33 Essence",
    slug: "santal-33-essence",
    category: "Eau de Parfum",
    price: 11000,
    original_price: null,
    description: "An iconic scent that intoxicates a man as much as a woman. Cardamom, iris, violet, and ambrox.",
    notes: "Woody, leathery, and deeply comforting.",
    top_notes: "Cardamom, Violet, Iris",
    middle_notes: "Papyrus, Ambrox",
    base_notes: "Sandalwood, Cedarwood, Leather",
    how_to_use: "Spray on wrists and neck.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1582211594533-268f4f1edcb9?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "50ml", price: 11000 }, { size: "100ml", price: 16000 }]),
    gender: "Unisex",
    stock: 75,
    rating: 4.7,
    review_count: 320,
    badge: "Best Seller"
  },
  {
    name: "Baccarat Rouge Bloom",
    slug: "baccarat-rouge-bloom",
    category: "Eau de Parfum",
    price: 22000,
    original_price: 25000,
    description: "A luminous and sophisticated fragrance that lays on the skin like an amber floral and woody breeze.",
    notes: "Radiant, airy, and highly concentrated.",
    top_notes: "Jasmine, Saffron",
    middle_notes: "Amberwood, Ambergris",
    base_notes: "Fir Resin, Cedar",
    how_to_use: "Apply sparingly to pulse points.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "50ml", price: 22000 }]),
    gender: "Unisex",
    stock: 10,
    rating: 5.0,
    review_count: 450,
    badge: "Featured"
  },
  {
    name: "Jasmine Sambac Oil",
    slug: "jasmine-sambac-oil",
    category: "Attars & Oils",
    price: 2500,
    original_price: 3000,
    description: "Pure, sweet, and intensely floral jasmine oil distilled at dawn.",
    notes: "Fresh, green, and highly floral.",
    top_notes: "Green Leaves",
    middle_notes: "Jasmine Sambac",
    base_notes: "White Musk",
    how_to_use: "Apply to the back of the neck.",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1585218334450-afcf929da36e?q=80&w=800&auto=format&fit=crop"
    ]),
    sizes: JSON.stringify([{ size: "12ml", price: 2500 }]),
    gender: "Women",
    stock: 120,
    rating: 4.5,
    review_count: 65,
    badge: "New"
  }
];

async function seedDatabase() {
  console.log("Starting database seed...");
  try {
    const pool = await getPool();

    // Check if database is already seeded
    const [existingProducts] = await pool.execute("SELECT COUNT(*) as count FROM products");
    if (existingProducts[0].count > 0) {
      console.log("Database already has products. Skipping seed to prevent data loss.");
      process.exit(0);
    }

    // Clear existing data (just in case)
    await pool.execute("DELETE FROM products");
    await pool.execute("DELETE FROM categories");
    console.log("Cleared old products and categories.");

    // Insert Categories
    for (const cat of seedCategories) {
      await pool.execute(
        `INSERT INTO categories (id, name, slug, image, description) VALUES (?, ?, ?, ?, ?)`,
        [cat.id, cat.name, cat.slug, cat.image, cat.description]
      );
    }
    console.log(`Inserted ${seedCategories.length} categories.`);

    // Insert Products
    for (const prod of seedProducts) {
      const id = uuidv4();
      
      const sampleReviews = [
        { id: uuidv4(), author: "Aarav S.", rating: 5, text: "Absolutely incredible fragrance. Lasts all day long and I get so many compliments!" },
        { id: uuidv4(), author: "Priya M.", rating: 4, text: "Very luxurious and premium packaging. The scent is slightly strong at first but settles beautifully." },
        { id: uuidv4(), author: "Vikram R.", rating: 5, text: "A masterpiece. This has become my new signature scent. Highly recommended." }
      ];

      await pool.execute(
        `INSERT INTO products (
          id, name, slug, category, price, original_price, description, notes,
          top_notes, middle_notes, base_notes, how_to_use, images, sizes, gender, stock, rating, review_count, badge, reviews
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, prod.name, prod.slug, prod.category, prod.price, prod.original_price, prod.description, prod.notes,
          prod.top_notes, prod.middle_notes, prod.base_notes, prod.how_to_use, prod.images, prod.sizes, prod.gender, prod.stock, prod.rating, prod.review_count, prod.badge, JSON.stringify(sampleReviews)
        ]
      );
    }
    console.log(`Inserted ${seedProducts.length} products.`);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();