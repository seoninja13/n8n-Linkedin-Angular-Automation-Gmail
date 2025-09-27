// SIMPLIFIED DUPLICATE DETECTION - PRODUCTION VERSION
// Architecture: Merge Node combining Data Flattener + Google Sheets
// Mode: "Run Once for All Items" (Execute Once: ENABLED)
// Purpose: Replace 606-line diagnostic code with streamlined production logic

console.log('🔍 DUPLICATE DETECTION - Production Mode (Simplified)');

// ✅ GET ALL ITEMS FROM MERGE NODE
const allItems = $input.all();
console.log(`📊 Total items from Merge Node: ${allItems.length}`);

if (allItems.length === 0) {
  throw new Error('CRITICAL: No items received from Merge Node');
}

// ✅ IDENTIFY CURRENT RECORD vs EXISTING RECORDS
// Architecture: First item = current record (Data Flattener)
//              Remaining items = existing records (Google Sheets)
const currentRecord = allItems[0].json;
const existingRecords = allItems.length > 1 
  ? allItems.slice(1).filter(item => item.json && item.json.dedupeKey).map(item => item.json)
  : [];

if (!currentRecord) {
  throw new Error('CRITICAL: No current record found in first item');
}

console.log(`🎯 Current: ${currentRecord.companyName} - ${currentRecord.jobTitle}`);
console.log(`📋 Existing: ${existingRecords.length} records for comparison`);

// ✅ PERFORM DUPLICATE DETECTION
let isDuplicate = false;
let duplicateCount = 1;
let originalApplicationDate = null;
let duplicateReason = '';

if (existingRecords.length === 0) {
  // Empty sheet scenario
  isDuplicate = false;
  duplicateCount = 1;
  console.log('✅ FIRST EXECUTION: No existing records');
} else {
  // Check for duplicates
  const currentKey = currentRecord.dedupeKey.toLowerCase().trim();
  const matchingRecords = existingRecords.filter(record => 
    record.dedupeKey && record.dedupeKey.toLowerCase().trim() === currentKey
  );

  if (matchingRecords.length > 0) {
    isDuplicate = true;
    duplicateCount = matchingRecords.length + 1;
    duplicateReason = 'SAME_COMPANY_AND_JOB_TITLE';
    originalApplicationDate = matchingRecords[0].timeStamp;
    console.log(`🚫 DUPLICATE: Found ${matchingRecords.length} existing records`);
  } else {
    isDuplicate = false;
    duplicateCount = 1;
    console.log('✅ NEW APPLICATION: No matching records found');
  }
}

// ✅ DETERMINE ROUTING DECISION FOR IF NODE
const routingDecision = isDuplicate ? 'UPDATE' : 'INSERT';

// ✅ CREATE ENHANCED RECORD
const enhancedRecord = {
  // Preserve all original data
  ...currentRecord,
  
  // Add duplicate detection results
  isDuplicate: isDuplicate,
  duplicateCount: duplicateCount,
  duplicateReason: duplicateReason,
  originalApplicationDate: originalApplicationDate,
  
  // Add processing metadata
  duplicateDetectionTimestamp: new Date().toISOString(),
  routingDecision: routingDecision,
  processingMode: 'PRODUCTION_SIMPLIFIED',
  
  // Update status based on duplicate detection
  status: isDuplicate ? 'DUPLICATE_DETECTED' : 'NEW_APPLICATION'
};

console.log(`📊 Result: isDuplicate=${isDuplicate}, routing=${routingDecision}`);

// ✅ VALIDATION
const requiredFields = ['timeStamp', 'companyName', 'jobTitle', 'dedupeKey'];
const missingFields = requiredFields.filter(field => !enhancedRecord[field]);

if (missingFields.length > 0) {
  throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
}

// ✅ RETURN SINGLE ENHANCED RECORD
return { json: enhancedRecord };
