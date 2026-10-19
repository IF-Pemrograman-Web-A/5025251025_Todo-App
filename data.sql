CREATE DATABASE IF NOT EXISTS todo_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE todo_app;
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 display_name VARCHAR(100) NOT NULL,
 email VARCHAR(190) NOT NULL UNIQUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE todos (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 owner_id INT UNSIGNED NOT NULL,
 title VARCHAR(150) NOT NULL,
 description TEXT,
 priority ENUM('high','medium','low') NOT NULL DEFAULT 'medium',
 due_date DATE NULL,
 category VARCHAR(50) NOT NULL DEFAULT 'Kuliah',
 completed TINYINT(1) NOT NULL DEFAULT 0,
 scope ENUM('personal','shared') NOT NULL DEFAULT 'personal',
 image_path VARCHAR(255) NULL,
 notification_time DATETIME NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO users(id,display_name,email) VALUES
(1,'Demo User','demo@example.com'),(2,'Elsi','elsi@example.com'),(3,'Pisi','pisi@example.com');
INSERT INTO todos(owner_id,title,description,priority,due_date,category,completed,scope) VALUES
(1,'Tugas Pemrograman Web','Tugas E04: modularisasi PHP dan CRUD database.','high','2026-10-25','Kuliah',0,'personal'),
(1,'Tugas Teori Graf','Selesaikan latihan graf dan cek kembali jawaban.','medium','2026-10-28','Kuliah',0,'personal'),
(2,'Rapat Divisi','Siapkan agenda rapat dan catatan progres.','high','2026-10-22','Organization',0,'shared'),
(3,'Persiapan Presentasi','Bagikan materi presentasi sebelum rapat.','medium','2026-10-24','Organization',1,'shared');
