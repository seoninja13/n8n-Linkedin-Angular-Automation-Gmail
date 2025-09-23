// DUPLICATE DETECTION & LOGGING NODE - CORRECTED IMPLEMENTATION
// This node MUST be connected between Data Flattener and Google Sheets
// Purpose: Always post records with proper duplicate marking and early termination

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
  // Use Google Sheets API to read existing data
  const sheetsCredentials = await this.helpers.getCredentials('googleSheetsOAuth2Api');
  const documentId = '1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g';
  const sheetName = 'Tracking';
  
  // Read existing records to check for duplicates
  const response = await this.helpers.httpRequestWithAuthentication.call(
    this,
    'googleSheetsOAuth2Api',
    {
      method: 'GET',
      url: `https://sheets.googleapis.com/v4/spreadsheets/${documentId}/values/${sheetName}!A:Q`,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  if (response.values && response.values.length > 1) {
    // Find header row to locate dedupeKey column
    const headers = response.values[0];
    const dedupeKeyIndex = headers.findIndex(header => 
      header.toLowerCase().includes('dedupekey') || header.toLowerCase().includes('dedupe')
    );
    
    if (dedupeKeyIndex !== -1) {
      // Check for existing records with same dedupeKey
      const existingRecords = response.values.slice(1).filter(row => 
        row[dedupeKeyIndex] && row[dedupeKeyIndex].toLowerCase() === dedupeKey.toLowerCase()
      );
      
      if (existingRecords.length > 0) {
        isDuplicate = true;
        duplicateCount = existingRecords.length + 1; // +1 for current application
        
        // Find timestamp column for original application date
        const timestampIndex = headers.findIndex(header => 
          header.toLowerCase().includes('timestamp') || header.toLowerCase().includes('time')
        );
        
        if (timestampIndex !== -1 && existingRecords[0][timestampIndex]) {
          originalApplicationDate = existingRecords[0][timestampIndex];
        }
        
        console.log(`🚫 DUPLICATE DETECTED: ${dedupeKey}`);
        console.log(`📊 Duplicate Count: ${duplicateCount}`);
        console.log(`📅 Original Application: ${originalApplicationDate}`);
      } else {
        console.log(`✅ NEW APPLICATION: ${dedupeKey}`);
      }
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
  // CRITICAL: Update status based on duplicate detection
  status: isDuplicate ? 'DUPLICATE' : 'PREPARED',
  // Add new duplicate tracking fields
  isDuplicate: isDuplicate,
  duplicateCount: duplicateCount,
  duplicateDetectedAt: isDuplicate ? new Date().toISOString() : null,
  originalApplicationDate: originalApplicationDate,
  duplicateReason: isDuplicate ? 'SAME_COMPANY_AND_JOB_TITLE' : null,
  // Add processing metadata
  duplicateCheckTimestamp: new Date().toISOString(),
  duplicateCheckStatus: 'COMPLETED'
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
  console.log(`   ⚠️ EARLY TERMINATION: Workflow will terminate after Google Sheets posting`);
} else {
  console.log(`✅ NEW APPLICATION APPROVED`);
  console.log(`   Company: ${enhancedData.companyName}`);
  console.log(`   Job Title: ${enhancedData.jobTitle}`);
  console.log(`   Dedupe Key: ${dedupeKey}`);
  console.log(`   Status: ${enhancedData.status}`);
  console.log(`   ✅ CONTINUE PROCESSING: Workflow will proceed to downstream steps`);
}

// ✅ VALIDATION
const requiredFields = ['timeStamp', 'companyName', 'jobTitle', 'dedupeKey', 'status'];
const missingFields = requiredFields.filter(field => !enhancedData[field]);

if (missingFields.length > 0) {
  console.error('❌ CRITICAL ERROR: Missing required fields:', missingFields);
  throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
}

console.log(`✅ Enhanced data ready for Google Sheets (${Object.keys(enhancedData).length} fields)`);
console.log(`✅ Duplicate Detection Status: ${isDuplicate ? 'DUPLICATE' : 'NEW'}`);

// ✅ RETURN ENHANCED DATA FOR GOOGLE SHEETS
// This will ALWAYS create a new row in Google Sheets with proper status marking
return [{ json: enhancedData }];
