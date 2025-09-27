// DIAGNOSTIC DUPLICATE DETECTION - SHOWS EXACTLY WHAT'S IN GOOGLE SHEETS
// Purpose: Diagnose why duplicate detection isn't finding matches
// Mode: "Run Once for All Items" - Shows complete data analysis

console.log('=== DIAGNOSTIC DUPLICATE DETECTION ANALYSIS ===');

// ✅ ACCESS ALL DATA FROM MERGE NODE
const allItems = $input.all();
console.log(`📊 Total items from Merge node: ${allItems.length}`);

// ✅ EXTRACT CURRENT RECORD (first item from Data Flattener)
const currentRecord = allItems[0].json;
console.log('=== CURRENT RECORD ANALYSIS ===');
console.log(`✅ Current Company: ${currentRecord.companyName}`);
console.log(`✅ Current Job Title: ${currentRecord.jobTitle}`);
console.log(`✅ Current DedupeKey: "${currentRecord.dedupeKey}"`);
console.log(`✅ Current Timestamp: ${currentRecord.timeStamp}`);

// ✅ EXTRACT ALL EXISTING RECORDS (remaining items from Google Sheets Query)
let existingData = [];
if (allItems.length > 1) {
  existingData = allItems.slice(1).map(item => item.json).filter(record => 
    record && Object.keys(record).length > 0
  );
  console.log(`✅ Total existing records from Google Sheets: ${existingData.length}`);
} else {
  console.log('📄 No existing records found - Google Sheets appears to be empty');
}

console.log('=== GOOGLE SHEETS CONTENT ANALYSIS ===');

if (existingData.length === 0) {
  console.log('🔍 DIAGNOSIS: Google Sheets Query returned NO existing records');
  console.log('   This means either:');
  console.log('   1. The Google Sheets "Tracking" sheet is completely empty');
  console.log('   2. The Google Sheets Query node has a configuration issue');
  console.log('   3. There are no records that match the query criteria');
} else {
  console.log(`🔍 DIAGNOSIS: Found ${existingData.length} existing records in Google Sheets`);
  
  // ✅ ANALYZE ALL EXISTING DEDUPEKEYS
  const existingDedupeKeys = new Set();
  const dedupeKeyAnalysis = {};
  
  existingData.forEach((record, index) => {
    const dedupeKey = record.dedupeKey;
    const company = record.companyName || 'Unknown';
    const jobTitle = record.jobTitle || 'Unknown';
    const timestamp = record.timeStamp || 'Unknown';
    
    console.log(`   Record ${index + 1}:`);
    console.log(`      Company: ${company}`);
    console.log(`      Job Title: ${jobTitle}`);
    console.log(`      DedupeKey: "${dedupeKey}"`);
    console.log(`      Timestamp: ${timestamp}`);
    console.log(`      Row Number: ${record.row_number || 'Unknown'}`);
    
    if (dedupeKey) {
      existingDedupeKeys.add(dedupeKey);
      if (!dedupeKeyAnalysis[dedupeKey]) {
        dedupeKeyAnalysis[dedupeKey] = 0;
      }
      dedupeKeyAnalysis[dedupeKey]++;
    }
  });
  
  console.log('=== DEDUPEKEY FREQUENCY ANALYSIS ===');
  Object.entries(dedupeKeyAnalysis).forEach(([key, count]) => {
    console.log(`   "${key}": ${count} occurrence(s)`);
  });
  
  console.log('=== DUPLICATE DETECTION TEST ===');
  const currentDedupeKey = currentRecord.dedupeKey;
  const hasMatch = existingDedupeKeys.has(currentDedupeKey);
  
  console.log(`🔍 Looking for matches to: "${currentDedupeKey}"`);
  console.log(`🔍 Match found in existing data: ${hasMatch}`);
  
  if (hasMatch) {
    const matchingRecords = existingData.filter(record => 
      record.dedupeKey === currentDedupeKey
    );
    console.log(`🎯 DUPLICATE DETECTED! Found ${matchingRecords.length} matching record(s)`);
    matchingRecords.forEach((record, index) => {
      console.log(`   Match ${index + 1}: ${record.companyName} | ${record.jobTitle} | ${record.timeStamp}`);
    });
  } else {
    console.log(`✅ NO DUPLICATES FOUND - This is a new application`);
    console.log(`   Current: "${currentDedupeKey}"`);
    console.log(`   Available in Google Sheets: [${Array.from(existingDedupeKeys).join(', ')}]`);
  }
}

console.log('=== GOOGLE SHEETS QUERY VERIFICATION ===');
console.log('📋 To verify your Google Sheets Query node configuration:');
console.log('   1. Document ID: 1Eiwf8LVWfkVeuaVSiicIp-GaX1Po95wCVAeMH7BUr6g');
console.log('   2. Sheet Name: "Tracking"');
console.log('   3. Range: A:Z (should include all columns)');
console.log('   4. Check if the sheet actually contains the records you expect');

console.log('=== EXPECTED VS ACTUAL BEHAVIOR ===');
console.log('🔍 If you ran the same job twice, you should see:');
console.log('   - First run: No existing records → isDuplicate: false');
console.log('   - Second run: 1 existing record with same dedupeKey → isDuplicate: true');
console.log('');
console.log('🔍 Current situation analysis:');
if (existingData.length === 0) {
  console.log('   ❌ No existing records found - this suggests the Google Sheets is empty');
  console.log('   ❌ This means previous executions did not successfully write to Google Sheets');
  console.log('   ❌ Check the "Google Sheets Tracking" node configuration and credentials');
} else {
  const currentKey = currentRecord.dedupeKey;
  const hasCurrentKey = existingData.some(record => record.dedupeKey === currentKey);
  
  if (hasCurrentKey) {
    console.log('   ✅ Found matching records - duplicate detection should work');
  } else {
    console.log('   ⚠️ No matching records found for current job');
    console.log('   ⚠️ This means you haven\'t run this specific job before');
    console.log('   ⚠️ Or the previous execution failed to write to Google Sheets');
  }
}

console.log('=== DIAGNOSTIC COMPLETE ===');

// ✅ RETURN DIAGNOSTIC RESULTS
const diagnosticResult = {
  // ✅ PRESERVE ORIGINAL DATA
  ...currentRecord,
  
  // ✅ ADD DIAGNOSTIC INFORMATION
  diagnosticInfo: {
    totalExistingRecords: existingData.length,
    existingDedupeKeys: Array.from(new Set(existingData.map(r => r.dedupeKey))),
    currentDedupeKey: currentRecord.dedupeKey,
    duplicateFound: existingData.some(record => record.dedupeKey === currentRecord.dedupeKey),
    googleSheetsEmpty: existingData.length === 0,
    diagnosticTimestamp: new Date().toISOString()
  },
  
  // ✅ STANDARD DUPLICATE DETECTION RESULT
  isDuplicate: existingData.some(record => record.dedupeKey === currentRecord.dedupeKey),
  duplicateCount: existingData.filter(record => record.dedupeKey === currentRecord.dedupeKey).length + 1,
  status: existingData.some(record => record.dedupeKey === currentRecord.dedupeKey) ? 'DUPLICATE' : 'PREPARED'
};

return [{ json: diagnosticResult }];
