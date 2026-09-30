-- Optional sample data for local development / demos.
USE medistock_db;

INSERT INTO categories (name, description, created_at, updated_at) VALUES
 ('Analgesics', 'Pain relief medication', NOW(), NOW()),
 ('Antibiotics', 'Bacterial infection treatment', NOW(), NOW()),
 ('Antacids', 'Digestive / acidity relief', NOW(), NOW()),
 ('Vitamins & Supplements', 'Nutritional supplements', NOW(), NOW());

INSERT INTO suppliers (name, contact_number, email, address, created_at, updated_at) VALUES
 ('MedSupply Co.', '+91-9876543210', 'contact@medsupply.com', '12 Industrial Area, Chennai', NOW(), NOW()),
 ('PharmaDirect Ltd.', '+91-9123456780', 'sales@pharmadirect.com', '45 Health Park, Bengaluru', NOW(), NOW());

-- Sample medicines (assumes category ids 1-4 and supplier ids 1-2 from above)
INSERT INTO medicines (name, batch_number, category_id, supplier_id, quantity, reorder_level,
                        manufacturing_date, expiry_date, price, unit, created_at, updated_at) VALUES
 ('Paracetamol 500mg', 'BATCH-PARA-001', 1, 1, 500, 50, '2025-01-10', '2027-01-10', 2.50, 'tablets', NOW(), NOW()),
 ('Amoxicillin 250mg', 'BATCH-AMOX-014', 2, 2, 15, 30, '2025-03-01', '2026-09-15', 6.75, 'capsules', NOW(), NOW()),
 ('Antacid Syrup', 'BATCH-ANTA-007', 3, 1, 0, 20, '2024-11-05', '2026-05-20', 45.00, 'bottles', NOW(), NOW()),
 ('Vitamin C 1000mg', 'BATCH-VITC-022', 4, 2, 200, 40, '2025-06-01', '2026-09-30', 8.25, 'tablets', NOW(), NOW());
