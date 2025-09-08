const emailText = (candidate, senderName, senderEmail, message, siteName) =>
  `Hello ${candidate.name},\n\n` +
  `You have a new connection request on ${siteName}.\n\n` +
  `Sender Details:\n` +
  `Name: ${senderName}\n` +
  `Email: ${senderEmail}\n` +
  `${message ? `\nMessage:\n${message}\n\n` : ""}` +
  `You can reply directly to this email to contact the sender.\n\n` +
  `Regards,\n${siteName}`;

const mailHtml = (candidate, senderName, senderEmail, message, siteName) => `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin: 0 0 12px 0;">New connection request</h2>
        <p>You have received a new connection request on <strong>${siteName}</strong>.</p>
        <div style="background:#F3F4F6; padding:12px 16px; border-radius:8px;">
          <p style="margin:4px 0;"><strong>Candidate:</strong> ${
            candidate.name
          }</p>
          <p style="margin:4px 0;"><strong>Sender Name:</strong> ${senderName}</p>
          <p style="margin:4px 0;"><strong>Sender Email:</strong> ${senderEmail}</p>
          ${
            message
              ? `<p style="margin:12px 0 0 0;"><strong>Message:</strong><br/>${String(
                  message
                ).replace(/\n/g, "<br/>")}</p>`
              : ""
          }
        </div>
        <p style="margin-top:16px;">You can reply directly to this email to contact the sender.</p>
        <p style="margin-top:16px; color:#6B7280;">— ${siteName}</p>
      </div>
    `;
module.exports = { emailText, mailHtml };
