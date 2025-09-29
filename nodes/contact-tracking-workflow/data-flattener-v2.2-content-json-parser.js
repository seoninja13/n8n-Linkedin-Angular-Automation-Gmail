/*
  Data Flattener for Google Sheets (N8N Code Node)
  Workflow: Contact Tracking (ID: wZyxRjWShhnSFbSV)
  File: nodes/contact-tracking-workflow/data-flattener-v2.2-content-json-parser.js
  Version: 2.2.0
  Purpose:
    - Extract job application data from AI output, preferring originalJobData nested in AI content
      (originalJobData may be present as an object or as JSON inside content strings)
    - Normalize and finalize dedupeKey (prefer originalJobData.dedupeKey; else compute from company+job)
    - Flatten AI content (content.parts[0].text | content.text | stringify(object) | direct string)
    - Produce a canonical record for Google Sheets, with robust logging and error handling
    - Maintain legacy output compatibility (recipientEmail and recepientEmail)

  Node Mode: Run Once for Each Item
  Return: Single item object: { json: <flattenedRecord> }

  Notes:
    - ASCII-only logs for reliability
    - No external dependencies; safe in N8N Code node
    - Comprehensive logs to aid duplicate detection debugging
*/

function logInfo(msg) { try { console.log(String(msg)); } catch (e) {} }
function logWarn(msg) { try { console.warn(String(msg)); } catch (e) {} }
function logError(msg){ try { console.error(String(msg)); } catch (e) {} }

// Attempts to parse a JSON string robustly, including when the string contains extra text or code fences
function safeJSONParse(str) {
  if (typeof str !== "string") return null;
  var s = str.trim();
  // Quick attempt
  try { return JSON.parse(s); } catch (_) {}
  // Strip common Markdown code fences if present
  if (s.indexOf("```") !== -1) {
    s = s.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "");
    try { return JSON.parse(s.trim()); } catch (_) {}
  }
  // Fallback: extract first {...} block
  var first = s.indexOf("{");
  var last = s.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    var candidate = s.slice(first, last + 1);
    try { return JSON.parse(candidate); } catch (_) {}
  }
  return null;
}

// Try to discover originalJobData from multiple plausible sources
function findOriginalJobData(item) {
  var source = "";
  var oj = null;

  // 1) Direct item.originalJobData (object or JSON string)
  if (item && typeof item === "object" && typeof item.originalJobData !== "undefined") {
    if (item.originalJobData && typeof item.originalJobData === "object") {
      oj = item.originalJobData;
      source = "ITEM_ORIGINALJOBDATA_OBJECT";
    } else if (typeof item.originalJobData === "string") {
      var parsed = safeJSONParse(item.originalJobData);
      if (parsed && typeof parsed === "object") {
        // If the parsed result contains originalJobData, prefer it; else assume parsed is the object itself
        oj = parsed.originalJobData && typeof parsed.originalJobData === "object" ? parsed.originalJobData : parsed;
        source = "ITEM_ORIGINALJOBDATA_STRING";
      }
    }
  }

  // 2) AI content field: content.parts[0].text, content.text, or content as string containing JSON
  if (!oj && item && typeof item === "object" && typeof item.content !== "undefined") {
    var c = item.content;
    // content as object with parts[0].text
    if (c && typeof c === "object" && Array.isArray(c.parts) && c.parts.length > 0) {
      var t = c.parts[0] && c.parts[0].text ? String(c.parts[0].text) : "";
      var parsedFromParts = safeJSONParse(t);
      if (parsedFromParts && typeof parsedFromParts === "object") {
        if (parsedFromParts.originalJobData && typeof parsedFromParts.originalJobData === "object") {
          oj = parsedFromParts.originalJobData;
          source = "CONTENT_PARTS_TEXT_ORIGINALJOBDATA";
        } else {
          // If the parsed object itself looks like the originalJobData payload, use it
          oj = parsedFromParts;
          source = "CONTENT_PARTS_TEXT_PARSED_OBJECT";
        }
      }
    }
    // content as object with text
    if (!oj && c && typeof c === "object" && typeof c.text === "string") {
      var parsedFromText = safeJSONParse(c.text);
      if (parsedFromText && typeof parsedFromText === "object") {
        if (parsedFromText.originalJobData && typeof parsedFromText.originalJobData === "object") {
          oj = parsedFromText.originalJobData;
          source = "CONTENT_TEXT_ORIGINALJOBDATA";
        } else {
          oj = parsedFromText;
          source = "CONTENT_TEXT_PARSED_OBJECT";
        }
      }
    }
    // content as string
    if (!oj && typeof c === "string") {
      var parsedFromString = safeJSONParse(c);
      if (parsedFromString && typeof parsedFromString === "object") {
        if (parsedFromString.originalJobData && typeof parsedFromString.originalJobData === "object") {
          oj = parsedFromString.originalJobData;
          source = "CONTENT_STRING_ORIGINALJOBDATA";
        } else {
          oj = parsedFromString;
          source = "CONTENT_STRING_PARSED_OBJECT";
        }
      }
    }
  }

  return { oj: oj, source: source };
}

try {
  // 1) Validate input
  var item = $json;
  if (!item || typeof item !== "object") {
    throw new Error("CRITICAL: No item data received in Data Flattener");
  }

  logInfo("DATA FLATTENER v2.2 - Start");
  logInfo("Input presence:");
  logInfo(" - item.originalJobData exists: " + (!!item.originalJobData));
  logInfo(" - item.content exists: " + (!!item.content));
  logInfo(" - top-level companyName exists: " + (!!item.companyName));

  // Utility: normalize key parts for dedupeKey computation
  function normalizeKeyPart(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }

  // Utility: robust field validator with meaningful fallbacks
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

  // 2) Extract original job data (object or JSON string), including from content JSON
  var discovery = findOriginalJobData(item);
  var oj = discovery.oj;
  var extractionSource = discovery.source;

  var extractedJobData = {};
  if (oj && typeof oj === "object") {
    extractedJobData.companyName  = oj.companyName  || "";
    extractedJobData.jobTitle     = oj.jobTitle     || "";
    extractedJobData.jobUrl       = oj.jobUrl       || "";
    extractedJobData.contactEmail = oj.contactEmail || "";
    extractedJobData.contactName  = oj.contactName  || "";
    extractedJobData.dedupeKey    = oj.dedupeKey    || "";
    extractedJobData.timeStamp    = oj.timeStamp    || "";
    extractedJobData.status       = oj.status       || "pending";
  } else {
    // Fall back to top-level fields
    extractedJobData.companyName  = item.companyName  || "";
    extractedJobData.jobTitle     = item.jobTitle     || "";
    extractedJobData.jobUrl       = item.jobUrl       || "";
    extractedJobData.contactEmail = item.contactEmail || item.recipientEmail || "";
    extractedJobData.contactName  = item.contactName  || "";
    extractedJobData.dedupeKey    = item.dedupeKey    || "";
    extractedJobData.timeStamp    = item.timeStamp    || "";
    extractedJobData.status       = item.status       || "pending";
  }

  var usedAIData = !!(oj && typeof oj === "object");

  logInfo("Extracted data:");
  logInfo(" - companyName: " + extractedJobData.companyName);
  logInfo(" - jobTitle: " + extractedJobData.jobTitle);
  logInfo(" - contactEmail: " + extractedJobData.contactEmail);
  logInfo(" - dedupeKey (raw): " + (extractedJobData.dedupeKey || "(empty)"));
  logInfo(" - extraction source: " + (usedAIData ? ("AI_ORIGINAL_DATA:" + extractionSource) : "TOP_LEVEL_FALLBACK"));

  // 3) Normalize and finalize dedupeKey
  var finalDedupeKey = extractedJobData.dedupeKey;
  if (!finalDedupeKey || String(finalDedupeKey).trim() === "") {
    var c = normalizeKeyPart(extractedJobData.companyName);
    var j = normalizeKeyPart(extractedJobData.jobTitle);
    if (c && j) {
      finalDedupeKey = c + "-" + j;
      logInfo("Computed dedupeKey from companyName and jobTitle: " + finalDedupeKey);
    }
  }
  if (!finalDedupeKey || String(finalDedupeKey).trim() === "") {
    finalDedupeKey = "missing-" + Date.now();
    logWarn("Using last-resort dedupeKey fallback: " + finalDedupeKey);
  }

  // 4) Flatten AI-generated content (supports object and string outputs)
  var flattenedContent = "";
  var finishReason = "";
  var avgLogprobs = "";

  if (item.content && typeof item.content === "object") {
    if (item.content.parts && Array.isArray(item.content.parts) && item.content.parts.length > 0) {
      flattenedContent = item.content.parts[0] && item.content.parts[0].text ? String(item.content.parts[0].text) : "";
    } else if (typeof item.content.text === "string") {
      flattenedContent = item.content.text;
    } else {
      try {
        flattenedContent = JSON.stringify(item.content);
      } catch (e) {
        flattenedContent = "";
      }
    }
  } else if (typeof item.content === "string") {
    flattenedContent = item.content;
  }

  if (typeof item.finishReason !== "undefined") finishReason = String(item.finishReason);
  if (typeof item.avgLogprobs !== "undefined") avgLogprobs = String(item.avgLogprobs);

  // Determine subject and body using safe fallbacks
  var subjectFallback = "Application for " + (extractedJobData.jobTitle || "Position") + " - Ivo Dachev";
  var emailSubjectValue = "";
  if (typeof item.subject === "string" && item.subject.trim() !== "") {
    emailSubjectValue = item.subject;
  } else if (typeof item.emailSubject === "string" && item.emailSubject.trim() !== "") {
    emailSubjectValue = item.emailSubject;
  } else {
    emailSubjectValue = subjectFallback;
  }

  var emailBodyValue = "";
  if (typeof item.emailBody === "string" && item.emailBody.trim() !== "") {
    emailBodyValue = item.emailBody;
  } else if (flattenedContent && flattenedContent.trim() !== "") {
    emailBodyValue = flattenedContent;
  } else {
    emailBodyValue = "Email content not generated";
  }

  // 5) Build flattened record for Google Sheets (keep legacy recepientEmail for compatibility)
  var recipientEmailValue = validateField(extractedJobData.contactEmail, "contactEmail", "contact-missing@placeholder.com");
  var companyNameValue    = validateField(extractedJobData.companyName, "companyName", "Company Name Missing");
  var jobTitleValue       = validateField(extractedJobData.jobTitle, "jobTitle", "Job Title Missing");

  var flattenedRecord = {
    timeStamp: extractedJobData.timeStamp || new Date().toISOString(),
    companyName: companyNameValue,
    jobTitle: jobTitleValue,
    jobUrl: extractedJobData.jobUrl || "",
    recipientEmail: recipientEmailValue,
    recepientEmail: recipientEmailValue, // legacy compatibility
    status: extractedJobData.status || "pending",
    dedupeKey: finalDedupeKey,

    // Optional AI content and metadata if available upstream
    content: flattenedContent,
    finishReason: finishReason,
    avgLogprobs: avgLogprobs,

    // Email fields
    emailSubject: emailSubjectValue,
    emailBody: emailBodyValue,

    // Enhanced email audit trail fields (for Google Sheets columns)
    emailBodyContent: emailBodyValue,
    draftCreatedTimestamp: new Date().toISOString(),
    draftStatus: (emailBodyValue && emailBodyValue !== "Email content not generated") ? "CREATED" : "FAILED",

    // Initialization for downstream duplicate handling
    isDuplicate: false,
    duplicateCount: 1,
    duplicateDetectedAt: "",
    originalApplicationDate: "",
    duplicateReason: "",

    // Processing metadata
    dataFlattenerTimestamp: new Date().toISOString(),
    processingMode: usedAIData ? "AI_ORIGINALJOBDATA_EXTRACTION" : "TOP_LEVEL_FALLBACK",
    dataExtractionSource: usedAIData ? ("AI_ORIGINAL_DATA:" + extractionSource) : "TOP_LEVEL_FALLBACK",
    dataExtractionSuccess: !!(companyNameValue && jobTitleValue && recipientEmailValue && finalDedupeKey)
  };

  // Summary logs for verification
  logInfo("DATA FLATTENER RESULTS:");
  logInfo(" - companyName: " + flattenedRecord.companyName);
  logInfo(" - jobTitle: " + flattenedRecord.jobTitle);
  logInfo(" - recipientEmail: " + flattenedRecord.recipientEmail);
  logInfo(" - dedupeKey: " + flattenedRecord.dedupeKey);
  logInfo(" - emailSubject: " + flattenedRecord.emailSubject);
  logInfo(" - dataExtractionSource: " + flattenedRecord.dataExtractionSource);
  logInfo(" - dataExtractionSuccess: " + flattenedRecord.dataExtractionSuccess);

  // 6) Return single item (N8N requirement for Run Once for Each Item)
  return { json: flattenedRecord };

} catch (err) {
  // Fail-safe fallback to keep pipeline running and aid debugging
  var msg = (err && err.message) ? err.message : String(err);
  logError("DATA FLATTENER ERROR: " + msg);

  var fallback = {
    timeStamp: new Date().toISOString(),
    companyName: "Company Name Missing",
    jobTitle: "Job Title Missing",
    jobUrl: "",
    recipientEmail: "contact-missing@placeholder.com",
    recepientEmail: "contact-missing@placeholder.com",
    status: "pending",
    dedupeKey: "missing-" + Date.now(),
    content: "",
    finishReason: "",
    avgLogprobs: "",
    emailSubject: "Application for Position - Ivo Dachev",
    emailBody: "Email content not generated",

    // Enhanced email audit trail fields (fallback values)
    emailBodyContent: "Email content not generated",
    draftCreatedTimestamp: new Date().toISOString(),
    draftStatus: "FAILED",

    emailTemplate: "job-application-outreach",
    estimatedResponseRate: "",
    personalizedElements: [],
    trackingPixelUrl: "",
    followUpSubject: "",
    followUpBody: "",
    isDuplicate: false,
    duplicateCount: 1,
    duplicateDetectedAt: "",
    originalApplicationDate: "",
    duplicateReason: "",
    dataFlattenerTimestamp: new Date().toISOString(),
    processingMode: "AI_ORIGINALJOBDATA_EXTRACTION_FALLBACK",
    dataExtractionSource: "FALLBACK_ON_ERROR",
    dataExtractionSuccess: false,
    errorMessage: msg
  };

  return { json: fallback };
}

