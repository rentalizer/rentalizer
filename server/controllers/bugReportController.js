const nodemailer = require('nodemailer');

class BugReportController {
  async submitBugReport(req, res) {
    try {
      const { subject, description, userAgent, url, timestamp } = req.body;

      // Validate required fields
      if (!subject || !description) {
        return res.status(400).json({
          success: false,
          message: 'Subject and description are required'
        });
      }

      // Create transporter for sending email
      // Using Gmail as an example - you'll need to configure this with your email service
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'gelodevelops@gmail.com',
          pass: process.env.EMAIL_PASS || 'lzkehblfbohqhuqa'
        }
      });

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@rentalizer.com',
        to: 'gelodevelops@gmail.com',
        subject: `🐛 Bug Report: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #dc2626, #ea580c); padding: 20px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🐛 New Bug Report</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="margin-bottom: 20px;">
                <h2 style="color: #dc2626; margin: 0 0 10px 0; font-size: 18px; border-bottom: 2px solid #dc2626; padding-bottom: 5px;">
                  ${subject}
                </h2>
              </div>
              
              <div style="margin-bottom: 20px;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px;">Description:</h3>
                <p style="color: #4b5563; line-height: 1.6; white-space: pre-wrap; background-color: #f9fafb; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626;">
                  ${description}
                </p>
              </div>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border: 1px solid #e5e7eb;">
                <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 14px;">📊 Technical Details:</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; font-size: 13px;"><strong>🌐 URL:</strong></td>
                    <td style="padding: 5px 0; color: #4b5563; font-size: 13px; word-break: break-all;">${url || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; font-size: 13px;"><strong>🕐 Time:</strong></td>
                    <td style="padding: 5px 0; color: #4b5563; font-size: 13px;">${timestamp ? new Date(timestamp).toLocaleString() : 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #6b7280; font-size: 13px; vertical-align: top;"><strong>💻 User Agent:</strong></td>
                    <td style="padding: 5px 0; color: #4b5563; font-size: 13px; word-break: break-all;">${userAgent || 'Not provided'}</td>
                  </tr>
                </table>
              </div>
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
                <p>This bug report was automatically generated from the Rentalizer application</p>
              </div>
            </div>
          </div>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);

      console.log(`Bug report sent to gelodevelops@gmail.com - Subject: ${subject}`);

      res.status(200).json({
        success: true,
        message: 'Bug report submitted successfully'
      });

    } catch (error) {
      console.error('Error sending bug report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit bug report',
        error: process.env.NODE_ENV === 'production' ? undefined : error.message
      });
    }
  }
}

module.exports = new BugReportController();

