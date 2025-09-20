// DUPLICATE DETECTION & LOGGING NODE - PRODUCTION VERSION
// Queries Google Sheets to detect duplicates and enhances data with duplicate tracking
// Always creates new rows with appropriate status (DUPLICATE vs PREPARED)

const flattenedData = $json;
const dedupeKey = flattenedData.dedupeKey;

console.log('=== DUPLICATE DETECTION DEBUG ===');
console.log(`Checking for duplicates: ${dedupeKey}`);
console.log(`Company: ${flattenedData.companyName}`);
console.log(`Job Title: ${flattenedData.jobTitle}`);

// ✅ QUERY EXISTING GOOGLE SHEETS DATA TO CHECK FOR DUPLICATES
let isDuplicate = false;
let duplicateCount = 1;
let originalApplicationDate = null;

try {
  // Create a temporary Google Sheets Read node to check for existing records
  const readParams = {
    operation: 'read',
    documentId: '1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g',
    sheetName: 'Tracking',
    range: 'A:Q', // Read all columns including new duplicate tracking columns
    returnAll: true
  };
  
  // Execute Google Sheets read operation
  const existingRecords = await this.helpers.httpRequestWithAuthentication.call(
    this,
    'googleSheetsOAuth2Api',
    {
      method: 'GET',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${readParams.documentId}/values/${readParams.sheetName}!${readParams.range}`,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (existingRecords.values && existingRecords.values.length > 1) {
    // Skip header row, check data rows
    const dataRows = existingRecords.values.slice(1);
    const dedupeKeyColumnIndex = 6; // Column G (0-indexed)
    
    // Filter for matching dedupeKey
    const duplicateRecords = dataRows.filter(row => 
      row[dedupeKeyColumnIndex] && 
      row[dedupeKeyColumnIndex].toLowerCase() === dedupeKey.toLowerCase()
    );
    
    if (duplicateRecords.length > 0) {
      isDuplicate = true;
      duplicateCount = duplicateRecords.length + 1; // +1 for current application
      originalApplicationDate = duplicateRecords[0][0]; // First column is timestamp
      
      console.log(`🚫 DUPLICATE DETECTED: ${dedupeKey}`);
      console.log(`📊 Duplicate Count: ${duplicateCount}`);
      console.log(`📅 Original Application: ${originalApplicationDate}`);
    } else {
      console.log(`✅ NEW APPLICATION: ${dedupeKey}`);
    }
  }
} catch (error) {
  console.warn('⚠️ Could not query Google Sheets for duplicates:', error.message);
  console.warn('Proceeding as new application (fail-safe mode)');
  // Fail-safe: treat as new application if we can't check
  isDuplicate = false;
}

// ✅ ENHANCE DATA WITH DUPLICATE TRACKING INFORMATION
const enhancedData = {
  ...flattenedData,
  // Update status based on duplicate detection
  status: isDuplicate ? 'DUPLICATE' : 'PREPARED',
  // Add new duplicate tracking fields
  isDuplicate: isDuplicate,
  duplicateCount: duplicateCount,
  duplicateDetectedAt: isDuplicate ? new Date().toISOString() : null,
  originalApplicationDate: originalApplicationDate,
  duplicateReason: isDuplicate ? 'SAME_COMPANY_AND_JOB_TITLE' : null
};

// ✅ COMPREHENSIVE LOGGING
if (isDuplicate) {
  console.log(`🚫 DUPLICATE APPLICATION DETECTED`);
  console.log(`   Company: ${enhancedData.companyName}`);
  console.log(`   Job Title: ${enhancedData.jobTitle}`);
  console.log(`   Dedupe Key: ${dedupeKey}`);
  console.log(`   Attempt #: ${duplicateCount}`);
  console.log(`   Original Date: ${originalApplicationDate}`);
  console.log(`   Status: ${enhancedData.status}`);
} else {
  console.log(`✅ NEW APPLICATION APPROVED`);
  console.log(`   Company: ${enhancedData.companyName}`);
  console.log(`   Job Title: ${enhancedData.jobTitle}`);
  console.log(`   Dedupe Key: ${dedupeKey}`);
  console.log(`   Status: ${enhancedData.status}`);
}

// ✅ VALIDATION
const requiredFields = ['timeStamp', 'companyName', 'jobTitle', 'dedupeKey', 'status'];
const missingFields = requiredFields.filter(field => !enhancedData[field]);

if (missingFields.length > 0) {
  console.error('❌ CRITICAL ERROR: Missing required fields:', missingFields);
  throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
}

console.log(`✅ Enhanced data ready for Google Sheets (${Object.keys(enhancedData).length} fields)`);

// ✅ RETURN ENHANCED DATA FOR GOOGLE SHEETS
return [{ json: enhancedData }];
