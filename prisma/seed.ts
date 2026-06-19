import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Shampoo", slug: "shampoo", description: "Herbal shampoos for hair care" },
    }),
    prisma.category.create({
      data: { name: "Hair Oils", slug: "hair-oils", description: "Natural oils for hair growth and nourishment" },
    }),
    prisma.category.create({
      data: { name: "Herbal Tea", slug: "herbal-tea", description: "Organic teas for wellness" },
    }),
    prisma.category.create({
      data: { name: "Hand Wash", slug: "hand-wash", description: "Natural hand wash products" },
    }),
    prisma.category.create({
      data: { name: "Soap", slug: "soap", description: "Handmade herbal soaps" },
    }),
    prisma.category.create({
      data: { name: "Skin Care", slug: "skin-care", description: "Natural skin care products" },
    }),
    prisma.category.create({
      data: { name: "Bundles", slug: "bundles", description: "Special combo offers" },
    }),
  ]);

  // Create products
  const products = [
    {
      name: "PurestStem Organic Shampoo - Repair Ultra",
      slug: "organic-shampoo-repair-ultra",
      description: "A powerful herbal shampoo crafted with rare mountain herbs to repair damaged hair and restore natural shine. Free from sulfates and parabens.",
      price: 1450,
      salePrice: 1200,
      stock: 50,
      sku: "KH-SH-001",
      weight: "250ml",
      ingredients: "Amla, Reetha, Shikakai, Aloe Vera, Bhringraj",
      howToUse: "Apply to wet hair, massage gently into scalp, rinse thoroughly. Use 2-3 times per week.",
      featured: true,
      categoryId: categories[0].id,
    },
    {
      name: "Golden Oil for Hair Growth",
      slug: "golden-oil-hair-growth",
      description: "Premium hair growth oil infused with 24K gold flakes and potent herbs. Stimulates follicles and promotes thicker, healthier hair.",
      price: 2200,
      salePrice: 1850,
      stock: 35,
      sku: "KH-OI-001",
      weight: "100ml",
      ingredients: "Almond Oil, Coconut Oil, Gold Flakes, Brahmi, Ashwagandha",
      howToUse: "Warm slightly and massage into scalp for 10-15 minutes. Leave overnight for best results.",
      featured: true,
      categoryId: categories[1].id,
    },
    {
      name: "Bloating Relief Herbal Tea",
      slug: "bloating-relief-herbal-tea",
      description: "Soothing herbal blend designed to ease digestive discomfort and reduce bloating. Caffeine-free and perfect for daily wellness.",
      price: 850,
      salePrice: 720,
      stock: 60,
      sku: "KH-TE-001",
      weight: "100g",
      ingredients: "Peppermint, Fennel, Ginger, Chamomile, Dandelion Root",
      howToUse: "Steep 1 teaspoon in hot water for 5-7 minutes. Drink after meals.",
      featured: true,
      categoryId: categories[2].id,
    },
    {
      name: "Neem Detox Soap",
      slug: "neem-detox-soap",
      description: "Purifying neem soap that deeply cleanses skin while maintaining natural moisture balance. Ideal for acne-prone skin.",
      price: 450,
      salePrice: 380,
      stock: 80,
      sku: "KH-SO-001",
      weight: "100g",
      ingredients: "Neem Extract, Tea Tree Oil, Coconut Oil, Olive Oil, Vitamin E",
      howToUse: "Lather and apply to body and face. Rinse thoroughly.",
      featured: true,
      categoryId: categories[4].id,
    },
    {
      name: "Rose Glow Soap",
      slug: "rose-glow-soap",
      description: "Luxurious rose-infused soap that brightens and softens skin. Contains real rose petals and essential oils.",
      price: 550,
      salePrice: 470,
      stock: 45,
      sku: "KH-SO-002",
      weight: "100g",
      ingredients: "Rose Petals, Rose Essential Oil, Shea Butter, Glycerin, Vitamin E",
      howToUse: "Lather and apply to body and face. Rinse thoroughly.",
      featured: false,
      categoryId: categories[4].id,
    },
    {
      name: "PurestStem Skin Polish Ubtan Powder",
      slug: "skin-polish-ubtan-powder",
      description: "Traditional ubtan recipe for radiant skin. Exfoliates dead skin cells and reveals a natural glow.",
      price: 1200,
      salePrice: 990,
      stock: 40,
      sku: "KH-SK-001",
      weight: "200g",
      ingredients: "Gram Flour, Turmeric, Sandalwood, Rose Petals, Saffron",
      howToUse: "Mix with rose water or milk to form a paste. Apply and let dry, then scrub gently.",
      featured: true,
      categoryId: categories[5].id,
    },
    {
      name: "Hair Fall Rescue Kit",
      slug: "hair-fall-rescue-kit",
      description: "Complete hair care bundle including herbal shampoo, hair oil, and hair mask. The ultimate solution for hair fall control.",
      price: 4500,
      salePrice: 3800,
      stock: 25,
      sku: "KH-BU-001",
      weight: "Combo",
      ingredients: "Amla, Reetha, Shikakai, Bhringraj, Brahmi, Coconut Oil",
      howToUse: "Follow the included regimen guide for optimal results.",
      featured: true,
      categoryId: categories[6].id,
    },
    {
      name: "Herbal Hand Wash - Lemon Fresh",
      slug: "herbal-hand-wash-lemon",
      description: "Gentle yet effective hand wash with natural lemon extracts. Kills germs while keeping hands soft.",
      price: 650,
      salePrice: 550,
      stock: 70,
      sku: "KH-HW-001",
      weight: "300ml",
      ingredients: "Lemon Extract, Aloe Vera, Tea Tree Oil, Glycerin",
      howToUse: "Pump onto wet hands, lather for 20 seconds, rinse.",
      featured: false,
      categoryId: categories[3].id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // Create blog posts
  const blogPosts = [
    {
      title: "Is Herbal Shampoo Good for Hair Loss?",
      slug: "is-herbal-shampoo-good-for-hair-loss",
      excerpt: "Discover why herbal shampoos are becoming the go-to solution for hair loss and how natural ingredients can transform your hair health.",
      content: `Hair loss is a common concern affecting millions worldwide. While chemical-based products promise quick fixes, they often cause more harm than good in the long run. Herbal shampoos, crafted from nature's finest ingredients, offer a gentler, more sustainable approach to hair care.

## Why Choose Herbal Shampoo?

Unlike conventional shampoos loaded with sulfates and parabens, herbal alternatives harness the power of botanical extracts that have been used for centuries in traditional medicine.

### Key Benefits:
- **Gentle Cleansing**: Natural surfactants clean without stripping essential oils
- **Nourishment**: Herbs like amla and bhringraj strengthen hair follicles
- **Scalp Health**: Anti-inflammatory properties soothe irritated scalps
- **Long-term Results**: Addresses root causes rather than masking symptoms

## Best Herbs for Hair Loss

1. **Amla (Indian Gooseberry)**: Rich in Vitamin C and antioxidants
2. **Bhringraj**: Known as the king of herbs for hair growth
3. **Shikakai**: Natural cleanser that promotes shine
4. **Reetha**: Gentle foaming agent that maintains pH balance

## Making the Switch

Transitioning to herbal shampoo may take time. Your hair might need 2-4 weeks to adjust as it detoxifies from chemical buildup. Be patient - the results are worth it.`,
      author: "PurestStem",
      published: true,
    },
    {
      title: "The Power of Mountain Herbs in Modern Wellness",
      slug: "power-of-mountain-herbs",
      excerpt: "Explore how ancient mountain herbal remedies are being validated by modern science for today's wellness needs.",
      content: `For centuries, communities living in mountainous regions have relied on the unique flora of high altitudes for their medicinal needs. Today, science is catching up to what these traditional healers have always known.

## Unique Properties of Mountain Herbs

Plants growing at high altitudes develop potent compounds to survive harsh conditions. These stress-response chemicals often translate to powerful benefits for human health.

### Notable Mountain Herbs:
- **Rhodiola Rosea**: Adaptogen for stress relief
- **Sea Buckthorn**: Rich in Omega fatty acids
- **Yarrow**: Natural wound healer
- **Gentian**: Digestive aid

## Sustainability in Sourcing

At PurestStem, we work directly with mountain communities to ethically source our ingredients. This ensures both potency and supports local economies.

## Incorporating into Daily Life

Mountain herbs can be consumed as teas, applied topically in oils, or used in powdered form. Start with one herb and observe how your body responds.`,
      author: "PurestStem",
      published: true,
    },
    {
      title: "Understanding Your Hair Type: A Complete Guide",
      slug: "understanding-your-hair-type",
      excerpt: "Learn how to identify your hair type and choose the right herbal products for your specific needs.",
      content: `Not all hair is created equal. Understanding your unique hair type is the first step toward choosing products that actually work for you.

## The Four Main Hair Types

### Type 1: Straight Hair
- Tends to get oily quickly
- Benefits from lightweight, balancing formulas
- Avoid heavy oils that weigh hair down

### Type 2: Wavy Hair
- Prone to frizz
- Needs moisture without heaviness
- Look for products with aloe vera and light oils

### Type 3: Curly Hair
- Naturally dry due to oil travel challenges
- Requires rich, hydrating ingredients
- Deep conditioning treatments are essential

### Type 4: Coily Hair
- Most fragile hair type
- Needs maximum moisture and protection
- Heavy butters and oils work best

## Porosity Matters

Beyond curl pattern, porosity determines how your hair absorbs moisture. High porosity hair needs more protein, while low porosity needs heat to open cuticles.

## Herbal Solutions by Type

Our product line is formulated to address the specific needs of each hair type while leveraging the power of mountain herbs.`,
      author: "PurestStem",
      published: true,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@pureststem.com",
      name: "Admin User",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Create sample reviews
  const allProducts = await prisma.product.findMany();
  const reviews = [
    { name: "Ayesha K.", rating: 5, comment: "Amazing shampoo! My hair feels so much healthier after just two weeks.", verified: true },
    { name: "Mohammad R.", rating: 5, comment: "The golden oil is a game changer. My hair fall has reduced significantly.", verified: true },
    { name: "Fatima S.", rating: 4, comment: "Love the herbal tea. Great taste and really helps with digestion.", verified: true },
    { name: "Ali H.", rating: 5, comment: "Best herbal products in Pakistan. Authentic and effective.", verified: true },
  ];

  for (let i = 0; i < reviews.length; i++) {
    await prisma.review.create({
      data: {
        ...reviews[i],
        productId: allProducts[i % allProducts.length].id,
      },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
