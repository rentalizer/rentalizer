const students = [
  { legacyId: '1', name: 'Lindsay Sherman', email: 'dutchess0085@gmail.com', progress: 100, startDate: '2024-08-01', status: 'active' },
  { legacyId: '2', name: 'Takeisha Moore', email: 'takeisha.moore@metrobrokers.com', progress: 100, startDate: '2025-06-18', status: 'active' },
  { legacyId: '3', name: 'Tiffany Worthy', email: 'tiffany1990worthy@yahoo.com', progress: 100, startDate: '2024-08-01', status: 'active' },
  { legacyId: '4', name: 'Pavlos Michaels', email: 'pavlos.michaels4@gmail.com', progress: 100, startDate: '2024-08-01', status: 'active' },
  { legacyId: '5', name: 'Alex Johnson', email: 'alex.johnson@email.com', progress: 100, startDate: '2024-08-01', status: 'active' },
  { legacyId: '6', name: 'Sarah Wilson', email: 'sarah.wilson@email.com', progress: 100, startDate: '2024-08-01', status: 'active' },
  { legacyId: '7', name: 'Mike Davis', email: 'mike.davis@email.com', progress: 100, startDate: '2024-08-01', status: 'active' },
  { legacyId: '8', name: 'Sanyo Mathew', email: 'sanyo.6677@gmail.com', progress: 100, startDate: '2024-08-01', status: 'active' },
  { legacyId: '9', name: 'Vinod Kumar', email: 'vinodkhatri@hotmail.com', progress: 100, startDate: '2025-06-19', status: 'active' },
  { legacyId: '10', name: 'Mary Fofanah', email: 'maryfofanah18@gmail.com', progress: 100, startDate: '2024-08-01', status: 'active' },
  { legacyId: '11', name: 'Santosh Roka', email: 'santosh.roka@email.com', progress: 100, startDate: '2025-01-15', status: 'active' }
];

const defaultActivities = [
  {
    legacyId: '1',
    type: 'document',
    title: 'Getting Started Guide',
    description: 'Read introduction to rental arbitrage fundamentals',
    date: '2024-08-01',
    material: 'Getting Started Guide.pdf',
    materialType: 'pdf',
    completed: true,
    duration: '1.5 hours',
    serverId: 'srv-content-delivery-001'
  },
  {
    legacyId: '2',
    type: 'video',
    title: 'Market Research Basics',
    description: 'Watched foundational market research training',
    date: '2024-08-15',
    material: 'Market Research Basics',
    materialType: 'video',
    completed: true,
    duration: '24:30',
    serverId: 'srv-content-delivery-002',
    category: 'Market Research',
    views: 1
  },
  {
    legacyId: '3',
    type: 'assignment',
    title: 'Market Analysis Project',
    description: 'Analyze your local rental market',
    date: '2024-08-20',
    material: 'Project Submission.pdf',
    materialType: 'pdf',
    completed: true,
    score: '92%',
    serverId: 'srv-us-central-1-prod-800'
  },
  {
    legacyId: '4',
    type: 'quiz',
    title: 'Foundation Quiz',
    description: 'Test your understanding of basics',
    date: '2024-08-25',
    material: 'Quiz Report.pdf',
    materialType: 'pdf',
    completed: true,
    score: '85%',
    serverId: 'srv-us-east-1-prod-799'
  },
  {
    legacyId: '5',
    type: 'achievement',
    title: 'Foundation Complete',
    description: 'Successfully mastered the fundamentals',
    date: '2024-09-01',
    material: 'Achievement Badge.pdf',
    materialType: 'pdf',
    completed: true,
    serverId: 'srv-us-west-2-prod-798'
  }
];

const studentSpecificActivities = {
  '2': [
    {
      legacyId: 'tm1',
      type: 'achievement',
      title: 'Accelerator Program Access Granted',
      description: 'Successfully purchased and enrolled in Accelerator (presale $2,500)',
      date: '2025-06-18',
      material: 'Program Access Confirmation.pdf',
      materialType: 'pdf',
      completed: true,
      duration: '5 min',
      serverId: 'srv-us-west-1-prod-810'
    },
    {
      legacyId: 'tm2',
      type: 'video',
      title: 'Accelerator Orientation Video',
      description: 'Watched complete program introduction and setup',
      date: '2025-06-18',
      material: 'Accelerator Welcome Orientation',
      materialType: 'video',
      completed: true,
      duration: '32:15',
      serverId: 'srv-content-delivery-005',
      category: 'Business Formation',
      views: 1
    },
    {
      legacyId: 'tm3',
      type: 'video',
      title: 'Market Research Overview',
      description: 'Completed advanced market evaluation training',
      date: '2025-06-20',
      material: 'Market Research Overview',
      materialType: 'video',
      completed: true,
      duration: '28:45',
      serverId: 'srv-content-delivery-005',
      category: 'Market Research',
      views: 2
    },
    {
      legacyId: 'tm4',
      type: 'video',
      title: 'Competitor Analysis Deep Dive',
      description: 'Mastered competitive analysis techniques',
      date: '2025-06-21',
      material: 'Competitor Analysis',
      materialType: 'video',
      completed: true,
      duration: '35:20',
      serverId: 'srv-content-delivery-007',
      category: 'Market Research',
      views: 1
    },
    {
      legacyId: 'tm5',
      type: 'video',
      title: 'Property Acquisitions Overview',
      description: 'Learned comprehensive acquisition strategies',
      date: '2025-06-22',
      material: 'Property Acquisitions Overview',
      materialType: 'video',
      completed: true,
      duration: '38:45',
      serverId: 'srv-content-delivery-007',
      category: 'Property Acquisitions',
      views: 3
    },
    {
      legacyId: 'tm6',
      type: 'assignment',
      title: 'Live Deal Analysis',
      description: 'Analyzed real properties with mentor guidance',
      date: '2025-06-25',
      material: 'Live Deal Analysis Report.pdf',
      materialType: 'pdf',
      completed: true,
      score: '97%',
      serverId: 'srv-us-central-2-prod-811'
    },
    {
      legacyId: 'tm7',
      type: 'video',
      title: 'Property Listing Optimization',
      description: 'Advanced listing optimization strategies',
      date: '2025-06-26',
      material: 'Property Listing Optimization',
      materialType: 'video',
      completed: true,
      duration: '25:12',
      serverId: 'srv-content-delivery-009',
      category: 'Property Management',
      views: 1
    },
    {
      legacyId: 'tm8',
      type: 'video',
      title: 'Hiring Your VA',
      description: 'Complete guide to virtual assistant recruitment',
      date: '2025-06-28',
      material: 'Hiring Your VA',
      materialType: 'video',
      completed: true,
      duration: '42:15',
      serverId: 'srv-content-delivery-009',
      category: 'Operations',
      views: 1
    },
    {
      legacyId: 'tm9',
      type: 'quiz',
      title: 'Accelerator Mastery Assessment',
      description: 'Comprehensive evaluation of advanced concepts',
      date: '2025-07-01',
      material: 'Mastery Assessment Results.pdf',
      materialType: 'pdf',
      completed: true,
      score: '94%',
      serverId: 'srv-us-east-1-prod-802'
    }
  ],
  '9': [
    {
      legacyId: 'vk1',
      type: 'achievement',
      title: 'Welcome to Rentalizer Academy',
      description: 'Successfully enrolled in Accelerator Pro Program',
      date: '2025-06-19',
      material: 'Welcome Package.pdf',
      materialType: 'pdf',
      completed: true,
      duration: '15 min',
      serverId: 'srv-us-west-1-prod-810'
    },
    {
      legacyId: 'vk2',
      type: 'video',
      title: 'Foundation Business Formation',
      description: 'Watched complete business setup training',
      date: '2025-06-20',
      material: 'Business Formation Basics',
      materialType: 'video',
      completed: true,
      duration: '45:30',
      serverId: 'srv-content-delivery-005',
      category: 'Business Formation',
      views: 1
    },
    {
      legacyId: 'vk3',
      type: 'video',
      title: 'Market Research Fundamentals',
      description: 'Completed market research methodology training',
      date: '2025-06-22',
      material: 'Market Research Fundamentals',
      materialType: 'video',
      completed: true,
      duration: '33:18',
      serverId: 'srv-content-delivery-006',
      category: 'Market Research',
      views: 2
    },
    {
      legacyId: 'vk4',
      type: 'assignment',
      title: 'Market Research Assignment',
      description: 'Submitted local market analysis report',
      date: '2025-06-24',
      material: 'Assignment Submission.pdf',
      materialType: 'pdf',
      completed: true,
      score: '95%',
      serverId: 'srv-us-central-1-prod-803'
    },
    {
      legacyId: 'vk5',
      type: 'quiz',
      title: 'Foundation Knowledge Quiz',
      description: 'Passed comprehensive knowledge assessment',
      date: '2025-06-25',
      material: 'Quiz Results.pdf',
      materialType: 'pdf',
      completed: true,
      score: '88%',
      serverId: 'srv-us-east-1-prod-801'
    },
    {
      legacyId: 'vk6',
      type: 'video',
      title: 'Property Acquisition Strategies',
      description: 'Learned property finding and evaluation methods',
      date: '2025-06-28',
      material: 'Property Acquisition Masterclass',
      materialType: 'video',
      completed: true,
      duration: '36:40',
      serverId: 'srv-content-delivery-008',
      category: 'Property Acquisitions',
      views: 1
    },
    {
      legacyId: 'vk7',
      type: 'video',
      title: 'Hiring Your Housekeeper',
      description: 'Operations training for property management',
      date: '2025-06-30',
      material: 'Hiring Your Housekeeper',
      materialType: 'video',
      completed: true,
      duration: '31:30',
      serverId: 'srv-content-delivery-008',
      category: 'Property Management',
      views: 1
    },
    {
      legacyId: 'vk8',
      type: 'achievement',
      title: 'First Month Milestone',
      description: 'Completed first month of accelerator program',
      date: '2025-07-01',
      material: 'Milestone Certificate.pdf',
      materialType: 'pdf',
      completed: true,
      serverId: 'srv-us-west-2-prod-804'
    }
  ],
  '11': [
    {
      legacyId: 'sr1',
      type: 'achievement',
      title: 'Welcome to Rentalizer Academy',
      description: 'Successfully enrolled in Accelerator Pro Program',
      date: '2025-01-15',
      material: 'Welcome Package.pdf',
      materialType: 'pdf',
      completed: true,
      duration: '15 min',
      serverId: 'srv-us-west-1-prod-810'
    },
    {
      legacyId: 'sr2',
      type: 'video',
      title: 'Foundation Business Formation',
      description: 'Watched complete business setup training',
      date: '2025-01-16',
      material: 'Business Formation Basics',
      materialType: 'video',
      completed: true,
      duration: '45:30',
      serverId: 'srv-content-delivery-005',
      category: 'Business Formation',
      views: 1
    },
    {
      legacyId: 'sr3',
      type: 'video',
      title: 'Market Research Fundamentals',
      description: 'Completed market research methodology training',
      date: '2025-01-18',
      material: 'Market Research Fundamentals',
      materialType: 'video',
      completed: true,
      duration: '33:18',
      serverId: 'srv-content-delivery-006',
      category: 'Market Research',
      views: 2
    }
  ]
};

module.exports = {
  students,
  defaultActivities,
  studentSpecificActivities
};
