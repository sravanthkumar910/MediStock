-- ============================================================
-- MediStock - MySQL Database Schema (reference)
-- Note: Spring Boot (Hibernate ddl-auto=update) creates/updates
-- these tables automatically on startup. This file is provided
-- as a readable reference and for manual DB setup if needed.
-- ============================================================

CREATE DATABASE IF NOT EXISTS medistock_db;
USE medistock_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL,          -- ADMIN, PHARMACIST, STAFF
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    oauth_provider VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_number VARCHAR(20),
    email VARCHAR(150),
    address VARCHAR(300),
    notes VARCHAR(500),
    created_at DATETIME,
    updated_at DATETIME
);

CREATE TABLE IF NOT EXISTS medicines (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    category_id BIGINT,
    supplier_id BIGINT,
    quantity INT NOT NULL DEFAULT 0,
    reorder_level INT NOT NULL DEFAULT 20,
    manufacturing_date DATE,
    expiry_date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20),
    description VARCHAR(1000),
    created_at DATETIME,
    updated_at DATETIME,
    CONSTRAINT fk_medicine_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_medicine_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    INDEX idx_medicine_name (name),
    INDEX idx_medicine_batch (batch_number),
    INDEX idx_medicine_expiry (expiry_date)
);

CREATE TABLE IF NOT EXISTS stock_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    medicine_id BIGINT NOT NULL,
    movement_type VARCHAR(20) NOT NULL,  -- STOCK_IN, STOCK_OUT, ADJUSTMENT, EXPIRED_REMOVAL
    quantity_changed INT NOT NULL,
    quantity_after INT NOT NULL,
    performed_by BIGINT,
    remarks VARCHAR(300),
    created_at DATETIME,
    updated_at DATETIME,
    CONSTRAINT fk_stocklog_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
    CONSTRAINT fk_stocklog_user FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS purchase_orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, ORDERED, RECEIVED, CANCELLED
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    created_by BIGINT,
    notes VARCHAR(500),
    created_at DATETIME,
    updated_at DATETIME,
    CONSTRAINT fk_po_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    CONSTRAINT fk_po_user FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    purchase_order_id BIGINT NOT NULL,
    medicine_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    created_at DATETIME,
    updated_at DATETIME,
    CONSTRAINT fk_poi_order FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_poi_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(30) NOT NULL,  -- LOW_STOCK, OUT_OF_STOCK, EXPIRY_WARNING, EXPIRED, PURCHASE_ORDER, SYSTEM
    title VARCHAR(200) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    medicine_id BIGINT,
    user_id BIGINT,
    created_at DATETIME,
    updated_at DATETIME,
    CONSTRAINT fk_notif_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
