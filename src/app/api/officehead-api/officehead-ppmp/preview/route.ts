import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export const dynamic = "force-dynamic"; // ✅ Disable static rendering
export const fetchCache = "force-no-store"; // ✅ Disable caching

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      blankrows: false,
      raw: true  // Changed to true to get raw values
    });

    console.log('Raw Excel Data:', jsonData); // For debugging

    const transformedData = jsonData
      .slice(1)
      .filter((row: unknown): row is any[] => {
        return Array.isArray(row) && 
               row.length >= 5 && 
               typeof row[1] === 'string' && 
               row[1] !== 'GENERAL DESCRIPTION' && 
               !row[1].includes('PART') && 
               !row[1].includes('COMMON OFFICE') &&
               !row[1].includes('FURNITURE AND FIXTURES');
      })
      .map((row: any[]) => ({
        ppmp_item: row[1],
        unit_cost: parseFloat(row[4]?.toString().replace(/,/g, '')) || 0  // Parse the number properly
      }))
      .filter(item => item.ppmp_item && !isNaN(item.unit_cost));

    console.log('Transformed Data:', transformedData); // For debugging

    return NextResponse.json(transformedData);

  } catch (error: any) {
    console.error('Error processing Excel file:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Failed to process Excel file' },
      { status: 500 }
    );
  }
}