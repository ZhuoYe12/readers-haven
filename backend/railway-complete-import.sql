-- ========================================
-- COMPLETE DATABASE IMPORT FOR RAILWAY
-- Run this file to create all tables and data
-- ========================================

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS `borrows`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `users`;

-- ========================================
-- 1. CREATE USERS TABLE
-- ========================================
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin','librarian') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 2. CREATE BOOKS TABLE
-- ========================================
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `description` text,
  `genres` json DEFAULT NULL,
  `cover_image` varchar(500) DEFAULT NULL,
  `quantity` int DEFAULT '1',
  `available` int DEFAULT '1',
  `rating_average` decimal(3,2) DEFAULT '0.00',
  `rating_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 3. CREATE BORROWS TABLE
-- ========================================
CREATE TABLE `borrows` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `borrow_type` enum('borrow','reserve') NOT NULL DEFAULT 'borrow',
  `borrow_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date` timestamp NULL DEFAULT NULL,
  `return_date` timestamp NULL DEFAULT NULL,
  `status` enum('active','returned','overdue','reserved') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `borrows_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `borrows_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ========================================
-- 4. INSERT ALL BOOKS DATA
-- ========================================

INSERT INTO `books` (`title`, `author`, `description`, `genres`, `cover_image`, `quantity`, `available`) VALUES
('To Kill a Mockingbird', 'Harper Lee', 'A gripping tale of racial injustice and childhood innocence in the American South.', '["Fiction", "Classic", "Historical"]', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop', 4, 4),
('1984', 'George Orwell', 'A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.', '["Fiction", "Dystopian", "Classic"]', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop', 3, 3),
('Pride and Prejudice', 'Jane Austen', 'A romantic novel of manners that critiques the British landed gentry at the end of the 18th century.', '["Romance", "Classic", "Fiction"]', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop', 5, 5),
('The Silent Patient', 'Alex Michaelides', 'Alicia Berenson shoots her husband and never speaks again. A psychological thriller about a therapist determined to uncover the truth.', '["Mystery", "Thriller", "Psychological"]', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop', 3, 3),
('Gone Girl', 'Gillian Flynn', 'On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne''s fifth wedding anniversary. Presents are being wrapped and reservations are being made when Nick''s clever and beautiful wife disappears.', '["Mystery", "Thriller", "Suspense"]', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop', 2, 2),
('The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Harriet Vanger, a scion of one of Sweden''s wealthiest families disappeared over forty years ago. All these years later, her aged uncle continues to seek the truth.', '["Mystery", "Crime", "Thriller"]', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop', 3, 3),
('Big Little Lies', 'Liane Moriarty', 'Big Little Lies follows three women, each at a crossroads. The story builds to a shocking climax set at a school trivia night.', '["Mystery", "Contemporary", "Drama"]', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop', 2, 2),
('The Da Vinci Code', 'Dan Brown', 'While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night. A murder has occurred in the Louvre.', '["Mystery", "Thriller", "Adventure"]', 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=450&fit=crop', 4, 4),
('And Then There Were None', 'Agatha Christie', 'Ten strangers are lured to an isolated island mansion off the Devon coast by a mysterious host. One by one, they begin to die.', '["Mystery", "Classic", "Crime"]', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=450&fit=crop', 3, 3),
('Dune', 'Frank Herbert', 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.', '["Science Fiction", "Adventure", "Epic"]', 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop', 4, 4),
('The Martian', 'Andy Weir', 'Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. Now, he''s sure he''ll be the first person to die there.', '["Science Fiction", "Adventure", "Survival"]', 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=300&h=450&fit=crop', 3, 3),
('Foundation', 'Isaac Asimov', 'For twelve thousand years the Galactic Empire has ruled supreme. Now it is dying. A revolutionary plan to save humanity is hatched.', '["Science Fiction", "Classic", "Space Opera"]', 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=450&fit=crop', 3, 3),
('Ender''s Game', 'Orson Scott Card', 'In order to develop a secure defense against a hostile alien race''s next attack, government agencies breed child geniuses and train them as soldiers.', '["Science Fiction", "Military", "Young Adult"]', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=450&fit=crop', 4, 4),
('Neuromancer', 'William Gibson', 'Case was the sharpest data-thief in the matrix—until he crossed the wrong people and they crippled his nervous system.', '["Science Fiction", "Cyberpunk", "Thriller"]', 'https://images.unsplash.com/photo-1506880135364-e28660dc35fa?w=300&h=450&fit=crop', 2, 2),
('The Hitchhiker''s Guide', 'Douglas Adams', 'Seconds before Earth is demolished to make way for a galactic freeway, Arthur Dent is plucked off the planet by his friend Ford Prefect.', '["Science Fiction", "Comedy", "Adventure"]', 'https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=300&h=450&fit=crop', 3, 3),
('The Hobbit', 'J.R.R. Tolkien', 'Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life. That changes when Gandalf and a company of dwarves arrive on his doorstep.', '["Fantasy", "Adventure", "Classic"]', 'https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?w=300&h=450&fit=crop', 5, 5),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive.', '["Fantasy", "Young Adult", "Magic"]', 'https://images.unsplash.com/photo-1618488905203-3b3c9f937111?w=300&h=450&fit=crop', 5, 5),
('A Game of Thrones', 'George R.R. Martin', 'Long ago, in a time forgotten, a preternatural event threw the seasons out of balance. In a land where summers can last decades and winters a lifetime.', '["Fantasy", "Epic", "Political"]', 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop', 4, 4),
('The Name of the Wind', 'Patrick Rothfuss', 'Kvothe has come to retire as an innkeeper in a small town. But his past is catching up with him and he tells his story to a Chronicler.', '["Fantasy", "Adventure", "Magic"]', 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=300&h=450&fit=crop', 3, 3),
('The Way of Kings', 'Brandon Sanderson', 'Roshar is a world of stone and storms. It has been centuries since the fall of the ten consecrated orders known as the Knights Radiant.', '["Fantasy", "Epic", "Adventure"]', 'https://images.unsplash.com/photo-1609667083964-f3dbecb7e7a5?w=300&h=450&fit=crop', 3, 3),
('The Chronicles of Narnia', 'C.S. Lewis', 'Four adventurous siblings step through a wardrobe door and into the land of Narnia, a land frozen in eternal winter.', '["Fantasy", "Classic", "Adventure"]', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop', 4, 4);

-- ========================================
-- DONE! Database is ready!
-- ========================================

