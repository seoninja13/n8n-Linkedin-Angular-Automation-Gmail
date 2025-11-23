// ============================================
// TEST MODE BOOLEAN CONVERSION FIX
// ============================================
// Purpose: Ensure testMode flag is boolean before Test Mode Router
// Position: INSERT THIS NODE BETWEEN "Dynamic Priority-Based Account Selector" AND "Test Mode Router"
// Node Type: Code node (n8n-nodes-base.code)
// Mode: Run Once for All Items
// Version: 1.0
// ============================================

const items = $input.all();

console.log('🔍 TEST MODE BOOLEAN CONVERSION FIX (v1.0)');
console.log('   Total items:', items.length);

return items.map((item, index) => {
  const testMode = item.json.testMode;
  const testModeType = typeof testMode;
  
  // Log original value for debugging
  console.log(`   Item ${index}:`);
  console.log(`     Original testMode value: ${testMode}`);
  console.log(`     Original testMode type: ${testModeType}`);
  
  // Force boolean conversion
  // Handles: true, "TRUE", "true", 1, "1"
  const testModeBoolean = testMode === true || 
                          testMode === 'TRUE' || 
                          testMode === 'true' || 
                          testMode === 1 || 
                          testMode === '1';
  
  console.log(`     Converted testMode: ${testModeBoolean} (boolean)`);
  console.log(`     Will route to: ${testModeBoolean ? 'Output 0 (Draft Creation)' : 'Output 1 (Send Email)'}`);
  
  return {
    json: {
      ...item.json,
      testMode: testModeBoolean,  // ✅ Guaranteed boolean
      
      // Add debug metadata
      testModeDebug: {
        originalValue: testMode,
        originalType: testModeType,
        convertedValue: testModeBoolean,
        convertedType: 'boolean',
        conversionApplied: true,
        fixVersion: 'v1.0-BOOLEAN-CONVERSION'
      }
    },
    binary: item.binary,
    pairedItem: item.pairedItem || { item: index }
  };
});

