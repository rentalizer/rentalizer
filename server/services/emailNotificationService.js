const nodemailer = require('nodemailer');

class EmailNotificationService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  // Initialize email transporter
  initializeTransporter() {
    // Check if email configuration is available
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Use real email configuration
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      console.log('📧 Email transporter initialized with real configuration');
    } else {
      // Use mock transporter for development
      this.transporter = {
        sendMail: async (mailOptions) => {
          console.log('📧 Mock email sent:', {
            to: mailOptions.to,
            subject: mailOptions.subject,
            preview: mailOptions.text?.substring(0, 100) + '...'
          });
          return { messageId: 'mock-message-id-' + Date.now() };
        }
      };
      console.log('📧 Email transporter initialized with mock configuration (set EMAIL_HOST, EMAIL_USER, EMAIL_PASS for real emails)');
    }
  }

  // Send event invitation email
  async sendEventInvitation(invitation, event, inviter) {
    try {
      const subject = `You're invited to: ${event.title}`;
      const html = this.generateInvitationEmailHTML(invitation, event, inviter);
      const text = this.generateInvitationEmailText(invitation, event, inviter);

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.FROM_EMAIL || 'noreply@rentalizer.com',
        to: invitation.user.email,
        subject,
        text,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Event invitation email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Failed to send event invitation email:', error);
      throw new Error(`Failed to send invitation email: ${error.message}`);
    }
  }

  // Send event reminder email
  async sendEventReminder(invitation, event) {
    try {
      const subject = `Reminder: ${event.title} is tomorrow`;
      const html = this.generateReminderEmailHTML(invitation, event);
      const text = this.generateReminderEmailText(invitation, event);

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.FROM_EMAIL || 'noreply@rentalizer.com',
        to: invitation.user.email,
        subject,
        text,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Event reminder email sent:', result.messageId);
      
      // Mark reminder as sent
      await invitation.markReminderSent();
      
      return result;
    } catch (error) {
      console.error('Failed to send event reminder email:', error);
      throw new Error(`Failed to send reminder email: ${error.message}`);
    }
  }

  // Send event update notification
  async sendEventUpdateNotification(invitation, event, changes) {
    try {
      const subject = `Event Updated: ${event.title}`;
      const html = this.generateUpdateNotificationHTML(invitation, event, changes);
      const text = this.generateUpdateNotificationText(invitation, event, changes);

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.FROM_EMAIL || 'noreply@rentalizer.com',
        to: invitation.user.email,
        subject,
        text,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Event update notification sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Failed to send event update notification:', error);
      throw new Error(`Failed to send update notification: ${error.message}`);
    }
  }

  // Send RSVP confirmation email
  async sendRSVPConfirmation(invitation, event) {
    try {
      const subject = `RSVP Confirmed: ${event.title}`;
      const html = this.generateRSVPConfirmationHTML(invitation, event);
      const text = this.generateRSVPConfirmationText(invitation, event);

      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.FROM_EMAIL || 'noreply@rentalizer.com',
        to: invitation.user.email,
        subject,
        text,
        html
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('RSVP confirmation email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Failed to send RSVP confirmation email:', error);
      throw new Error(`Failed to send RSVP confirmation: ${error.message}`);
    }
  }

  // Generate invitation email HTML
  generateInvitationEmailHTML(invitation, event, inviter) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Event Invitation</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">You're invited to an event!</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">${event.title}</h3>
            <p><strong>Date:</strong> ${event.event_date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.event_time}</p>
            <p><strong>Duration:</strong> ${event.duration}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            ${event.zoom_link ? `<p><strong>Join Link:</strong> <a href="${event.zoom_link}">${event.zoom_link}</a></p>` : ''}
            ${event.description ? `<p><strong>Description:</strong><br>${event.description}</p>` : ''}
          </div>
          
          <p>Invited by: ${inviter.firstName} ${inviter.lastName}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/events/${event._id}" 
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Event Details
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            This invitation was sent to you because you're a member of the Rentalizer community.
          </p>
        </div>
      </body>
      </html>
    `;
  }

  // Generate invitation email text
  generateInvitationEmailText(invitation, event, inviter) {
    return `
You're invited to an event!

Event: ${event.title}
Date: ${event.event_date.toLocaleDateString()}
Time: ${event.event_time}
Duration: ${event.duration}
Location: ${event.location}
${event.zoom_link ? `Join Link: ${event.zoom_link}` : ''}
${event.description ? `Description: ${event.description}` : ''}

Invited by: ${inviter.firstName} ${inviter.lastName}

View event details: ${process.env.FRONTEND_URL || 'http://localhost:8080'}/events/${event._id}

This invitation was sent to you because you're a member of the Rentalizer community.
    `;
  }

  // Generate reminder email HTML
  generateReminderEmailHTML(invitation, event) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Event Reminder</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626;">Reminder: Event Tomorrow!</h2>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #991b1b;">${event.title}</h3>
            <p><strong>Date:</strong> ${event.event_date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.event_time}</p>
            <p><strong>Duration:</strong> ${event.duration}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            ${event.zoom_link ? `<p><strong>Join Link:</strong> <a href="${event.zoom_link}">${event.zoom_link}</a></p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/events/${event._id}" 
               style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Event Details
            </a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate reminder email text
  generateReminderEmailText(invitation, event) {
    return `
Reminder: Event Tomorrow!

Event: ${event.title}
Date: ${event.event_date.toLocaleDateString()}
Time: ${event.event_time}
Duration: ${event.duration}
Location: ${event.location}
${event.zoom_link ? `Join Link: ${event.zoom_link}` : ''}

View event details: ${process.env.FRONTEND_URL || 'http://localhost:8080'}/events/${event._id}
    `;
  }

  // Generate update notification HTML
  generateUpdateNotificationHTML(invitation, event, changes) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Event Updated</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #059669;">Event Updated</h2>
          
          <p>The following event has been updated:</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #047857;">${event.title}</h3>
            <p><strong>Date:</strong> ${event.event_date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.event_time}</p>
            <p><strong>Duration:</strong> ${event.duration}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            ${event.zoom_link ? `<p><strong>Join Link:</strong> <a href="${event.zoom_link}">${event.zoom_link}</a></p>` : ''}
          </div>
          
          ${changes.length > 0 ? `
            <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #92400e;">Changes made:</h4>
              <ul>
                ${changes.map(change => `<li>${change}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/events/${event._id}" 
               style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Updated Event
            </a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate update notification text
  generateUpdateNotificationText(invitation, event, changes) {
    return `
Event Updated

The following event has been updated:

Event: ${event.title}
Date: ${event.event_date.toLocaleDateString()}
Time: ${event.event_time}
Duration: ${event.duration}
Location: ${event.location}
${event.zoom_link ? `Join Link: ${event.zoom_link}` : ''}

${changes.length > 0 ? `Changes made:\n${changes.map(change => `- ${change}`).join('\n')}` : ''}

View updated event: ${process.env.FRONTEND_URL}/events/${event._id}
    `;
  }

  // Generate RSVP confirmation HTML
  generateRSVPConfirmationHTML(invitation, event) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>RSVP Confirmed</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #059669;">RSVP Confirmed</h2>
          
          <p>Your RSVP for the following event has been confirmed:</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #047857;">${event.title}</h3>
            <p><strong>Date:</strong> ${event.event_date.toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${event.event_time}</p>
            <p><strong>Duration:</strong> ${event.duration}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Your RSVP:</strong> <span style="color: #059669; font-weight: bold;">${invitation.status.toUpperCase()}</span></p>
            ${event.zoom_link ? `<p><strong>Join Link:</strong> <a href="${event.zoom_link}">${event.zoom_link}</a></p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/events/${event._id}" 
               style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Event Details
            </a>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generate RSVP confirmation text
  generateRSVPConfirmationText(invitation, event) {
    return `
RSVP Confirmed

Your RSVP for the following event has been confirmed:

Event: ${event.title}
Date: ${event.event_date.toLocaleDateString()}
Time: ${event.event_time}
Duration: ${event.duration}
Location: ${event.location}
Your RSVP: ${invitation.status.toUpperCase()}
${event.zoom_link ? `Join Link: ${event.zoom_link}` : ''}

View event details: ${process.env.FRONTEND_URL || 'http://localhost:8080'}/events/${event._id}
    `;
  }
}

module.exports = new EmailNotificationService();
