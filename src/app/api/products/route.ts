import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId, generateSlug } from '@/lib/turso';

// Helper to parse JSON fields - returns frontend-compatible field names
function parseProduct(row: Record<string, unknown>) {
  const price = Number(row.price) || 0;
  const compareAtPrice = row.compareAtPrice ? Number(row.compareAtPrice) : null;
  const stock = Number(row.stock) || 0;
  
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    shortDescription: row.shortDescription || '',
    fullDescription: row.fullDescription || '',
    description: row.fullDescription || '',
    // Frontend expects these field names
    basePrice: price,
    discountPrice: compareAtPrice,
    stockQuantity: stock,
    lowStockThreshold: 5,
    // Also keep original names for compatibility
    price: price,
    compareAtPrice: compareAtPrice,
    cost: row.cost,
    stock: stock,
    categoryId: row.categoryId || '',
    brandId: row.brandId || '',
    status: row.status || 'active',
    images: row.images ? JSON.parse(row.images as string) : [],
    specifications: row.specifications ? JSON.parse(row.specifications as string) : {},
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    isFeatured: Boolean(row.featured),
    isNew: false,
    featured: Boolean(row.featured),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// GET all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    let sql = 'SELECT * FROM products WHERE 1=1';
    const args: (string | number)[] = [];
    
    // Filter by category
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      sql += ' AND categoryId = ?';
      args.push(categoryId);
    }
    
    // Filter by brand
    const brandId = searchParams.get('brandId');
    if (brandId) {
      sql += ' AND brandId = ?';
      args.push(brandId);
    }
    
    // Filter by status
    const status = searchParams.get('status');
    if (status) {
      sql += ' AND status = ?';
      args.push(status);
    }
    
    // Search by name
    const search = searchParams.get('search');
    if (search) {
      sql += ' AND (name LIKE ? OR sku LIKE ? OR shortDescription LIKE ?)';
      const searchPattern = `%${search}%`;
      args.push(searchPattern, searchPattern, searchPattern);
    }
    
    sql += ' ORDER BY createdAt DESC';
    
    const result = await turso.execute({ sql, args });
    const products = result.rows.map(row => parseProduct(row as Record<string, unknown>));
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    
    // Handle both form field names and API field names
    const price = body.price ?? body.basePrice ?? 0;
    const compareAtPrice = body.compareAtPrice ?? body.discountPrice ?? null;
    const stock = body.stock ?? body.stockQuantity ?? 0;
    const fullDescription = body.fullDescription ?? body.description ?? null;
    const featured = body.featured ?? body.isFeatured ?? false;
    
    const newProduct = {
      id: generateId('prod'),
      name: body.name,
      slug: generateSlug(body.name),
      sku: body.sku,
      shortDescription: body.shortDescription || null,
      fullDescription: fullDescription,
      price: typeof price === 'number' ? price : parseFloat(price) || 0,
      compareAtPrice: compareAtPrice !== null && compareAtPrice !== undefined 
        ? (typeof compareAtPrice === 'number' ? compareAtPrice : parseFloat(compareAtPrice)) 
        : null,
      cost: body.cost !== null && body.cost !== undefined 
        ? (typeof body.cost === 'number' ? body.cost : parseFloat(body.cost)) 
        : null,
      categoryId: body.categoryId || null,
      brandId: body.brandId || null,
      status: body.status || 'active',
      stock: typeof stock === 'number' ? stock : parseInt(stock) || 0,
      images: JSON.stringify(body.images || []),
      specifications: JSON.stringify(body.specifications || {}),
      metaTitle: body.metaTitle || null,
      metaDescription: body.metaDescription || null,
      featured: featured ? 1 : 0,
      createdAt: now,
      updatedAt: now,
    };
    
    await turso.execute({
      sql: `INSERT INTO products (
        id, name, slug, sku, shortDescription, fullDescription, price, 
        compareAtPrice, cost, categoryId, brandId, status, stock, 
        images, specifications, metaTitle, metaDescription, featured, 
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newProduct.id,
        newProduct.name,
        newProduct.slug,
        newProduct.sku,
        newProduct.shortDescription,
        newProduct.fullDescription,
        newProduct.price,
        newProduct.compareAtPrice,
        newProduct.cost,
        newProduct.categoryId,
        newProduct.brandId,
        newProduct.status,
        newProduct.stock,
        newProduct.images,
        newProduct.specifications,
        newProduct.metaTitle,
        newProduct.metaDescription,
        newProduct.featured,
        newProduct.createdAt,
        newProduct.updatedAt,
      ],
    });
    
    // Return the product with parsed JSON fields
    return NextResponse.json({
      ...newProduct,
      images: body.images || [],
      specifications: body.specifications || [],
      featured: Boolean(newProduct.featured),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
