import { db } from "@/database";
import { categories } from "@/database/schema";

//TODO: Create a script to seed the categories
const categoryNames = [
  // Main Categories
  "Entertainment",
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Education",
  "Science & Technology",
  "Travel & Events",
  "Howto & Style",
  "Film & Animation",
  "Comedy",
  "People & Blogs",
  "Autos & Vehicles",
  "Pets & Animals",
  "Nonprofits & Activism",

  // Entertainment Subcategories
  "Movies",
  "TV Shows",
  "Celebrity News",
  "Reality TV",
  "Talk Shows",

  // Music Subcategories
  "Pop Music",
  "Rock Music",
  "Hip Hop",
  "Classical",
  "Electronic Music",
  "Country Music",
  "Jazz",
  "World Music",

  // Gaming Subcategories
  "Action Games",
  "Strategy Games",
  "RPG Games",
  "Sports Games",
  "Racing Games",
  "Simulation Games",
  "Mobile Gaming",
  "Esports",

  // Education Subcategories
  "Tutorials",
  "Language Learning",
  "Academic Courses",
  "Tech Tutorials",
  "Cooking Tutorials",
  "DIY & Crafts",

  // Science & Technology Subcategories
  "Tech Reviews",
  "Programming",
  "Artificial Intelligence",
  "Space & Astronomy",
  "Physics",
  "Chemistry",
  "Biology",

  // Sports Subcategories
  "Football",
  "Basketball",
  "Baseball",
  "Soccer",
  "Tennis",
  "Golf",
  "Olympics",
  "Extreme Sports",

  // Travel & Events Subcategories
  "Travel Vlogs",
  "Food & Dining",
  "Adventure Travel",
  "Cultural Events",
  "Festivals",

  // Film & Animation Subcategories
  "Short Films",
  "Animation",
  "Documentary",
  "Movie Reviews",
  "Film Making",

  // People & Blogs Subcategories
  "Vlogs",
  "Lifestyle",
  "Fashion",
  "Beauty",
  "Fitness",
  "Health",

  // Autos & Vehicles Subcategories
  "Car Reviews",
  "Motorcycles",
  "Racing",
  "Auto Repair",
  "Electric Vehicles",

  // Pets & Animals Subcategories
  "Dogs",
  "Cats",
  "Wildlife",
  "Animal Rescue",
  "Pet Care",

  // Additional Categories
  "Business",
  "Finance",
  "Politics",
  "Religion",
  "Philosophy",
  "Art",
  "Photography",
  "Dance",
  "Fashion & Style",
  "Food & Cooking",
  "Parenting",
  "Relationships",
  "Self Improvement",
  "Social Issues",
  "Technology News",
];

async function main() {
  console.log("Seeding categories...");

  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `This is the description for ${name.toLowerCase()}`,
    }));

    await db.insert(categories).values(values);
    console.log("Categories seeded successfully");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

main();
