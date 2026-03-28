-- Creating the CodeFox CRM Database
CREATE DATABASE IF NOT EXISTS codefox_crm;
USE codefox_crm;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Editor') DEFAULT 'Admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Posts (Blog) Table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(100),
    image VARCHAR(255),
    content LONGTEXT,
    status ENUM('draft', 'published') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Projects (Blog) Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL,
    project_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Initial Demo Administrator User
-- The password generated here evaluates to: admin123
INSERT INTO users (name, email, password, role) 
VALUES ('CodeFox Admin', 'admin@codefoxit.com', '$2b$10$H/AOAjtzEYKv6YUXFGaVcOF.FeiPI4trQdCOOHcEZJOBUL7EGlm5ojC', 'Admin');



/* 1. Set the database to support modern characters (Emojis, symbols) */
ALTER DATABASE codefox_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

/* 2. Set the posts table to support these characters */
ALTER TABLE posts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

/* 3. Increase the data size limit for the server (requires Admin/Root access) */
SET GLOBAL max_allowed_packet=104857600; /* Sets to 100MB */


/* Add the views column with a default of 0 */
ALTER TABLE posts ADD COLUMN views INT DEFAULT 0;