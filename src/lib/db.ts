import { promises as fs } from 'fs';
import path from 'path';
import { Product, Category, Brand } from '@/types';

// Use __dirname alternative for ES modules in Next.js
const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

export interface StoreData {
  products: Product[];
  categories: Category[];
  brands: Brand[];
}

// Read the JSON data file
export async function readData(): Promise<StoreData> {
  try {
    console.log('Reading data from:', DATA_FILE);
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    console.log('Loaded products:', parsed.products?.length || 0);
    console.log('Loaded categories:', parsed.categories?.length || 0);
    console.log('Loaded brands:', parsed.brands?.length || 0);
    return parsed;
  } catch (error) {
    console.error('Error reading data file:', error);
    console.error('Attempted path:', DATA_FILE);
    return { products: [], categories: [], brands: [] };
  }
}

// Write to the JSON data file
export async function writeData(data: StoreData): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing data file:', error);
    throw error;
  }
}

// Generate a unique ID
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate a slug from a string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
