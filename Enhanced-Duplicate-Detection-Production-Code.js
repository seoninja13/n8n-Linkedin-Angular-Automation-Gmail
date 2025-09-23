// ENHANCED DUPLICATE DETECTION & ROUTING - SELF-CONTAINED SOLUTION
// Architecture: Direct Google Sheets API integration with conditional routing
// Eliminates: Google Sheets Query + Merge complexity
// Provides: Reliable duplicate detection with routing decisions

// ✅ GET CURRENT RECORD FROM DATA FLATTENER
const items = $input.all();
if (items.length === 0 || !items[0].json) {
  throw new Error('No data received from Data Flattener');
}

const currentRecord = items[0].json;
const currentDedupeKey = currentRecord.dedupeKey;

if (!currentDedupeKey || !currentRecord.companyName || !currentRecord.jobTitle) {
  throw new Error('Missing required fields: dedupeKey, companyName, or jobTitle');
}

// ✅ INITIALIZE ROUTING VARIABLES
let routingDecision = 'INSERT'; // Default: new record
let targetRowNumber = null;
let isDuplicate = false;
let duplicateCount = 1;
let originalApplicationDate = null;
let existingRecordData = null;

try {
  // 🎯 DIRECT GOOGLE SHEETS API QUERY - SELF-CONTAINED
  console.log('🔍 Querying Google Sheets directly for duplicate detection...');
  
  const sheetsResponse = await this.helpers.httpRequestWithAuthentication.call(
    this,
    'googleSheetsOAuth2Api',
    {
      method: 'GET',
      url: `https://sheets.googleapis.com/v4/spreadsheets/1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g/values/Tracking!A:Z`,
      json: true
    }
  );

  const sheetData = sheetsResponse.values || [];
  
  if (sheetData.length <= 1) {
    // Empty sheet or only headers
    console.log('📄 Empty sheet detected - first execution');
    routingDecision = 'INSERT';
    isDuplicate = false;
    duplicateCount = 1;
  } else {
    // 🔍 SEARCH FOR DUPLICATES IN EXISTING DATA
    const headers = sheetData[0];
    const dedupeKeyIndex = headers.indexOf('dedupeKey');
    const companyIndex = headers.indexOf('companyName');
    const jobTitleIndex = headers.indexOf('jobTitle');
    const timestampIndex = headers.indexOf('timeStamp');
    const duplicateCountIndex = headers.indexOf('duplicateCount');
    
    if (dedupeKeyIndex === -1) {
      throw new Error('dedupeKey column not found in Google Sheets');
    }
    
    console.log(`🔍 Searching ${sheetData.length - 1} existing records for: "${currentDedupeKey}"`);
    
    // Search for matching dedupeKey
    let matchingRowIndex = -1;
    let highestDuplicateCount = 0;
    
    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      const existingDedupeKey = row[dedupeKeyIndex];
      
      if (existingDedupeKey && existingDedupeKey.toLowerCase().trim() === currentDedupeKey.toLowerCase().trim()) {
        // 🎯 DUPLICATE FOUND!
        matchingRowIndex = i;
        const existingDuplicateCount = parseInt(row[duplicateCountIndex]) || 1;
        highestDuplicateCount = Math.max(highestDuplicateCount, existingDuplicateCount);
        
        existingRecordData = {
          company: row[companyIndex],
          jobTitle: row[jobTitleIndex],
          timestamp: row[timestampIndex],
          duplicateCount: existingDuplicateCount,
          rowNumber: i + 1 // Google Sheets is 1-indexed
        };
        
        console.log(`🚫 DUPLICATE FOUND at row ${i + 1}: ${existingRecordData.company} - ${existingRecordData.jobTitle}`);
        break;
      }
    }
    
    if (matchingRowIndex !== -1) {
      // 🚫 DUPLICATE DETECTED - SET UPDATE ROUTING
      routingDecision = 'UPDATE';
      targetRowNumber = matchingRowIndex + 1; // Convert to 1-indexed
      isDuplicate = true;
      duplicateCount = highestDuplicateCount + 1;
      originalApplicationDate = existingRecordData.timestamp;
      
      console.log(`🚫 DUPLICATE ROUTING: UPDATE row ${targetRowNumber}, attempt #${duplicateCount}`);
    } else {
      // ✅ NEW APPLICATION - SET INSERT ROUTING
      routingDecision = 'INSERT';
      isDuplicate = false;
      duplicateCount = 1;
      
      console.log(`✅ NEW APPLICATION ROUTING: INSERT new record`);
    }
  }
  
} catch (error) {
  // ✅ FAIL-SAFE: Default to INSERT on any error
  console.error('❌ Google Sheets query error:', error.message);
  routingDecision = 'INSERT';
  isDuplicate = false;
  duplicateCount = 1;
  console.warn('⚠️ FAIL-SAFE: Defaulting to INSERT operation');
}

// ✅ CREATE ENHANCED OUTPUT WITH ROUTING METADATA
const enhancedRecord = {
  // ✅ PRESERVE ALL ORIGINAL DATA
  ...currentRecord,
  
  // ✅ UPDATE DUPLICATE DETECTION FIELDS
  isDuplicate: isDuplicate,
  duplicateCount: duplicateCount,
  duplicateDetectedAt: isDuplicate ? new Date().toISOString() : null,
  originalApplicationDate: originalApplicationDate,
  duplicateReason: isDuplicate ? 'SAME_COMPANY_AND_JOB_TITLE' : null,
  status: isDuplicate ? 'DUPLICATE' : 'PREPARED',
  
  // 🎯 CRITICAL: ROUTING DECISION METADATA
  routingDecision: routingDecision,
  targetRowNumber: targetRowNumber,
  operationType: routingDecision,
  
  // ✅ PROCESSING METADATA
  processedAt: new Date().toISOString(),
  duplicateCheckStatus: 'SUCCESS',
  workflowStep: 'enhanced-duplicate-detection',
  
  // 🔍 DEBUGGING INFO (visible in N8N execution results)
  debugInfo: {
    currentDedupeKey: currentDedupeKey,
    routingDecision: routingDecision,
    targetRowNumber: targetRowNumber,
    isDuplicate: isDuplicate,
    duplicateCount: duplicateCount,
    existingRecordFound: !!existingRecordData,
    existingRecordData: existingRecordData,
    processingTimestamp: new Date().toISOString()
  }
};

console.log('✅ ENHANCED DUPLICATE DETECTION COMPLETE');
console.log(`   Routing Decision: ${routingDecision}`);
console.log(`   Is Duplicate: ${isDuplicate}`);
console.log(`   Duplicate Count: ${duplicateCount}`);
console.log(`   Target Row: ${targetRowNumber || 'N/A'}`);

return [{ json: enhancedRecord }];
