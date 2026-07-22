import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Categories with SEO-friendly descriptions
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Herbal Shampoo",
        slug: "herbal-shampoo",
        description: "Sulfate-free herbal shampoos with amla, reetha, shikakai and bhringraj for strong, healthy hair in Pakistan.",
        image: "/uploads/products/1780239716925-Screenshot_2026-05-09_122740.png",
      },
    }),
    prisma.category.create({
      data: {
        name: "Hair Oils",
        slug: "hair-oils",
        description: "Authentic Pakistani hair oils infused with golden flakes, coconut, almond, brahmi and ashwagandha for hair growth.",
        image: "/uploads/products/1780239938780-Screenshot_2026-05-15_104832.png",
      },
    }),
    prisma.category.create({
      data: {
        name: "Herbal Tea",
        slug: "herbal-tea",
        description: "Caffeine-free organic herbal teas for digestion, bloating relief, detox and daily wellness.",
        image: "/uploads/products/1780240425037-Screenshot_2026-05-22_205452.png",
      },
    }),
    prisma.category.create({
      data: {
        name: "Hand Wash",
        slug: "hand-wash",
        description: "Natural antibacterial hand wash with lemon, aloe vera and tea tree oil. Gentle for daily family use.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Herbal Soap",
        slug: "herbal-soap",
        description: "Handmade herbal soaps with neem, rose, turmeric and shea butter for glowing, acne-free skin.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Skin Care",
        slug: "skin-care",
        description: "Traditional Pakistani skin care including ubtan powder, face masks and natural exfoliators for radiant skin.",
      },
    }),
    prisma.category.create({
      data: {
        name: "Bundles & Kits",
        slug: "bundles-and-kits",
        description: "Money-saving herbal bundles and complete hair care kits with shampoo, oil and mask combos.",
      },
    }),
  ]);

  // Real SEO-optimized products
  const products = [
    {
      name: "PurestStem Organic Shampoo - Repair Ultra",
      slug: "organic-shampoo-repair-ultra-pakistan",
      description:
        "Pakistan's best sulfate-free herbal shampoo for damaged hair. Formulated with ancient mountain herbs including Amla, Reetha, Shikakai, Aloe Vera and Bhringraj to repair split ends, reduce breakage and restore natural shine. Safe for colored hair and daily use.",
      price: 1450,
      salePrice: 1200,
      stock: 50,
      sku: "PS-SH-001",
      weight: "250ml",
      ingredients:
        "Amla (Indian Gooseberry), Reetha (Soapnut), Shikakai, Aloe Vera Extract, Bhringraj Extract, Purified Water, Vegetable Glycerin, Natural Preservatives.",
      howToUse:
        "Wet hair thoroughly. Apply a generous amount to scalp and hair. Massage gently for 2-3 minutes. Rinse with normal water. For best results, use 2-3 times per week with PurestStem hair oil.",
      featured: true,
      isActive: true,
      categoryId: categories[0].id,
      image: "/uploads/products/1780239716925-Screenshot_2026-05-09_122740.png",
    },
    {
      name: "Golden Oil for Hair Growth",
      slug: "golden-hair-growth-oil-pakistan",
      description:
        "Premium 24K gold-infused hair growth oil made in Pakistan. A powerful blend of cold-pressed Almond Oil, Coconut Oil, Brahmi, Ashwagandha and pure gold flakes stimulates dormant follicles, reduces hair fall and promotes thicker, stronger hair from root to tip.",
      price: 2200,
      salePrice: 1850,
      stock: 35,
      sku: "PS-OI-001",
      weight: "100ml",
      ingredients:
        "Cold-Pressed Almond Oil, Virgin Coconut Oil, 24K Gold Flakes, Brahmi Extract, Ashwagandha Extract, Vitamin E, Castor Oil.",
      howToUse:
        "Warm 5-7 drops of oil between palms. Massage deeply into scalp using fingertips for 10-15 minutes in circular motion. Leave overnight or at least 2 hours before washing. Use twice weekly for visible results.",
      featured: true,
      isActive: true,
      categoryId: categories[1].id,
      image: "/uploads/products/1780239938780-Screenshot_2026-05-15_104832.png",
    },
    {
      name: "Bloating Relief Herbal Tea",
      slug: "bloating-relief-herbal-tea-pakistan",
      description:
        "Natural digestive herbal tea for bloating, gas and indigestion relief. This caffeine-free blend combines Peppermint, Fennel, Ginger, Chamomile and Dandelion Root to soothe your stomach after every meal. Ideal for daily wellness routines in Pakistan.",
      price: 850,
      salePrice: 720,
      stock: 60,
      sku: "PS-TE-001",
      weight: "100g",
      ingredients:
        "Organic Peppermint Leaves, Fennel Seeds, Dried Ginger Root, Chamomile Flowers, Dandelion Root, Lemongrass.",
      howToUse:
        "Add 1 teaspoon of herbal tea to a cup of hot water. Cover and steep for 5-7 minutes. Strain and sip slowly after meals. Drink 1-2 cups daily for best digestive comfort.",
      featured: true,
      isActive: true,
      categoryId: categories[2].id,
      image: "/uploads/products/1780240425037-Screenshot_2026-05-22_205452.png",
    },
    {
      name: "Neem Detox Soap",
      slug: "neem-detox-soap-pakistan",
      description:
        "Authentic neem detox soap for acne-prone and oily skin in Pakistan. Deeply cleanses pores, removes dirt, excess oil and impurities while maintaining your skin's natural moisture barrier. Suitable for face and body.",
      price: 450,
      salePrice: 380,
      stock: 80,
      sku: "PS-SO-001",
      weight: "100g",
      ingredients:
        "Pure Neem Extract, Tea Tree Essential Oil, Extra Virgin Coconut Oil, Olive Oil, Shea Butter, Vitamin E, Glycerin.",
      howToUse:
        "Wet skin with lukewarm water. Lather the soap between palms and massage gently onto face and body in circular motion. Rinse thoroughly. Use twice daily for clear, refreshed skin.",
      featured: true,
      isActive: true,
      categoryId: categories[4].id,
    },
    {
      name: "Rose Glow Soap",
      slug: "rose-glow-soap-pakistan",
      description:
        "Luxury rose glow soap enriched with real rose petals, rose essential oil, shea butter and vitamin E. Brightens dull skin, improves uneven tone and leaves your skin soft, hydrated and naturally fragrant.",
      price: 550,
      salePrice: 470,
      stock: 45,
      sku: "PS-SO-002",
      weight: "100g",
      ingredients:
        "Real Rose Petals, Rose Essential Oil, Shea Butter, Glycerin, Vitamin E, Coconut Oil, Olive Oil.",
      howToUse:
        "Lather well and apply on wet face and body. Massage gently for 1-2 minutes. Rinse with normal water. Use daily for a radiant natural glow.",
      featured: false,
      isActive: true,
      categoryId: categories[4].id,
    },
    {
      name: "PurestStem Skin Polish Ubtan Powder",
      slug: "skin-polish-ubtan-powder-pakistan",
      description:
        "Traditional Pakistani ubtan powder for bridal glow and radiant skin. Made with gram flour, turmeric, sandalwood, rose petals and saffron, this natural exfoliator removes tan, dead skin cells and impurities without harsh chemicals.",
      price: 1200,
      salePrice: 990,
      stock: 40,
      sku: "PS-SK-001",
      weight: "200g",
      ingredients:
        "Gram Flour (Besan), Turmeric Powder, Sandalwood Powder, Dried Rose Petals, Saffron Strands, Milk Powder.",
      howToUse:
        "Mix 2 tablespoons of ubtan with rose water or milk to form a smooth paste. Apply evenly on cleansed face and neck. Let it dry for 15-20 minutes. Scrub gently and rinse with normal water. Use twice a week.",
      featured: true,
      isActive: true,
      categoryId: categories[5].id,
    },
    {
      name: "Hair Fall Rescue Kit",
      slug: "hair-fall-rescue-kit-pakistan",
      description:
        "Complete herbal hair fall control kit for Pakistani men and women. Includes Organic Repair Shampoo, Golden Hair Growth Oil and a deep-conditioning hair mask. The ultimate natural solution for hair fall, thinning and weak roots.",
      price: 4500,
      salePrice: 3800,
      stock: 25,
      sku: "PS-BU-001",
      weight: "Kit",
      ingredients:
        "Amla, Reetha, Shikakai, Bhringraj, Brahmi, Coconut Oil, Almond Oil, Aloe Vera, Fenugreek, Castor Oil.",
      howToUse:
        "Follow the 4-week hair rescue regimen included in the kit: oil twice weekly, shampoo 2-3 times weekly, and apply hair mask once weekly for intensive repair.",
      featured: true,
      isActive: true,
      categoryId: categories[6].id,
    },
    {
      name: "Herbal Hand Wash - Lemon Fresh",
      slug: "herbal-hand-wash-lemon-fresh-pakistan",
      description:
        "Natural lemon fresh hand wash for families in Pakistan. Effectively cleans hands, removes germs and keeps skin soft with aloe vera, glycerin and tea tree oil. Free from harsh sulfates and artificial colors.",
      price: 650,
      salePrice: 550,
      stock: 70,
      sku: "PS-HW-001",
      weight: "300ml",
      ingredients:
        "Lemon Extract, Aloe Vera Juice, Tea Tree Oil, Vegetable Glycerin, Coconut-Derived Cleansers, Vitamin E, Purified Water.",
      howToUse:
        "Pump a small amount onto wet hands. Rub together to create rich lather for at least 20 seconds. Rinse thoroughly with clean water. Use as often as needed.",
      featured: false,
      isActive: true,
      categoryId: categories[3].id,
    },
    {
      name: "Anti-Dandruff Herbal Shampoo",
      slug: "anti-dandruff-herbal-shampoo-pakistan",
      description:
        "Clinically inspired anti-dandruff herbal shampoo with neem, tea tree oil, apple cider vinegar and aloe vera. Gently removes flakes, soothes itchy scalp and restores scalp health without drying out your hair.",
      price: 1350,
      salePrice: 1150,
      stock: 40,
      sku: "PS-SH-002",
      weight: "250ml",
      ingredients:
        "Neem Extract, Tea Tree Oil, Apple Cider Vinegar, Aloe Vera, Bhringraj, Reetha, Shikakai, Natural Preservatives.",
      howToUse:
        "Apply to wet scalp and hair. Massage for 2-3 minutes focusing on roots. Rinse well. Use 2-3 times per week. Pair with PurestStem hair oil for best results.",
      featured: true,
      isActive: true,
      categoryId: categories[0].id,
    },
    {
      name: "Amla Reetha Shikakai Powder",
      slug: "amla-reetha-shikakai-powder-pakistan",
      description:
        "Pure triple-herb hair cleanser powder made from sun-dried Amla, Reetha and Shikakai. The original desi hair wash powder for silky, strong and naturally clean hair without any chemicals.",
      price: 750,
      salePrice: 650,
      stock: 55,
      sku: "PS-SK-002",
      weight: "200g",
      ingredients:
        "100% Pure Amla Powder, Reetha Powder, Shikakai Powder. No additives or preservatives.",
      howToUse:
        "Soak 2 tablespoons in warm water for 30 minutes. Strain and use the liquid to wash hair. Massage scalp gently. Rinse thoroughly. Use weekly as a natural hair cleanser.",
      featured: false,
      isActive: true,
      categoryId: categories[0].id,
    },
    {
      name: "Herbal Face Pack for Glowing Skin",
      slug: "herbal-face-pack-glowing-skin-pakistan",
      description:
        "Desi herbal face pack for instant glow and tan removal. A nourishing blend of Multani Mitti, Sandalwood, Turmeric and Rose Petals tightens pores, controls oil and brightens skin naturally.",
      price: 650,
      salePrice: 550,
      stock: 45,
      sku: "PS-SK-003",
      weight: "150g",
      ingredients:
        "Multani Mitti (Fuller's Earth), Sandalwood Powder, Turmeric, Dried Rose Petals, Licorice Powder.",
      howToUse:
        "Mix with rose water or yogurt to make a smooth paste. Apply on cleansed face and neck. Leave for 15 minutes. Rinse with normal water. Use 2-3 times a week for glowing skin.",
      featured: true,
      isActive: true,
      categoryId: categories[5].id,
    },
    {
      name: "Detox Green Herbal Tea",
      slug: "detox-green-herbal-tea-pakistan",
      description:
        "Refreshing detox green herbal tea with green tea leaves, mint, lemongrass and ginger. Supports metabolism, digestion and natural cleansing. Perfect morning or post-meal tea for health-conscious Pakistanis.",
      price: 950,
      salePrice: 800,
      stock: 50,
      sku: "PS-TE-002",
      weight: "100g",
      ingredients:
        "Green Tea Leaves, Mint Leaves, Lemongrass, Ginger Pieces, Fennel Seeds, Tulsi Leaves.",
      howToUse:
        "Steep 1 teaspoon in hot water for 3-5 minutes. Strain and enjoy without sugar or add honey. Drink 1-2 cups daily as part of a healthy detox routine.",
      featured: false,
      isActive: true,
      categoryId: categories[2].id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // SEO blog posts with real content
  const blogPosts = [
    {
      title: "Best Herbal Shampoo for Hair Fall in Pakistan - A Complete Guide",
      slug: "best-herbal-shampoo-hair-fall-pakistan",
      excerpt:
        "Discover why Pakistani women and men are switching to herbal shampoos for hair fall. Learn which natural ingredients actually work and how to choose the right product.",
      content: `Hair fall is one of the most common beauty concerns in Pakistan. Pollution, hard water, heat styling and chemical-laden products damage hair roots over time. The good news is that nature offers powerful solutions.

## Why Herbal Shampoo Beats Chemical Shampoo

Most commercial shampoos contain sulfates, parabens and silicones that give temporary shine but weaken hair follicles. Herbal shampoos use plant-based cleansers that clean gently while nourishing the scalp.

### Best Herbs for Hair Fall Control
- **Amla**: Rich in Vitamin C, strengthens hair roots and prevents premature greying
- **Bhringraj**: Known as the king of herbs for hair growth and thickness
- **Shikakai**: Natural cleanser that maintains scalp pH without stripping oils
- **Reetha**: Creates mild lather and removes dirt without harsh chemicals
- **Aloe Vera**: Soothes itchy scalp and adds natural moisture

## How to Choose a Herbal Shampoo in Pakistan

Look for sulfate-free and paraben-free labels. Check the ingredient list for real herb extracts rather than just fragrances. A good herbal shampoo should also match your scalp type - oily, dry or balanced.

## Results Timeline

When switching to herbal shampoo, allow 3-4 weeks for your scalp to detox. Consistent use for 2-3 months shows visible improvement in hair fall, texture and shine.

## Conclusion

Herbal shampoo is not a trend - it is a return to trusted desi hair care. Choose products with authentic mountain herbs and give your hair the chemical-free care it deserves.`,
      author: "PurestStem Herbal Experts",
      published: true,
    },
    {
      title: "Benefits of Hair Oiling: Why Pakistani Hair Care Starts with Oil",
      slug: "benefits-of-hair-oiling-pakistan",
      excerpt:
        "Learn the science-backed benefits of regular hair oiling with coconut, almond and herbal oils. Find the best oiling routine for stronger Pakistani hair.",
      content: `For generations, Pakistani households have practiced weekly hair oiling. This tradition is backed by both culture and science. Regular oil massage nourishes roots, improves circulation and protects hair from damage.

## Why Hair Oiling Works

Natural oils penetrate the hair shaft and seal moisture. They also form a protective layer against heat, pollution and UV rays. Massaging oil into the scalp boosts blood flow to hair follicles.

### Best Oils for Hair Growth
1. **Coconut Oil**: Deep conditioning and prevents protein loss
2. **Almond Oil**: Rich in Vitamin E, adds shine and strength
3. **Castor Oil**: Thickens hair and supports growth
4. **Mustard Oil**: Traditional choice for strong, black hair
5. **Herbal Infused Oils**: Brahmi, Bhringraj and Ashwagandha for targeted benefits

## The Right Oiling Routine

Warm the oil slightly. Apply to scalp and lengths. Massage for 10-15 minutes. Leave overnight or for at least 2 hours before washing. Oil 1-2 times per week for best results.

## Common Mistakes to Avoid

Do not use too much oil - a few drops are enough. Avoid leaving oil on for days as it attracts dirt. Always rinse thoroughly with a mild herbal shampoo.

## Final Thoughts

Make hair oiling a weekly ritual. With patience and the right oil, you will notice stronger, shinier and healthier hair naturally.`,
      author: "PurestStem Herbal Experts",
      published: true,
    },
    {
      title: "How to Use Ubtan for Bridal Glow - Pakistani Skincare Secret",
      slug: "how-to-use-ubtan-bridal-glow-pakistan",
      excerpt:
        "Ubtan is Pakistan's oldest beauty secret for radiant skin. Learn how to prepare and apply ubtan for a natural bridal glow before your big day.",
      content: `Ubtan has been a part of Pakistani bridal beauty rituals for centuries. This natural face and body paste exfoliates, brightens and softens skin without any chemicals.

## What is Ubtan?

Ubtan is a mixture of gram flour (besan), turmeric, sandalwood and other skin-loving herbs. Each family has its own recipe, but the core ingredients remain the same.

### Classic Ubtan Ingredients
- **Gram Flour**: Natural exfoliator and cleanser
- **Turmeric**: Anti-inflammatory and brightening
- **Sandalwood**: Cooling and soothing
- **Rose Petals**: Hydration and natural fragrance
- **Saffron**: Luxury glow booster
- **Milk or Rose Water**: Mixing liquid for smooth paste

## How to Apply Ubtan for Best Results

Mix 2 tablespoons of ubtan powder with rose water or milk. Apply a thin layer on cleansed face, neck and arms. Let it dry for 15-20 minutes. Spray rose water if it feels too tight. Gently scrub while rinsing in circular motions.

## Bridal Glow Routine

Start using ubtan 4-6 weeks before the wedding. Apply twice a week. Follow with a light herbal moisturizer. Avoid harsh chemical peels during this period.

## Conclusion

Ubtan is safe, affordable and highly effective. For the best bridal glow in Pakistan, trust this time-tested tradition with pure, natural ingredients.`,
      author: "PurestStem Herbal Experts",
      published: true,
    },
    {
      title: "Top 5 Herbal Teas for Digestion and Detox in Pakistan",
      slug: "top-herbal-teas-digestion-detox-pakistan",
      excerpt:
        "Explore the best herbal teas available in Pakistan for digestion, bloating relief and natural detox. Caffeine-free options for daily wellness.",
      content: `Pakistani cuisine is rich and flavorful, but heavy meals can sometimes cause bloating and indigestion. Herbal teas offer a gentle, natural way to support digestion and detox.

## Best Herbal Teas for Digestive Health

### 1. Peppermint Tea
Cooling and calming for the stomach. Helps relieve gas and bloating after meals.

### 2. Fennel Tea
Traditional Pakistani remedy for indigestion. Chewing fennel seeds after meals is a common practice.

### 3. Ginger Tea
Warming spice that improves digestion, reduces nausea and supports metabolism.

### 4. Chamomile Tea
Soothes the digestive tract and helps reduce stress-related stomach issues.

### 5. Green Herbal Detox Tea
Combines green tea, tulsi, lemongrass and ginger for a refreshing morning cleanse.

## When to Drink Herbal Tea

Digestive blends work best 20-30 minutes after meals. Detox teas are ideal in the morning. Avoid caffeine-free blends late at night if they contain ginger.

## Making Herbal Tea at Home

Use 1 teaspoon of dried herbs per cup. Steep in hot water for 5-7 minutes. Strain and add honey if desired. Fresh herbs can be used for stronger flavor.

## Conclusion

Adding herbal tea to your daily routine is a simple step toward better digestion and overall wellness. Choose organic blends for maximum benefit.`,
      author: "PurestStem Herbal Experts",
      published: true,
    },
    {
      title: "Neem Soap Benefits for Acne and Oily Skin in Pakistan",
      slug: "neem-soap-benefits-acne-oily-skin-pakistan",
      excerpt:
        "Neem soap is one of the best natural remedies for acne, pimples and oily skin in Pakistan's humid climate. Learn how to use it effectively.",
      content: `Neem has been used in Pakistani skincare for thousands of years. Its antibacterial and anti-inflammatory properties make it ideal for treating acne, pimples and oily skin.

## Why Neem Works for Acne

Neem contains compounds like azadirachtin and nimbin that fight acne-causing bacteria. It also helps control excess oil production without over-drying the skin.

### Neem Soap Benefits
- Deep cleanses pores and removes dirt
- Reduces active pimples and prevents new breakouts
- Controls oil for hours
- Soothes redness and irritation
- Suitable for face and body

## Who Should Use Neem Soap?

Neem soap is best for oily, combination and acne-prone skin. People with very dry skin should use it less frequently and follow with moisturizer.

## How to Use Neem Soap for Acne

Use twice daily - morning and night. Lather well and massage gently on affected areas. Leave the lather for 30 seconds before rinsing. Pat skin dry and apply a light moisturizer.

## Results Timeline

You may notice reduced oiliness within a week. Acne improvement usually takes 3-4 weeks of consistent use. Combine with a healthy diet and adequate water intake.

## Conclusion

Neem soap is a trusted, affordable solution for clear skin in Pakistan. Choose a handmade version with real neem extract for the best results.`,
      author: "PurestStem Herbal Experts",
      published: true,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@pureststem.com",
      name: "Admin User",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Real customer reviews
  const allProducts = await prisma.product.findMany();
  const reviews = [
    { name: "Ayesha Khan", rating: 5, comment: "The herbal shampoo is amazing! My hair fall reduced within 3 weeks and hair feels so soft. Highly recommended for Pakistani hair.", verified: true },
    { name: "Mohammad Rafiq", rating: 5, comment: "Golden hair oil is the best I have used in Pakistan. My hair is thicker and the fragrance is very natural.", verified: true },
    { name: "Fatima Sheikh", rating: 4, comment: "Bloating relief tea really works. I drink it after dinner and feel much lighter.", verified: true },
    { name: "Ali Hassan", rating: 5, comment: "Finally found a real herbal brand in Pakistan. Products are authentic and delivery was fast with cash on delivery.", verified: true },
    { name: "Sana Tariq", rating: 5, comment: "Neem soap cleared my acne in one month. Will definitely buy again.", verified: true },
    { name: "Bilal Ahmed", rating: 4, comment: "Hair fall rescue kit is worth the price. My wife loves all three products.", verified: true },
    { name: "Nadia Hussain", rating: 5, comment: "Ubtan powder gave me a natural glow before my sister's wedding. Best desi skincare product.", verified: true },
    { name: "Usman Ali", rating: 5, comment: "Fast shipping to Lahore and genuine products. PurestStem is now my go-to herbal store.", verified: true },
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
