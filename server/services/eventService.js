const Event = require('../models/Event');
const EventInvitation = require('../models/EventInvitation');
const User = require('../models/User');
const mongoose = require('mongoose');

class EventService {
  // Create a new event
  static async createEvent(eventData, createdBy) {
    try {
      const event = new Event({
        ...eventData,
        created_by: createdBy
      });

      const savedEvent = await event.save();
      
      // If it's a recurring event, create additional weekly events
      if (eventData.is_recurring) {
        await this.createRecurringEvents(savedEvent, 11); // 11 more for total of 12
      }

      return await Event.findById(savedEvent._id)
        .populate('created_by', 'firstName lastName email profilePicture');
    } catch (error) {
      throw new Error(`Failed to create event: ${error.message}`);
    }
  }

  // Get all events with filtering and pagination
  static async getEvents(filters = {}, pagination = {}) {
    try {
      const {
        date_from,
        date_to,
        year,
        month,
        page = 1,
        limit = 20
      } = filters;

      const query = { is_active: true };

      // Date range filter
      if (date_from || date_to) {
        query.event_date = {};
        if (date_from) {
          query.event_date.$gte = new Date(date_from);
        }
        if (date_to) {
          query.event_date.$lte = new Date(date_to);
        }
      }

      // Year and month filter
      if (year && month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        query.event_date = {
          $gte: startDate,
          $lte: endDate
        };
      }

      const skip = (page - 1) * limit;

      const events = await Event.find(query)
        .populate('created_by', 'firstName lastName email profilePicture')
        .sort({ event_date: 1, event_time: 1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Event.countDocuments(query);

      return {
        events,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
  }

  // Get events for a specific month
  static async getEventsForMonth(year, month) {
    try {
      return await Event.getEventsForMonth(year, month);
    } catch (error) {
      throw new Error(`Failed to fetch events for month: ${error.message}`);
    }
  }

  // Get a single event by ID
  static async getEventById(eventId) {
    try {
      const event = await Event.findById(eventId)
        .populate('created_by', 'firstName lastName email profilePicture');
      
      if (!event) {
        throw new Error('Event not found');
      }

      return event;
    } catch (error) {
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
  }

  // Update an event
  static async updateEvent(eventId, updateData, userId) {
    try {
      const event = await Event.findById(eventId);
      
      if (!event) {
        throw new Error('Event not found');
      }

      // Check if user is the creator or admin
      if (event.created_by.toString() !== userId.toString()) {
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
          throw new Error('Unauthorized: Only event creator or admin can update');
        }
      }

      // If making it recurring, create additional weekly events
      if (updateData.is_recurring && !event.is_recurring) {
        await this.createRecurringEvents(event, 11);
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('created_by', 'firstName lastName email profilePicture');

      return updatedEvent;
    } catch (error) {
      throw new Error(`Failed to update event: ${error.message}`);
    }
  }

  // Delete an event
  static async deleteEvent(eventId, userId) {
    try {
      const event = await Event.findById(eventId);
      
      if (!event) {
        throw new Error('Event not found');
      }

      // Check if user is the creator or admin
      if (event.created_by.toString() !== userId.toString()) {
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
          throw new Error('Unauthorized: Only event creator or admin can delete');
        }
      }

      // Soft delete by setting is_active to false
      event.is_active = false;
      await event.save();

      // Also delete related invitations
      await EventInvitation.deleteMany({ event: eventId });

      return { message: 'Event deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete event: ${error.message}`);
    }
  }

  // Create recurring events
  static async createRecurringEvents(parentEvent, count) {
    try {
      const recurringEvents = [];
      
      for (let i = 1; i <= count; i++) {
        const futureDate = new Date(parentEvent.event_date);
        futureDate.setDate(futureDate.getDate() + (i * 7)); // Add weeks
        
        recurringEvents.push({
          title: parentEvent.title,
          description: parentEvent.description,
          event_date: futureDate,
          event_time: parentEvent.event_time,
          duration: parentEvent.duration,
          location: parentEvent.location,
          zoom_link: parentEvent.zoom_link,
          attendees: parentEvent.attendees,
          is_recurring: true,
          remind_members: parentEvent.remind_members,
          created_by: parentEvent.created_by,
          cover_image: parentEvent.cover_image,
          max_attendees: parentEvent.max_attendees,
          series_id: parentEvent._id,
          tags: parentEvent.tags
        });
      }

      if (recurringEvents.length > 0) {
        await Event.insertMany(recurringEvents);
        console.log(`Created ${recurringEvents.length} recurring events`);
      }
    } catch (error) {
      console.error('Error creating recurring events:', error);
      throw new Error(`Failed to create recurring events: ${error.message}`);
    }
  }

  // Get upcoming events
  static async getUpcomingEvents(limit = 10) {
    try {
      const now = new Date();
      
      const events = await Event.find({
        is_active: true,
        event_date: { $gte: now }
      })
      .populate('created_by', 'firstName lastName email profilePicture')
      .sort({ event_date: 1, event_time: 1 })
      .limit(limit);

      return events;
    } catch (error) {
      throw new Error(`Failed to fetch upcoming events: ${error.message}`);
    }
  }

  // Get events created by a user
  static async getEventsByUser(userId, filters = {}) {
    try {
      const query = {
        created_by: userId,
        is_active: true
      };

      const events = await Event.find(query)
        .populate('created_by', 'firstName lastName email profilePicture')
        .sort({ createdAt: -1 });

      return events;
    } catch (error) {
      throw new Error(`Failed to fetch user events: ${error.message}`);
    }
  }

  // Search events
  static async searchEvents(searchTerm, filters = {}) {
    try {
      const query = {
        is_active: true,
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      };

      if (filters.date_from || filters.date_to) {
        query.event_date = {};
        if (filters.date_from) {
          query.event_date.$gte = new Date(filters.date_from);
        }
        if (filters.date_to) {
          query.event_date.$lte = new Date(filters.date_to);
        }
      }

      const events = await Event.find(query)
        .populate('created_by', 'firstName lastName email profilePicture')
        .sort({ event_date: 1, event_time: 1 });

      return events;
    } catch (error) {
      throw new Error(`Failed to search events: ${error.message}`);
    }
  }

  // Get event statistics
  static async getEventStats() {
    try {
      const totalEvents = await Event.countDocuments({ is_active: true });
      const upcomingEvents = await Event.countDocuments({
        is_active: true,
        event_date: { $gte: new Date() }
      });
      const [{ totalCapacity = 0 } = {}] = await Event.aggregate([
        { $match: { is_active: true } },
        {
          $group: {
            _id: null,
            totalCapacity: { $sum: '$max_attendees' }
          }
        }
      ]);

      return {
        totalEvents,
        upcomingEvents,
        totalPastEvents: totalEvents - upcomingEvents,
        totalCapacity
      };
    } catch (error) {
      throw new Error(`Failed to fetch event statistics: ${error.message}`);
    }
  }

  // Generate Google Calendar link
  static generateGoogleCalendarLink(event) {
    try {
      const startDate = event.full_datetime;
      const endDate = event.end_datetime;
      
      // Format dates for Google Calendar
      const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const details = [
        event.description || '',
        event.location && event.location !== 'Zoom' ? `Location: ${event.location}` : '',
        event.zoom_link ? `Join: ${event.zoom_link}` : ''
      ].filter(Boolean).join('\n\n');
      
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.zoom_link || '')}`;
      
      return calendarUrl;
    } catch (error) {
      throw new Error(`Failed to generate calendar link: ${error.message}`);
    }
  }

  // Generate iCal format
  static generateICal(event) {
    try {
      const startDate = event.full_datetime;
      const endDate = event.end_datetime;
      
      const formatDate = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const ical = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Rentalizer//Event Calendar//EN',
        'BEGIN:VEVENT',
        `UID:${event._id}@rentalizer.com`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description || ''}`,
        `LOCATION:${event.location}`,
        `STATUS:CONFIRMED`,
        `END:VEVENT`,
        'END:VCALENDAR'
      ].join('\r\n');
      
      return ical;
    } catch (error) {
      throw new Error(`Failed to generate iCal: ${error.message}`);
    }
  }
}

module.exports = EventService;
