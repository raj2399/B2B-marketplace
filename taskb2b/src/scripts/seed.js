const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Listing = require('../models/Listing');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskb2b', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample categories with their attribute schemas
const categories = [
  {
    name: 'Televisions',
    slug: 'televisions',
    attributeSchema: [
      {
        name: 'screenSize',
        type: 'number',
        required: true
      },
      {
        name: 'resolution',
        type: 'string',
        required: true,
        options: ['4K', '8K', '1080p']
      },
      {
        name: 'smartTV',
        type: 'boolean',
        required: true
      }
    ]
  },
  {
    name: 'Running Shoes',
    slug: 'running-shoes',
    attributeSchema: [
      {
        name: 'size',
        type: 'number',
        required: true
      },
      {
        name: 'color',
        type: 'string',
        required: true
      },
      {
        name: 'gender',
        type: 'string',
        required: true,
        options: ['Men', 'Women', 'Unisex']
      }
    ]
  }
];

// Function to generate random listings for a category
const generateListings = (category, count) => {
  const listings = [];
  
  for (let i = 0; i < count; i++) {
    const listing = {
      title: `${category.name} Item ${i + 1}`,
      description: `A great ${category.name.toLowerCase()} product with amazing features.`,
      price: Math.floor(Math.random() * 1000) + 100,
      location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'][Math.floor(Math.random() * 5)],
      categoryId: category._id,
      attributes: {}
    };

    // Add dynamic attributes based on category
    if (category.slug === 'televisions') {
      listing.attributes = {
        screenSize: Math.floor(Math.random() * 30) + 32,
        resolution: ['4K', '8K', '1080p'][Math.floor(Math.random() * 3)],
        smartTV: Math.random() > 0.2
      };
    } else if (category.slug === 'running-shoes') {
      listing.attributes = {
        size: Math.floor(Math.random() * 6) + 6,
        color: ['Black', 'White', 'Red', 'Blue', 'Grey'][Math.floor(Math.random() * 5)],
        gender: ['Men', 'Women', 'Unisex'][Math.floor(Math.random() * 3)]
      };
    }

    listings.push(listing);
  }

  return listings;
};

// Seed the database
async function seed() {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Listing.deleteMany({});

    // Insert categories
    const savedCategories = await Category.insertMany(categories);
    console.log('Categories seeded successfully');

    // Generate and insert listings
    const allListings = [];
    for (const category of savedCategories) {
      const listings = generateListings(category, 15); // 15 listings per category
      allListings.push(...listings);
    }

    await Listing.insertMany(allListings);
    console.log('Listings seeded successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed(); 