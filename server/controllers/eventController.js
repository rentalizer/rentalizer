const EventService = require('../services/eventService');
const EventInvitation = require('../models/EventInvitation');
const User = require('../models/User');
const calendarIntegrationService = require('../services/calendarIntegrationService');

class EventController {
  // Create a new event
  static async createEvent(req, res) {
    try {
      const eventData = req.body;
      const userId = req.user.id;

      const event = await EventService.createEvent(eventData, userId);

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: event
      });
    } catch (error) {
      console.error('Create event error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all events with filtering
  static async getEvents(req, res) {
    try {
      const filters = req.query;
      const result = await EventService.getEvents(filters);

      res.json({
        success: true,
        message: 'Events fetched successfully',
        data: result.events,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Get events error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get events for a specific month
  static async getEventsForMonth(req, res) {
    try {
      const { year, month } = req.params;
      
      if (!year || !month) {
        return res.status(400).json({
          success: false,
          message: 'Year and month are required'
        });
      }

      const events = await EventService.getEventsForMonth(parseInt(year), parseInt(month));

      res.json({
        success: true,
        message: 'Events for month fetched successfully',
        data: events
      });
    } catch (error) {
      console.error('Get events for month error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get a single event by ID
  static async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);

      res.json({
        success: true,
        message: 'Event fetched successfully',
        data: event
      });
    } catch (error) {
      console.error('Get event by ID error:', error);
      const statusCode = error.message === 'Event not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update an event
  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;

      const event = await EventService.updateEvent(id, updateData, userId);

      res.json({
        success: true,
        message: 'Event updated successfully',
        data: event
      });
    } catch (error) {
      console.error('Update event error:', error);
      const statusCode = error.message.includes('not found') || error.message.includes('Unauthorized') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete an event
  static async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const result = await EventService.deleteEvent(id, userId);

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Delete event error:', error);
      const statusCode = error.message.includes('not found') || error.message.includes('Unauthorized') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get upcoming events
  static async getUpcomingEvents(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const events = await EventService.getUpcomingEvents(limit);

      res.json({
        success: true,
        message: 'Upcoming events fetched successfully',
        data: events
      });
    } catch (error) {
      console.error('Get upcoming events error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Search events
  static async searchEvents(req, res) {
    try {
      const { q: searchTerm } = req.query;
      
      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const filters = req.query;
      const events = await EventService.searchEvents(searchTerm, filters);

      res.json({
        success: true,
        message: 'Events searched successfully',
        data: events
      });
    } catch (error) {
      console.error('Search events error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get event statistics
  static async getEventStats(req, res) {
    try {
      const stats = await EventService.getEventStats();

      res.json({
        success: true,
        message: 'Event statistics fetched successfully',
        data: stats
      });
    } catch (error) {
      console.error('Get event stats error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get calendar links for an event
  static async getCalendarLinks(req, res) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      
      const links = calendarIntegrationService.generateAllCalendarLinks(event);

      res.json({
        success: true,
        message: 'Calendar links generated successfully',
        data: links
      });
    } catch (error) {
      console.error('Get calendar links error:', error);
      const statusCode = error.message === 'Event not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // Export events as iCal
  static async exportEventsAsICal(req, res) {
    try {
      const { eventIds } = req.body;
      
      if (!eventIds || !Array.isArray(eventIds)) {
        return res.status(400).json({
          success: false,
          message: 'Event IDs array is required'
        });
      }

      const events = [];
      for (const eventId of eventIds) {
        const event = await EventService.getEventById(eventId);
        events.push(event);
      }

      const ical = calendarIntegrationService.exportEventsAsICal(events);

      res.setHeader('Content-Type', 'text/calendar');
      res.setHeader('Content-Disposition', 'attachment; filename="rentalizer-events.ics"');
      res.send(ical);
    } catch (error) {
      console.error('Export events as iCal error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Invite users to an event
  static async inviteUsers(req, res) {
    try {
      const { id: eventId } = req.params;
      const { user_ids } = req.body;
      const invitedBy = req.user.id;

      // Check if event exists
      const event = await EventService.getEventById(eventId);

      // Check if user is authorized to invite (creator or admin)
      if (event.created_by.toString() !== invitedBy.toString()) {
        const user = await User.findById(invitedBy);
        if (!user || user.role !== 'admin') {
          return res.status(403).json({
            success: false,
            message: 'Unauthorized: Only event creator or admin can send invitations'
          });
        }
      }

      // Create invitations
      const invitations = [];
      for (const userId of user_ids) {
        try {
          const invitation = new EventInvitation({
            event: eventId,
            user: userId,
            invited_by: invitedBy
          });
          await invitation.save();
          invitations.push(invitation);
        } catch (error) {
          // Skip if invitation already exists
          if (error.code === 11000) {
            continue;
          }
          throw error;
        }
      }

      res.status(201).json({
        success: true,
        message: 'Invitations sent successfully',
        data: {
          event: eventId,
          invitations_sent: invitations.length,
          total_invited: user_ids.length
        }
      });
    } catch (error) {
      console.error('Invite users error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get event attendees
  static async getEventAttendees(req, res) {
    try {
      const { id: eventId } = req.params;
      
      // Check if event exists
      await EventService.getEventById(eventId);

      const invitations = await EventInvitation.getEventInvitations(eventId);

      res.json({
        success: true,
        message: 'Event attendees fetched successfully',
        data: invitations
      });
    } catch (error) {
      console.error('Get event attendees error:', error);
      const statusCode = error.message === 'Event not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // RSVP to an event
  static async rsvpToEvent(req, res) {
    try {
      const { id: eventId } = req.params;
      const { status, notes } = req.body;
      const userId = req.user.id;

      // Check if event exists
      await EventService.getEventById(eventId);

      // Find or create invitation
      let invitation = await EventInvitation.findOne({
        event: eventId,
        user: userId
      });

      if (!invitation) {
        // Create invitation if it doesn't exist
        invitation = new EventInvitation({
          event: eventId,
          user: userId,
          invited_by: userId // Self-invitation
        });
      }

      await invitation.updateStatus(status, notes);

      res.json({
        success: true,
        message: 'RSVP updated successfully',
        data: invitation
      });
    } catch (error) {
      console.error('RSVP to event error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get user's event invitations
  static async getUserInvitations(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      const invitations = await EventInvitation.getUserInvitations(userId, status);

      res.json({
        success: true,
        message: 'User invitations fetched successfully',
        data: invitations
      });
    } catch (error) {
      console.error('Get user invitations error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get event attendance statistics
  static async getEventStats(req, res) {
    try {
      const { id: eventId } = req.params;
      
      // Check if event exists
      await EventService.getEventById(eventId);

      const stats = await EventInvitation.getEventStats(eventId);

      res.json({
        success: true,
        message: 'Event statistics fetched successfully',
        data: stats
      });
    } catch (error) {
      console.error('Get event statistics error:', error);
      const statusCode = error.message === 'Event not found' ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get calendar integration status
  static async getCalendarIntegrationStatus(req, res) {
    try {
      const userId = req.user.id;
      const status = calendarIntegrationService.getIntegrationStatus(userId);

      res.json({
        success: true,
        message: 'Calendar integration status fetched successfully',
        data: status
      });
    } catch (error) {
      console.error('Get calendar integration status error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = EventController;
