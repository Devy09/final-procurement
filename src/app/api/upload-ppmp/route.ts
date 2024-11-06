import { NextRequest, NextResponse } from 'next/server';
import formidable, { File, Fields, Files } from 'formidable';
import { readFile } from 'fs/promises';
import * as XLSX from 'xlsx';
import prisma from '@/lib/prisma';  // Adjust path as needed

const REQUIRED_COLUMNS = ['ID', 'Item Description', 'Unit Cost', 'Category'];

interface ExcelRow {
  ID: number;
  'Item Description': string;
  'Unit Cost': number;
  Category: string;
}

// Helper function to parse form data
const parseForm = async (req: NextRequest): Promise<{ fields: Fields; files: Files }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });

    // Use the raw request object from req.body
    const rawReq = (req as any).body;

    form.parse(rawReq, (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        reject(err);
      } else {
        console.log('Form parsed successfully:', fields, files);
        resolve({ fields, files });
      }
    });
  });
};

// Validate that the Excel file contains the required columns
const validateExcelStructure = (columns: string[]): boolean =>
  REQUIRED_COLUMNS.every((col) => columns.includes(col));

// POST handler to process Excel file uploads
export async function POST(req: NextRequest) {
  try {
    console.log('Upload request received');  // Log entry point

    const { fields, files } = await parseForm(req);

    // Handle missing file error
    const excelFile = Array.isArray(files.excel) ? files.excel[0] : files.excel;
    if (!excelFile) {
      throw new Error('No file uploaded');
    }

    const filePath = (excelFile as File).filepath;
    console.log('Reading file from path:', filePath);

    const data = await readFile(filePath);
    console.log('File read successfully, processing Excel...');

    const workbook = XLSX.read(data, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

    if (rows.length === 0) {
      throw new Error('The Excel file is empty.');
    }

    const firstRowColumns = Object.keys(rows[0]);
    if (!validateExcelStructure(firstRowColumns)) {
      throw new Error(
        `Invalid Excel structure. Expected columns: ${REQUIRED_COLUMNS.join(', ')}`
      );
    }

    // Insert each row into the database
    const items = await Promise.all(
      rows.map(async (row) => {
        const { ID, 'Item Description': description, 'Unit Cost': unitCost, Category: category } = row;

        if (!ID || !description) {
          throw new Error('Missing required data in one or more rows.');
        }

        return prisma.item.create({
          data: {
            id: Number(ID),
            description,
            unitCost: parseFloat(unitCost.toString()) || 0.0,
            category: category || 'Uncategorized',
          },
        });
      })
    );

    console.log('Items inserted into the database:', items);

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error('Error in file upload:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
}
