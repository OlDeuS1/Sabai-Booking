-- PostgreSQL Data Migration from SQLite
-- INSERT sample data (adjust according to your actual data)

-- Insert Users
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES 
(1, '66070083@kmitl.ac.th', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'thanasit', 'tungjai', '1234567890', 'user', '2025-09-06 07:08:18'),
(2, '66070080@kmitl.ac.th', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'Thanaphat', 'malikaew', '0649515415', 'user', '2025-09-06 08:44:17'),
(3, 'owner1@example.com', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'Owner', 'One', '0812345678', 'hotel', '2025-09-10 07:39:40'),
(4, 'user1@example.com', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'User', 'One', '0898765432', 'user', '2025-09-10 07:39:40'),
(6, 'admin@sabai-booking.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Admin', 'System', '099-999-9999', 'admin', '2025-09-19 08:20:33');

-- Insert Hotels
INSERT INTO hotels (hotel_id, owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, status, created_at, amenities) VALUES 
(1, 1, 'Sabai Hotel', 'โรงแรมใจกลางกรุงเทพ ใกล้ BTS', '123 ถนนสุขุมวิท', 'กรุงเทพ', 'ไทย', '021234567', 'contact@sabaihotel.com', 'approved', '2025-09-10 07:35:30', 'WiFi, สระว่ายน้ำ'),
(2, 1, 'Chill Resort', 'รีสอร์ทบรรยากาศดี เหมาะสำหรับครอบครัว', '456 ถนนพระราม 9', 'กรุงเทพ', 'ไทย', '022345678', 'info@chillresort.com', 'approved', '2025-09-10 07:35:30', 'ฟิตเนส, อาหารเช้า'),
(3, 3, 'Sabai Hotel2', 'โรงแรมใจกลางกรุงเทพ ใกล้ BTS', '123 ถนนสุขุมวิท', 'กรุงเทพ', 'ไทย', '021234567', 'contact@sabaihotel.com', 'approved', '2025-09-10 07:39:41', 'WiFi, สระว่ายน้ำ, test'),
(4, 3, 'Chill Resort', 'รีสอร์ทบรรยากาศดี เหมาะสำหรับครอบครัว', '456 ถนนพระราม 9', 'กรุงเทพ', 'ไทย', '022345678', 'info@chillresort.com', 'approved', '2025-09-10 07:39:41', 'ฟิตเนส, อาหารเช้า');

-- Insert Rooms
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES 
(1, 1, 'Deluxe', 2500.00, 2, 1, 10),
(2, 1, 'Suite', 4000.00, 4, 2, 5),
(3, 1, 'Executive', 6000.00, 4, 2, 3),
(4, 2, 'Standard', 1200.00, 2, 1, 15),
(5, 2, 'Family', 2000.00, 4, 2, 8),
(8, 4, 'Standard', 1800.00, 2, 1, 20),
(9, 4, 'Family Suite', 3200.00, 5, 3, 10);

-- Insert Hotel Images
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES 
(1, 1, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Front View'),
(2, 1, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Lobby'),
(3, 1, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Standard Room'),
(4, 1, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Pool Area'),
(5, 1, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Restaurant'),
(6, 1, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Deluxe Room');

-- Reset sequences to proper values
SELECT setval('users_user_id_seq', COALESCE((SELECT MAX(user_id) FROM users), 1));
SELECT setval('hotels_hotel_id_seq', COALESCE((SELECT MAX(hotel_id) FROM hotels), 1));
SELECT setval('rooms_room_id_seq', COALESCE((SELECT MAX(room_id) FROM rooms), 1));
SELECT setval('hotel_images_image_id_seq', COALESCE((SELECT MAX(image_id) FROM hotel_images), 1));
SELECT setval('bookings_booking_id_seq', COALESCE((SELECT MAX(booking_id) FROM bookings), 1));
SELECT setval('payments_payment_id_seq', COALESCE((SELECT MAX(payment_id) FROM payments), 1));
SELECT setval('ratings_rating_id_seq', COALESCE((SELECT MAX(rating_id) FROM ratings), 1));