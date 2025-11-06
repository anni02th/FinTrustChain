import sgMail from "@sendgrid/mail";

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM || `noreply@fintrustchain.io`;

    // Initialize SendGrid with API key
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      // Uncomment the line below if you are using an EU regional subuser
      // sgMail.setDataResidency('eu');
    } else {
      console.warn("⚠️  SENDGRID_API_KEY not found in environment variables");
    }
  }

  emailHTML(subject) {
    const primary = "#5170ff";
    const text = "#545454";
    const bg = "#ffffff";
    const year = new Date().getFullYear();

    return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${subject}</title>
    <style>
      /* Mobile tweaks (supported in many clients) */
      @media (max-width: 600px) {
        .container { width: 100% !important; padding: 24px !important; }
        .btn { display: block !important; width: 100% !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background:${bg};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${bg};">
      <tr>
        <td align="center" style="padding: 32px 12px;">
          <table role="presentation" class="container" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px; background:${bg}; border:1px solid #eee; border-radius:16px; padding:32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <tr>
              <td align="left" style="padding-bottom: 8px;">
                <div style="font-size: 12px; line-height: 1; color: transparent; display:none; mso-hide:all;">
                  Verify your FinTrustChain email address. Link expires in 10 minutes.
                </div>
                <div style="font-size: 18px; font-weight: 600; color: ${primary}; letter-spacing: 0.3px;">FinTrustChain</div>
              </td>
            </tr>

            <tr>
              <td align="left" style="padding-top: 8px; padding-bottom: 12px;">
                <h1 style="margin:0; font-size: 22px; line-height: 1.4; color:${text}; font-weight:700;">Verify your email</h1>
              </td>
            </tr>

            <tr>
              <td align="left" style="padding-bottom: 16px; color:${text}; font-size:15px; line-height:1.6;">
                Hi ${this.firstName},<br/>
                Please confirm this is your email for FinTrustChain. Click the button below to verify. This link will expire in <strong>10 minutes</strong>.
              </td>
            </tr>

            <tr>
              <td align="center" style="padding: 8px 0 24px 0;">
                <a href="${this.url}"
                   class="btn"
                   style="background:${primary}; color:#ffffff; text-decoration:none; padding:14px 22px; border-radius:10px; display:inline-block; font-weight:700; font-size:15px;">
                   Verify Email
                </a>
              </td>
            </tr>

            <tr>
              <td align="left" style="padding-top: 0; padding-bottom: 16px; color:${text}; font-size:13px; line-height:1.6;">
                If the button doesn’t work, copy and paste this link into your browser:<br/>
                <a href="${this.url}" style="color:${primary}; word-break:break-all;">${this.url}</a>
              </td>
            </tr>

            <tr>
              <td align="left" style="padding-top: 8px; color:${text}; font-size:13px; line-height:1.6;">
                If you didn’t create this account, you can safely ignore this email.
              </td>
            </tr>

            <tr>
              <td align="center" style="padding-top: 28px; border-top: 1px solid #eee; color:#8a8a8a; font-size:12px; line-height:1.6;">
                © ${year} FinTrustChain • This is an automated message—please don’t reply.
              </td>
            </tr>
          </table>

          <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px; margin-top:12px;">
            <tr>
              <td align="center" style="color:#8a8a8a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:12px;">
                <a href="#" style="color:#8a8a8a; text-decoration:none;">Privacy</a> •
                <a href="#" style="color:#8a8a8a; text-decoration:none;">Help</a>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </body>
</html>`;
  }

  async send(subject, message) {
    const msg = {
      to: this.to,
      from: this.from, // Must be a verified sender in SendGrid
      subject,
      text: message,
      html: this.emailHTML(subject),
    };

    try {
      const response = await sgMail.send(msg);
      console.log(
        `✅ Email sent successfully to ${this.to} (Status: ${response[0].statusCode})`
      );
      return response;
    } catch (error) {
      console.error(`❌ Failed to send email to ${this.to}:`, error.message);

      // Log more details if available
      if (error.response) {
        console.error("SendGrid Error Details:", error.response.body);
      }

      throw new Error("Failed to send email. Please try again later.");
    }
  }

  async sendVerificationEmail() {
    const subject = "Verify Your Email Address";
    const message = `Hi ${this.firstName},

Please click the following link to verify your email address:
${this.url}

This link will expire in 10 minutes.

If you did not create this account, please ignore this email.`;
    await this.send(subject, message);
  }
}
