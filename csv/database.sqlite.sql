BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "bookings" (
	"booking_id"	INTEGER NOT NULL,
	"user_id"	INTEGER NOT NULL,
	"room_id"	INTEGER NOT NULL,
	"hotel_id"	INTEGER NOT NULL,
	"check_in_date"	TEXT NOT NULL,
	"check_out_date"	TEXT NOT NULL,
	"num_guests"	INTEGER NOT NULL,
	"total_price"	REAL NOT NULL,
	"booking_status"	TEXT NOT NULL DEFAULT 'pending' CHECK("booking_status" IN ('pending', 'confirmed', 'cancelled', 'completed')),
	"created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"expires_at"	TEXT,
	PRIMARY KEY("booking_id" AUTOINCREMENT),
	FOREIGN KEY("hotel_id") REFERENCES "hotels"("hotel_id"),
	FOREIGN KEY("room_id") REFERENCES "rooms"("room_id"),
	FOREIGN KEY("user_id") REFERENCES "users"("user_id")
);
CREATE TABLE IF NOT EXISTS "hotel_images" (
	"image_id"	INTEGER NOT NULL,
	"hotel_id"	INTEGER NOT NULL,
	"image_url"	TEXT NOT NULL,
	"description"	TEXT,
	PRIMARY KEY("image_id" AUTOINCREMENT),
	FOREIGN KEY("hotel_id") REFERENCES "hotels"("hotel_id")
);
CREATE TABLE IF NOT EXISTS "hotels" (
	"hotel_id"	INTEGER NOT NULL,
	"owner_id"	INTEGER NOT NULL,
	"hotel_name"	TEXT NOT NULL,
	"description"	TEXT,
	"address"	TEXT NOT NULL,
	"city"	TEXT NOT NULL,
	"country"	TEXT NOT NULL,
	"contact_phone"	TEXT,
	"contact_email"	TEXT,
	"status"	TEXT NOT NULL DEFAULT 'pending' CHECK("status" IN ('pending', 'approved', 'rejected', 'deleted')),
	"created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"amenities"	TEXT,
	PRIMARY KEY("hotel_id" AUTOINCREMENT),
	FOREIGN KEY("owner_id") REFERENCES "users"("user_id")
);
CREATE TABLE IF NOT EXISTS "payments" (
	"payment_id"	INTEGER NOT NULL,
	"booking_id"	INTEGER NOT NULL UNIQUE,
	"amount"	REAL NOT NULL,
	"payment_method"	TEXT,
	"payment_status"	TEXT NOT NULL CHECK("payment_status" IN ('pending', 'completed', 'failed')),
	"payment_date"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("payment_id" AUTOINCREMENT),
	FOREIGN KEY("booking_id") REFERENCES "bookings"("booking_id")
);
CREATE TABLE IF NOT EXISTS "ratings" (
	"rating_id"	INTEGER NOT NULL,
	"booking_id"	INTEGER NOT NULL UNIQUE,
	"user_id"	INTEGER NOT NULL,
	"hotel_id"	INTEGER NOT NULL,
	"rating"	INTEGER NOT NULL CHECK("rating" BETWEEN 1 AND 5),
	"created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("rating_id" AUTOINCREMENT),
	FOREIGN KEY("booking_id") REFERENCES "bookings"("booking_id"),
	FOREIGN KEY("hotel_id") REFERENCES "hotels"("hotel_id"),
	FOREIGN KEY("user_id") REFERENCES "users"("user_id")
);
CREATE TABLE IF NOT EXISTS "rooms" (
	"room_id"	INTEGER NOT NULL,
	"hotel_id"	INTEGER NOT NULL,
	"room_type"	TEXT NOT NULL,
	"price_per_night"	REAL NOT NULL,
	"max_guests"	INTEGER NOT NULL,
	"beds"	INTEGER NOT NULL DEFAULT 1,
	"quantity"	INTEGER NOT NULL,
	PRIMARY KEY("room_id" AUTOINCREMENT),
	FOREIGN KEY("hotel_id") REFERENCES "hotels"("hotel_id")
);
CREATE TABLE IF NOT EXISTS "users" (
	"user_id"	INTEGER NOT NULL,
	"email"	TEXT NOT NULL UNIQUE,
	"password_hash"	TEXT NOT NULL,
	"first_name"	TEXT,
	"last_name"	TEXT,
	"phone_number"	TEXT,
	"role"	TEXT NOT NULL DEFAULT 'user' CHECK("role" IN ('user', 'hotel', 'admin')),
	"created_at"	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("user_id" AUTOINCREMENT)
);
-- INSERT INTO "bookings" VALUES (1,1,1,1,'2025-09-15','2025-09-18',2,7500.0,'completed','2025-09-13 11:44:39',NULL);
-- INSERT INTO "bookings" VALUES (2,2,4,2,'2025-09-20','2025-09-22',2,2400.0,'cancelled','2025-09-13 11:44:39','2025-09-24 07:51:53');
-- INSERT INTO "bookings" VALUES (3,1,6,3,'2025-10-05','2025-10-10',2,17500.0,'completed','2025-09-13 11:44:39',NULL);
-- INSERT INTO "bookings" VALUES (4,4,9,4,'2025-12-01','2025-12-05',4,12800.0,'completed','2025-09-13 11:44:39',NULL);
-- INSERT INTO "bookings" VALUES (5,1,4,2,'2025-09-23','2025-09-20',2,2400.0,'completed','2025-09-23 17:51:09',NULL);
-- INSERT INTO "bookings" VALUES (6,1,1,1,'2025-09-23','2025-09-25',2,5000.0,'cancelled','2025-09-23 17:54:54','2025-09-24 07:51:53');
-- INSERT INTO "bookings" VALUES (7,1,8,4,'2025-09-23','2025-09-25',1,7200.0,'cancelled','2025-09-23 18:04:54','2025-09-24 07:51:53');
-- INSERT INTO "bookings" VALUES (8,1,8,4,'2025-09-23','2025-09-25',1,3600.0,'cancelled','2025-09-23 18:06:07','2025-09-24 07:51:53');
-- INSERT INTO "bookings" VALUES (9,1,8,4,'2025-09-24','2025-09-26',1,3600.0,'completed','2025-09-23 18:06:30',NULL);
-- INSERT INTO "bookings" VALUES (10,1,8,4,'2025-09-23','2025-09-25',1,3600.0,'completed','2025-09-23 18:06:44',NULL);
-- INSERT INTO "bookings" VALUES (11,1,9,4,'2025-09-23','2025-09-25',1,6400.0,'completed','2025-09-23 18:17:03',NULL);
-- INSERT INTO "bookings" VALUES (12,1,8,4,'2025-09-23','2025-09-25',1,3600.0,'completed','2025-09-24 07:17:03',NULL);
-- INSERT INTO "bookings" VALUES (13,1,1,1,'2025-09-24','2025-09-26',1,5000.0,'cancelled','2025-09-24 07:41:50','2025-09-24T07:56:50.806Z');
-- INSERT INTO "bookings" VALUES (14,1,4,2,'2025-09-23','2025-09-25',1,2400.0,'completed','2025-09-24 07:47:04','2025-09-24T08:02:04.920Z');
-- INSERT INTO "bookings" VALUES (15,1,1,1,'2025-09-20','2025-09-23',2,3000.0,'completed','2025-09-25 13:23:33',NULL);
-- INSERT INTO "bookings" VALUES (16,1,9,4,'2025-09-23','2025-09-24',1,3200.0,'completed','2025-09-25 13:26:41','2025-09-25T13:41:41.384Z');
-- INSERT INTO "bookings" VALUES (17,9,1,1,'2025-10-15','2025-10-17',2,5000.0,'completed','2025-09-26 09:37:07',NULL);
-- INSERT INTO "bookings" VALUES (18,4,12,10,'2025-10-05','2025-10-07',1,2000.0,'confirmed','2025-10-06 14:11:52','2025-10-06T14:26:52.003Z');
-- INSERT INTO "hotel_images" VALUES (1,1,'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop','ภาพหลักโรงแรม Sabai');
-- INSERT INTO "hotel_images" VALUES (2,2,'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1170&auto=format&fit=crop','ภาพหลัก Chill Resort');
-- INSERT INTO "hotel_images" VALUES (3,1,'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop','ภาพหลักโรงแรม Sabai');
-- INSERT INTO "hotel_images" VALUES (4,2,'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg','ภาพหลัก Chill Resort');
-- INSERT INTO "hotel_images" VALUES (5,1,'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop','Main Lobby');
-- INSERT INTO "hotel_images" VALUES (6,1,'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop','Deluxe Room');
-- INSERT INTO "hotel_images" VALUES (7,2,'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop','Front View');
-- INSERT INTO "hotel_images" VALUES (8,2,'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop','Standard Room');
-- INSERT INTO "hotel_images" VALUES (11,4,'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop','Playground');
-- INSERT INTO "hotel_images" VALUES (12,4,'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop','Family Suite Room');
-- INSERT INTO "hotel_images" VALUES (15,3,'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop',NULL);
-- INSERT INTO "hotel_images" VALUES (16,3,'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1170&auto=format&fit=crop',NULL);
-- INSERT INTO "hotels" VALUES (1,1,'Sabai Hotel','โรงแรมใจกลางกรุงเทพ ใกล้ BTS','123 ถนนสุขุมวิท','กรุงเทพ','ไทย','021234567','contact@sabaihotel.com','approved','2025-09-10 07:35:30','WiFi, สระว่ายน้ำ');
-- INSERT INTO "hotels" VALUES (2,1,'Chill Resort','รีสอร์ทบรรยากาศดี เหมาะสำหรับครอบครัว','456 ถนนพระราม 9','กรุงเทพ','ไทย','022345678','info@chillresort.com','approved','2025-09-10 07:35:30','ฟิตเนส, อาหารเช้า');
-- INSERT INTO "hotels" VALUES (3,3,'Sabai Hotel2','โรงแรมใจกลางกรุงเทพ ใกล้ BTS','123 ถนนสุขุมวิท','กรุงเทพ','ไทย','021234567','contact@sabaihotel.com','approved','2025-09-10 07:39:41','WiFi, สระว่ายน้ำ, test');
-- INSERT INTO "hotels" VALUES (4,3,'Chill Resort','รีสอร์ทบรรยากาศดี เหมาะสำหรับครอบครัว','456 ถนนพระราม 9','กรุงเทพ','ไทย','022345678','info@chillresort.com','approved','2025-09-10 07:39:41','ฟิตเนส, อาหารเช้า');
-- INSERT INTO "hotels" VALUES (5,3,'Bangkok Grand Hotel','Luxury hotel in Bangkok','123 Sukhumvit Rd','กรุงเทพ','ไทย','021234567','contact@bangkokgrand.com','approved','2025-09-13 11:44:39','Pool, Spa, WiFi, Fitness Center');
-- INSERT INTO "hotels" VALUES (6,3,'Chiang Mai Cozy Inn','Affordable stay in Chiang Mai','456 Nimmanhaemin Rd','เชียงใหม่','ไทย','053765432','info@cmcozy.com','approved','2025-09-13 11:44:39','Free Parking, WiFi');
-- INSERT INTO "hotels" VALUES (7,3,'Phuket Paradise Resort','Beachfront resort with sea view rooms','789 Patong Beach Rd','ภูเก็ต','ไทย','076222333','hello@phuketparadise.com','approved','2025-09-13 11:44:39','Beach Access, Pool, Bar, WiFi');
-- INSERT INTO "hotels" VALUES (8,3,'Hua Hin Family Hotel','Family-friendly hotel near the beach','101 Hua Hin Rd','หัวหิน','ไทย','032999888','contact@huahinfamily.com','pending','2025-09-13 11:44:39','Playground, Pool, Restaurant, WiFi');
-- INSERT INTO "hotels" VALUES (9,2,'Sea View Resort',X'c3d5cacdc3ecb7c3d4c1b7d0e0c5cac7c2a7d2c1',X'31323320b6b9b9aad2c2cbd2b420bad2a7e1cab9',X'aac5bad8c3d5',X'e4b7c2','038-123456','seaview@resort.com','rejected','2025-09-26 09:35:39',X'cac3d0c7e8d2c2b9e9d32c20bfd4b5e0b9ca2c20cabbd2');
-- INSERT INTO "hotels" VALUES (10,3,'test','test','test','กรุงเทพ','ไทย','0812345678','test@gmail.com','deleted','2025-10-06 14:03:07','test');
-- INSERT INTO "payments" VALUES (1,1,7500.0,'Credit Card','completed','2025-09-13 11:44:39');
-- INSERT INTO "payments" VALUES (2,2,2400.0,'Bank Transfer','pending','2025-09-13 11:44:39');
-- INSERT INTO "payments" VALUES (3,3,17500.0,'PayPal','completed','2025-09-13 11:44:39');
-- INSERT INTO "payments" VALUES (4,4,12800.0,'Credit Card','completed','2025-09-13 11:44:39');
-- INSERT INTO "payments" VALUES (5,11,6400.0,'PromptPay','completed','2025-09-23 18:17:16');
-- INSERT INTO "payments" VALUES (6,12,3600.0,'PromptPay','completed','2025-09-24 07:17:24');
-- INSERT INTO "payments" VALUES (7,5,2400.0,'PromptPay','completed','2025-09-24 07:30:18');
-- INSERT INTO "payments" VALUES (8,16,3200.0,'PromptPay','completed','2025-09-25 13:26:43');
-- INSERT INTO "payments" VALUES (9,18,2000.0,'PromptPay','completed','2025-10-06 14:11:53');
-- INSERT INTO "ratings" VALUES (1,1,2,1,5,'2025-09-10 07:35:30');
-- INSERT INTO "ratings" VALUES (2,2,2,2,4,'2025-09-10 07:35:30');
-- INSERT INTO "ratings" VALUES (3,3,4,1,5,'2025-09-13 11:50:12');
-- INSERT INTO "ratings" VALUES (4,14,1,2,5,'2025-09-25 12:59:38');
-- INSERT INTO "rooms" VALUES (1,1,'Deluxe',2500.0,2,1,10);
-- INSERT INTO "rooms" VALUES (2,1,'Suite',4000.0,4,2,5);
-- INSERT INTO "rooms" VALUES (3,1,'Executive',6000.0,4,2,3);
-- INSERT INTO "rooms" VALUES (4,2,'Standard',1200.0,2,1,15);
-- INSERT INTO "rooms" VALUES (5,2,'Family',2000.0,4,2,8);
-- INSERT INTO "rooms" VALUES (8,4,'Standard',1800.0,2,1,20);
-- INSERT INTO "rooms" VALUES (9,4,'Family Suite',3200.0,5,3,10);
-- INSERT INTO "rooms" VALUES (10,9,'Deluxe Sea View',3500.0,2,1,10);
-- INSERT INTO "rooms" VALUES (12,10,'test',1000.0,1,1,1);
-- INSERT INTO "rooms" VALUES (16,3,'Sea View',3500.0,2,1,12);
-- INSERT INTO "rooms" VALUES (17,3,'Villa',7000.0,6,3,6);
-- INSERT INTO "users" VALUES (1,'66070083@kmitl.ac.th','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','thanasit','tungjai','1234567890','user','2025-09-06 07:08:18');
-- INSERT INTO "users" VALUES (2,'66070080@kmitl.ac.th','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','Thanaphat','malikaew','0649515415','user','2025-09-06 08:44:17');
-- INSERT INTO "users" VALUES (3,'owner1@example.com','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','Owner','One','0812345678','hotel','2025-09-10 07:39:40');
-- INSERT INTO "users" VALUES (4,'user1@example.com','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','User','One','0898765432','user','2025-09-10 07:39:40');
-- INSERT INTO "users" VALUES (6,'admin@sabai-booking.com','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9','Admin','System','099-999-9999','admin','2025-09-19 08:20:33');
-- INSERT INTO "users" VALUES (7,'test@gmail.com','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','test1','test1','1234567890','user','2025-09-20 09:05:08');
-- INSERT INTO "users" VALUES (8,'user5@gmail.com','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','user5','user5','1234567890','user','2025-09-20 09:11:43');
-- INSERT INTO "users" VALUES (9,'somchai@gmail.com','hashed123',X'cac1aad2c2',X'e3a8b4d5','081-234-5678','user','2025-09-26 09:35:58');
-- INSERT INTO "users" VALUES (10,'malee@yahoo.com','hashed456',X'c1d2c5d5',X'cad8a2e3ca','089-876-5432','user','2025-09-26 09:36:18');
-- INSERT INTO "users" VALUES (11,'owner2@example.com','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','owner2','owner2','1234567890','hotel','2025-10-06 12:45:12');
-- INSERT INTO "users" VALUES (12,'660700832323@kmitl.ac.th','5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5','test1','user5','1234567890','hotel','2025-10-06 12:52:54');
-- COMMIT;
