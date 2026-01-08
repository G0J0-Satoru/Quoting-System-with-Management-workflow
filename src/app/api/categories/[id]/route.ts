import { NextRequest, NextResponse } from 'next/server';
import { turso, generateSlug } from '@/lib/turso';

// GET a single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await turso.execute({
      sql: 'SELECT * FROM categories WHERE id = ? OR slug = ?',
      args: [id, id],
    });
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    const row = result.rows[0];
    const category = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      displayOrder: row.displayOrder,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Check if category exists
    const existing = await turso.execute({
      sql: 'SELECT * FROM categories WHERE id = ?',
      args: [id],
    });
    
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    const currentCategory = existing.rows[0];
    const updatedAt = new Date().toISOString();
    const newSlug = body.name ? generateSlug(body.name) : currentCategory.slug;
    
    await turso.execute({
      sql: `UPDATE categories SET 
        name = ?, 
        slug = ?, 
        description = ?, 
        displayOrder = ?, 
        updatedAt = ? 
        WHERE id = ?`,
      args: [
        body.name || currentCategory.name,
        newSlug,
        body.description !== undefined ? body.description : currentCategory.description,
        body.displayOrder !== undefined ? body.displayOrder : currentCategory.displayOrder,
        updatedAt,
        id,
      ],
    });
    
    // Fetch updated category
    const updated = await turso.execute({
      sql: 'SELECT * FROM categories WHERE id = ?',
      args: [id],
    });
    
    const row = updated.rows[0];
    const category = {
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      displayOrder: row.displayOrder,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if category exists
    const existing = await turso.execute({
      sql: 'SELECT * FROM categories WHERE id = ?',
      args: [id],
    });
    
    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Check if any products use this category
    const productsWithCategory = await turso.execute({
      sql: 'SELECT COUNT(*) as count FROM products WHERE categoryId = ?',
      args: [id],
    });
    
    const productCount = Number(productsWithCategory.rows[0].count);
    if (productCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category. ${productCount} products are using this category.` 
      }, { status: 400 });
    }
    
    await turso.execute({
      sql: 'DELETE FROM categories WHERE id = ?',
      args: [id],
    });
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
