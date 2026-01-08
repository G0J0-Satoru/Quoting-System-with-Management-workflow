import { NextRequest, NextResponse } from 'next/server';
import { turso, generateSlug } from '@/lib/turso';

// GET a single brand
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await turso.execute({
      sql: 'SELECT * FROM brands WHERE id = ? OR slug = ?',
      args: [id, id],
    });
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
    
    const row = result.rows[0];
    const brand = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      logo: row.logo,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
    
    return NextResponse.json({ brand });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 });
  }
}

// PUT - Update a brand
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Check if brand exists
    const existing = await turso.execute({
      sql: 'SELECT * FROM brands WHERE id = ?',
      args: [id],
    });
    
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
    
    const currentBrand = existing.rows[0];
    const updatedAt = new Date().toISOString();
    const newSlug = body.name ? generateSlug(body.name) : currentBrand.slug;
    
    await turso.execute({
      sql: `UPDATE brands SET 
        name = ?, 
        slug = ?, 
        description = ?, 
        logo = ?, 
        updatedAt = ? 
        WHERE id = ?`,
      args: [
        body.name || currentBrand.name,
        newSlug,
        body.description !== undefined ? body.description : currentBrand.description,
        body.logo !== undefined ? body.logo : currentBrand.logo,
        updatedAt,
        id,
      ],
    });
    
    // Fetch updated brand
    const updated = await turso.execute({
      sql: 'SELECT * FROM brands WHERE id = ?',
      args: [id],
    });
    
    const row = updated.rows[0];
    const brand = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      logo: row.logo,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
    
    return NextResponse.json({ brand });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

// DELETE a brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if brand exists
    const existing = await turso.execute({
      sql: 'SELECT * FROM brands WHERE id = ?',
      args: [id],
    });
    
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
    
    // Check if any products use this brand
    const productsWithBrand = await turso.execute({
      sql: 'SELECT COUNT(*) as count FROM products WHERE brandId = ?',
      args: [id],
    });
    
    const productCount = Number(productsWithBrand.rows[0].count);
    if (productCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete brand. ${productCount} products are using this brand.` 
      }, { status: 400 });
    }
    
    await turso.execute({
      sql: 'DELETE FROM brands WHERE id = ?',
      args: [id],
    });
    
    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}
