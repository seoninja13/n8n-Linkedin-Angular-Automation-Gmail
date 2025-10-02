// RESUME FILENAME CUSTOMIZER (ENHANCED WITH EMAIL DATA PARSING + SIGNATURE FIX)
// Renames binary data and parses AI Email data for Draft Gmail node
// FIXED: Parses JSON from AI Email Generation and provides clean data structure
// ENHANCED: Replaces any placeholder names/emails/phones with actual candidate data

const jobTitle = $('Outreach Input Processing').item.json.job.title;
const companyName = $('Outreach Input Processing').item.json.job.company;
const candidateName = "Ivo Dachev";
const candidateEmail = "dachevivo@gmail.com";
const candidatePhone = "+1 (650)-222-7923";

// Clean strings for filename
const cleanJobTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, '_');
const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, '_');
const cleanCandidateName = candidateName.replace(/[^a-zA-Z0-9]/g, '_');

// Generate dynamic filename
const filename = 'Resume_' + cleanCandidateName + '_' + cleanJobTitle + '_' + cleanCompanyName + '.pdf';

console.log('📄 Resume Filename:', filename);

// Get binary data from Google Drive export
const binaryData = $input.item.binary.data;

if (!binaryData) {
  throw new Error('No binary data found from Google Drive export');
}

// ✅ FIXED: Parse AI Email data and extract email content
const aiEmailData = $('AI Email Generation').item.json;

console.log('🔍 AI Email Data Structure:');
console.log('   Has content:', !!aiEmailData.content);
console.log('   Has parts:', !!(aiEmailData.content && aiEmailData.content.parts));
console.log('   Parts length:', aiEmailData.content && aiEmailData.content.parts ? aiEmailData.content.parts.length : 0);

// Parse the JSON string from Gemini response with error handling
let emailSubject = 'Application for ' + jobTitle + ' - ' + candidateName;
let emailBody = 'Dear Hiring Manager,\n\nPlease see my attached resume for the ' + jobTitle + ' position at ' + companyName + '.\n\nSincerely,\n' + candidateName + '\n' + candidatePhone + '\n' + candidateEmail;

try {
  if (aiEmailData.content && aiEmailData.content.parts && aiEmailData.content.parts[0]) {
    const textContent = aiEmailData.content.parts[0].text;
    console.log('📄 Raw AI Response Text (first 200 chars):', textContent.substring(0, 200));
    
    const emailDataArray = JSON.parse(textContent);
    console.log('✅ JSON Parse Success');
    console.log('   Array length:', emailDataArray.length);
    
    if (emailDataArray && emailDataArray.length > 0 && emailDataArray[0]) {
      console.log('   Has emailSubject:', !!emailDataArray[0].emailSubject);
      console.log('   Has emailBody:', !!emailDataArray[0].emailBody);
      
      emailSubject = emailDataArray[0].emailSubject || emailSubject;
      emailBody = emailDataArray[0].emailBody || emailBody;
      
      console.log('✅ Email Data Extracted Successfully');
    } else {
      console.warn('⚠️ Parsed array is empty or missing element at index 0');
    }
  } else {
    console.warn('⚠️ AI Email data structure is missing content.parts[0]');
  }
} catch (error) {
  console.error('❌ Failed to parse AI Email data:', error.message);
  console.error('   Using fallback email content');
}

// ✅ ENHANCED: Replace any placeholder names/emails/phones with actual candidate data
console.log('🔧 Applying Signature Fix...');

// List of common placeholder names that AI might generate
const placeholderNames = [
  'John Smith',
  'Jane Doe',
  'Alice Wonderland',
  'Bob Johnson',
  'Sarah Williams',
  'Michael Brown',
  'Emily Davis',
  'David Wilson',
  'Jennifer Martinez',
  'Robert Anderson'
];

// List of common placeholder emails
const placeholderEmails = [
  'john.smith@email.com',
  'jane.doe@email.com',
  'alice.wonderland@email.com',
  'example@email.com',
  'user@example.com',
  'contact@email.com'
];

// List of common placeholder phone patterns
const placeholderPhones = [
  '555-123-4567',
  '(555) 123-4567',
  '555.123.4567',
  '123-456-7890',
  '(123) 456-7890'
];

// Replace placeholder names with actual candidate name
placeholderNames.forEach(function(placeholder) {
  if (emailBody.indexOf(placeholder) !== -1) {
    console.log('   🔧 Replacing placeholder name: ' + placeholder + ' → ' + candidateName);
    emailBody = emailBody.split(placeholder).join(candidateName);
  }
  if (emailSubject.indexOf(placeholder) !== -1) {
    console.log('   🔧 Replacing placeholder name in subject: ' + placeholder + ' → ' + candidateName);
    emailSubject = emailSubject.split(placeholder).join(candidateName);
  }
});

// Replace placeholder emails with actual candidate email
placeholderEmails.forEach(function(placeholder) {
  if (emailBody.indexOf(placeholder) !== -1) {
    console.log('   🔧 Replacing placeholder email: ' + placeholder + ' → ' + candidateEmail);
    emailBody = emailBody.split(placeholder).join(candidateEmail);
  }
});

// Replace placeholder phones with actual candidate phone
placeholderPhones.forEach(function(placeholder) {
  if (emailBody.indexOf(placeholder) !== -1) {
    console.log('   🔧 Replacing placeholder phone: ' + placeholder + ' → ' + candidatePhone);
    emailBody = emailBody.split(placeholder).join(candidatePhone);
  }
});

console.log('✅ Signature Fix Applied');

console.log('📧 Final Email Subject:', emailSubject);
console.log('📧 Final Email Body Length:', emailBody.length);
console.log('📧 Email Body Preview (first 100 chars):', emailBody.substring(0, 100));
console.log('📧 Email Body Preview (last 200 chars):', emailBody.substring(emailBody.length - 200));

// Validate that we have string values (not undefined)
if (typeof emailSubject !== 'string' || emailSubject.length === 0) {
  console.error('❌ emailSubject is not a valid string, using fallback');
  emailSubject = 'Application for ' + jobTitle + ' - ' + candidateName;
}

if (typeof emailBody !== 'string' || emailBody.length === 0) {
  console.error('❌ emailBody is not a valid string, using fallback');
  emailBody = 'Dear Hiring Manager,\n\nPlease see my attached resume for the ' + jobTitle + ' position at ' + companyName + '.\n\nSincerely,\n' + candidateName + '\n' + candidatePhone + '\n' + candidateEmail;
}

// Final verification: Check if signature contains actual candidate data
const hasCorrectName = emailBody.indexOf(candidateName) !== -1;
const hasCorrectEmail = emailBody.indexOf(candidateEmail) !== -1;
const hasCorrectPhone = emailBody.indexOf(candidatePhone) !== -1;

console.log('🔍 Signature Verification:');
console.log('   Contains candidate name (' + candidateName + '): ' + hasCorrectName);
console.log('   Contains candidate email (' + candidateEmail + '): ' + hasCorrectEmail);
console.log('   Contains candidate phone (' + candidatePhone + '): ' + hasCorrectPhone);

if (!hasCorrectName || !hasCorrectEmail || !hasCorrectPhone) {
  console.warn('⚠️ WARNING: Email body may not contain correct candidate signature');
  console.warn('   Appending correct signature to ensure accuracy...');
  
  // Ensure the email ends with the correct signature
  const correctSignature = '\n\nSincerely,\n' + candidateName + '\n' + candidatePhone + '\n' + candidateEmail;
  
  // Remove any existing "Sincerely," section and replace with correct one
  const sincerelyIndex = emailBody.lastIndexOf('Sincerely,');
  if (sincerelyIndex !== -1) {
    emailBody = emailBody.substring(0, sincerelyIndex) + correctSignature;
    console.log('   ✅ Replaced existing signature with correct one');
  } else {
    emailBody = emailBody + correctSignature;
    console.log('   ✅ Appended correct signature');
  }
}

// Return with renamed binary property and CLEAN email data
return {
  json: {
    emailSubject: emailSubject,
    emailBody: emailBody,
    resumeFilename: filename,
    resumeGenerated: true,
    jobTitle: jobTitle,
    companyName: companyName,
    candidateName: candidateName,
    candidateEmail: candidateEmail,
    candidatePhone: candidatePhone,
    originalAiResponse: aiEmailData  // Keep original for debugging
  },
  binary: {
    resume: {
      data: binaryData.data,
      mimeType: 'application/pdf',
      fileName: filename,
      fileExtension: 'pdf'
    }
  }
};

