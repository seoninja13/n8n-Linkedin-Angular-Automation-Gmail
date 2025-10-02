// RESUME FILENAME CUSTOMIZER (ENHANCED WITH EMAIL DATA PARSING)
// Renames binary data and parses AI Email data for Draft Gmail node
// FIXED: Parses JSON from AI Email Generation and provides clean data structure

const jobTitle = $('Outreach Input Processing').item.json.job.title;
const companyName = $('Outreach Input Processing').item.json.job.company;
const candidateName = "Ivo Dachev";

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
let emailBody = 'Dear Hiring Manager,\n\nPlease see my attached resume for the ' + jobTitle + ' position at ' + companyName + '.\n\nSincerely,\n' + candidateName;

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

console.log('📧 Final Email Subject:', emailSubject);
console.log('📧 Final Email Body Length:', emailBody.length);
console.log('📧 Email Body Preview (first 100 chars):', emailBody.substring(0, 100));

// Validate that we have string values (not undefined)
if (typeof emailSubject !== 'string' || emailSubject.length === 0) {
  console.error('❌ emailSubject is not a valid string, using fallback');
  emailSubject = 'Application for ' + jobTitle + ' - ' + candidateName;
}

if (typeof emailBody !== 'string' || emailBody.length === 0) {
  console.error('❌ emailBody is not a valid string, using fallback');
  emailBody = 'Dear Hiring Manager,\n\nPlease see my attached resume for the ' + jobTitle + ' position at ' + companyName + '.\n\nSincerely,\n' + candidateName;
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

