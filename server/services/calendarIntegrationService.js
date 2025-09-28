const axios = require('axios');

class CalendarIntegrationService {
  constructor() {
    this.googleCalendarAPI = 'https://www.googleapis.com/calendar/v3';
    this.outlookCalendarAPI = 'https://graph.microsoft.com/v1.0/me/events';
  }

  // Generate Google Calendar add event URL
  generateGoogleCalendarURL(event) {
    try {
      const startDate = event.full_datetime;
      const endDate = event.end_datetime;
      
      // Format dates for Google Calendar
      const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const details = this.buildEventDetails(event);
      
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.zoom_link || event.location)}`;
      
      return calendarUrl;
    } catch (error) {
      throw new Error(`Failed to generate Google Calendar URL: ${error.message}`);
    }
  }

  // Generate Outlook Calendar add event URL
  generateOutlookCalendarURL(event) {
    try {
      const startDate = event.full_datetime;
      const endDate = event.end_datetime;
      
      // Format dates for Outlook Calendar
      const formatDate = (date) => {
        return date.toISOString();
      };
      
      const details = this.buildEventDetails(event);
      
      const calendarUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${formatDate(startDate)}&enddt=${formatDate(endDate)}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(event.zoom_link || event.location)}`;
      
      return calendarUrl;
    } catch (error) {
      throw new Error(`Failed to generate Outlook Calendar URL: ${error.message}`);
    }
  }

  // Generate Yahoo Calendar add event URL
  generateYahooCalendarURL(event) {
    try {
      const startDate = event.full_datetime;
      const endDate = event.end_datetime;
      
      // Format dates for Yahoo Calendar
      const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const details = this.buildEventDetails(event);
      
      const calendarUrl = `https://calendar.yahoo.com/?v=60&title=${encodeURIComponent(event.title)}&st=${formatDate(startDate)}&et=${formatDate(endDate)}&desc=${encodeURIComponent(details)}&in_loc=${encodeURIComponent(event.zoom_link || event.location)}`;
      
      return calendarUrl;
    } catch (error) {
      throw new Error(`Failed to generate Yahoo Calendar URL: ${error.message}`);
    }
  }

  // Generate iCal (.ics) format
  generateICal(event) {
    try {
      const startDate = event.full_datetime;
      const endDate = event.end_datetime;
      
      const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const details = this.buildEventDetails(event);
      
      const ical = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Rentalizer//Event Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `UID:${event._id}@rentalizer.com`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `DTSTAMP:${formatDate(new Date())}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${this.escapeICalText(details)}`,
        `LOCATION:${this.escapeICalText(event.zoom_link || event.location)}`,
        `STATUS:CONFIRMED`,
        `SEQUENCE:0`,
        `END:VEVENT`,
        'END:VCALENDAR'
      ].join('\r\n');
      
      return ical;
    } catch (error) {
      throw new Error(`Failed to generate iCal: ${error.message}`);
    }
  }

  // Build event details string
  buildEventDetails(event) {
    const details = [];
    
    if (event.description) {
      details.push(event.description);
    }
    
    if (event.location && event.location !== 'Zoom') {
      details.push(`Location: ${event.location}`);
    }
    
    if (event.zoom_link) {
      details.push(`Join: ${event.zoom_link}`);
    }
    
    if (event.duration) {
      details.push(`Duration: ${event.duration}`);
    }
    
    if (event.event_type) {
      details.push(`Type: ${event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}`);
    }
    
    if (event.attendees) {
      details.push(`Attendees: ${event.attendees}`);
    }
    
    if (event.tags && event.tags.length > 0) {
      details.push(`Tags: ${event.tags.join(', ')}`);
    }
    
    return details.join('\n\n');
  }

  // Escape text for iCal format
  escapeICalText(text) {
    if (!text) return '';
    
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
  }

  // Generate all calendar links for an event
  generateAllCalendarLinks(event) {
    try {
      return {
        google: this.generateGoogleCalendarURL(event),
        outlook: this.generateOutlookCalendarURL(event),
        yahoo: this.generateYahooCalendarURL(event),
        ical: this.generateICal(event)
      };
    } catch (error) {
      throw new Error(`Failed to generate calendar links: ${error.message}`);
    }
  }

  // Create event in Google Calendar (requires OAuth)
  async createGoogleCalendarEvent(event, accessToken) {
    try {
      const startDate = event.full_datetime;
      const endDate = event.end_datetime;
      
      const eventData = {
        summary: event.title,
        description: this.buildEventDetails(event),
        location: event.zoom_link || event.location,
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'UTC'
        },
        attendees: event.invitees ? event.invitees.map(email => ({ email })) : [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }       // 30 minutes before
          ]
        }
      };

      const response = await axios.post(
        `${this.googleCalendarAPI}/calendars/primary/events`,
        eventData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to create Google Calendar event: ${error.message}`);
    }
  }

  // Create event in Outlook Calendar (requires OAuth)
  async createOutlookCalendarEvent(event, accessToken) {
    try {
      const startDate = event.full_datetime;
      const endDate = event.end_datetime;
      
      const eventData = {
        subject: event.title,
        body: {
          contentType: 'text',
          content: this.buildEventDetails(event)
        },
        location: {
          displayName: event.zoom_link || event.location
        },
        start: {
          dateTime: startDate.toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: endDate.toISOString(),
          timeZone: 'UTC'
        },
        attendees: event.invitees ? event.invitees.map(email => ({ 
          emailAddress: { address: email }
        })) : [],
        isReminderOn: true,
        reminderMinutesBeforeStart: 30
      };

      const response = await axios.post(
        this.outlookCalendarAPI,
        eventData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to create Outlook Calendar event: ${error.message}`);
    }
  }

  // Get calendar integration status
  getIntegrationStatus(userId) {
    // This would typically check if user has connected their calendars
    // For now, return mock data
    return {
      google: {
        connected: false,
        lastSync: null
      },
      outlook: {
        connected: false,
        lastSync: null
      },
      apple: {
        connected: false,
        lastSync: null
      }
    };
  }

  // Sync events with external calendar
  async syncWithExternalCalendar(event, calendarType, accessToken) {
    try {
      switch (calendarType.toLowerCase()) {
        case 'google':
          return await this.createGoogleCalendarEvent(event, accessToken);
        case 'outlook':
          return await this.createOutlookCalendarEvent(event, accessToken);
        default:
          throw new Error(`Unsupported calendar type: ${calendarType}`);
      }
    } catch (error) {
      throw new Error(`Failed to sync with ${calendarType}: ${error.message}`);
    }
  }

  // Export events as iCal file
  exportEventsAsICal(events) {
    try {
      if (!Array.isArray(events) || events.length === 0) {
        throw new Error('No events provided for export');
      }

      const icalEvents = events.map(event => {
        const startDate = event.full_datetime;
        const endDate = event.end_datetime;
        
        const formatDate = (date) => {
          return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        const details = this.buildEventDetails(event);
        
        return [
          'BEGIN:VEVENT',
          `UID:${event._id}@rentalizer.com`,
          `DTSTART:${formatDate(startDate)}`,
          `DTEND:${formatDate(endDate)}`,
          `DTSTAMP:${formatDate(new Date())}`,
          `SUMMARY:${event.title}`,
          `DESCRIPTION:${this.escapeICalText(details)}`,
          `LOCATION:${this.escapeICalText(event.zoom_link || event.location)}`,
          `STATUS:CONFIRMED`,
          `SEQUENCE:0`,
          `END:VEVENT`
        ].join('\r\n');
      }).join('\r\n');

      const ical = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Rentalizer//Event Calendar//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        icalEvents,
        'END:VCALENDAR'
      ].join('\r\n');

      return ical;
    } catch (error) {
      throw new Error(`Failed to export events as iCal: ${error.message}`);
    }
  }
}

module.exports = new CalendarIntegrationService();
