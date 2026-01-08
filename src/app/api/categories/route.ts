import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId, generateSlug } from '@/lib/turso';

// GET all categories
export async function GET() {
  try {
    const result = await turso.execute(`
      SELECT * FROM categories ORDER BY displayOrder ASC, name ASC
    `);
    
    const categories = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      displayOrder: row.displayOrder,
      status: (row.status as string) || 'active',
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = generateId('cat');
    const slug = generateSlug(body.name);
    const now = new Date().toISOString();
    
    await turso.execute({
      sql: `INSERT INTO categories (id, name, slug, description, displayOrder, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        body.name,
        slug,
        body.description || null,
        body.displayOrder || 0,
        now,
        now
      ]
    });
    
    const newCategory = {
      id,
      name: body.name,
      slug,
      description: body.description,
      displayOrder: body.displayOrder || 0,
      createdAt: now,
      updatedAt: now,
    };
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
