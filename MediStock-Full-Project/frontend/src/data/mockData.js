// Placeholder in-memory data, shaped to match the Spring Boot DTOs
// this frontend will eventually consume from /api/... (see src/services/api.js).

export const CATEGORIES = [
  "Analgesic",
  "Antibiotic",
  "Antipyretic",
  "Antiseptic",
  "Cardiac",
  "Respiratory",
  "Vitamin & Supplement",
  "Diabetic Care",
];

export const initialSuppliers = [
  {
    id: "SUP-1001",
    name: "Vantage Pharma Distributors",
    contact: "+91 98450 12233",
    email: "orders@vantagepharma.in",
    address: "Plot 14, Peenya Industrial Area, Bengaluru",
    medicinesSupplied: 18,
    lastOrder: "2026-08-10",
    performance: 96,
  },
  {
    id: "SUP-1002",
    name: "Sunrise Healthcare Supplies",
    contact: "+91 90031 44210",
    email: "sales@sunrisehc.com",
    address: "42 Anna Salai, Chennai",
    medicinesSupplied: 11,
    lastOrder: "2026-08-14",
    performance: 89,
  },
  {
    id: "SUP-1003",
    name: "MedLine Wholesale Co.",
    contact: "+91 88005 67890",
    email: "support@medlinewholesale.com",
    address: "7th Cross, Sahakar Nagar, Pune",
    medicinesSupplied: 24,
    lastOrder: "2026-08-02",
    performance: 92,
  },
  {
    id: "SUP-1004",
    name: "Nova Bio Traders",
    contact: "+91 97170 33321",
    email: "contact@novabio.in",
    address: "Sector 18, Gurugram",
    medicinesSupplied: 9,
    lastOrder: "2026-07-28",
    performance: 78,
  },
];

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const initialMedicines = [
  {
    id: "MED-0001",
    name: "Paracetamol 500mg",
    batchNumber: "PCM-2401-A",
    category: "Antipyretic",
    supplierId: "SUP-1001",
    quantity: 1240,
    reorderLevel: 300,
    manufacturingDate: "2025-11-02",
    expiryDate: daysFromNow(420),
    price: 2.5,
  },
  {
    id: "MED-0002",
    name: "Amoxicillin 250mg",
    batchNumber: "AMX-2312-C",
    category: "Antibiotic",
    supplierId: "SUP-1003",
    quantity: 85,
    reorderLevel: 150,
    manufacturingDate: "2025-08-19",
    expiryDate: daysFromNow(18),
    price: 6.75,
  },
  {
    id: "MED-0003",
    name: "Ibuprofen 400mg",
    batchNumber: "IBP-2405-B",
    category: "Analgesic",
    supplierId: "SUP-1001",
    quantity: 620,
    reorderLevel: 200,
    manufacturingDate: "2025-12-11",
    expiryDate: daysFromNow(260),
    price: 3.1,
  },
  {
    id: "MED-0004",
    name: "Cetirizine 10mg",
    batchNumber: "CTZ-2403-A",
    category: "Respiratory",
    supplierId: "SUP-1002",
    quantity: 42,
    reorderLevel: 100,
    manufacturingDate: "2025-09-05",
    expiryDate: daysFromNow(6),
    price: 1.9,
  },
  {
    id: "MED-0005",
    name: "Metformin 500mg",
    batchNumber: "MET-2402-D",
    category: "Diabetic Care",
    supplierId: "SUP-1003",
    quantity: 310,
    reorderLevel: 150,
    manufacturingDate: "2025-10-22",
    expiryDate: daysFromNow(140),
    price: 4.2,
  },
  {
    id: "MED-0006",
    name: "Atorvastatin 20mg",
    batchNumber: "ATV-2311-B",
    category: "Cardiac",
    supplierId: "SUP-1004",
    quantity: 0,
    reorderLevel: 80,
    manufacturingDate: "2025-07-14",
    expiryDate: daysFromNow(-4),
    price: 8.4,
  },
  {
    id: "MED-0007",
    name: "Povidone Iodine Solution",
    batchNumber: "PVI-2404-A",
    category: "Antiseptic",
    supplierId: "SUP-1002",
    quantity: 190,
    reorderLevel: 60,
    manufacturingDate: "2025-11-30",
    expiryDate: daysFromNow(310),
    price: 5.6,
  },
  {
    id: "MED-0008",
    name: "Vitamin D3 60K IU",
    batchNumber: "VTD-2401-C",
    category: "Vitamin & Supplement",
    supplierId: "SUP-1004",
    quantity: 275,
    reorderLevel: 100,
    manufacturingDate: "2025-10-01",
    expiryDate: daysFromNow(29),
    price: 12.0,
  },
  {
    id: "MED-0009",
    name: "Azithromycin 500mg",
    batchNumber: "AZM-2402-B",
    category: "Antibiotic",
    supplierId: "SUP-1003",
    quantity: 58,
    reorderLevel: 120,
    manufacturingDate: "2025-09-18",
    expiryDate: daysFromNow(11),
    price: 9.8,
  },
  {
    id: "MED-0010",
    name: "Salbutamol Inhaler",
    batchNumber: "SAL-2312-A",
    category: "Respiratory",
    supplierId: "SUP-1001",
    quantity: 130,
    reorderLevel: 50,
    manufacturingDate: "2025-08-27",
    expiryDate: daysFromNow(95),
    price: 14.3,
  },
];

export const initialUsers = [
  { id: "USR-1", name: "Anita Rao", email: "anita.rao@medistock.app", role: "Admin", status: "Active" },
  { id: "USR-2", name: "Karthik Subramaniam", email: "karthik.s@medistock.app", role: "Pharmacist", status: "Active" },
  { id: "USR-3", name: "Priya Menon", email: "priya.menon@medistock.app", role: "Staff", status: "Active" },
  { id: "USR-4", name: "Ravi Prakash", email: "ravi.prakash@medistock.app", role: "Pharmacist", status: "Invited" },
];

export const initialNotifications = [
  { id: "N-1", type: "expiry", severity: "critical", message: "Atorvastatin 20mg (ATV-2311-B) expired 4 days ago.", time: "2h ago", read: false },
  { id: "N-2", type: "stock", severity: "warning", message: "Cetirizine 10mg is below reorder level (42 / 100).", time: "5h ago", read: false },
  { id: "N-3", type: "expiry", severity: "warning", message: "Azithromycin 500mg expires in 11 days.", time: "1d ago", read: false },
  { id: "N-4", type: "purchase", severity: "info", message: "Purchase order PO-3391 to MedLine Wholesale Co. was received in full.", time: "2d ago", read: true },
  { id: "N-5", type: "stock", severity: "critical", message: "Atorvastatin 20mg is out of stock.", time: "2d ago", read: true },
  { id: "N-6", type: "expiry", severity: "warning", message: "Vitamin D3 60K IU expires in 29 days.", time: "3d ago", read: true },
];

export const purchaseOrders = [
  { id: "PO-3391", supplierId: "SUP-1003", items: 6, total: 48210, status: "Received", date: "2026-08-14" },
  { id: "PO-3388", supplierId: "SUP-1001", items: 3, total: 21870, status: "In Transit", date: "2026-08-20" },
  { id: "PO-3382", supplierId: "SUP-1002", items: 4, total: 15640, status: "Pending Approval", date: "2026-08-22" },
  { id: "PO-3375", supplierId: "SUP-1004", items: 2, total: 9120, status: "Received", date: "2026-08-05" },
];

export const stockMovementSeries = [
  { day: "Mon", inbound: 420, outbound: 310 },
  { day: "Tue", inbound: 180, outbound: 260 },
  { day: "Wed", inbound: 340, outbound: 298 },
  { day: "Thu", inbound: 90, outbound: 410 },
  { day: "Fri", inbound: 560, outbound: 330 },
  { day: "Sat", inbound: 210, outbound: 190 },
  { day: "Sun", inbound: 60, outbound: 140 },
];
