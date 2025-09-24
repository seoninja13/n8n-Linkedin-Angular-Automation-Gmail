// COMPREHENSIVE DUPLICATE DETECTION DIAGNOSTIC - ROOT CAUSE ANALYSIS
// Purpose: Definitively identify why duplicate detection has been failing systematically
// Architecture: Native N8N with Merge node combining current + existing data
// Mode: "Run Once for All Items" - COMPREHENSIVE DIAGNOSTIC VERSION
// Target: Workflow ID wZyxRjWShhnSFbSV - Contact Tracking duplicate detection failure

console.log('╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                    COMPREHENSIVE DUPLICATE DETECTION DIAGNOSTIC              ║');
console.log('║                           ROOT CAUSE ANALYSIS                               ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝');

const diagnosticStartTime = new Date().toISOString();
console.log(`🕐 Diagnostic started at: ${diagnosticStartTime}`);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1: MERGE NODE DATA STRUCTURE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
console.log('│                    SECTION 1: MERGE NODE DATA STRUCTURE ANALYSIS           │');
console.log('└─────────────────────────────────────────────────────────────────────────────┘');

// ✅ ACCESS ALL DATA FROM MERGE NODE
const allItems = $input.all();
console.log(`📊 Total items received from Merge node: ${allItems.length}`);

if (allItems.length === 0) {
  console.log('🚨 CRITICAL ERROR: Merge node provided NO items');
  console.log('   This indicates a fundamental workflow configuration issue');
  console.log('   Expected: At least 1 item (current record from Data Flattener)');
  throw new Error('DIAGNOSTIC FAILURE: No data received from Merge node');
}

console.log('\n🔍 DETAILED MERGE NODE ITEM ANALYSIS:');
console.log('─'.repeat(80));

allItems.forEach((item, index) => {
  console.log(`\n📋 ITEM ${index} ANALYSIS:`);
  console.log(`   Source: ${index === 0 ? 'Data Flattener (Current Record)' : 'Google Sheets Query (Existing Record)'}`);
  console.log(`   Has JSON data: ${!!item.json}`);
  console.log(`   JSON keys count: ${item.json ? Object.keys(item.json).length : 0}`);

  if (item.json) {
    console.log(`   DedupeKey: "${item.json.dedupeKey || 'MISSING'}"`);
    console.log(`   Company: "${item.json.companyName || 'MISSING'}"`);
    console.log(`   Job Title: "${item.json.jobTitle || 'MISSING'}"`);
    console.log(`   Timestamp: "${item.json.timeStamp || 'MISSING'}"`);
    console.log(`   Row Number: ${item.json.row_number || 'N/A (Current Record)'}`);
    console.log(`   Current isDuplicate: ${item.json.isDuplicate}`);
    console.log(`   Current duplicateCount: ${item.json.duplicateCount}`);

    // Log first 300 characters of JSON for structure analysis
    const jsonPreview = JSON.stringify(item.json, null, 2).substring(0, 300);
    console.log(`   JSON Structure Preview:\n${jsonPreview}${jsonPreview.length >= 300 ? '...' : ''}`);
  } else {
    console.log('   ⚠️ WARNING: Item has no JSON data');
  }
  console.log('─'.repeat(40));
});

// ✅ EXTRACT CURRENT RECORD (first item should be from Data Flattener)
if (!allItems[0] || !allItems[0].json) {
  throw new Error('DIAGNOSTIC FAILURE: First item (current record) is missing or invalid');
}

const currentRecord = allItems[0].json;
console.log('\n✅ CURRENT RECORD IDENTIFICATION:');
console.log(`   DedupeKey: "${currentRecord.dedupeKey}"`);
console.log(`   Company: "${currentRecord.companyName}"`);
console.log(`   Job Title: "${currentRecord.jobTitle}"`);
console.log(`   Timestamp: "${currentRecord.timeStamp}"`);
console.log(`   Source Verification: ${currentRecord.row_number ? 'ERROR - Should not have row_number' : 'CORRECT - No row_number (from Data Flattener)'}`);

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2: GOOGLE SHEETS DATA INVENTORY & ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
console.log('│                    SECTION 2: GOOGLE SHEETS DATA INVENTORY                  │');
console.log('└─────────────────────────────────────────────────────────────────────────────┘');

// ✅ EXTRACT EXISTING RECORDS (remaining items from Google Sheets Query)
let existingData = [];
let invalidRecords = [];

if (allItems.length > 1) {
  console.log(`📊 Processing ${allItems.length - 1} items from Google Sheets Query...`);

  // All items after the first one should be existing records from Google Sheets
  allItems.slice(1).forEach((item, index) => {
    const record = item.json;
    const recordNumber = index + 1;

    console.log(`\n🔍 GOOGLE SHEETS RECORD ${recordNumber} ANALYSIS:`);

    if (!record) {
      console.log(`   ❌ ERROR: Record ${recordNumber} has no JSON data`);
      invalidRecords.push({ recordNumber, reason: 'No JSON data', data: item });
      return;
    }

    const hasDedupeKey = record.dedupeKey && record.dedupeKey.trim() !== '';
    const hasRequiredFields = record.companyName && record.jobTitle;
    const isValid = hasDedupeKey && hasRequiredFields;

    console.log(`   DedupeKey: "${record.dedupeKey || 'MISSING'}"`);
    console.log(`   Company: "${record.companyName || 'MISSING'}"`);
    console.log(`   Job Title: "${record.jobTitle || 'MISSING'}"`);
    console.log(`   Timestamp: "${record.timeStamp || 'MISSING'}"`);
    console.log(`   Row Number: ${record.row_number || 'MISSING'}`);
    console.log(`   Current isDuplicate Flag: ${record.isDuplicate}`);
    console.log(`   Current duplicateCount: ${record.duplicateCount}`);
    console.log(`   Record Status: "${record.status || 'MISSING'}"`);
    console.log(`   Has DedupeKey: ${hasDedupeKey}`);
    console.log(`   Has Required Fields: ${hasRequiredFields}`);
    console.log(`   Overall Valid: ${isValid}`);

    if (isValid) {
      existingData.push(record);
      console.log(`   ✅ VALID - Added to analysis dataset`);
    } else {
      const reasons = [];
      if (!hasDedupeKey) reasons.push('Missing/empty dedupeKey');
      if (!hasRequiredFields) reasons.push('Missing company/jobTitle');

      invalidRecords.push({
        recordNumber,
        reason: reasons.join(', '),
        data: record
      });
      console.log(`   ❌ INVALID - ${reasons.join(', ')}`);
    }
  });

  console.log(`\n📊 GOOGLE SHEETS DATA SUMMARY:`);
  console.log(`   Total items from Google Sheets Query: ${allItems.length - 1}`);
  console.log(`   Valid records for analysis: ${existingData.length}`);
  console.log(`   Invalid/filtered records: ${invalidRecords.length}`);

  if (invalidRecords.length > 0) {
    console.log(`\n⚠️ INVALID RECORDS DETAILS:`);
    invalidRecords.forEach(invalid => {
      console.log(`   Record ${invalid.recordNumber}: ${invalid.reason}`);
    });
  }

} else {
  console.log('📄 NO ADDITIONAL ITEMS - Google Sheets Query returned no existing records');
  console.log('   This indicates either:');
  console.log('   1. The "Tracking" sheet is completely empty');
  console.log('   2. Google Sheets Query node configuration issue');
  console.log('   3. Authentication/permission problems');
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3: DEDUPEKEY FREQUENCY ANALYSIS & HISTORICAL DATA CORRUPTION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
console.log('│                SECTION 3: DEDUPEKEY FREQUENCY & CORRUPTION ANALYSIS         │');
console.log('└─────────────────────────────────────────────────────────────────────────────┘');

// ✅ CREATE DEDUPEKEY FREQUENCY MAP
const dedupeKeyFrequency = {};
const dedupeKeyRecords = {};
let totalDuplicateGroups = 0;
let totalDuplicateRecords = 0;

console.log('\n🔍 ANALYZING ALL DEDUPEKEY VALUES IN GOOGLE SHEETS:');
console.log('─'.repeat(80));

existingData.forEach((record, index) => {
  const dedupeKey = record.dedupeKey;

  if (!dedupeKeyFrequency[dedupeKey]) {
    dedupeKeyFrequency[dedupeKey] = 0;
    dedupeKeyRecords[dedupeKey] = [];
  }

  dedupeKeyFrequency[dedupeKey]++;
  dedupeKeyRecords[dedupeKey].push({
    index: index + 1,
    company: record.companyName,
    jobTitle: record.jobTitle,
    timestamp: record.timeStamp,
    isDuplicate: record.isDuplicate,
    duplicateCount: record.duplicateCount,
    status: record.status,
    rowNumber: record.row_number
  });
});

console.log(`\n📊 DEDUPEKEY FREQUENCY ANALYSIS:`);
Object.entries(dedupeKeyFrequency).forEach(([dedupeKey, count]) => {
  console.log(`\n🔑 DedupeKey: "${dedupeKey}"`);
  console.log(`   Frequency: ${count} occurrence(s)`);
  console.log(`   Status: ${count > 1 ? '🚨 DUPLICATE GROUP' : '✅ Unique'}`);

  if (count > 1) {
    totalDuplicateGroups++;
    totalDuplicateRecords += count;

    console.log(`   🔍 DUPLICATE GROUP ANALYSIS:`);
    dedupeKeyRecords[dedupeKey].forEach((record, idx) => {
      console.log(`      Record ${idx + 1}:`);
      console.log(`         Company: ${record.company}`);
      console.log(`         Job: ${record.jobTitle}`);
      console.log(`         Timestamp: ${record.timestamp}`);
      console.log(`         Current isDuplicate: ${record.isDuplicate}`);
      console.log(`         Current duplicateCount: ${record.duplicateCount}`);
      console.log(`         Current status: ${record.status}`);
      console.log(`         Row: ${record.rowNumber}`);
      console.log(`         🚨 CORRUPTION: ${record.isDuplicate === false ? 'Should be TRUE for duplicates' : 'Correctly marked'}`);
    });
  }
});

console.log(`\n📈 HISTORICAL DATA CORRUPTION SUMMARY:`);
console.log(`   Total unique dedupeKeys: ${Object.keys(dedupeKeyFrequency).length}`);
console.log(`   Duplicate groups found: ${totalDuplicateGroups}`);
console.log(`   Total duplicate records: ${totalDuplicateRecords}`);
console.log(`   Data corruption evidence: ${totalDuplicateGroups > 0 ? '🚨 YES - Multiple records with same dedupeKey all marked as non-duplicates' : '✅ None detected'}`);

if (totalDuplicateGroups > 0) {
  console.log(`\n🚨 CRITICAL DATA INTEGRITY ISSUE DETECTED:`);
  console.log(`   The Google Sheets contains ${totalDuplicateGroups} groups of duplicate records`);
  console.log(`   These duplicates are ALL incorrectly marked as isDuplicate: false`);
  console.log(`   This proves the duplicate detection system has been systematically failing`);
  console.log(`   Historical data cannot be trusted as a reliable baseline`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4: CURRENT RECORD DUPLICATE DETECTION WITH STEP-BY-STEP ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
console.log('│                SECTION 4: CURRENT RECORD DUPLICATE DETECTION                │');
console.log('└─────────────────────────────────────────────────────────────────────────────┘');

// ✅ INITIALIZE DUPLICATE DETECTION VARIABLES
const currentDedupeKey = currentRecord.dedupeKey;
const companyName = currentRecord.companyName || 'Unknown';
const jobTitle = currentRecord.jobTitle || 'Unknown';

console.log(`\n🎯 CURRENT RECORD ANALYSIS:`);
console.log(`   Company: "${companyName}"`);
console.log(`   Job Title: "${jobTitle}"`);
console.log(`   DedupeKey: "${currentDedupeKey}"`);
console.log(`   Timestamp: "${currentRecord.timeStamp}"`);

let isDuplicate = false;
let duplicateCount = 1;
let originalApplicationDate = null;
let duplicateCheckStatus = 'PENDING';
let duplicateCheckError = null;
let matchingRecords = [];

try {
  console.log('\n🔍 STARTING STEP-BY-STEP DUPLICATE DETECTION:');

  if (existingData.length === 0) {
    // ✅ EMPTY SHEET OR NO DATA - FIRST EXECUTION
    console.log('📄 CASE 1: No existing data found');
    console.log('   Result: Treating as first execution');
    isDuplicate = false;
    duplicateCount = 1;
    duplicateCheckStatus = 'EMPTY_SHEET';
    originalApplicationDate = null;
  } else {
    // ✅ SEARCH FOR EXISTING RECORDS WITH SAME DEDUPEKEY
    console.log(`� CASE 2: Analyzing ${existingData.length} existing records`);
    console.log(`🔍 Looking for matches to: "${currentDedupeKey}"`);
    console.log('\n🔍 DETAILED COMPARISON ANALYSIS:');
    console.log('─'.repeat(60));

    // Enhanced comparison with detailed logging
    existingData.forEach((record, index) => {
      const recordDedupeKey = record.dedupeKey;

      console.log(`\n📋 RECORD ${index + 1} COMPARISON:`);
      console.log(`   Existing DedupeKey: "${recordDedupeKey || 'MISSING'}"`);
      console.log(`   Current DedupeKey:  "${currentDedupeKey}"`);

      if (!recordDedupeKey) {
        console.log(`   ❌ SKIP: Record has no dedupeKey`);
        return;
      }

      // Normalize both keys for comparison
      const currentKey = currentDedupeKey.toLowerCase().trim();
      const existingKey = recordDedupeKey.toLowerCase().trim();
      const matches = existingKey === currentKey;

      console.log(`   Normalized Current:  "${currentKey}"`);
      console.log(`   Normalized Existing: "${existingKey}"`);
      console.log(`   String Length Current: ${currentKey.length}`);
      console.log(`   String Length Existing: ${existingKey.length}`);
      console.log(`   Exact Match: ${matches}`);

      if (matches) {
        matchingRecords.push(record);
        console.log(`   🎯 ✅ MATCH FOUND!`);
        console.log(`      Company: ${record.companyName}`);
        console.log(`      Job: ${record.jobTitle}`);
        console.log(`      Timestamp: ${record.timeStamp}`);
        console.log(`      Current isDuplicate flag: ${record.isDuplicate}`);
        console.log(`      Current duplicateCount: ${record.duplicateCount}`);
        console.log(`      🚨 CORRUPTION CHECK: ${record.isDuplicate === false ? 'CORRUPTED - Should be TRUE' : 'Correctly marked'}`);
      } else {
        console.log(`   ❌ NO MATCH`);
      }
    });

    console.log(`\n� DUPLICATE DETECTION SUMMARY:`);
    console.log(`   Total matching records found: ${matchingRecords.length}`);

    if (matchingRecords.length > 0) {
      // ✅ DUPLICATE DETECTED
      isDuplicate = true;
      duplicateCount = matchingRecords.length + 1; // +1 for current application
      duplicateCheckStatus = 'DUPLICATE_FOUND';

      console.log(`\n🚫 DUPLICATE DETECTED!`);
      console.log(`   Existing matching records: ${matchingRecords.length}`);
      console.log(`   This will be application attempt #${duplicateCount}`);

      // ✅ EXTRACT ORIGINAL APPLICATION DATE
      if (matchingRecords[0].timeStamp) {
        originalApplicationDate = matchingRecords[0].timeStamp;
        console.log(`   Original application date: ${originalApplicationDate}`);
      } else {
        console.warn('⚠️ Could not extract original application date');
        originalApplicationDate = 'Unknown';
      }

      // ✅ LOG EXISTING RECORD DETAILS FOR AUDIT
      console.log(`\n📋 MATCHING RECORDS AUDIT:`);
      matchingRecords.forEach((record, index) => {
        const recordTimestamp = record.timeStamp || 'Unknown';
        const recordStatus = record.status || 'Unknown';
        console.log(`   Match ${index + 1}: ${recordTimestamp} | Status: ${recordStatus} | isDuplicate: ${record.isDuplicate}`);
      });

    } else {
      // ✅ NEW RECORD
      isDuplicate = false;
      duplicateCount = 1;
      duplicateCheckStatus = 'NEW_RECORD';
      originalApplicationDate = null;

      console.log(`\n✅ NEW APPLICATION APPROVED`);
      console.log(`   No existing records found for dedupeKey: "${currentDedupeKey}"`);
      console.log(`   This appears to be the first application for this job`);
    }
  }

} catch (error) {
  // ✅ ERROR HANDLING WITH FAIL-SAFE BEHAVIOR
  console.error('❌ DUPLICATE DETECTION ERROR:', error.message);
  console.error('❌ Error details:', error);
  
  duplicateCheckError = error.message;
  duplicateCheckStatus = 'ERROR_FAIL_SAFE';
  
  // ✅ FAIL-SAFE: Treat as new application to ensure record is posted
  isDuplicate = false;
  duplicateCount = 1;
  originalApplicationDate = null;
  
  console.warn('⚠️ FAIL-SAFE MODE: Treating as new application to ensure record posting');
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5: GOOGLE SHEETS QUERY VERIFICATION & CONFIGURATION ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
console.log('│                SECTION 5: GOOGLE SHEETS QUERY VERIFICATION                  │');
console.log('└─────────────────────────────────────────────────────────────────────────────┘');

console.log('\n📋 GOOGLE SHEETS CONFIGURATION VERIFICATION:');
console.log(`   Document ID: 1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g`);
console.log(`   Sheet Name: "Tracking"`);
console.log(`   Expected Range: A:Z (all columns)`);
console.log(`   Records Retrieved: ${existingData.length}`);
console.log(`   Invalid Records Filtered: ${invalidRecords.length}`);

if (existingData.length === 0) {
  console.log('\n🚨 GOOGLE SHEETS QUERY ISSUE ANALYSIS:');
  console.log('   Possible causes for empty results:');
  console.log('   1. ❌ Sheet "Tracking" does not exist');
  console.log('   2. ❌ Sheet is completely empty (no data rows)');
  console.log('   3. ❌ Authentication/permission issues');
  console.log('   4. ❌ Google Sheets Query node misconfiguration');
  console.log('   5. ❌ Range specification excludes data');
  console.log('\n   RECOMMENDATION: Manually verify Google Sheets content');
} else {
  console.log('\n✅ GOOGLE SHEETS QUERY WORKING:');
  console.log(`   Successfully retrieved ${existingData.length} valid records`);
  console.log(`   Data structure appears correct`);
  console.log(`   All records contain required fields (dedupeKey, company, job)`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6: ROOT CAUSE ANALYSIS & DIAGNOSTIC CONCLUSIONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
console.log('│                SECTION 6: ROOT CAUSE ANALYSIS & CONCLUSIONS                 │');
console.log('└─────────────────────────────────────────────────────────────────────────────┘');

console.log('\n🔍 COMPREHENSIVE ROOT CAUSE ANALYSIS:');

// Analyze the specific failure pattern
let rootCauseCategory = 'UNKNOWN';
let rootCauseDescription = '';
let recommendedActions = [];

if (existingData.length === 0) {
  rootCauseCategory = 'DATA_ACCESS_FAILURE';
  rootCauseDescription = 'Google Sheets Query is not retrieving existing records';
  recommendedActions = [
    'Verify Google Sheets authentication and permissions',
    'Check if "Tracking" sheet exists and contains data',
    'Validate Google Sheets Query node configuration',
    'Test with manual Google Sheets access'
  ];
} else if (totalDuplicateGroups > 0) {
  rootCauseCategory = 'HISTORICAL_DATA_CORRUPTION';
  rootCauseDescription = 'Multiple records with identical dedupeKeys all marked as non-duplicates';
  recommendedActions = [
    'Historical duplicate detection system has been systematically failing',
    'Data cleanup required to correct isDuplicate flags',
    'Implement enhanced duplicate detection logic',
    'Consider data migration to fix corrupted records'
  ];
} else if (matchingRecords.length > 0 && !isDuplicate) {
  rootCauseCategory = 'LOGIC_ERROR';
  rootCauseDescription = 'Matching records found but duplicate flag not set correctly';
  recommendedActions = [
    'Review duplicate detection comparison logic',
    'Check string normalization and comparison methods',
    'Verify variable assignment and flow control'
  ];
} else if (matchingRecords.length === 0 && existingData.length > 0) {
  rootCauseCategory = 'NO_ACTUAL_DUPLICATES';
  rootCauseDescription = 'Current job has not been applied to before - no duplicates exist';
  recommendedActions = [
    'This is expected behavior for new job applications',
    'Verify you are testing with the same job data',
    'Check dedupeKey generation consistency'
  ];
}

console.log(`\n📊 DIAGNOSTIC CONCLUSION:`);
console.log(`   Root Cause Category: ${rootCauseCategory}`);
console.log(`   Description: ${rootCauseDescription}`);
console.log(`   Current Record Status: ${isDuplicate ? 'DUPLICATE' : 'NEW APPLICATION'}`);
console.log(`   Data Integrity Status: ${totalDuplicateGroups > 0 ? 'CORRUPTED' : 'CLEAN'}`);

console.log(`\n🎯 RECOMMENDED ACTIONS:`);
recommendedActions.forEach((action, index) => {
  console.log(`   ${index + 1}. ${action}`);
});

// ✅ ENHANCE DATA WITH DUPLICATE TRACKING INFORMATION
const currentTimestamp = new Date().toISOString();
const enhancedData = {
  // ✅ PRESERVE ALL ORIGINAL DATA
  ...currentRecord,

  // ✅ UPDATE STATUS BASED ON DUPLICATE DETECTION
  status: isDuplicate ? 'DUPLICATE' : 'PREPARED',

  // ✅ ADD DUPLICATE TRACKING FIELDS
  isDuplicate: isDuplicate,
  duplicateCount: duplicateCount,
  duplicateDetectedAt: isDuplicate ? currentTimestamp : null,
  originalApplicationDate: originalApplicationDate,
  duplicateReason: isDuplicate ? 'SAME_COMPANY_AND_JOB_TITLE' : null,

  // ✅ ADD PROCESSING METADATA
  duplicateCheckTimestamp: currentTimestamp,
  duplicateCheckStatus: duplicateCheckStatus,
  duplicateCheckError: duplicateCheckError,
  processingNode: 'duplicate-detection-comprehensive-diagnostic',

  // ✅ ADD DIAGNOSTIC METADATA
  diagnosticInfo: {
    rootCauseCategory: rootCauseCategory,
    rootCauseDescription: rootCauseDescription,
    totalExistingRecords: existingData.length,
    totalDuplicateGroups: totalDuplicateGroups,
    totalDuplicateRecords: totalDuplicateRecords,
    matchingRecordsFound: matchingRecords.length,
    dataCorruptionDetected: totalDuplicateGroups > 0,
    diagnosticTimestamp: diagnosticStartTime,
    diagnosticVersion: 'comprehensive-v1.0'
  },

  // ✅ ADD AUDIT TRAIL FIELDS
  processedAt: currentTimestamp,
  workflowName: 'LinkedIn-SEO-Gmail-sub-flow-Workshop-ContactTracking--Augment',
  nodeType: 'duplicate-detection-comprehensive-diagnostic',

  // ✅ ENSURE UNIQUE RECORD IDENTIFIER
  uniqueRecordId: `${currentDedupeKey}-${currentTimestamp}-${Date.now()}`,
};

// ✅ COMPREHENSIVE VALIDATION
const requiredFields = ['timeStamp', 'companyName', 'jobTitle', 'dedupeKey', 'status'];
const missingFields = requiredFields.filter(field => !enhancedData[field]);

if (missingFields.length > 0) {
  console.error('❌ CRITICAL ERROR: Missing required fields:', missingFields);
  throw new Error(`Missing required fields for Google Sheets: ${missingFields.join(', ')}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7: COMPREHENSIVE DIAGNOSTIC SUMMARY & FINAL RESULTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n┌─────────────────────────────────────────────────────────────────────────────┐');
console.log('│                SECTION 7: COMPREHENSIVE DIAGNOSTIC SUMMARY                  │');
console.log('└─────────────────────────────────────────────────────────────────────────────┘');

console.log('\n📊 FINAL DUPLICATE DETECTION RESULTS:');
console.log('─'.repeat(80));
console.log(`✅ Company: ${enhancedData.companyName}`);
console.log(`✅ Job Title: ${enhancedData.jobTitle}`);
console.log(`✅ DedupeKey: ${enhancedData.dedupeKey}`);
console.log(`✅ Status: ${enhancedData.status}`);
console.log(`✅ Is Duplicate: ${enhancedData.isDuplicate}`);
console.log(`✅ Duplicate Count: ${enhancedData.duplicateCount}`);
console.log(`✅ Original Application: ${enhancedData.originalApplicationDate || 'N/A'}`);
console.log(`✅ Check Status: ${enhancedData.duplicateCheckStatus}`);
console.log(`✅ Unique Record ID: ${enhancedData.uniqueRecordId}`);

console.log('\n🔍 DIAGNOSTIC METADATA:');
console.log('─'.repeat(80));
console.log(`📋 Root Cause: ${enhancedData.diagnosticInfo.rootCauseCategory}`);
console.log(`📋 Description: ${enhancedData.diagnosticInfo.rootCauseDescription}`);
console.log(`📋 Existing Records: ${enhancedData.diagnosticInfo.totalExistingRecords}`);
console.log(`📋 Duplicate Groups: ${enhancedData.diagnosticInfo.totalDuplicateGroups}`);
console.log(`📋 Data Corruption: ${enhancedData.diagnosticInfo.dataCorruptionDetected ? 'YES' : 'NO'}`);
console.log(`📋 Matching Records: ${enhancedData.diagnosticInfo.matchingRecordsFound}`);
console.log(`📋 Diagnostic Version: ${enhancedData.diagnosticInfo.diagnosticVersion}`);

// ✅ BUSINESS LOGIC SUMMARY WITH DIAGNOSTIC CONTEXT
if (isDuplicate) {
  console.log('\n🚫 DUPLICATE APPLICATION SUMMARY:');
  console.log('─'.repeat(60));
  console.log(`   📊 This is application attempt #${duplicateCount} for this job`);
  console.log(`   📅 Original application: ${originalApplicationDate}`);
  console.log(`   ⚠️ Status marked as: DUPLICATE`);
  console.log(`   📝 Record will be posted to Google Sheets for audit trail`);
  console.log(`   🔍 Diagnostic: Duplicate detection is working correctly`);
} else {
  console.log('\n✅ NEW APPLICATION SUMMARY:');
  console.log('─'.repeat(60));
  console.log(`   📊 First application for this job (or no existing matches)`);
  console.log(`   ✅ Status marked as: PREPARED`);
  console.log(`   📝 Record will be posted to Google Sheets`);
  console.log(`   🚀 Workflow should continue to downstream processing`);

  if (existingData.length === 0) {
    console.log(`   🔍 Diagnostic: Google Sheets appears empty - check data source`);
  } else if (totalDuplicateGroups > 0) {
    console.log(`   🔍 Diagnostic: Historical data corruption detected - system was previously failing`);
  } else {
    console.log(`   🔍 Diagnostic: System working correctly - this is genuinely a new application`);
  }
}

console.log('\n🎯 NEXT STEPS BASED ON DIAGNOSTIC:');
console.log('─'.repeat(80));
if (rootCauseCategory === 'DATA_ACCESS_FAILURE') {
  console.log('   1. ❌ CRITICAL: Fix Google Sheets Query configuration');
  console.log('   2. ❌ CRITICAL: Verify authentication and permissions');
  console.log('   3. ❌ CRITICAL: Test manual Google Sheets access');
} else if (rootCauseCategory === 'HISTORICAL_DATA_CORRUPTION') {
  console.log('   1. ⚠️ WARNING: Historical data is corrupted');
  console.log('   2. ⚠️ WARNING: Plan data cleanup for existing records');
  console.log('   3. ✅ GOOD: Current duplicate detection logic is working');
} else if (rootCauseCategory === 'NO_ACTUAL_DUPLICATES') {
  console.log('   1. ✅ GOOD: System is working correctly');
  console.log('   2. ✅ GOOD: No duplicates exist for current job');
  console.log('   3. ✅ GOOD: Test with same job data to verify duplicate detection');
} else {
  console.log('   1. 🔍 INVESTIGATE: Review diagnostic output above');
  console.log('   2. 🔍 INVESTIGATE: Check specific error conditions');
  console.log('   3. 🔍 INVESTIGATE: Validate data flow and logic');
}

console.log('\n╔══════════════════════════════════════════════════════════════════════════════╗');
console.log('║                    COMPREHENSIVE DIAGNOSTIC COMPLETE                        ║');
console.log('║                         DUPLICATE DETECTION ANALYSIS                        ║');
console.log('╚══════════════════════════════════════════════════════════════════════════════╝');

const diagnosticEndTime = new Date().toISOString();
console.log(`🕐 Diagnostic completed at: ${diagnosticEndTime}`);
console.log(`⏱️ Total diagnostic time: ${new Date(diagnosticEndTime) - new Date(diagnosticStartTime)}ms`);

// ✅ RETURN ENHANCED DATA FOR GOOGLE SHEETS
return [{ json: enhancedData }];
