// MongoDB seed script for Ecommerce application
// Run this in mongosh: mongosh < seed-data.js
// Or in mongosh shell: load('seed-data.js')

// Use your database (change if needed)
// use ecommerce;

db.products.drop();
print("Dropped products collection");

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPrice(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randomDateWithinDays(days) {
  const now = new Date();
  const past = new Date(now.getTime() - randomInt(0, days) * 24 * 60 * 60 * 1000);
  return past;
}

const categories = {
  Electronics: {
    sub: ["Laptops", "Mobiles", "Tablets", "Headphones", "Cameras"],
    brands: ["Apple", "Samsung", "Dell", "HP", "Sony", "Lenovo", "OnePlus"]
  },
  Fashion: {
    sub: ["Clothes", "Sneakers", "Jackets", "Accessories", "Watches"],
    brands: ["Nike", "Adidas", "Puma", "Zara", "H&M", "Levi's"]
  },
  Beauty: {
    sub: ["Skincare", "Makeup", "Fragrance", "Haircare", "Nails"],
    brands: ["L'Oreal", "Maybelline", "Dove", "Nivea", "Lakme"]
  },
  Sports: {
    sub: ["Cricket", "Football", "Fitness", "Cycling", "Tennis"],
    brands: ["Nivia", "SS", "Yonex", "Decathlon", "Reebok", "Cosco"]
  },
  Home: {
    sub: ["Furniture", "Kitchen", "Decor", "Lighting", "Storage"],
    brands: ["IKEA", "Home Centre", "Urban Ladder", "Pepperfry"]
  }
};

const availabilityValues = ["IN_STOCK", "OUT_OF_STOCK", "PREORDER"];

const docs = [];

let counter = 1;

Object.entries(categories).forEach(([mainCat, cfg]) => {
  cfg.sub.forEach(subCat => {
    const count = 20; // 20 products per subcategory
    for (let i = 0; i < count; i++) {
      const brand = randomFrom(cfg.brands);
      const price = randomPrice(500, 150000);
      const discount = Math.random() < 0.5 ? randomInt(5, 40) : null;
      const stock = randomInt(0, 500);
      const rating = Math.round((Math.random() * 4 + 1) * 10) / 10; // 1.0 - 5.0
      const reviewCount = randomInt(0, 2000);
      const salesCount = randomInt(0, 5000);
      const viewsCount = randomInt(0, 20000);
      const createdAt = randomDateWithinDays(120);
      const updatedAt = randomDateWithinDays(30);

      // Simple title + description
      const title = `${brand} ${subCat} Product #${counter}`;
      const description = `Sample ${subCat} product in ${mainCat} category with great features and quality`;

      // Features: vary by main category
      const features = [];

      if (mainCat === "Electronics") {
        features.push(
          { key: "ram", value: randomFrom(["8GB", "16GB", "32GB"]) },
          { key: "storage", value: randomFrom(["128GB", "256GB", "512GB", "1TB"]) },
          { key: "color", value: randomFrom(["Black", "Silver", "Gray", "Blue"]) }
        );
      } else if (mainCat === "Fashion") {
        features.push(
          { key: "size", value: randomFrom(["S", "M", "L", "XL"]) },
          { key: "color", value: randomFrom(["Black", "White", "Red", "Blue"]) },
          { key: "material", value: randomFrom(["Cotton", "Polyester", "Leather"]) }
        );
      } else if (mainCat === "Beauty") {
        features.push(
          { key: "skinType", value: randomFrom(["Oily", "Dry", "Combination", "Normal"]) },
          { key: "gender", value: randomFrom(["Men", "Women", "Unisex"]) },
          { key: "volume", value: randomFrom(["50ml", "100ml", "200ml"]) }
        );
      } else if (mainCat === "Sports") {
        features.push(
          { key: "sport", value: subCat },
          { key: "size", value: randomFrom(["S", "M", "L", "XL"]) },
          { key: "color", value: randomFrom(["Red", "Blue", "Green", "Yellow"]) }
        );
      } else if (mainCat === "Home") {
        features.push(
          { key: "material", value: randomFrom(["Wood", "Metal", "Plastic", "Glass"]) },
          { key: "color", value: randomFrom(["White", "Black", "Brown", "Gray"]) }
        );
      }

      const availabilityStatus =
        stock === 0 ? "OUT_OF_STOCK" : randomFrom(availabilityValues);

      docs.push({
        title,
        brand,
        category: subCat,
        categoryPath: [mainCat, subCat],  // IMPORTANT for category navigation
        price,
        discountPercentage: discount,
        stock,
        description,
        availabilityStatus,
        rating,
        reviewCount,
        salesCount,
        viewsCount,
        features,
        createdAt,
        updatedAt
      });

      counter++;
    }
  });
});

db.products.insertMany(docs);
print(`✅ Inserted ${docs.length} products across ${Object.keys(categories).length} categories`);
print("Categories:", Object.keys(categories).join(", "));
print("Sample document:");
printjson(docs[0]);
