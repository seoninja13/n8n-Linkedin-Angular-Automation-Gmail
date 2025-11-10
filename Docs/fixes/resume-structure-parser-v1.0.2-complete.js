// RESUME STRUCTURE PARSER (v1.0.2 - COMPLETE)
// Parses base resume into structured sections for specialized AI agents
// Validates that all 10-11 positions are present
// FIXED v1.0.1: Now handles both 'EXPERIENCE' and 'WORK EXPERIENCE' section headers
// FIXED v1.0.2: Now handles TAB-separated format instead of pipe-separated format

const inputData = $json;

// Get base resume from Keyword Processing And Validation node
const baseResume = inputData.baseResume || '';

if (!baseResume) {
  throw new Error('Missing base resume from Keyword Processing And Validation node');
}

// Parse identity section (first 2 lines)
const lines = baseResume.split('\n');
const identityLine1 = lines[0] || '';
const identityLine2 = lines[1] || '';

// Extract identity fields
const identity = {
  name: identityLine1.trim(),
  phone: identityLine2.match(/\(\d{3}\) \d{3}-\d{4}/)?.[0] || '',
  email: identityLine2.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || '',
  location: identityLine2.split('|')[0]?.trim() || ''
};

// Validate identity
if (!identity.name.includes('IVO DACHEV')) {
  throw new Error('Invalid base resume: missing candidate name "IVO DACHEV"');
}

if (!identity.phone || !identity.email) {
  throw new Error('Invalid base resume: missing contact information');
}

// Find SUMMARY section
const summaryStartIndex = lines.findIndex(line => line.trim().toUpperCase() === 'SUMMARY');
if (summaryStartIndex === -1) {
  throw new Error('Invalid base resume: missing SUMMARY section');
}

// Find EXPERIENCE section (handles both 'EXPERIENCE' and 'WORK EXPERIENCE')
const experienceStartIndex = lines.findIndex(line => {
  const upperLine = line.trim().toUpperCase();
  return upperLine === 'EXPERIENCE' || upperLine === 'WORK EXPERIENCE';
});
if (experienceStartIndex === -1) {
  throw new Error('Invalid base resume: missing EXPERIENCE or WORK EXPERIENCE section');
}

// Extract summary
const summaryLines = lines.slice(summaryStartIndex + 1, experienceStartIndex);
const summary = summaryLines.join('\n').trim();

if (!summary) {
  throw new Error('Invalid base resume: empty SUMMARY section');
}

// Extract experience section
const experienceLines = lines.slice(experienceStartIndex + 1);

// Parse experience positions (TAB-separated format)
// Format:
//   Line 1: Job Title\tDates
//   Line 2: Company\tLocation
//   Lines 3+: Bullet points
const positions = [];
let i = 0;

while (i < experienceLines.length) {
  const line = experienceLines[i].trim();
  
  // Check if this line is a position header (contains TAB and has date pattern)
  if (line.includes('\t') && /\d{2}\/\d{4}/.test(line)) {
    // This is a position header: "Job Title\tDates"
    const parts = line.split('\t');
    const title = parts[0]?.trim() || '';
    const dates = parts[1]?.trim() || '';
    
    // Next line should be: "Company\tLocation"
    i++;
    if (i >= experienceLines.length) break;
    
    const companyLine = experienceLines[i].trim();
    const companyParts = companyLine.split('\t');
    const company = companyParts[0]?.trim() || '';
    const location = companyParts[1]?.trim() || '';
    
    // Collect bullet points
    i++;
    const bullets = [];
    while (i < experienceLines.length) {
      const bulletLine = experienceLines[i].trim();
      
      // Stop if we hit the next position header (contains TAB and date pattern)
      if (bulletLine.includes('\t') && /\d{2}\/\d{4}/.test(bulletLine)) {
        break;
      }
      
      // Stop if we hit EDUCATION section
      if (bulletLine.toUpperCase() === 'EDUCATION') {
        break;
      }
      
      // Add bullet point if it's not empty
      if (bulletLine) {
        bullets.push(bulletLine);
      }
      
      i++;
    }
    
    // Only add position if we have valid data
    if (title && company) {
      positions.push({
        company,
        title,
        dates,
        location,
        bullets
      });
    }
  } else {
    i++;
  }
}

// Validate position count
if (positions.length < 10) {
  throw new Error(`Invalid base resume: found only ${positions.length} positions (expected 10-11)`);
}

console.log('✅ Resume Structure Parser Success:');
console.log(`   Identity: ${identity.name}`);
console.log(`   Summary length: ${summary.length} characters`);
console.log(`   Positions found: ${positions.length}`);

// Output structured data
return [{
  json: {
    identity,
    summary,
    experience: positions,
    metadata: {
      totalPositions: positions.length,
      summaryLength: summary.length,
      parsedAt: new Date().toISOString()
    },
    keywordGuidance: inputData.keywordGuidance,
    jobContext: inputData.jobContext
  }
}];

