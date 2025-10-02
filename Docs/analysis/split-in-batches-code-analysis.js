// EXTRACTED CODE FROM "Split in Batches" NODE
// Workflow: LinkedIn-SEO-Gmail-Orchestrator--Augment copy
// Node ID: d0ca39f2-8bc4-40a3-af07-480c483369ed
// Purpose: Extract and process job data from AI Agent output

// CRITICAL FIX: AI AGENT INTERMEDIATE STEPS DATA EXTRACTION
// Extracts structured job data from AI Agent's intermediateSteps[0].observation
// Handles JSON parsing and maintains complete data integrity

const aiAgentOutput = $json;
let jobs = [];

console.log('🔍 DEBUGGING: AI Agent Output Structure Analysis');
console.log('📊 Full AI Agent Output Keys:', Object.keys(aiAgentOutput));

// CRITICAL FIX: Extract from intermediateSteps[0].observation
if (aiAgentOutput.intermediateSteps && Array.isArray(aiAgentOutput.intermediateSteps)) {
  console.log(`📋 Found ${aiAgentOutput.intermediateSteps.length} intermediate steps`);
  
  for (let i = 0; i < aiAgentOutput.intermediateSteps.length; i++) {
    const step = aiAgentOutput.intermediateSteps[i];
    console.log(`🔍 Step ${i} structure:`, Object.keys(step));
    
    if (step.observation) {
      console.log(`📝 Step ${i} observation type:`, typeof step.observation);
      console.log(`📝 Step ${i} observation preview:`, JSON.stringify(step.observation).substring(0, 200) + '...');
      
      let observationData = step.observation;
      
      // Handle JSON string parsing
      if (typeof observationData === 'string') {
        try {
          observationData = JSON.parse(observationData);
          console.log('✅ Successfully parsed JSON string from observation');
        } catch (parseError) {
          console.log('⚠️ Observation is string but not valid JSON, using as-is');
          // Try to extract JSON from text if it's embedded
          const jsonMatch = observationData.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            try {
              observationData = JSON.parse(jsonMatch[0]);
              console.log('✅ Extracted and parsed JSON from text');
            } catch (extractError) {
              console.log('❌ Failed to extract JSON from text');
              continue;
            }
          } else {
            continue;
          }
        }
      }
      
      // Extract jobs from parsed observation data
      if (Array.isArray(observationData)) {
        jobs = observationData;
        console.log(`✅ Found job array in step ${i} with ${jobs.length} jobs`);
        break;
      } else if (observationData && typeof observationData === 'object') {
        // Check various possible job array locations
        if (observationData.jobs && Array.isArray(observationData.jobs)) {
          jobs = observationData.jobs;
          console.log(`✅ Found jobs array in step ${i} with ${jobs.length} jobs`);
          break;
        } else if (observationData.data && Array.isArray(observationData.data)) {
          jobs = observationData.data;
          console.log(`✅ Found data array in step ${i} with ${jobs.length} jobs`);
          break;
        } else if (observationData.results && Array.isArray(observationData.results)) {
          jobs = observationData.results;
          console.log(`✅ Found results array in step ${i} with ${jobs.length} jobs`);
          break;
        }
      }
    }
  }
}

// Fallback: Check traditional output locations
if (jobs.length === 0) {
  console.log('🔄 Fallback: Checking traditional output locations');
  
  if (aiAgentOutput.output && aiAgentOutput.output.toolOutput) {
    const toolOutput = aiAgentOutput.output.toolOutput;
    if (Array.isArray(toolOutput)) {
      jobs = toolOutput;
      console.log(`✅ Fallback: Found jobs in output.toolOutput with ${jobs.length} jobs`);
    } else if (toolOutput.jobs && Array.isArray(toolOutput.jobs)) {
      jobs = toolOutput.jobs;
      console.log(`✅ Fallback: Found jobs in output.toolOutput.jobs with ${jobs.length} jobs`);
    }
  }
}

// Final validation and processing
console.log(`📊 Total jobs extracted: ${jobs.length}`);

if (jobs.length === 0) {
  console.log('❌ CRITICAL ERROR: No jobs found in AI Agent output');
  console.log('🔍 Full AI Agent Output for debugging:', JSON.stringify(aiAgentOutput, null, 2));
  return [];
}

// Validate and process each job
const validJobs = jobs.filter((job, index) => {
  if (!job || typeof job !== 'object') {
    console.log(`⚠️ Skipping invalid job at index ${index}: not an object`);
    return false;
  }
  
  // Validate essential fields based on limit node output structure
  const hasId = job.id || job.jobId || job.linkedinJobId;
  const hasTitle = job.title || job.jobTitle || job.position;
  const hasCompany = job.companyName || job.company || job.organization;
  
  if (!hasId || !hasTitle || !hasCompany) {
    console.log(`⚠️ Skipping incomplete job at index ${index}:`, {
      id: hasId,
      title: hasTitle,
      company: hasCompany
    });
    return false;
  }
  
  console.log(`✅ Valid job ${index + 1}: "${job.title}" at "${job.companyName}" (ID: ${job.id})`);
  return true;
});

console.log(`✅ Validated ${validJobs.length} jobs out of ${jobs.length} total`);

// Process each valid job into individual items
const jobItems = validJobs.map((job, index) => {
  // Preserve complete data structure from limit node output
  const processedJob = {
    // Core identification (matching limit node structure)
    id: job.id || job.jobId || job.linkedinJobId || '',
    title: job.title || job.jobTitle || job.position || 'Unknown Position',
    companyName: job.companyName || job.company || job.organization || 'Unknown Company',
    location: job.location || job.jobLocation || job.city || 'Location Not Specified',
    
    // Job descriptions (preserve both HTML and text versions)
    descriptionHtml: job.descriptionHtml || job.description || '',
    descriptionText: job.descriptionText || job.description || '',
    description: job.description || job.descriptionHtml || job.descriptionText || '',
    
    // Application and URL information
    applyUrl: job.applyUrl || job.applicationUrl || job.jobUrl || job.url || '',
    salary: job.salary || job.compensation || job.salaryRange || '',
    
    // Additional fields from limit node output
    postedDate: job.postedDate || job.datePosted || job.publishedAt || '',
    jobType: job.jobType || job.employmentType || job.type || '',
    experienceLevel: job.experienceLevel || job.seniorityLevel || '',
    
    // Company details
    companyWebsite: job.companyWebsite || job.website || job.companyUrl || '',
    companySize: job.companySize || job.employeeCount || '',
    industry: job.industry || job.sector || '',
    
    // LinkedIn specific data
    linkedinJobId: job.linkedinJobId || job.jobId || job.id || '',
    linkedinCompanyId: job.linkedinCompanyId || job.companyId || '',
    
    // Preserve ALL original fields from limit node output
    ...job,
    
    // Template metadata
    jobIndex: index,
    totalJobs: validJobs.length,
    processingMetadata: {
      processedAt: new Date().toISOString(),
      orchestratorWorkflow: 'LinkedIn-Automation-Template',
      dataSource: 'AI-Agent-IntermediateSteps-Observation',
      processingNode: 'Code-Split-in-Batches-Fixed',
      templateVersion: 'intermediate-steps-fix-v1.0',
      originalJobCount: jobs.length,
      validJobCount: validJobs.length,
      dataIntegrityPreserved: true
    }
  };

  return { json: processedJob };
});

// Comprehensive success logging
console.log('🎯 PROCESSING RESULTS:');
console.log(`✅ Successfully extracted ${validJobs.length} jobs from AI Agent intermediateSteps`);
console.log(`📋 Job IDs: ${jobItems.slice(0, 5).map(item => item.json.id).join(', ')}${jobItems.length > 5 ? '...' : ''}`);
console.log(`📋 Job Titles: ${jobItems.slice(0, 3).map(item => item.json.title).join(', ')}${jobItems.length > 3 ? '...' : ''}`);
console.log(`📋 Companies: ${jobItems.slice(0, 3).map(item => item.json.companyName).join(', ')}${jobItems.length > 3 ? '...' : ''}`);
console.log(`📋 Locations: ${jobItems.slice(0, 3).map(item => item.json.location).join(', ')}${jobItems.length > 3 ? '...' : ''}`);

// Data integrity validation
const firstJob = jobItems[0]?.json;
if (firstJob) {
  console.log('🔍 FIRST JOB SAMPLE:');
  console.log(`   ID: ${firstJob.id}`);
  console.log(`   Title: ${firstJob.title}`);
  console.log(`   Company: ${firstJob.companyName}`);
  console.log(`   Location: ${firstJob.location}`);
  console.log(`   Apply URL: ${firstJob.applyUrl}`);
  console.log(`   Description Length: ${firstJob.description?.length || 0} characters`);
}

// Final validation
if (jobItems.length === validJobs.length && validJobs.length >= 10) {
  console.log('🎉 SUCCESS: All 10+ jobs successfully extracted and processed');
  console.log('✅ Data integrity maintained - Ready for parallel workshop processing');
} else if (jobItems.length > 0) {
  console.log(`⚠️ PARTIAL SUCCESS: ${jobItems.length} jobs processed (expected 10+)`);
} else {
  console.log('❌ FAILURE: No jobs successfully processed');
}

console.log(`🚀 Returning ${jobItems.length} individual job items for distributed processing`);

return jobItems;

// ============================================================================
// ANALYSIS NOTES:
// ============================================================================
// 
// BATCH SIZE CONFIGURATION: NOT FOUND IN THIS CODE
// 
// This code does NOT contain any explicit batch size limiting logic such as:
// - .slice(0, 10)
// - .take(10)
// - .limit(10)
// - if (validJobs.length > 10) validJobs = validJobs.slice(0, 10)
// 
// The code processes ALL valid jobs extracted from the AI Agent output.
// 
// OBSERVATION:
// - The code extracts jobs from aiAgentOutput.intermediateSteps[0].observation
// - It validates each job
// - It returns ALL valid jobs as individual items
// - There is NO limiting logic to restrict the output to 10 items
// 
// CONCLUSION:
// The batch size of 10 items is NOT configured in this "Split in Batches" node.
// The 10-item limit must be configured elsewhere, likely in:
// 1. The Job Discovery Workshop (workflow ID: wbkQo6X2R8XQOYgG)
// 2. A "Limit" node in the Job Discovery workflow
// 
// NEXT STEP:
// Retrieve and analyze the Job Discovery Workshop to find the batch size configuration.

