import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId, generateSlug } from '@/lib/turso';

// GET all brands
export async function GET() {
  try {
    const result = await turso.execute('SELECT * FROM brands ORDER BY name ASC');
    
    const brands = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      logo: row.logo,
      status: (row.status as string) || 'active',
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
    
    return NextResponse.json({ brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

// POST - Create a new brand
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    
    const newBrand = {
      id: generateId('brand'),
      name: body.name,
      slug: generateSlug(body.name),
      description: body.description || null,
      logo: body.logo || null,
      createdAt: now,
      updatedAt: now,
    };
    
    await turso.execute({
      sql: `INSERT INTO brands (id, name, slug, description, logo, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        newBrand.id,
        newBrand.name,
        newBrand.slug,
        newBrand.description,
        newBrand.logo,
        newBrand.createdAt,
        newBrand.updatedAt,
      ],
    });
    
    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
