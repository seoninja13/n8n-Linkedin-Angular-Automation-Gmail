// Gmail MIME Builder (DRAFT VERSION) - Constructs RFC 2822 compliant multipart MIME email
// Input: $json.emailSubject, $json.emailBody, binary data 'resume'
// Output: Base64url encoded MIME message ready for Gmail Draft API
// IMPORTANT: Change the senderEmail variable for each account:
//   - dachevivo@gmail.com (Account 1)
//   - ivoddachev@gmail.com (Account 2)
//   - ivodachevd@gmail.com (Account 3)

const items = $input.all();
const outputItems = [];

for (const item of items) {
  try {
    // Extract input data
    const subject = item.json.emailSubject;
    const bodyText = item.json.emailBody;
    const recipientEmail = $('Outreach Input Processing').item.json.contact.email;
    
    // ⚠️ CHANGE THIS FOR EACH ACCOUNT ⚠️
    const senderEmail = 'dachevivo@gmail.com';  // ← CHANGE THIS: dachevivo@gmail.com, ivoddachev@gmail.com, or ivodachevd@gmail.com
    
    // Get resume PDF binary data
    const resumeBinary = item.binary.resume;
    if (!resumeBinary) {
      throw new Error('Resume binary data not found');
    }
    
    // Convert binary data to base64
    const resumeBase64 = resumeBinary.data;
    const resumeFilename = item.json.resumeFilename || 'Resume.pdf';
    
    // Generate unique MIME boundaries
    const boundaryMixed = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const boundaryAlt = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    // Convert plain text body (preserve newlines)
    const plainTextBody = bodyText;
    
    // Convert HTML body (replace \n\n with <br><br>, \n with <br>)
    const htmlBody = '<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">' +
      bodyText.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>') +
      '</div>';
    
    // Construct RFC 2822 compliant MIME message
    const mimeMessage = [
      `From: ${senderEmail}`,
      `To: ${recipientEmail}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/mixed; boundary="${boundaryMixed}"`,
      ``,
      `--${boundaryMixed}`,
      `Content-Type: multipart/alternative; boundary="${boundaryAlt}"`,
      ``,
      `--${boundaryAlt}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      plainTextBody,
      ``,
      `--${boundaryAlt}`,
      `Content-Type: text/html; charset="UTF-8"`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      htmlBody,
      ``,
      `--${boundaryAlt}--`,
      ``,
      `--${boundaryMixed}`,
      `Content-Type: application/pdf; name="${resumeFilename}"`,
      `Content-Disposition: attachment; filename="${resumeFilename}"`,
      `Content-Transfer-Encoding: base64`,
      ``,
      resumeBase64,
      ``,
      `--${boundaryMixed}--`
    ].join('\r\n');
    
    // Base64url encode the entire MIME message
    const base64Message = Buffer.from(mimeMessage, 'utf-8').toString('base64');
    const base64urlMessage = base64Message
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Output for HTTP Request node (Draft API)
    outputItems.push({
      json: {
        raw: base64urlMessage,
        subject: subject,
        recipient: recipientEmail,
        mimeSize: mimeMessage.length,
        draftMode: true,
        senderEmail: senderEmail
      },
      pairedItem: { item: items.indexOf(item) }
    });
    
  } catch (error) {
    outputItems.push({
      json: {
        error: error.message,
        subject: item.json.emailSubject || 'Unknown',
        recipient: $('Outreach Input Processing').item.json.contact.email
      },
      pairedItem: { item: items.indexOf(item) }
    });
  }
}

return outputItems;

