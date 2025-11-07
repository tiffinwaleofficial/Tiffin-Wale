const fs = require('fs');
const path = require('path');

/**
 * Clean PDF Generation Script
 * Deletes all generated PDFs from the storage directories
 */

const PDF_STORAGE_BASE = path.join(__dirname, '../src/modules/report/formats/pdf/storage/generated');

const PDF_DIRECTORIES = [
  'contracts',
  'invoices',
  'legal-documents',
  'order-receipts',
  'subscriptions'
];

function deletePdfFiles(directory) {
  const dirPath = path.join(PDF_STORAGE_BASE, directory);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory does not exist: ${directory}`);
    return { deleted: 0, errors: 0 };
  }

  let deleted = 0;
  let errors = 0;

  try {
    const files = fs.readdirSync(dirPath);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      console.log(`✓  No PDFs found in ${directory}/`);
      return { deleted: 0, errors: 0 };
    }

    pdfFiles.forEach(file => {
      const filePath = path.join(dirPath, file);
      try {
        fs.unlinkSync(filePath);
        deleted++;
        console.log(`  ✓  Deleted: ${directory}/${file}`);
      } catch (error) {
        errors++;
        console.error(`  ✗  Error deleting ${directory}/${file}:`, error.message);
      }
    });

    return { deleted, errors };
  } catch (error) {
    console.error(`✗  Error reading directory ${directory}:`, error.message);
    return { deleted: 0, errors: 1 };
  }
}

function main() {
  console.log('🧹 Cleaning generated PDFs...\n');
  console.log(`📁 Base directory: ${PDF_STORAGE_BASE}\n`);

  let totalDeleted = 0;
  let totalErrors = 0;

  PDF_DIRECTORIES.forEach(directory => {
    console.log(`📂 Processing: ${directory}/`);
    const result = deletePdfFiles(directory);
    totalDeleted += result.deleted;
    totalErrors += result.errors;
    console.log('');
  });

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Total PDFs deleted: ${totalDeleted}`);
  if (totalErrors > 0) {
    console.log(`⚠️  Total errors: ${totalErrors}`);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (totalErrors === 0) {
    console.log('✨ PDF cleanup completed successfully!');
    process.exit(0);
  } else {
    console.log('⚠️  PDF cleanup completed with some errors.');
    process.exit(1);
  }
}

// Run the script
main();

