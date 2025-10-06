/*
  Data Flattener for Google Sheets - CORRECTED v3.0
  Workflow: Contact Tracking (ID: wZyxRjWShhnSFbSV)
  
  FIXES APPLIED:
  1. Access job data from Contact Data Merger & Processing node (not from AI output)
  2. Parse AI-generated email from current item
  3. Merge job data + AI email output
  4. Remove duplicate 'content' field (keep only 'emailBody')
  
  Version: 3.0.0
  Purpose:
    - Extract job application data from Contact Data Merger & Processing node
    - Extract AI-generated email from AI Email Template Generator output
    - Merge both data sources into a single flattened record
    - Produce canonical record for Google Sheets with NO duplicate fields
  
  Node Mode: Run Once for Each Item
  Return: Single item object: { json: <flattenedRecord> }
*/

function logInfo(msg) { try { console.log(String(msg)); } catch (e) {} }
function logWarn(msg) { try { console.warn(String(msg)); } catch (e) {} }
function logError(msg){ try { console.error(String(msg)); } catch (e) {} }

// Robust JSON parser that handles code fences and extra text
function safeJSONParse(str) {
  if (typeof str !== "string") return null;
  var s = str.trim();
  
  // Quick attempt
  try { return JSON.parse(s); } catch (_) {}
  
  // Strip Markdown code fences
  if (s.indexOf("```") !== -1) {
    s = s.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "");
    try { return JSON.parse(s.trim()); } catch (_) {}
  }
  
  // Extract first {...} block
  var first = s.indexOf("{");
  var last = s.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    var candidate = s.slice(first, last + 1);
    try { return JSON.parse(candidate); } catch (_) {}
  }
  
  return null;
}

// Normalize key parts for dedupeKey computation
function normalizeKeyPart(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

// Field validator with meaningful fallbacks
function validateField(value, fieldName, fallback) {
  if (typeof value !== "string") {
    if (value === null || typeof value === "undefined") {
      logWarn("Missing " + fieldName + ", using fallback: \"" + fallback + "\"");
      return fallback;
    }
    try {
      value = String(value);
    } catch (e) {
      logWarn("Non-string " + fieldName + ", using fallback: \"" + fallback + "\"");
      return fallback;
    }
  }
  if (value.trim() === "") {
    logWarn("Empty " + fieldName + ", using fallback: \"" + fallback + "\"");
    return fallback;
  }
  return value;
}

try {
  logInfo("=== DATA FLATTENER v3.0 - CORRECTED DATA FLOW ===");
  
  // 1) Get AI output from current item
  var aiOutput = $json;
  if (!aiOutput || typeof aiOutput !== "object") {
    throw new Error("CRITICAL: No AI output received in Data Flattener");
  }
  
  logInfo("Step 1: AI output received");
  logInfo(" - Has content: " + (!!aiOutput.content));
  logInfo(" - Has finishReason: " + (!!aiOutput.finishReason));
  
  // 2) Get job data from Contact Data Merger & Processing node
  var originalJobData;
  try {
    originalJobData = $('Contact Data Merger & Processing').item.json;
    logInfo("Step 2: Successfully accessed Contact Data Merger & Processing node");
    logInfo(" - Has companyName: " + (!!originalJobData.companyName));
    logInfo(" - Has jobTitle: " + (!!originalJobData.jobTitle));
    logInfo(" - Has candidate: " + (!!originalJobData.candidate));
  } catch (nodeError) {
    logError("CRITICAL: Cannot access Contact Data Merger & Processing node");
    logError("Error: " + nodeError.message);
    throw new Error("Cannot access upstream job data - workflow structure may be incorrect");
  }
  
  // 3) Extract job information from Contact Data Merger & Processing output
  var extractedJobData = {
    companyName: originalJobData.companyName || "",
    jobTitle: originalJobData.jobTitle || "",
    jobUrl: originalJobData.jobUrl || "",
    contactEmail: originalJobData.contactEmail || originalJobData.recipientEmail || "",
    contactName: originalJobData.contactName || "",
    dedupeKey: originalJobData.dedupeKey || "",
    timeStamp: originalJobData.timeStamp || "",
    status: originalJobData.status || "pending"
  };
  
  logInfo("Step 3: Extracted job data from upstream node:");
  logInfo(" - Company: \"" + extractedJobData.companyName + "\"");
  logInfo(" - Job Title: \"" + extractedJobData.jobTitle + "\"");
  logInfo(" - Contact Email: \"" + extractedJobData.contactEmail + "\"");
  logInfo(" - DedupeKey: \"" + extractedJobData.dedupeKey + "\"");
  
  // 4) Normalize and finalize dedupeKey
  var finalDedupeKey = extractedJobData.dedupeKey;
  if (!finalDedupeKey || String(finalDedupeKey).trim() === "") {
    var c = normalizeKeyPart(extractedJobData.companyName);
    var j = normalizeKeyPart(extractedJobData.jobTitle);
    if (c && j) {
      finalDedupeKey = c + "-" + j;
      logInfo("Computed dedupeKey from company and job: " + finalDedupeKey);
    }
  }
  if (!finalDedupeKey || String(finalDedupeKey).trim() === "") {
    finalDedupeKey = "missing-" + Date.now();
    logWarn("Using last-resort dedupeKey fallback: " + finalDedupeKey);
  }
  
  // 5) Extract AI-generated email from AI output
  var flattenedContent = "";
  var emailSubjectValue = "";
  var emailBodyValue = "";
  
  if (aiOutput.content && typeof aiOutput.content === "object") {
    if (aiOutput.content.parts && Array.isArray(aiOutput.content.parts) && aiOutput.content.parts.length > 0) {
      flattenedContent = aiOutput.content.parts[0] && aiOutput.content.parts[0].text ? String(aiOutput.content.parts[0].text) : "";
    } else if (typeof aiOutput.content.text === "string") {
      flattenedContent = aiOutput.content.text;
    } else {
      try {
        flattenedContent = JSON.stringify(aiOutput.content);
      } catch (e) {
        flattenedContent = "";
      }
    }
  } else if (typeof aiOutput.content === "string") {
    flattenedContent = aiOutput.content;
  }
  
  logInfo("Step 4: Extracted AI content (length: " + flattenedContent.length + " chars)");
  
  // 6) Parse AI output to extract emailSubject and emailBody
  if (flattenedContent) {
    var parsedAI = safeJSONParse(flattenedContent);
    if (parsedAI && typeof parsedAI === "object") {
      // Check if it's an array with one object
      if (Array.isArray(parsedAI) && parsedAI.length > 0) {
        emailSubjectValue = parsedAI[0].emailSubject || "";
        emailBodyValue = parsedAI[0].emailBody || "";
      } else {
        emailSubjectValue = parsedAI.emailSubject || "";
        emailBodyValue = parsedAI.emailBody || "";
      }
      logInfo("Step 5: Parsed AI output successfully");
      logInfo(" - Email Subject: \"" + emailSubjectValue.substring(0, 50) + "...\"");
      logInfo(" - Email Body length: " + emailBodyValue.length + " chars");
    } else {
      logWarn("Could not parse AI output as JSON, using raw content");
      emailBodyValue = flattenedContent;
    }
  }
  
  // Fallback for subject if not found
  if (!emailSubjectValue || emailSubjectValue.trim() === "") {
    emailSubjectValue = "Application for " + (extractedJobData.jobTitle || "Position") + " - Ivo Dachev";
    logWarn("Using fallback email subject: " + emailSubjectValue);
  }
  
  // Fallback for body if not found
  if (!emailBodyValue || emailBodyValue.trim() === "") {
    emailBodyValue = "Email content not generated";
    logWarn("Using fallback email body");
  }
  
  // 7) Validate critical fields
  var recipientEmailValue = validateField(extractedJobData.contactEmail, "contactEmail", "contact-missing@placeholder.com");
  var companyNameValue = validateField(extractedJobData.companyName, "companyName", "Company Name Missing");
  var jobTitleValue = validateField(extractedJobData.jobTitle, "jobTitle", "Job Title Missing");
  
  // 8) Build flattened record for Google Sheets
  var flattenedRecord = {
    timeStamp: extractedJobData.timeStamp || new Date().toISOString(),
    companyName: companyNameValue,
    jobTitle: jobTitleValue,
    jobUrl: extractedJobData.jobUrl || "",
    recipientEmail: recipientEmailValue,
    recepientEmail: recipientEmailValue, // legacy compatibility
    status: extractedJobData.status || "pending",
    dedupeKey: finalDedupeKey,
    
    // ✅ REMOVED: 'content' field (no duplicate email body fields)
    // Only include 'emailBody' for Google Sheets
    
    finishReason: aiOutput.finishReason || "",
    avgLogprobs: aiOutput.avgLogprobs || "",
    
    // Email fields from AI output
    emailSubject: emailSubjectValue,
    emailBody: emailBodyValue,
    
    // Initialization for downstream duplicate handling
    isDuplicate: false,
    duplicateCount: 1,
    duplicateDetectedAt: "",
    originalApplicationDate: "",
    duplicateReason: "",
    
    // Processing metadata
    dataFlattenerTimestamp: new Date().toISOString(),
    processingMode: "UPSTREAM_NODE_ACCESS_V3.0",
    dataExtractionSource: "CONTACT_DATA_MERGER_NODE",
    dataExtractionSuccess: !!(companyNameValue && jobTitleValue && recipientEmailValue && finalDedupeKey)
  };
  
  // 9) Summary logs
  logInfo("=== DATA FLATTENER RESULTS v3.0 ===");
  logInfo(" - Company: \"" + flattenedRecord.companyName + "\"");
  logInfo(" - Job Title: \"" + flattenedRecord.jobTitle + "\"");
  logInfo(" - Recipient Email: \"" + flattenedRecord.recipientEmail + "\"");
  logInfo(" - DedupeKey: \"" + flattenedRecord.dedupeKey + "\"");
  logInfo(" - Email Subject: \"" + flattenedRecord.emailSubject.substring(0, 50) + "...\"");
  logInfo(" - Email Body Length: " + flattenedRecord.emailBody.length + " chars");
  logInfo(" - Data Source: " + flattenedRecord.dataExtractionSource);
  logInfo(" - Extraction Success: " + flattenedRecord.dataExtractionSuccess);
  
  // 10) Warnings
  if (flattenedRecord.companyName === "Company Name Missing") {
    logWarn("WARNING: Company name not found in upstream node");
  }
  if (flattenedRecord.jobTitle === "Job Title Missing") {
    logWarn("WARNING: Job title not found in upstream node");
  }
  if (flattenedRecord.recipientEmail.includes("placeholder")) {
    logWarn("WARNING: Recipient email not found in upstream node");
  }
  
  // 11) Return single item
  return { json: flattenedRecord };
  
} catch (err) {
  var msg = (err && err.message) ? err.message : String(err);
  logError("DATA FLATTENER ERROR v3.0: " + msg);
  
  var fallback = {
    timeStamp: new Date().toISOString(),
    companyName: "Company Name Missing",
    jobTitle: "Job Title Missing",
    jobUrl: "",
    recipientEmail: "contact-missing@placeholder.com",
    recepientEmail: "contact-missing@placeholder.com",
    status: "pending",
    dedupeKey: "missing-" + Date.now(),
    finishReason: "",
    avgLogprobs: "",
    emailSubject: "Application for Position - Ivo Dachev",
    emailBody: "Email content not generated",
    isDuplicate: false,
    duplicateCount: 1,
    duplicateDetectedAt: "",
    originalApplicationDate: "",
    duplicateReason: "",
    dataFlattenerTimestamp: new Date().toISOString(),
    processingMode: "ERROR_FALLBACK_V3.0",
    dataExtractionSource: "FALLBACK_ON_ERROR",
    dataExtractionSuccess: false,
    errorMessage: msg
  };
  
  return { json: fallback };
}

