require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('../models/Book');

// Connect to database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Sample books data (matching your frontend)
const books = [
  // Mystery & Thriller
  { 
    title: "The Silent Patient", 
    author: "Alex Michaelides", 
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    genres: ["Mystery", "Thriller", "Psychological"],
    description: "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
    quantity: 3,
    available: 3,
    pages: 336,
    language: "English"
  },
  { 
    title: "Gone Girl", 
    author: "Gillian Flynn", 
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
    genres: ["Mystery", "Thriller", "Suspense"],
    description: "On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne's fifth wedding anniversary. Presents are being wrapped and reservations are being made when Nick's clever and beautiful wife disappears. Husband-of-the-Year Nick isn't doing himself any favors with cringe-worthy daydreams about the slope and shape of his wife's head.",
    quantity: 2,
    available: 2,
    pages: 432,
    language: "English"
  },
  // Add more books here (I'll add a few more as examples)
  { 
    title: "Dune", 
    author: "Frank Herbert", 
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop",
    genres: ["Science Fiction", "Adventure", "Epic"],
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness.",
    quantity: 4,
    available: 4,
    pages: 688,
    language: "English"
  },
  { 
    title: "Harry Potter and the Sorcerer's Stone", 
    author: "J.K. Rowling", 
    coverImage: "https://images.unsplash.com/photo-1618488905203-3b3c9f937111?w=300&h=450&fit=crop",
    genres: ["Fantasy", "Young Adult", "Magic"],
    description: "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle.",
    quantity: 5,
    available: 5,
    pages: 309,
    language: "English"
  },
  { 
    title: "Pride and Prejudice", 
    author: "Jane Austen", 
    coverImage: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&h=450&fit=crop",
    genres: ["Romance", "Classic", "Historical"],
    description: "Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work 'her own darling child' and its vivacious heroine, Elizabeth Bennet, 'as delightful a creature as ever appeared in print.'",
    quantity: 3,
    available: 3,
    pages: 432,
    language: "English"
  },
  { 
    title: "1984", 
    author: "George Orwell", 
    coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=450&fit=crop",
    genres: ["Literary Fiction", "Dystopian", "Classic"],
    description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.",
    quantity: 4,
    available: 4,
    pages: 328,
    language: "English"
  }
  // You can add all 72 books from your frontend here
];

// Seed function
const seedBooks = async () => {
  try {
    // Clear existing books
    await Book.deleteMany();
    console.log('📚 Cleared existing books');

    // Insert new books
    const createdBooks = await Book.insertMany(books);
    console.log(`✅ ${createdBooks.length} books added to database`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

// Run seeder
seedBooks();

