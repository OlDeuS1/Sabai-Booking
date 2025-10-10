--
-- File generated with SQLiteStudio v3.4.4 on ?. ?.?. 10 10:46:09 2025
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: bookings
CREATE TABLE IF NOT EXISTS "bookings" (
    "booking_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL, -- FK ??????????????????????
    "room_id" INTEGER NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "check_in_date" TEXT NOT NULL,
    "check_out_date" TEXT NOT NULL,
    "num_guests" INTEGER NOT NULL,
    "total_price" REAL NOT NULL,
    "booking_status" TEXT NOT NULL CHECK (
        "booking_status" IN (
            'pending',
            'confirmed',
            'cancelled',
            'completed'
        )
    ) DEFAULT 'pending',
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, expires_at TEXT,
    PRIMARY KEY ("booking_id" AUTOINCREMENT),
    FOREIGN KEY ("user_id") REFERENCES "users" ("user_id"),
    FOREIGN KEY ("room_id") REFERENCES "rooms" ("room_id"),
    FOREIGN KEY ("hotel_id") REFERENCES "hotels" ("hotel_id")
);
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (1, 1, 1, 1, '2025-09-15', '2025-09-18', 2, 7500.0, 'completed', '2025-09-13 11:44:39', NULL);
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (2, 2, 4, 2, '2025-09-20', '2025-09-22', 2, 2400.0, 'cancelled', '2025-09-13 11:44:39', '2025-09-24 07:51:53');
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (3, 1, 6, 3, '2025-10-05', '2025-10-10', 2, 17500.0, 'completed', '2025-09-13 11:44:39', NULL);
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (4, 4, 9, 4, '2025-12-01', '2025-12-05', 4, 12800.0, 'completed', '2025-09-13 11:44:39', NULL);
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (5, 1, 4, 2, '2025-09-23', '2025-09-20', 2, 2400.0, 'completed', '2025-09-23 17:51:09', NULL);
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (6, 1, 1, 1, '2025-09-23', '2025-09-25', 2, 5000.0, 'cancelled', '2025-09-23 17:54:54', '2025-09-24 07:51:53');
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (7, 1, 8, 4, '2025-09-23', '2025-09-25', 1, 7200.0, 'cancelled', '2025-09-23 18:04:54', '2025-09-24 07:51:53');
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (8, 1, 8, 4, '2025-09-23', '2025-09-25', 1, 3600.0, 'cancelled', '2025-09-23 18:06:07', '2025-09-24 07:51:53');
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (9, 1, 8, 4, '2025-09-24', '2025-09-26', 1, 3600.0, 'completed', '2025-09-23 18:06:30', NULL);
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (10, 1, 8, 4, '2025-09-23', '2025-09-25', 1, 3600.0, 'completed', '2025-09-23 18:06:44', NULL);
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (11, 1, 9, 4, '2025-09-23', '2025-09-25', 1, 6400.0, 'completed', '2025-09-23 18:17:03', NULL);
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (12, 1, 8, 4, '2025-09-23', '2025-09-25', 1, 3600.0, 'completed', '2025-09-24 07:17:03', NULL);
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (13, 1, 1, 1, '2025-09-24', '2025-09-26', 1, 5000.0, 'cancelled', '2025-09-24 07:41:50', '2025-09-24T07:56:50.806Z');
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (14, 1, 4, 2, '2025-09-23', '2025-09-25', 1, 2400.0, 'completed', '2025-09-24 07:47:04', '2025-09-24T08:02:04.920Z');
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (15, 1, 1, 1, '2025-09-20', '2025-09-23', 2, 3000.0, 'completed', '2025-09-25 13:23:33', NULL);
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (16, 1, 9, 4, '2025-09-23', '2025-09-24', 1, 3200.0, 'completed', '2025-09-25 13:26:41', '2025-09-25T13:41:41.384Z');
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (17, 9, 1, 1, '2025-10-15', '2025-10-17', 2, 5000.0, 'completed', '2025-09-26 09:37:07', NULL);
INSERT INTO bookings (booking_id, user_id, room_id, hotel_id, check_in_date, check_out_date, num_guests, total_price, booking_status, created_at, expires_at) VALUES (18, 4, 12, 10, '2025-10-05', '2025-10-07', 1, 2000.0, 'confirmed', '2025-10-06 14:11:52', '2025-10-06T14:26:52.003Z');

-- Table: hotel_images
CREATE TABLE IF NOT EXISTS "hotel_images" (
    "image_id" INTEGER NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "description" TEXT,
    PRIMARY KEY ("image_id" AUTOINCREMENT),
    FOREIGN KEY ("hotel_id") REFERENCES "hotels" ("hotel_id")
);
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (1, 1, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', '????????????? Sabai');
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (2, 2, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1170&auto=format&fit=crop', '??????? Chill Resort');
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (3, 1, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', '????????????? Sabai');
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (4, 2, 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg', '??????? Chill Resort');
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (5, 1, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Main Lobby');
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (6, 1, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Deluxe Room');
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (7, 2, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Front View');
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (8, 2, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Standard Room');
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (11, 4, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Playground');
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (12, 4, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', 'Family Suite Room');
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (15, 3, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', NULL);
INSERT INTO hotel_images (image_id, hotel_id, image_url, description) VALUES (16, 3, 'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop', NULL);

-- Table: hotels
CREATE TABLE IF NOT EXISTS "hotels" (
    "hotel_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "hotel_name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "contact_phone" TEXT,
    "contact_email" TEXT,
    "status" TEXT NOT NULL CHECK (
        "status" IN ('pending', 'approved', 'rejected', 'deleted')
    ) DEFAULT 'pending',
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amenities" TEXT,
    PRIMARY KEY ("hotel_id" AUTOINCREMENT),
    FOREIGN KEY ("owner_id") REFERENCES "users" ("user_id")
);
INSERT INTO hotels (hotel_id, owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, status, created_at, amenities) VALUES (1, 1, 'Sabai Hotel', '??????????????????? ???? BTS', '123 ???????????', '???????', '???', '021234567', 'contact@sabaihotel.com', 'approved', '2025-09-10 07:35:30', 'WiFi, ??????????');
INSERT INTO hotels (hotel_id, owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, status, created_at, amenities) VALUES (2, 1, 'Chill Resort', '????????????????? ???????????????????', '456 ????????? 9', '???????', '???', '022345678', 'info@chillresort.com', 'approved', '2025-09-10 07:35:30', '??????, ?????????');
INSERT INTO hotels (hotel_id, owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, status, created_at, amenities) VALUES (3, 3, 'Sabai Hotel2', '??????????????????? ???? BTS', '123 ???????????', '???????', '???', '021234567', 'contact@sabaihotel.com', 'approved', '2025-09-10 07:39:41', 'WiFi, ??????????, test');
INSERT INTO hotels (hotel_id, owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, status, created_at, amenities) VALUES (4, 3, 'Chill Resort', '????????????????? ???????????????????', '456 ????????? 9', '???????', '???', '022345678', 'info@chillresort.com', 'approved', '2025-09-10 07:39:41', '??????, ?????????');
INSERT INTO hotels (hotel_id, owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, status, created_at, amenities) VALUES (5, 3, 'Bangkok Grand Hotel', 'Luxury hotel in Bangkok', '123 Sukhumvit Rd', '???????', '???', '021234567', 'contact@bangkokgrand.com', 'approved', '2025-09-13 11:44:39', 'Pool, Spa, WiFi, Fitness Center');
INSERT INTO hotels (hotel_id, owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, status, created_at, amenities) VALUES (6, 3, 'Chiang Mai Cozy Inn', 'Affordable stay in Chiang Mai', '456 Nimmanhaemin Rd', '?????????', '???', '053765432', 'info@cmcozy.com', 'approved', '2025-09-13 11:44:39', 'Free Parking, WiFi');
INSERT INTO hotels (hotel_id, owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, status, created_at, amenities) VALUES (7, 3, 'Phuket Paradise Resort', 'Beachfront resort with sea view rooms', '789 Patong Beach Rd', '??????', '???', '076222333', 'hello@phuketparadise.com', 'approved', '2025-09-13 11:44:39', 'Beach Access, Pool, Bar, WiFi');
INSERT INTO hotels (hotel_id, owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, status, created_at, amenities) VALUES (8, 3, 'Hua Hin Family Hotel', 'Family-friendly hotel near the beach', '101 Hua Hin Rd', '??????', '???', '032999888', 'contact@huahinfamily.com', 'pending', '2025-09-13 11:44:39', 'Playground, Pool, Restaurant, WiFi');
INSERT INTO hotels (hotel_id, owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, status, created_at, amenities) VALUES (9, 2, 'Sea View Resort', '??????????????§??', '123 ¶¹¹ª???? º??'', 'ªz???', 'k?', '038-123456', 'seaview@resort.com', 'rejected', '2025-09-26 09:35:39', '??????¹??, ¿???, ??');
INSERT INTO hotels (hotel_id, owner_id, hotel_name, description, address, city, country, contact_phone, contact_email, status, created_at, amenities) VALUES (10, 3, 'test', 'test', 'test', '???????', '???', '0812345678', 'test@gmail.com', 'deleted', '2025-10-06 14:03:07', 'test');

-- Table: payments
CREATE TABLE IF NOT EXISTS "payments" (
    "payment_id" INTEGER NOT NULL,
    "booking_id" INTEGER NOT NULL UNIQUE, -- 1 ??????????? 1 ???????????
    "amount" REAL NOT NULL,
    "payment_method" TEXT, -- ???? 'Credit Card', 'Bank Transfer'
    "payment_status" TEXT NOT NULL CHECK (
        "payment_status" IN (
            'pending',
            'completed',
            'failed'
        )
    ),
    "payment_date" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("payment_id" AUTOINCREMENT),
    FOREIGN KEY ("booking_id") REFERENCES "bookings" ("booking_id")
);
INSERT INTO payments (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (1, 1, 7500.0, 'Credit Card', 'completed', '2025-09-13 11:44:39');
INSERT INTO payments (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (2, 2, 2400.0, 'Bank Transfer', 'pending', '2025-09-13 11:44:39');
INSERT INTO payments (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (3, 3, 17500.0, 'PayPal', 'completed', '2025-09-13 11:44:39');
INSERT INTO payments (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (4, 4, 12800.0, 'Credit Card', 'completed', '2025-09-13 11:44:39');
INSERT INTO payments (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (5, 11, 6400.0, 'PromptPay', 'completed', '2025-09-23 18:17:16');
INSERT INTO payments (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (6, 12, 3600.0, 'PromptPay', 'completed', '2025-09-24 07:17:24');
INSERT INTO payments (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (7, 5, 2400.0, 'PromptPay', 'completed', '2025-09-24 07:30:18');
INSERT INTO payments (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (8, 16, 3200.0, 'PromptPay', 'completed', '2025-09-25 13:26:43');
INSERT INTO payments (payment_id, booking_id, amount, payment_method, payment_status, payment_date) VALUES (9, 18, 2000.0, 'PromptPay', 'completed', '2025-10-06 14:11:53');

-- Table: ratings
CREATE TABLE IF NOT EXISTS "ratings" (
    "rating_id" INTEGER NOT NULL,
    "booking_id" INTEGER NOT NULL UNIQUE, -- ??? rating ????????????????????????
    "user_id" INTEGER NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL CHECK ("rating" BETWEEN 1 AND 5),
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("rating_id" AUTOINCREMENT),
    FOREIGN KEY ("booking_id") REFERENCES "bookings" ("booking_id"),
    FOREIGN KEY ("user_id") REFERENCES "users" ("user_id"),
    FOREIGN KEY ("hotel_id") REFERENCES "hotels" ("hotel_id")
);
INSERT INTO ratings (rating_id, booking_id, user_id, hotel_id, rating, created_at) VALUES (1, 1, 2, 1, 5, '2025-09-10 07:35:30');
INSERT INTO ratings (rating_id, booking_id, user_id, hotel_id, rating, created_at) VALUES (2, 2, 2, 2, 4, '2025-09-10 07:35:30');
INSERT INTO ratings (rating_id, booking_id, user_id, hotel_id, rating, created_at) VALUES (3, 3, 4, 1, 5, '2025-09-13 11:50:12');
INSERT INTO ratings (rating_id, booking_id, user_id, hotel_id, rating, created_at) VALUES (4, 14, 1, 2, 5, '2025-09-25 12:59:38');

-- Table: rooms
CREATE TABLE IF NOT EXISTS "rooms" (
    "room_id" INTEGER NOT NULL,
    "hotel_id" INTEGER NOT NULL,
    "room_type" TEXT NOT NULL, -- ???? 'Standard', 'Deluxe', 'Suite'
    "price_per_night" REAL NOT NULL,
    "max_guests" INTEGER NOT NULL,
    "beds" INTEGER NOT NULL DEFAULT 1,
    "quantity" INTEGER NOT NULL, -- ?????????????????????????????????
    PRIMARY KEY ("room_id" AUTOINCREMENT),
    FOREIGN KEY ("hotel_id") REFERENCES "hotels" ("hotel_id")
);
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES (1, 1, 'Deluxe', 2500.0, 2, 1, 10);
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES (2, 1, 'Suite', 4000.0, 4, 2, 5);
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES (3, 1, 'Executive', 6000.0, 4, 2, 3);
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES (4, 2, 'Standard', 1200.0, 2, 1, 15);
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES (5, 2, 'Family', 2000.0, 4, 2, 8);
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES (8, 4, 'Standard', 1800.0, 2, 1, 20);
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES (9, 4, 'Family Suite', 3200.0, 5, 3, 10);
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES (10, 9, 'Deluxe Sea View', 3500.0, 2, 1, 10);
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES (12, 10, 'test', 1000.0, 1, 1, 1);
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES (16, 3, 'Sea View', 3500.0, 2, 1, 12);
INSERT INTO rooms (room_id, hotel_id, room_type, price_per_night, max_guests, beds, quantity) VALUES (17, 3, 'Villa', 7000.0, 6, 3, 6);

-- Table: users
CREATE TABLE IF NOT EXISTS "users" (
    "user_id" INTEGER NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone_number" TEXT,
    "role" TEXT NOT NULL CHECK (
        "role" IN ('user', 'hotel', 'admin')
    ) DEFAULT 'user', -- ???????????
    "created_at" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("user_id" AUTOINCREMENT)
);
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES (1, '66070083@kmitl.ac.th', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'thanasit', 'tungjai', '1234567890', 'user', '2025-09-06 07:08:18');
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES (2, '66070080@kmitl.ac.th', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'Thanaphat', 'malikaew', '0649515415', 'user', '2025-09-06 08:44:17');
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES (3, 'owner1@example.com', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'Owner', 'One', '0812345678', 'hotel', '2025-09-10 07:39:40');
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES (4, 'user1@example.com', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'User', 'One', '0898765432', 'user', '2025-09-10 07:39:40');
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES (6, 'admin@sabai-booking.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Admin', 'System', '099-999-9999', 'admin', '2025-09-19 08:20:33');
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES (7, 'test@gmail.com', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'test1', 'test1', '1234567890', 'user', '2025-09-20 09:05:08');
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES (8, 'user5@gmail.com', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'user5', 'user5', '1234567890', 'user', '2025-09-20 09:11:43');
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES (9, 'somchai@gmail.com', 'hashed123', '????', '??', '081-234-5678', 'user', '2025-09-26 09:35:58');
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES (10, 'malee@yahoo.com', 'hashed456', '????', '????', '089-876-5432', 'user', '2025-09-26 09:36:18');
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES (11, 'owner2@example.com', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'owner2', 'owner2', '1234567890', 'hotel', '2025-10-06 12:45:12');
INSERT INTO users (user_id, email, password_hash, first_name, last_name, phone_number, role, created_at) VALUES (12, '660700832323@kmitl.ac.th', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', 'test1', 'user5', '1234567890', 'hotel', '2025-10-06 12:52:54');

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
