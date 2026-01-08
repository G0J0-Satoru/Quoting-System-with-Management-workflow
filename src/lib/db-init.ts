import { turso } from './turso';

// Migrate database - add missing tables without dropping existing data
export async function migrateDatabase() {
  // Settings table - add if not exists
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      storeName TEXT,
      storeEmail TEXT,
      storePhone TEXT,
      storeAddress TEXT,
      vatRate TEXT,
      quotationValidity TEXT,
      storeHours TEXT
    )
  `);

  console.log('Database migration completed successfully');
}

// Initialize database tables (WARNING: This drops all data!)
export async function initializeDatabase() {
  // Drop existing tables to recreate with correct schema
  await turso.execute('DROP TABLE IF EXISTS quotations');
  await turso.execute('DROP TABLE IF EXISTS products');
  await turso.execute('DROP TABLE IF EXISTS brands');
  await turso.execute('DROP TABLE IF EXISTS categories');
  await turso.execute('DROP TABLE IF EXISTS settings');

  // Categories table
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      displayOrder INTEGER DEFAULT 0,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);

  // Brands table
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      logo TEXT,
      createdAt TEXT,
      updatedAt TEXT
    )
  `);

  // Products table
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      sku TEXT NOT NULL,
      shortDescription TEXT,
      fullDescription TEXT,
      price REAL NOT NULL,
      compareAtPrice REAL,
      cost REAL,
      categoryId TEXT,
      brandId TEXT,
      status TEXT DEFAULT 'active',
      stock INTEGER DEFAULT 0,
      images TEXT,
      specifications TEXT,
      metaTitle TEXT,
      metaDescription TEXT,
      featured INTEGER DEFAULT 0,
      createdAt TEXT,
      updatedAt TEXT,
      FOREIGN KEY (categoryId) REFERENCES categories(id),
      FOREIGN KEY (brandId) REFERENCES brands(id)
    )
  `);

  // Quotations table
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS quotations (
      id TEXT PRIMARY KEY,
      quotationNumber TEXT NOT NULL UNIQUE,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      customerPhone TEXT,
      companyName TEXT,
      items TEXT NOT NULL,
      itemCount INTEGER DEFAULT 0,
      subtotal REAL NOT NULL,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      notes TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      validUntil TEXT
    )
  `);

  // Settings table
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY,
      storeName TEXT,
      storeEmail TEXT,
      storePhone TEXT,
      storeAddress TEXT,
      vatRate TEXT,
      quotationValidity TEXT,
      storeHours TEXT
    )
  `);

  console.log('Database tables initialized successfully');
}

// Seed initial data if tables are empty
export async function seedInitialData() {
  const now = new Date().toISOString();
  
  // Check if categories exist
  const categoriesCount = await turso.execute('SELECT COUNT(*) as count FROM categories');
  
  if (Number(categoriesCount.rows[0].count) === 0) {
    // Seed default categories
    const defaultCategories = [
      { id: 'cat-1', name: 'Laptops', slug: 'laptops', description: 'Gaming, Business, and Everyday Laptops', displayOrder: 1 },
      { id: 'cat-2', name: 'Desktops', slug: 'desktops', description: 'Pre-built and Custom Desktop PCs', displayOrder: 2 },
      { id: 'cat-3', name: 'Graphics Cards', slug: 'graphics-cards', description: 'NVIDIA and AMD Graphics Cards', displayOrder: 3 },
      { id: 'cat-4', name: 'Monitors', slug: 'monitors', description: 'Gaming and Professional Monitors', displayOrder: 4 },
      { id: 'cat-5', name: 'Processors', slug: 'processors', description: 'Intel and AMD CPUs', displayOrder: 5 },
      { id: 'cat-6', name: 'Storage', slug: 'storage', description: 'SSDs, HDDs, and NVMe Drives', displayOrder: 6 },
      { id: 'cat-7', name: 'Memory', slug: 'memory', description: 'RAM and Memory Modules', displayOrder: 7 },
      { id: 'cat-8', name: 'Peripherals', slug: 'peripherals', description: 'Keyboards, Mice, and Accessories', displayOrder: 8 },
    ];

    for (const cat of defaultCategories) {
      await turso.execute({
        sql: `INSERT INTO categories (id, name, slug, description, displayOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [cat.id, cat.name, cat.slug, cat.description, cat.displayOrder, now, now]
      });
    }
    console.log('Seeded default categories');
  }

  // Check if brands exist
  const brandsCount = await turso.execute('SELECT COUNT(*) as count FROM brands');
  
  if (Number(brandsCount.rows[0].count) === 0) {
    // Seed default brands
    const defaultBrands = [
      { id: 'brand-1', name: 'ASUS', slug: 'asus', description: 'Leading manufacturer of motherboards, graphics cards, and laptops' },
      { id: 'brand-2', name: 'Apple', slug: 'apple', description: 'Premium computers and devices' },
      { id: 'brand-3', name: 'MSI', slug: 'msi', description: 'Gaming hardware and laptops' },
      { id: 'brand-4', name: 'Samsung', slug: 'samsung', description: 'Electronics and storage solutions' },
      { id: 'brand-5', name: 'NVIDIA', slug: 'nvidia', description: 'Graphics cards and AI computing' },
      { id: 'brand-6', name: 'Intel', slug: 'intel', description: 'Processors and computing solutions' },
      { id: 'brand-7', name: 'AMD', slug: 'amd', description: 'Processors and graphics cards' },
      { id: 'brand-8', name: 'Corsair', slug: 'corsair', description: 'Gaming peripherals and components' },
    ];

    for (const brand of defaultBrands) {
      await turso.execute({
        sql: `INSERT INTO brands (id, name, slug, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [brand.id, brand.name, brand.slug, brand.description, now, now]
      });
    }
    console.log('Seeded default brands');
  }
}
