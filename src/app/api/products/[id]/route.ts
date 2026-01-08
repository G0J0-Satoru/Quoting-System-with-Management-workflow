import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

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

// GET a single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await turso.execute({
      sql: 'SELECT * FROM products WHERE id = ? OR slug = ?',
      args: [id, id],
    });
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const product = parseProduct(result.rows[0] as Record<string, unknown>);
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT - Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Check if product exists
    const existing = await turso.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id],
    });
    
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const currentProduct = existing.rows[0] as Record<string, unknown>;
    const updatedAt = new Date().toISOString();
    
    // Handle both frontend field names and API field names
    const price = body.basePrice ?? body.price ?? currentProduct.price;
    const compareAtPrice = body.discountPrice ?? body.compareAtPrice ?? currentProduct.compareAtPrice;
    const stock = body.stockQuantity ?? body.stock ?? currentProduct.stock;
    const fullDescription = body.description ?? body.fullDescription ?? currentProduct.fullDescription;
    const featured = body.isFeatured ?? body.featured ?? currentProduct.featured;
    
    await turso.execute({
      sql: `UPDATE products SET 
        name = ?, 
        slug = ?, 
        sku = ?,
        shortDescription = ?,
        fullDescription = ?,
        price = ?,
        compareAtPrice = ?,
        cost = ?,
        categoryId = ?,
        brandId = ?,
        status = ?,
        stock = ?,
        images = ?,
        specifications = ?,
        metaTitle = ?,
        metaDescription = ?,
        featured = ?,
        updatedAt = ? 
        WHERE id = ?`,
      args: [
        body.name !== undefined ? body.name : currentProduct.name,
        body.slug !== undefined ? body.slug : currentProduct.slug,
        body.sku !== undefined ? body.sku : currentProduct.sku,
        body.shortDescription !== undefined ? body.shortDescription : currentProduct.shortDescription,
        fullDescription,
        price,
        compareAtPrice,
        body.cost !== undefined ? body.cost : currentProduct.cost,
        body.categoryId !== undefined ? body.categoryId : currentProduct.categoryId,
        body.brandId !== undefined ? body.brandId : currentProduct.brandId,
        body.status !== undefined ? body.status : currentProduct.status,
        stock,
        body.images !== undefined ? JSON.stringify(body.images) : currentProduct.images,
        body.specifications !== undefined ? JSON.stringify(body.specifications) : currentProduct.specifications,
        body.metaTitle !== undefined ? body.metaTitle : currentProduct.metaTitle,
        body.metaDescription !== undefined ? body.metaDescription : currentProduct.metaDescription,
        featured ? 1 : 0,
        updatedAt,
        id,
      ],
    });
    
    // Fetch updated product
    const updated = await turso.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id],
    });
    
    const product = parseProduct(updated.rows[0] as Record<string, unknown>);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if product exists
    const existing = await turso.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id],
    });
    
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    await turso.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id],
    });
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
