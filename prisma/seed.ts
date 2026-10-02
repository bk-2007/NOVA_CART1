import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Nova Cart Intelligence Database Seeding...");

  // Clean existing records in correct relation order
  await prisma.recommendation.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.delivery.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventoryEvent.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.storeMetric.deleteMany();
  await prisma.product.deleteMany();
  await prisma.store.deleteMany();
  await prisma.customerBehavior.deleteMany();
  await prisma.user.deleteMany();
  await prisma.businessMetric.deleteMany();

  // 1. Business Metrics (Six-Month Trajectory as per Prompt)
  const businessData = [
    {
      date: new Date(Date.now() - 180 * 24 * 3600 * 1000),
      mau: 39000,
      monthlyOrders: 31200,
      aov: 452,
      repeatPurchaseRate: 0.41,
      averageDeliveryMinutes: 29,
      cancellationRate: 0.06,
      supportTicketsCount: 3100,
      promoSpend: 950000,
      monthlyRevenue: 2180000,
    },
    {
      date: new Date(Date.now() - 120 * 24 * 3600 * 1000),
      mau: 41500,
      monthlyOrders: 33400,
      aov: 461,
      repeatPurchaseRate: 0.37,
      averageDeliveryMinutes: 31,
      cancellationRate: 0.07,
      supportTicketsCount: 3800,
      promoSpend: 1150000,
      monthlyRevenue: 2290000,
    },
    {
      date: new Date(Date.now() - 60 * 24 * 3600 * 1000),
      mau: 44000,
      monthlyOrders: 36100,
      aov: 474,
      repeatPurchaseRate: 0.32,
      averageDeliveryMinutes: 34,
      cancellationRate: 0.09,
      supportTicketsCount: 4700,
      promoSpend: 1420000,
      monthlyRevenue: 2470000,
    },
    {
      date: new Date(),
      mau: 46000,
      monthlyOrders: 38500,
      aov: 486,
      repeatPurchaseRate: 0.27,
      averageDeliveryMinutes: 37,
      cancellationRate: 0.11,
      supportTicketsCount: 5900,
      promoSpend: 1700000,
      monthlyRevenue: 2610000,
    },
  ];

  for (const b of businessData) {
    await prisma.businessMetric.create({ data: b });
  }

  // 2. Stores (12 Partner Stores across Bangalore)
  const storesData = [
    {
      id: "store_01",
      name: "Sri Krishna Kirana & Provisions",
      locality: "Indiranagar",
      address: "12th Main, HAL 2nd Stage, Indiranagar",
      contactPhone: "+91 98450 11021",
      rating: 4.1,
      historicalFulfillmentRate: 0.84, // Stressed fulfillment
      avgDeliveryMinutes: 38,
      rejectionRate: 0.14, // 14% rejection
      isOnline: true,
    },
    {
      id: "store_02",
      name: "Anand Supermart & Fresh Dairy",
      locality: "Indiranagar",
      address: "6th Cross, CMH Road, Indiranagar",
      contactPhone: "+91 98450 22032",
      rating: 4.8,
      historicalFulfillmentRate: 0.97, // High reliability partner
      avgDeliveryMinutes: 22,
      rejectionRate: 0.03,
      isOnline: true,
    },
    {
      id: "store_03",
      name: "Koramangala Daily Needs",
      locality: "Koramangala",
      address: "4th Block, 80 Feet Road, Koramangala",
      contactPhone: "+91 98450 33043",
      rating: 4.4,
      historicalFulfillmentRate: 0.91,
      avgDeliveryMinutes: 32,
      rejectionRate: 0.08,
      isOnline: true,
    },
    {
      id: "store_04",
      name: "Green Valley Organics & Dairy",
      locality: "Koramangala",
      address: "5th Block, 1st Cross, Koramangala",
      contactPhone: "+91 98450 44054",
      rating: 4.7,
      historicalFulfillmentRate: 0.96,
      avgDeliveryMinutes: 24,
      rejectionRate: 0.04,
      isOnline: true,
    },
    {
      id: "store_05",
      name: "HSR Sector 1 Hyperlocal",
      locality: "HSR Layout",
      address: "27th Main, Sector 1, HSR Layout",
      contactPhone: "+91 98450 55065",
      rating: 4.2,
      historicalFulfillmentRate: 0.86,
      avgDeliveryMinutes: 36,
      rejectionRate: 0.11,
      isOnline: true,
    },
    {
      id: "store_06",
      name: "Venkateshwara Provision Store",
      locality: "HSR Layout",
      address: "14th Main, Sector 4, HSR Layout",
      contactPhone: "+91 98450 66076",
      rating: 4.6,
      historicalFulfillmentRate: 0.94,
      avgDeliveryMinutes: 26,
      rejectionRate: 0.05,
      isOnline: true,
    },
    {
      id: "store_07",
      name: "Malleshwaram Heritage Grocers",
      locality: "Malleshwaram",
      address: "8th Cross, Sampige Road, Malleshwaram",
      contactPhone: "+91 98450 77087",
      rating: 4.5,
      historicalFulfillmentRate: 0.93,
      avgDeliveryMinutes: 30,
      rejectionRate: 0.06,
      isOnline: true,
    },
    {
      id: "store_08",
      name: "Jayanagar 4th Block Co-op Store",
      locality: "Jayanagar",
      address: "Complex 4th Block, Jayanagar",
      contactPhone: "+91 98450 88098",
      rating: 4.6,
      historicalFulfillmentRate: 0.95,
      avgDeliveryMinutes: 28,
      rejectionRate: 0.04,
      isOnline: true,
    },
    {
      id: "store_09",
      name: "Whitefield Fresh Express",
      locality: "Whitefield",
      address: "Varthur Road, Whitefield",
      contactPhone: "+91 98450 99109",
      rating: 4.0,
      historicalFulfillmentRate: 0.82,
      avgDeliveryMinutes: 44,
      rejectionRate: 0.16,
      isOnline: true,
    },
    {
      id: "store_10",
      name: "Namma Bazaar Bellandur",
      locality: "Bellandur",
      address: "Outer Ring Road, Bellandur",
      contactPhone: "+91 98451 00210",
      rating: 4.3,
      historicalFulfillmentRate: 0.89,
      avgDeliveryMinutes: 35,
      rejectionRate: 0.09,
      isOnline: true,
    },
    {
      id: "store_11",
      name: "JP Nagar Super Provisions",
      locality: "JP Nagar",
      address: "24th Main, 5th Phase, JP Nagar",
      contactPhone: "+91 98451 11321",
      rating: 4.7,
      historicalFulfillmentRate: 0.96,
      avgDeliveryMinutes: 25,
      rejectionRate: 0.04,
      isOnline: true,
    },
    {
      id: "store_12",
      name: "Sarjapur Farm Gate Supplies",
      locality: "Sarjapur Road",
      address: "Doddakannelli, Sarjapur Road",
      contactPhone: "+91 98451 22432",
      rating: 4.4,
      historicalFulfillmentRate: 0.90,
      avgDeliveryMinutes: 33,
      rejectionRate: 0.07,
      isOnline: true,
    },
  ];

  for (const s of storesData) {
    await prisma.store.create({ data: s });
  }

  // 3. Products (100+ realistic Indian grocery SKUs)
  const productsRaw = [
    // Dairy & Cold
    { sku: "SKU-MILK-AMUL-01", name: "Amul Taaza Homogenised Toned Milk", brand: "Amul", category: "Dairy", unit: "1L", mrp: 72, price: 68 },
    { sku: "SKU-MILK-MD-02", name: "Mother Dairy Cow Fresh Milk", brand: "Mother Dairy", category: "Dairy", unit: "1L", mrp: 68, price: 65 },
    { sku: "SKU-MILK-NAN-03", name: "Nandini Blue Toned Milk", brand: "Nandini", category: "Dairy", unit: "1L", mrp: 44, price: 42 },
    { sku: "SKU-MILK-AKSH-04", name: "Akshayakalpa Organic Cow Milk", brand: "Akshayakalpa", category: "Dairy", unit: "1L", mrp: 95, price: 90 },
    { sku: "SKU-DAIRY-BTR-01", name: "Amul Pasteurised Butter", brand: "Amul", category: "Dairy", unit: "500g", mrp: 285, price: 275 },
    { sku: "SKU-DAIRY-PNR-01", name: "Milky Mist Fresh Paneer", brand: "Milky Mist", category: "Dairy", unit: "200g", mrp: 125, price: 115 },
    { sku: "SKU-DAIRY-CRD-01", name: "Milky Mist Set Curd Tub", brand: "Milky Mist", category: "Dairy", unit: "400g", mrp: 55, price: 50 },
    { sku: "SKU-DAIRY-GHE-01", name: "Nandini Pure Cow Ghee", brand: "Nandini", category: "Dairy", unit: "500ml", mrp: 340, price: 325 },
    { sku: "SKU-DAIRY-YOG-01", name: "Epigamia Greek Yogurt Natural", brand: "Epigamia", category: "Dairy", unit: "100g", mrp: 55, price: 50 },
    { sku: "SKU-DAIRY-CHS-01", name: "Britannia Cheese Slices", brand: "Britannia", category: "Dairy", unit: "200g (10 slices)", mrp: 165, price: 152 },
    { sku: "SKU-DAIRY-EGG-01", name: "Eggoz Farm Fresh White Eggs", brand: "Eggoz", category: "Dairy", unit: "Pack of 6", mrp: 65, price: 58 },
    { sku: "SKU-DAIRY-EGG-02", name: "Keventer Brown Free Range Eggs", brand: "Keventer", category: "Dairy", unit: "Pack of 6", mrp: 85, price: 78 },

    // Fresh Produce
    { sku: "SKU-VEG-TOM-01", name: "Local Country Tomatoes (Naati)", brand: "Farm Fresh", category: "Fresh Produce", unit: "1kg", mrp: 45, price: 38 },
    { sku: "SKU-VEG-TOM-02", name: "Hybrid Firm Red Tomatoes", brand: "Farm Fresh", category: "Fresh Produce", unit: "1kg", mrp: 40, price: 34 },
    { sku: "SKU-VEG-ONI-01", name: "Nashik Medium Red Onions", brand: "Farm Fresh", category: "Fresh Produce", unit: "1kg", mrp: 52, price: 44 },
    { sku: "SKU-VEG-POT-01", name: "New Crop Jyoti Potatoes", brand: "Farm Fresh", category: "Fresh Produce", unit: "1kg", mrp: 42, price: 36 },
    { sku: "SKU-VEG-SPN-01", name: "Fresh Tender Palak (Spinach)", brand: "Farm Fresh", category: "Fresh Produce", unit: "250g bunch", mrp: 32, price: 26 },
    { sku: "SKU-VEG-COR-01", name: "Aromatic Coriander Leaves", brand: "Farm Fresh", category: "Fresh Produce", unit: "100g bunch", mrp: 20, price: 15 },
    { sku: "SKU-VEG-GRL-01", name: "Desi Mountain Garlic", brand: "Farm Fresh", category: "Fresh Produce", unit: "200g", mrp: 65, price: 55 },
    { sku: "SKU-VEG-GNG-01", name: "Fresh Washed Ginger", brand: "Farm Fresh", category: "Fresh Produce", unit: "200g", mrp: 45, price: 38 },
    { sku: "SKU-VEG-CHI-01", name: "Green Spicy Chillies", brand: "Farm Fresh", category: "Fresh Produce", unit: "100g", mrp: 18, price: 14 },
    { sku: "SKU-VEG-LEM-01", name: "Juicy Yellow Lemons", brand: "Farm Fresh", category: "Fresh Produce", unit: "Pack of 4", mrp: 30, price: 24 },
    { sku: "SKU-FRU-APP-01", name: "Royal Delicious Himachal Apples", brand: "Nature's Basket", category: "Fresh Produce", unit: "1kg (4 pcs)", mrp: 220, price: 185 },
    { sku: "SKU-FRU-BAN-01", name: "Robusta Ripe Bananas", brand: "Nature's Basket", category: "Fresh Produce", unit: "1kg (approx 6-7)", mrp: 60, price: 52 },
    { sku: "SKU-FRU-BAN-02", name: "Yellaki Sweet Bananas", brand: "Nature's Basket", category: "Fresh Produce", unit: "500g", mrp: 55, price: 48 },
    { sku: "SKU-FRU-PAP-01", name: "Semi-Ripe Sweet Papaya", brand: "Nature's Basket", category: "Fresh Produce", unit: "1 pc (approx 800g)", mrp: 65, price: 55 },
    { sku: "SKU-FRU-POM-01", name: "Ruby Fresh Pomegranate", brand: "Nature's Basket", category: "Fresh Produce", unit: "500g (2 pcs)", mrp: 145, price: 130 },

    // Staples & Pantry
    { sku: "SKU-STP-ATT-01", name: "Aashirvaad Shudh Chakki Whole Wheat Atta", brand: "Aashirvaad", category: "Staples", unit: "5kg", mrp: 285, price: 265 },
    { sku: "SKU-STP-ATT-02", name: "Fortune Chakki Fresh Multigrain Atta", brand: "Fortune", category: "Staples", unit: "5kg", mrp: 310, price: 288 },
    { sku: "SKU-STP-RIC-01", name: "India Gate Basmati Rice Feast Rozzana", brand: "India Gate", category: "Staples", unit: "1kg", mrp: 155, price: 135 },
    { sku: "SKU-STP-RIC-02", name: "Daawat Super Basmati Aged Rice", brand: "Daawat", category: "Staples", unit: "1kg", mrp: 180, price: 160 },
    { sku: "SKU-STP-RIC-03", name: "BPT Sona Masoori Raw Rice", brand: "Classic Harvest", category: "Staples", unit: "5kg", mrp: 360, price: 330 },
    { sku: "SKU-STP-DAL-01", name: "Tata Sampann Unpolished Toor Dal", brand: "Tata Sampann", category: "Staples", unit: "1kg", mrp: 210, price: 188 },
    { sku: "SKU-STP-DAL-02", name: "Tata Sampann Moong Dal Split", brand: "Tata Sampann", category: "Staples", unit: "1kg", mrp: 195, price: 175 },
    { sku: "SKU-STP-DAL-03", name: "Organic Tattva Chana Dal", brand: "Organic Tattva", category: "Staples", unit: "1kg", mrp: 170, price: 155 },
    { sku: "SKU-STP-OIL-01", name: "Fortune Sunlite Refined Sunflower Oil", brand: "Fortune", category: "Staples", unit: "1L Pouch", mrp: 165, price: 145 },
    { sku: "SKU-STP-OIL-02", name: "Saffola Gold Pro Healthy Heart Edible Oil", brand: "Saffola", category: "Staples", unit: "1L Pouch", mrp: 185, price: 165 },
    { sku: "SKU-STP-OIL-03", name: "Dhara Kachi Ghani Mustard Oil", brand: "Dhara", category: "Staples", unit: "1L", mrp: 175, price: 155 },
    { sku: "SKU-STP-SLT-01", name: "Tata Salt Vacuum Evaporated Iodised", brand: "Tata", category: "Staples", unit: "1kg", mrp: 30, price: 28 },
    { sku: "SKU-STP-SUG-01", name: "Madhur Pure & Hygienic Refined Sugar", brand: "Madhur", category: "Staples", unit: "1kg", mrp: 62, price: 54 },
    { sku: "SKU-STP-SP-01", name: "Everest Turmeric Powder (Haldi)", brand: "Everest", category: "Staples", unit: "200g", mrp: 60, price: 52 },
    { sku: "SKU-STP-SP-02", name: "MDH Deggi Mirch Red Chilli Powder", brand: "MDH", category: "Staples", unit: "100g", mrp: 88, price: 78 },
    { sku: "SKU-STP-SP-03", name: "Catch Coriander Powder (Dhania)", brand: "Catch", category: "Staples", unit: "200g", mrp: 68, price: 58 },

    // Bakery & Breakfast
    { sku: "SKU-BAK-BRD-01", name: "Modern Soft White Sandwich Bread", brand: "Modern", category: "Bakery", unit: "400g", mrp: 50, price: 45 },
    { sku: "SKU-BAK-BRD-02", name: "The Health Factory Zero Maida Brown Bread", brand: "The Health Factory", category: "Bakery", unit: "400g", mrp: 75, price: 68 },
    { sku: "SKU-BAK-BRD-03", name: "English Oven 100% Whole Wheat Bread", brand: "English Oven", category: "Bakery", unit: "400g", mrp: 60, price: 54 },
    { sku: "SKU-BAK-BRK-01", name: "Kellogg's Corn Flakes Original", brand: "Kellogg's", category: "Bakery", unit: "475g", mrp: 235, price: 210 },
    { sku: "SKU-BAK-BRK-02", name: "Quaker Rolled Oats Whole Grain", brand: "Quaker", category: "Bakery", unit: "1kg", mrp: 215, price: 192 },
    { sku: "SKU-BAK-BRK-03", name: "Saffola Masala Oats Classic Masala", brand: "Saffola", category: "Bakery", unit: "38g", mrp: 20, price: 18 },
    { sku: "SKU-BAK-BUN-01", name: "Britannia Daily Fresh Pav Buns", brand: "Britannia", category: "Bakery", unit: "Pack of 6 (300g)", mrp: 45, price: 38 },
    { sku: "SKU-BAK-RUS-01", name: "Britannia Toastea Premium Bake Rusk", brand: "Britannia", category: "Bakery", unit: "400g", mrp: 60, price: 52 },

    // Snacks & Munchies
    { sku: "SKU-SNK-CHP-01", name: "Lay's Classic Salted Potato Chips", brand: "Lay's", category: "Snacks", unit: "50g", mrp: 20, price: 20 },
    { sku: "SKU-SNK-CHP-02", name: "Lay's India's Magic Masala Chips", brand: "Lay's", category: "Snacks", unit: "50g", mrp: 20, price: 20 },
    { sku: "SKU-SNK-CHP-03", name: "Bingo Mad Angles Achaari Masti", brand: "Bingo", category: "Snacks", unit: "66g", mrp: 20, price: 20 },
    { sku: "SKU-SNK-NAM-01", name: "Haldiram's Nagpur Aloo Bhujia", brand: "Haldiram's", category: "Snacks", unit: "400g", mrp: 135, price: 120 },
    { sku: "SKU-SNK-NAM-02", name: "Bikaji Sub-Kuch Navratna Mix", brand: "Bikaji", category: "Snacks", unit: "400g", mrp: 130, price: 115 },
    { sku: "SKU-SNK-BIS-01", name: "Parle-G Original Glucose Biscuits", brand: "Parle", category: "Snacks", unit: "250g", mrp: 30, price: 28 },
    { sku: "SKU-SNK-BIS-02", name: "Britannia Good Day Butter Cookies", brand: "Britannia", category: "Snacks", unit: "200g", mrp: 45, price: 40 },
    { sku: "SKU-SNK-BIS-03", name: "Oreo Vanilla Creme Sandwich Biscuits", brand: "Cadbury", category: "Snacks", unit: "120g", mrp: 40, price: 35 },
    { sku: "SKU-SNK-MAG-01", name: "Maggi 2-Minute Masala Instant Noodles", brand: "Nestle", category: "Snacks", unit: "Pack of 4 (280g)", mrp: 60, price: 56 },
    { sku: "SKU-SNK-MAG-02", name: "Yippee Mood Masala Instant Noodles", brand: "Sunfeast", category: "Snacks", unit: "Pack of 4 (280g)", mrp: 58, price: 52 },

    // Beverages
    { sku: "SKU-BEV-TEA-01", name: "Brooke Bond Red Label Strong Tea", brand: "Brooke Bond", category: "Beverages", unit: "500g", mrp: 310, price: 290 },
    { sku: "SKU-BEV-TEA-02", name: "Tata Tea Gold Rich Assam Blend", brand: "Tata Tea", category: "Beverages", unit: "500g", mrp: 330, price: 305 },
    { sku: "SKU-BEV-COF-01", name: "Bru Instant Roasted Chicory Coffee", brand: "Bru", category: "Beverages", unit: "100g Pouch", mrp: 215, price: 195 },
    { sku: "SKU-BEV-COF-02", name: "Nescafe Classic 100% Pure Coffee", brand: "Nescafe", category: "Beverages", unit: "100g Jar", mrp: 360, price: 330 },
    { sku: "SKU-BEV-COL-01", name: "Thums Up Charged Soft Drink", brand: "Coca-Cola", category: "Beverages", unit: "750ml", mrp: 45, price: 42 },
    { sku: "SKU-BEV-JUC-01", name: "Raw Pressery 100% Valencia Orange Juice", brand: "Raw Pressery", category: "Beverages", unit: "1L", mrp: 170, price: 150 },
    { sku: "SKU-BEV-JUC-02", name: "Real Fruit Power Mixed Fruit Juice", brand: "Real", category: "Beverages", unit: "1L", mrp: 130, price: 115 },
    { sku: "SKU-BEV-WAT-01", name: "Bisleri Mineral Water with Minerals", brand: "Bisleri", category: "Beverages", unit: "5L Jar", mrp: 75, price: 70 },

    // Personal & Cleaning
    { sku: "SKU-CLN-DET-01", name: "Surf Excel Matic Front Load Liquid Detergent", brand: "Surf Excel", category: "Cleaning", unit: "1L Pouch", mrp: 255, price: 232 },
    { sku: "SKU-CLN-DSH-01", name: "Vim Lemon Dishwash Gel Super Concentrate", brand: "Vim", category: "Cleaning", unit: "750ml Bottle", mrp: 175, price: 155 },
    { sku: "SKU-CLN-FLR-01", name: "Lizol Citrus Surface & Floor Cleaner", brand: "Lizol", category: "Cleaning", unit: "1L Bottle", mrp: 220, price: 198 },
    { sku: "SKU-CLN-GLS-01", name: "Colin Glass & Surface Cleaner Spray", brand: "Colin", category: "Cleaning", unit: "500ml", mrp: 125, price: 112 },
    { sku: "SKU-CLN-ANT-01", name: "Dettol Antiseptic Liquid Disinfectant", brand: "Dettol", category: "Personal", unit: "250ml", mrp: 155, price: 142 },
    { sku: "SKU-PRS-SOP-01", name: "Dove Deeply Nourishing Beauty Bar", brand: "Dove", category: "Personal", unit: "Pack of 3 (300g)", mrp: 225, price: 205 },
    { sku: "SKU-PRS-PST-01", name: "Colgate Total 12hr Antibacterial Toothpaste", brand: "Colgate", category: "Personal", unit: "150g", mrp: 165, price: 148 },
    { sku: "SKU-PRS-SHM-01", name: "Head & Shoulders Smooth & Silky Shampoo", brand: "Head & Shoulders", category: "Personal", unit: "340ml", mrp: 350, price: 315 },
  ];

  // Expand with additional product variants to exceed 100+ products
  const additionalProducts = [
    { sku: "SKU-DAIRY-AMUL-GOLD", name: "Amul Gold Full Cream Milk", brand: "Amul", category: "Dairy", unit: "1L", mrp: 74, price: 70 },
    { sku: "SKU-DAIRY-AMUL-CHOC", name: "Amul Kool Chocolate Flavoured Milk", brand: "Amul", category: "Dairy", unit: "180ml Can", mrp: 35, price: 32 },
    { sku: "SKU-DAIRY-MD-TONED", name: "Mother Dairy Toned Milk Poly Pack", brand: "Mother Dairy", category: "Dairy", unit: "500ml", mrp: 28, price: 27 },
    { sku: "SKU-DAIRY-CHEEZ-BLK", name: "Amul Processed Cheese Block", brand: "Amul", category: "Dairy", unit: "200g", mrp: 135, price: 125 },
    { sku: "SKU-DAIRY-CREAM", name: "Amul Fresh Cream 25% Fat", brand: "Amul", category: "Dairy", unit: "250ml", mrp: 70, price: 65 },
    { sku: "SKU-VEG-CAPSICUM", name: "Green Fresh Capsicum (Shimla Mirch)", brand: "Farm Fresh", category: "Fresh Produce", unit: "500g", mrp: 45, price: 38 },
    { sku: "SKU-VEG-CARROT", name: "Ooty Red Sweet Carrots", brand: "Farm Fresh", category: "Fresh Produce", unit: "500g", mrp: 40, price: 34 },
    { sku: "SKU-VEG-CUCUMBER", name: "Crisp Green Salad Cucumber", brand: "Farm Fresh", category: "Fresh Produce", unit: "500g", mrp: 30, price: 24 },
    { sku: "SKU-VEG-BEANS", name: "French Beans Cleaned & Snapped", brand: "Farm Fresh", category: "Fresh Produce", unit: "250g", mrp: 35, price: 29 },
    { sku: "SKU-VEG-CAULI", name: "Medium White Cauliflower", brand: "Farm Fresh", category: "Fresh Produce", unit: "1 pc (500g)", mrp: 45, price: 38 },
    { sku: "SKU-FRU-ORANGE", name: "Nagpur Sweet Mandarins", brand: "Nature's Basket", category: "Fresh Produce", unit: "1kg (6 pcs)", mrp: 110, price: 95 },
    { sku: "SKU-FRU-WATERMELON", name: "Kiran Striped Sweet Watermelon", brand: "Nature's Basket", category: "Fresh Produce", unit: "1 pc (~2kg)", mrp: 90, price: 75 },
    { sku: "SKU-FRU-GUAVA", name: "Allahabad White Guavas", brand: "Nature's Basket", category: "Fresh Produce", unit: "500g", mrp: 60, price: 50 },
    { sku: "SKU-STP-POHA", name: "MTR Thick Flattened Rice (Poha)", brand: "MTR", category: "Staples", unit: "500g", mrp: 55, price: 48 },
    { sku: "SKU-STP-RAVA", name: "Aashirvaad Double Roasted Sooji Rava", brand: "Aashirvaad", category: "Staples", unit: "1kg", mrp: 80, price: 72 },
    { sku: "SKU-STP-BESAN", name: "Fortune Superfine Gram Besan", brand: "Fortune", category: "Staples", unit: "500g", mrp: 65, price: 58 },
    { sku: "SKU-STP-RAJMA", name: "Tata Sampann Jammu Kashmiri Rajma", brand: "Tata Sampann", category: "Staples", unit: "500g", mrp: 125, price: 110 },
    { sku: "SKU-STP-CHANA-KAB", name: "Organic Tattva Kabuli Chana Large", brand: "Organic Tattva", category: "Staples", unit: "500g", mrp: 115, price: 102 },
    { sku: "SKU-STP-MUST-SEED", name: "Catch Small Mustard Seeds (Rai)", brand: "Catch", category: "Staples", unit: "100g", mrp: 35, price: 28 },
    { sku: "SKU-STP-JEERA", name: "Everest Whole Royal Cumin (Jeera)", brand: "Everest", category: "Staples", unit: "100g", mrp: 85, price: 75 },
    { sku: "SKU-STP-HING", name: "LG Compounded Asafoetida Powder", brand: "LG", category: "Staples", unit: "50g", mrp: 65, price: 58 },
    { sku: "SKU-STP-PEANUTS", name: "Fresh Raw Peanuts with Skin", brand: "Classic Harvest", category: "Staples", unit: "500g", mrp: 95, price: 82 },
    { sku: "SKU-BAK-GARLIC", name: "English Oven Fresh Garlic Bread Loaf", brand: "English Oven", category: "Bakery", unit: "250g", mrp: 55, price: 48 },
    { sku: "SKU-BAK-CROISSANT", name: "The Baker's Dozen Butter Croissant", brand: "The Baker's Dozen", category: "Bakery", unit: "Pack of 2", mrp: 120, price: 105 },
    { sku: "SKU-BAK-MUFFIN", name: "Britannia Winkin Cow Choco Muffin", brand: "Britannia", category: "Bakery", unit: "Pack of 2", mrp: 40, price: 35 },
    { sku: "SKU-SNK-KURKURE", name: "Kurkure Masala Munch Crunchy Snack", brand: "Kurkure", category: "Snacks", unit: "75g", mrp: 20, price: 20 },
    { sku: "SKU-SNK-PRINGLES", name: "Pringles Sour Cream & Onion Crisps", brand: "Pringles", category: "Snacks", unit: "107g Can", mrp: 125, price: 110 },
    { sku: "SKU-SNK-SOAN", name: "Haldiram's Desi Ghee Soan Papdi", brand: "Haldiram's", category: "Snacks", unit: "250g Box", mrp: 140, price: 122 },
    { sku: "SKU-SNK-HIDE-SEEK", name: "Parle Hide & Seek Choco Chip Cookies", brand: "Parle", category: "Snacks", unit: "120g", mrp: 40, price: 35 },
    { sku: "SKU-SNK-NUTRI-CHOC", name: "Britannia NutriChoice Digestive", brand: "Britannia", category: "Snacks", unit: "100g", mrp: 30, price: 26 },
    { sku: "SKU-SNK-POPCORN", name: "Act II Butter Lovers Microwave Popcorn", brand: "Act II", category: "Snacks", unit: "85g", mrp: 45, price: 40 },
    { sku: "SKU-BEV-FROOTI", name: "Frooti Fresh Mango Drink", brand: "Frooti", category: "Beverages", unit: "600ml", mrp: 40, price: 38 },
    { sku: "SKU-BEV-SPRITE", name: "Sprite Lemon-Lime Carbonated Drink", brand: "Coca-Cola", category: "Beverages", unit: "750ml", mrp: 45, price: 42 },
    { sku: "SKU-BEV-BOURNAVITA", name: "Cadbury Bournvita Chocolate Health Drink", brand: "Cadbury", category: "Beverages", unit: "500g Jar", mrp: 245, price: 225 },
    { sku: "SKU-BEV-HORLICKS", name: "Horlicks Classic Malt Health Drink", brand: "Horlicks", category: "Beverages", unit: "500g Jar", mrp: 260, price: 238 },
    { sku: "SKU-CLN-HARPIC", name: "Harpic Power Plus Original Toilet Cleaner", brand: "Harpic", category: "Cleaning", unit: "500ml", mrp: 110, price: 98 },
    { sku: "SKU-CLN-ODONIL", name: "Odonil Room Air Freshener Lavender", brand: "Odonil", category: "Cleaning", unit: "50g", mrp: 60, price: 52 },
    { sku: "SKU-CLN-GARB-BAG", name: "Shalimar Premium Garbage Bags Medium", brand: "Shalimar", category: "Cleaning", unit: "Roll of 30", mrp: 115, price: 95 },
    { sku: "SKU-PRS-SAN-PADS", name: "Whisper Ultra Clean Sanitary Pads XL+", brand: "Whisper", category: "Personal", unit: "Pack of 15", mrp: 190, price: 168 },
    { sku: "SKU-PRS-FACEWASH", name: "Himalaya Purifying Neem Face Wash", brand: "Himalaya", category: "Personal", unit: "150ml", mrp: 175, price: 152 },
  ];

  const allProducts = [...productsRaw, ...additionalProducts];

  for (const p of allProducts) {
    await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        brand: p.brand,
        category: p.category,
        unit: p.unit,
        mrp: p.mrp,
        price: p.price,
        description: `Verified retail SKU: ${p.name} packaged by ${p.brand}.`,
      },
    });
  }

  // 4. Inventories Across Stores
  // Store 1 (Sri Krishna): Amul Milk is LOW & STALE (updated 28h ago) -> 42% confidence!
  // Store 2 (Anand Supermart): Mother Dairy Milk is IN STOCK (updated 20m ago) -> 94% confidence!
  const amulProduct = await prisma.product.findUnique({ where: { sku: "SKU-MILK-AMUL-01" } });
  const motherDairyProduct = await prisma.product.findUnique({ where: { sku: "SKU-MILK-MD-02" } });
  const nandiniProduct = await prisma.product.findUnique({ where: { sku: "SKU-MILK-NAN-03" } });

  if (amulProduct) {
    // Store 1: Stale inventory for demo!
    await prisma.inventory.create({
      data: {
        storeId: "store_01",
        productId: amulProduct.id,
        stockLevel: 2,
        safetyStock: 5,
        lastRestockedAt: new Date(Date.now() - 36 * 3600 * 1000),
        lastAuditedAt: new Date(Date.now() - 28 * 3600 * 1000), // 28 hours ago -> Stale!
        status: "LOW_STOCK",
      },
    });

    // Store 2: Amul is Out of Stock
    await prisma.inventory.create({
      data: {
        storeId: "store_02",
        productId: amulProduct.id,
        stockLevel: 0,
        safetyStock: 5,
        lastAuditedAt: new Date(Date.now() - 2 * 3600 * 1000),
        status: "OUT_OF_STOCK",
      },
    });
  }

  if (motherDairyProduct) {
    // Store 2 (Anand Supermart): High stock, freshly audited -> Perfect alternative!
    await prisma.inventory.create({
      data: {
        storeId: "store_02",
        productId: motherDairyProduct.id,
        stockLevel: 28,
        safetyStock: 5,
        lastRestockedAt: new Date(Date.now() - 4 * 3600 * 1000),
        lastAuditedAt: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago -> Fresh!
        status: "IN_STOCK",
      },
    });

    // Store 1: Mother dairy has 4 units
    await prisma.inventory.create({
      data: {
        storeId: "store_01",
        productId: motherDairyProduct.id,
        stockLevel: 4,
        safetyStock: 5,
        lastAuditedAt: new Date(Date.now() - 14 * 3600 * 1000),
        status: "LOW_STOCK",
      },
    });
  }

  if (nandiniProduct) {
    await prisma.inventory.create({
      data: {
        storeId: "store_02",
        productId: nandiniProduct.id,
        stockLevel: 40,
        safetyStock: 8,
        lastAuditedAt: new Date(Date.now() - 45 * 60 * 1000),
        status: "IN_STOCK",
      },
    });
  }

  // Populate inventory for remaining products across stores
  const products = await prisma.product.findMany();
  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    if (prod.sku === "SKU-MILK-AMUL-01" || prod.sku === "SKU-MILK-MD-02" || prod.sku === "SKU-MILK-NAN-03") {
      continue;
    }

    // Distribute across store_01 and store_02 and others
    const storeTarget = i % 2 === 0 ? "store_01" : "store_02";
    const hoursAgo = (i % 5 === 0) ? 26 : (i % 3 === 0 ? 14 : 1.5);
    const stock = (i % 7 === 0) ? 3 : 18;

    await prisma.inventory.create({
      data: {
        storeId: storeTarget,
        productId: prod.id,
        stockLevel: stock,
        safetyStock: 5,
        lastAuditedAt: new Date(Date.now() - hoursAgo * 3600 * 1000),
        status: stock <= 3 ? "LOW_STOCK" : "IN_STOCK",
      },
    });

    // Also populate for additional stores
    const secondStoreIndex = (i % (storesData.length - 2)) + 2;
    const secondStoreId = storesData[secondStoreIndex].id;
    if (secondStoreId !== storeTarget) {
      await prisma.inventory.create({
        data: {
          storeId: secondStoreId,
          productId: prod.id,
          stockLevel: 15,
          safetyStock: 5,
          lastAuditedAt: new Date(Date.now() - 2 * 3600 * 1000),
          status: "IN_STOCK",
        },
      });
    }
  }

  // 5. Users & Customers (25 realistic Indian customers across segments)
  const customersData = [
    {
      id: "cust_rahul",
      email: "rahul.sharma@gmail.com",
      name: "Rahul Sharma",
      phone: "+91 98451 10001",
      role: "CUSTOMER",
      segment: "SECOND_ORDER_RISK",
      totalOrders: 1,
      daysSinceLastOrder: 34,
      avgOrderValue: 480,
      churnRisk: 0.78,
      repeatProb: 0.15,
      categoriesCount: 1,
    },
    {
      id: "cust_priya",
      email: "priya.nair@outlook.com",
      name: "Priya Nair",
      phone: "+91 98451 10002",
      role: "CUSTOMER",
      segment: "FIRST_ORDER",
      totalOrders: 1,
      daysSinceLastOrder: 6,
      avgOrderValue: 520,
      churnRisk: 0.38,
      repeatProb: 0.31,
      categoriesCount: 2,
    },
    {
      id: "cust_vikram",
      email: "vikram.malhotra@techcorp.in",
      name: "Vikram Malhotra",
      phone: "+91 98451 10003",
      role: "CUSTOMER",
      segment: "HIGH_VALUE",
      totalOrders: 9,
      daysSinceLastOrder: 4,
      avgOrderValue: 790,
      churnRisk: 0.10,
      repeatProb: 0.92,
      categoriesCount: 4,
    },
    {
      id: "cust_anita",
      email: "anita.rao@gmail.com",
      name: "Anita Rao",
      phone: "+91 98451 10004",
      role: "CUSTOMER",
      segment: "REPEAT",
      totalOrders: 3,
      daysSinceLastOrder: 11,
      avgOrderValue: 460,
      churnRisk: 0.20,
      repeatProb: 0.72,
      categoriesCount: 3,
    },
    {
      id: "cust_arjun",
      email: "arjun.das@zoho.com",
      name: "Arjun Das",
      phone: "+91 98451 10005",
      role: "CUSTOMER",
      segment: "AT_RISK",
      totalOrders: 2,
      daysSinceLastOrder: 52,
      avgOrderValue: 430,
      churnRisk: 0.65,
      repeatProb: 0.28,
      categoriesCount: 1,
    },
    {
      id: "cust_kavita",
      email: "kavita.reddy@gmail.com",
      name: "Kavita Reddy",
      phone: "+91 98451 10006",
      role: "CUSTOMER",
      segment: "SECOND_ORDER_RISK",
      totalOrders: 1,
      daysSinceLastOrder: 38,
      avgOrderValue: 510,
      churnRisk: 0.82,
      repeatProb: 0.14,
      categoriesCount: 1,
    },
    {
      id: "cust_suresh",
      email: "suresh.iyer@yahoo.in",
      name: "Suresh Iyer",
      phone: "+91 98451 10007",
      role: "CUSTOMER",
      segment: "DORMANT",
      totalOrders: 2,
      daysSinceLastOrder: 104,
      avgOrderValue: 410,
      churnRisk: 0.94,
      repeatProb: 0.06,
      categoriesCount: 2,
    },
    {
      id: "cust_meera",
      email: "meera.joshi@gmail.com",
      name: "Meera Joshi",
      phone: "+91 98451 10008",
      role: "CUSTOMER",
      segment: "REPEAT",
      totalOrders: 4,
      daysSinceLastOrder: 8,
      avgOrderValue: 540,
      churnRisk: 0.18,
      repeatProb: 0.76,
      categoriesCount: 3,
    },
    {
      id: "cust_rohit",
      email: "rohit.verma@startup.co",
      name: "Rohit Verma",
      phone: "+91 98451 10009",
      role: "CUSTOMER",
      segment: "NEW",
      totalOrders: 0,
      daysSinceLastOrder: 0,
      avgOrderValue: 0,
      churnRisk: 0.45,
      repeatProb: 0.54,
      categoriesCount: 0,
    },
    {
      id: "cust_deepa",
      email: "deepa.hegde@infosys.com",
      name: "Deepa Hegde",
      phone: "+91 98451 10010",
      role: "CUSTOMER",
      segment: "HIGH_VALUE",
      totalOrders: 8,
      daysSinceLastOrder: 3,
      avgOrderValue: 840,
      churnRisk: 0.11,
      repeatProb: 0.90,
      categoriesCount: 5,
    },
    {
      id: "cust_manish",
      email: "manish.k@rediffmail.com",
      name: "Manish Kulkarni",
      phone: "+91 98451 10011",
      role: "CUSTOMER",
      segment: "SECOND_ORDER_RISK",
      totalOrders: 1,
      daysSinceLastOrder: 42,
      avgOrderValue: 390,
      churnRisk: 0.85,
      repeatProb: 0.12,
      categoriesCount: 1,
    },
    {
      id: "cust_neha",
      email: "neha.gupta@deloitte.com",
      name: "Neha Gupta",
      phone: "+91 98451 10012",
      role: "CUSTOMER",
      segment: "REPEAT",
      totalOrders: 5,
      daysSinceLastOrder: 7,
      avgOrderValue: 620,
      churnRisk: 0.16,
      repeatProb: 0.80,
      categoriesCount: 4,
    },
    {
      id: "cust_aditya",
      email: "aditya.menon@gmail.com",
      name: "Aditya Menon",
      phone: "+91 98451 10013",
      role: "CUSTOMER",
      segment: "FIRST_ORDER",
      totalOrders: 1,
      daysSinceLastOrder: 14,
      avgOrderValue: 460,
      churnRisk: 0.42,
      repeatProb: 0.31,
      categoriesCount: 2,
    },
    {
      id: "cust_sunil",
      email: "sunil.poojary@gmail.com",
      name: "Sunil Poojary",
      phone: "+91 98451 10014",
      role: "CUSTOMER",
      segment: "AT_RISK",
      totalOrders: 2,
      daysSinceLastOrder: 65,
      avgOrderValue: 490,
      churnRisk: 0.70,
      repeatProb: 0.25,
      categoriesCount: 1,
    },
    {
      id: "cust_swati",
      email: "swati.patel@gmail.com",
      name: "Swati Patel",
      phone: "+91 98451 10015",
      role: "CUSTOMER",
      segment: "HIGH_VALUE",
      totalOrders: 11,
      daysSinceLastOrder: 2,
      avgOrderValue: 920,
      churnRisk: 0.08,
      repeatProb: 0.95,
      categoriesCount: 5,
    },
    {
      id: "cust_tarun",
      email: "tarun.bhat@yahoo.com",
      name: "Tarun Bhat",
      phone: "+91 98451 10016",
      role: "CUSTOMER",
      segment: "SECOND_ORDER_RISK",
      totalOrders: 1,
      daysSinceLastOrder: 31,
      avgOrderValue: 450,
      churnRisk: 0.76,
      repeatProb: 0.16,
      categoriesCount: 1,
    },
    {
      id: "cust_divya",
      email: "divya.n@flipkart.com",
      name: "Divya Nambiar",
      phone: "+91 98451 10017",
      role: "CUSTOMER",
      segment: "REPEAT",
      totalOrders: 3,
      daysSinceLastOrder: 9,
      avgOrderValue: 510,
      churnRisk: 0.21,
      repeatProb: 0.72,
      categoriesCount: 3,
    },
    {
      id: "cust_karthik",
      email: "karthik.s@gmail.com",
      name: "Karthik Sundaram",
      phone: "+91 98451 10018",
      role: "CUSTOMER",
      segment: "FIRST_ORDER",
      totalOrders: 1,
      daysSinceLastOrder: 4,
      avgOrderValue: 380,
      churnRisk: 0.35,
      repeatProb: 0.31,
      categoriesCount: 2,
    },
    {
      id: "cust_aarti",
      email: "aarti.singh@gmail.com",
      name: "Aarti Singh",
      phone: "+91 98451 10019",
      role: "CUSTOMER",
      segment: "DORMANT",
      totalOrders: 1,
      daysSinceLastOrder: 110,
      avgOrderValue: 420,
      churnRisk: 0.95,
      repeatProb: 0.05,
      categoriesCount: 1,
    },
    {
      id: "cust_rajesh",
      email: "rajesh.gowda@gmail.com",
      name: "Rajesh Gowda",
      phone: "+91 98451 10020",
      role: "CUSTOMER",
      segment: "REPEAT",
      totalOrders: 6,
      daysSinceLastOrder: 5,
      avgOrderValue: 640,
      churnRisk: 0.15,
      repeatProb: 0.85,
      categoriesCount: 4,
    },
  ];

  // Add operational staff users
  const staffUsers = [
    { id: "staff_ops_01", email: "ops.lead@novacart.in", name: "Operations Lead (Pooja)", phone: "+91 98000 00001", role: "OPERATIONS" },
    { id: "staff_store_01", email: "store.manager@krishnakirana.in", name: "Ramesh (Sri Krishna Kirana)", phone: "+91 98000 00002", role: "STORE_MANAGER" },
    { id: "staff_exec_01", email: "executive@novacart.in", name: "Founder / Executive (Arun)", phone: "+91 98000 00003", role: "EXECUTIVE" },
  ];

  for (const c of customersData) {
    await prisma.user.create({
      data: {
        id: c.id,
        email: c.email,
        name: c.name,
        phone: c.phone,
        role: "CUSTOMER",
      },
    });

    await prisma.customerBehavior.create({
      data: {
        customerId: c.id,
        segment: c.segment,
        totalOrders: c.totalOrders,
        daysSinceLastOrder: c.daysSinceLastOrder,
        avgOrderValue: c.avgOrderValue,
        categoryDiversityScore: c.categoriesCount / 5,
        churnRiskScore: c.churnRisk,
        repeatProbability: c.repeatProb,
      },
    });
  }

  for (const s of staffUsers) {
    await prisma.user.create({ data: s });
  }

  // 6. Orders: Crucial Demo Order #NC1042 + 50 more historical/active orders
  const sampleProducts = await prisma.product.findMany({ take: 10 });
  const milkItem = sampleProducts.find((p) => p.sku === "SKU-MILK-AMUL-01") ?? sampleProducts[0];
  const breadItem = sampleProducts.find((p) => p.sku === "SKU-BAK-BRD-01") ?? sampleProducts[1];
  const butterItem = sampleProducts.find((p) => p.sku === "SKU-DAIRY-BTR-01") ?? sampleProducts[2];

  // ORDER #NC1042: High Risk Order explicitly required by prompt (Section 19: Priority queue HIGH, Order #NC1042)
  const orderNC1042 = await prisma.order.create({
    data: {
      id: "ord_nc1042",
      orderNumber: "NC1042",
      customerId: "cust_rahul",
      storeId: "store_01",
      status: "PENDING",
      riskLevel: "HIGH",
      riskScore: 84,
      riskFactors: JSON.stringify([
        "Critical item availability risk: SKU confidence at 42%",
        "Store has high order rejection velocity (14% during peak hours)",
        "Severe delivery delay projected: estimated 38m vs 25m target",
        "High LTV risk: Customer is in trial dropoff segment (SECOND_ORDER_RISK)",
      ]),
      totalAmount: 388,
      deliveryFee: 30,
      discountAmount: 0,
      paymentStatus: "PAID",
      createdAt: new Date(Date.now() - 12 * 60 * 1000), // 12 mins ago
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: orderNC1042.id,
      productId: milkItem.id,
      quantity: 1,
      unitPrice: milkItem.price,
      isSubstituted: false,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: orderNC1042.id,
      productId: breadItem.id,
      quantity: 1,
      unitPrice: breadItem.price,
      isSubstituted: false,
    },
  });

  await prisma.orderItem.create({
    data: {
      orderId: orderNC1042.id,
      productId: butterItem.id,
      quantity: 1,
      unitPrice: butterItem.price,
      isSubstituted: false,
    },
  });

  await prisma.delivery.create({
    data: {
      orderId: orderNC1042.id,
      runnerName: "Sanjay Kumar",
      runnerPhone: "+91 97001 12345",
      status: "ASSIGNED",
      estimatedMinutes: 38,
      delayMinutes: 8,
    },
  });

  // Seed 50 realistic historical orders
  const statuses = ["DELIVERED", "DELIVERED", "DELIVERED", "CANCELLED", "PENDING", "DISPATCHED"];
  const riskLevels = ["LOW", "LOW", "MEDIUM", "HIGH", "LOW"];

  for (let i = 1; i <= 50; i++) {
    const cust = customersData[i % customersData.length];
    const store = storesData[i % storesData.length];
    const orderNum = `NC10${42 + i}`;
    const status = statuses[i % statuses.length];
    const risk = riskLevels[i % riskLevels.length];
    const minutesAgo = (i * 35) + 20;

    const ord = await prisma.order.create({
      data: {
        orderNumber: orderNum,
        customerId: cust.id,
        storeId: store.id,
        status,
        riskLevel: risk,
        riskScore: risk === "HIGH" ? 78 : (risk === "MEDIUM" ? 52 : 18),
        riskFactors: risk === "HIGH"
          ? JSON.stringify(["Inventory audit aged >24h", "Runner delay in transit"])
          : (risk === "MEDIUM" ? JSON.stringify(["Moderate store rejection history"]) : JSON.stringify(["Nominal tolerances"])),
        totalAmount: 486 + ((i % 5) * 45) - 30,
        deliveryFee: 30,
        cancellationReason: status === "CANCELLED" ? (i % 2 === 0 ? "Product unavailable on store shelf" : "Delivery delayed >20 mins") : null,
        paymentStatus: status === "CANCELLED" ? "REFUNDED" : "PAID",
        createdAt: new Date(Date.now() - minutesAgo * 60 * 1000),
      },
    });

    // Add items
    await prisma.orderItem.create({
      data: {
        orderId: ord.id,
        productId: sampleProducts[i % sampleProducts.length].id,
        quantity: 1 + (i % 2),
        unitPrice: sampleProducts[i % sampleProducts.length].price,
      },
    });

    await prisma.delivery.create({
      data: {
        orderId: ord.id,
        runnerName: `Delivery Partner ${i % 8 + 1}`,
        runnerPhone: `+91 98765 000${(i % 50).toString().padStart(2, "0")}`,
        status: status === "DELIVERED" ? "DELIVERED" : (status === "CANCELLED" ? "FAILED" : "EN_ROUTE"),
        estimatedMinutes: 28 + (i % 12),
        delayMinutes: status === "CANCELLED" ? 18 : (i % 4 === 0 ? 9 : 0),
      },
    });

    // Add support tickets for cancelled or delayed orders
    if (status === "CANCELLED" || i % 6 === 0) {
      await prisma.supportTicket.create({
        data: {
          ticketNumber: `TKT-NC-${1000 + i}`,
          orderId: ord.id,
          customerId: cust.id,
          issueType: status === "CANCELLED" ? "STALE_INVENTORY" : "DELIVERY_DELAY",
          status: i % 3 === 0 ? "OPEN" : "RESOLVED",
          priority: status === "CANCELLED" ? "HIGH" : "MEDIUM",
          refundAmount: status === "CANCELLED" ? 486 : 0,
          notes: status === "CANCELLED"
            ? "Customer reported ordered milk was out of stock when delivery partner reached store."
            : "Delivery partner delayed by 18 minutes past committed delivery window.",
        },
      });
    }
  }

  // 7. Promotions (Targeted, non-blanket per prompt)
  const promo1 = await prisma.promotion.create({
    data: {
      code: "RETENTION40",
      title: "Second-Order Recovery Incentive",
      description: "Targeted ₹40 discount on ₹299 basket for customers whose 1st order was >30 days ago",
      targetSegment: "SECOND_ORDER_RISK",
      discountType: "FIXED",
      discountValue: 40,
      minOrderValue: 299,
      totalBudget: 250000,
      spentBudget: 62000,
      isActive: true,
      isApproved: true,
      validUntil: new Date(Date.now() + 60 * 24 * 3600 * 1000),
    },
  });

  await prisma.promotion.create({
    data: {
      code: "FRESHSTART50",
      title: "At-Risk Cohort Reactivation",
      description: "₹50 voucher on fresh produce basket >₹399 for 45+ day inactive customers",
      targetSegment: "AT_RISK",
      discountType: "FIXED",
      discountValue: 50,
      minOrderValue: 399,
      totalBudget: 150000,
      spentBudget: 34000,
      isActive: true,
      isApproved: true,
      validUntil: new Date(Date.now() + 45 * 24 * 3600 * 1000),
    },
  });

  // Create coupon for Rahul Sharma
  await prisma.coupon.create({
    data: {
      promotionId: promo1.id,
      customerId: "cust_rahul",
      code: "RETENTION40-RAHUL",
      status: "AVAILABLE",
    },
  });

  console.log("✅ Nova Cart Database Seeding Complete!");
  console.log(`   - 12 Partner Stores`);
  console.log(`   - 25 Customers`);
  console.log(`   - ${allProducts.length} Products`);
  console.log(`   - 51 Orders including Priority Order #NC1042`);
  console.log(`   - Inventories, Deliveries, Tickets, Promotions seeded.`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
