import { NextResponse } from 'next/server';
import { initializeDatabase, seedInitialData, migrateDatabase } from '@/lib/db-init';

// GET - Migrate database (add new tables without dropping data)
export async function GET() {
  try {
    await migrateDatabase();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database migration completed successfully' 
    });
  } catch (error) {
    console.error('Error migrating database:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to migrate database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Full database reset (WARNING: Drops all data!)
export async function POST() {
  try {
    await initializeDatabase();
    await seedInitialData();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully' 
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to initialize database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
