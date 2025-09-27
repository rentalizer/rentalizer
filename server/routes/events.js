const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {
  validateCreateEvent,
  validateUpdateEvent,
  validateEventId,
  validateEventQuery,
  validateEventInvitation,
  validateRSVP
} = require('../middleware/eventValidation');

// Event CRUD Routes

// GET /api/events - Get all events with filtering and pagination
router.get('/', 
  validateEventQuery,
  EventController.getEvents
);

// GET /api/events/upcoming - Get upcoming events
router.get('/upcoming',
  EventController.getUpcomingEvents
);

// GET /api/events/search - Search events
router.get('/search',
  EventController.searchEvents
);

// GET /api/events/stats - Get event statistics
router.get('/stats',
  EventController.getEventStats
);

// GET /api/events/month/:year/:month - Get events for specific month
router.get('/month/:year/:month',
  EventController.getEventsForMonth
);

// GET /api/events/:id - Get single event by ID
router.get('/:id',
  validateEventId,
  EventController.getEventById
);

// POST /api/events - Create new event (Admin only)
router.post('/',
  auth,
  admin,
  validateCreateEvent,
  EventController.createEvent
);

// PUT /api/events/:id - Update event
router.put('/:id',
  auth,
  validateEventId,
  validateUpdateEvent,
  EventController.updateEvent
);

// DELETE /api/events/:id - Delete event
router.delete('/:id',
  auth,
  validateEventId,
  EventController.deleteEvent
);

// Calendar Integration Routes

// GET /api/events/:id/calendar-links - Get calendar links for event
router.get('/:id/calendar-links',
  validateEventId,
  EventController.getCalendarLinks
);

// POST /api/events/export/ical - Export events as iCal
router.post('/export/ical',
  auth,
  EventController.exportEventsAsICal
);

// GET /api/events/integration/status - Get calendar integration status
router.get('/integration/status',
  auth,
  EventController.getCalendarIntegrationStatus
);

// Event Invitation & RSVP Routes

// POST /api/events/:id/invite - Send invitations to users
router.post('/:id/invite',
  auth,
  validateEventId,
  validateEventInvitation,
  EventController.inviteUsers
);

// GET /api/events/:id/attendees - Get event attendees
router.get('/:id/attendees',
  validateEventId,
  EventController.getEventAttendees
);

// POST /api/events/:id/rsvp - RSVP to an event
router.post('/:id/rsvp',
  auth,
  validateEventId,
  validateRSVP,
  EventController.rsvpToEvent
);

// GET /api/events/:id/stats - Get event attendance statistics
router.get('/:id/stats',
  validateEventId,
  EventController.getEventStats
);

// GET /api/events/invitations/my - Get user's event invitations
router.get('/invitations/my',
  auth,
  EventController.getUserInvitations
);

module.exports = router;
