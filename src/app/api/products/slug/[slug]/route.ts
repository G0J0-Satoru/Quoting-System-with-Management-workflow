import { NextRequest, NextResponse } from "next/server";
import { turso } from "@/lib/turso";

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

// GET product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const result = await turso.execute({
      sql: "SELECT * FROM products WHERE slug = ?",
      args: [slug],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const product = parseProduct(result.rows[0] as Record<string, unknown>);
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error reading product:", error);
    return NextResponse.json(
      { error: "Failed to read product" },
      { status: 500 }
    );
  }
}
