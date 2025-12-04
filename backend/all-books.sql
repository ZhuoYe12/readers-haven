-- Delete any existing borrow records first (to avoid foreign key issues)
DELETE FROM borrows;

-- Delete existing books
DELETE FROM books;

-- Insert all books from frontend
INSERT INTO books (title, author, description, genres, cover_image, quantity, available) VALUES

-- Mystery & Thriller
('The Silent Patient', 'Alex Michaelides', 'Alicia Berenson shoots her husband and never speaks again.', '["Mystery", "Thriller", "Psychological"]', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop', 3, 3),
('Gone Girl', 'Gillian Flynn', 'On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne''s fifth wedding anniversary. Presents are being wrapped and reservations are being made when Nick''s clever and beautiful wife disappears.', '["Mystery", "Thriller", "Suspense"]', 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop', 2, 2),
('The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Harriet Vanger, a scion of one of Sweden''s wealthiest families disappeared over forty years ago.', '["Mystery", "Crime", "Thriller"]', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop', 3, 3),
('Big Little Lies', 'Liane Moriarty', 'Big Little Lies follows three women, each at a crossroads.', '["Mystery", "Contemporary", "Drama"]', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop', 2, 2),
('The Da Vinci Code', 'Dan Brown', 'While in Paris, Harvard symbologist Robert Langdon is awakened by a phone call in the dead of the night.', '["Mystery", "Thriller", "Adventure"]', 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=450&fit=crop', 4, 4),
('And Then There Were None', 'Agatha Christie', 'Ten strangers are lured to an isolated island mansion.', '["Mystery", "Classic", "Crime"]', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=450&fit=crop', 3, 3),

-- Science Fiction
('Dune', 'Frank Herbert', 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.', '["Science Fiction", "Adventure", "Epic"]', 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=450&fit=crop', 4, 4),
('The Martian', 'Andy Weir', 'Six days ago, astronaut Mark Watney became one of the first people to walk on Mars.', '["Science Fiction", "Adventure", "Survival"]', 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=300&h=450&fit=crop', 3, 3),
('Foundation', 'Isaac Asimov', 'For twelve thousand years the Galactic Empire has ruled supreme.', '["Science Fiction", "Classic", "Space Opera"]', 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=450&fit=crop', 3, 3),
('Ender''s Game', 'Orson Scott Card', 'In order to develop a secure defense against a hostile alien race''s next attack.', '["Science Fiction", "Military", "Young Adult"]', 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=450&fit=crop', 4, 4),
('Neuromancer', 'William Gibson', 'Case was the sharpest data-thief in the matrix.', '["Science Fiction", "Cyberpunk", "Thriller"]', 'https://images.unsplash.com/photo-1506880135364-e28660dc35fa?w=300&h=450&fit=crop', 2, 2),
('The Hitchhiker''s Guide', 'Douglas Adams', 'Seconds before Earth is demolished to make way for a galactic freeway.', '["Science Fiction", "Comedy", "Adventure"]', 'https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?w=300&h=450&fit=crop', 3, 3),

-- Fantasy
('The Hobbit', 'J.R.R. Tolkien', 'Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life.', '["Fantasy", "Adventure", "Classic"]', 'https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?w=300&h=450&fit=crop', 5, 5),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Harry Potter has never even heard of Hogwarts when the letters start dropping.', '["Fantasy", "Young Adult", "Magic"]', 'https://images.unsplash.com/photo-1618488905203-3b3c9f937111?w=300&h=450&fit=crop', 5, 5),
('A Game of Thrones', 'George R.R. Martin', 'Long ago, in a time forgotten, a preternatural event threw the seasons out of balance.', '["Fantasy", "Epic", "Political"]', 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop', 4, 4),
('The Name of the Wind', 'Patrick Rothfuss', 'Kvothe has come to retire as an innkeeper in a small town.', '["Fantasy", "Adventure", "Magic"]', 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=300&h=450&fit=crop', 3, 3),
('The Way of Kings', 'Brandon Sanderson', 'Roshar is a world of stone and storms.', '["Fantasy", "Epic", "Adventure"]', 'https://images.unsplash.com/photo-1609667083964-f3dbecb7e7a5?w=300&h=450&fit=crop', 3, 3),
('The Chronicles of Narnia', 'C.S. Lewis', 'Four adventurous siblings step through a wardrobe door into the land of Narnia.', '["Fantasy", "Classic", "Adventure"]', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=450&fit=crop', 4, 4);

