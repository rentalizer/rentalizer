const nodemailer = require('nodemailer');

class PromoCodeRequestController {
  async submitRequest(req, res) {
    try {
      const { email } = req.body;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'A valid email address is required'
        });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(normalizedEmail)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'gelodevelops@gmail.com',
          pass: process.env.EMAIL_PASS || 'lzkehblfbohqhuqa'
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@rentalizer.com',
        to: process.env.EMAIL_USER || 'gelodevelops@gmail.com',
        subject: 'New Promo Code Request',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #e2e8f0;">
            <div style="background: linear-gradient(135deg, #0891b2, #6366f1); padding: 18px; border-radius: 10px;">
              <h1 style="margin: 0; font-size: 22px; color: #f8fafc;">🚀 Promo Code Request</h1>
            </div>
            <div style="background: #0b1120; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid rgba(14,165,233,0.25);">
              <p style="margin: 0 0 12px 0; font-size: 16px; color: #cbd5f5;">
                A new promo code request was submitted from the signup form.
              </p>
              <div style="background: rgba(15,23,42,0.8); padding: 16px; border-radius: 8px; border: 1px solid rgba(14,116,144,0.4);">
                <p style="margin: 0; font-size: 15px;">
                  <strong style="color: #38bdf8;">Requester Email:</strong> 
                  <a href="mailto:${normalizedEmail}" style="color: #facc15; text-decoration: none;">${normalizedEmail}</a>
                </p>
              </div>
              <p style="margin: 20px 0 0 0; font-size: 13px; color: #94a3b8;">
                Remember to follow up within 24 hours as promised to the user.
              </p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);

      console.log(`Promo code request received for email: ${normalizedEmail}`);

      return res.status(200).json({
        success: true,
        message: 'Promo code request received'
      });
    } catch (error) {
      console.error('Promo code request error:', error);

      return res.status(500).json({
        success: false,
        message: 'Failed to submit promo code request',
        error: process.env.NODE_ENV === 'production' ? undefined : error.message
      });
    }
  }
}

module.exports = new PromoCodeRequestController();
