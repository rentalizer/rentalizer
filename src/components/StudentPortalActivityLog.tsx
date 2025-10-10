import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, CheckCircle, Download, Filter, BookOpen, Trophy, FileText, Play, File, Loader2, Database, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService, StudentLogActivity, StudentLogStudent } from '@/services/api';

interface ActivityEntry {
  id: string;
  type: 'module' | 'assignment' | 'quiz' | 'achievement' | 'video' | 'document';
  title: string;
  description: string;
  date: string;
  material: string;
  materialType: 'pdf' | 'video' | 'document' | 'link';
  completed: boolean;
  score?: string;
  duration?: string;
  serverID: string;
  category?: string;
  views?: number;
  studentId?: string;
  legacyId?: string;
}

interface StudentOption {
  id: string;
  legacyId?: string;
  name: string;
  email: string;
  progress: number;
  startDate?: string;
  status?: 'active' | 'inactive' | 'paused' | 'completed';
  source: 'mock' | 'backend';
}

const mockActivityData: ActivityEntry[] = [
  // Accelerator Program Activities - Takeisha Moore
  {
    id: 'tm1',
    type: 'achievement',
    title: 'Accelerator Program Access Granted',
    description: 'Successfully purchased and enrolled in Accelerator (presale $2,500)',
    date: '2025-06-18',
    material: 'Program Access Confirmation.pdf',
    materialType: 'pdf',
    completed: true,
    duration: '5 min',
    serverID: 'srv-us-west-1-prod-810'
  },
  {
    id: 'tm2',
    type: 'video',
    title: 'Accelerator Orientation Video',
    description: 'Watched complete program introduction and setup',
    date: '2025-06-18',
    material: 'Accelerator Welcome Orientation',
    materialType: 'video',
    completed: true,
    duration: '32:15',
    serverID: 'srv-content-delivery-005',
    category: 'Business Formation',
    views: 1
  },
  {
    id: 'tm3',
    type: 'video',
    title: 'Market Research Overview',
    description: 'Completed advanced market evaluation training',
    date: '2025-06-20',
    material: 'Market Research Overview',
    materialType: 'video',
    completed: true,
    duration: '28:45',
    serverID: 'srv-content-delivery-005',
    category: 'Market Research',
    views: 2
  },
  {
    id: 'tm4',
    type: 'video',
    title: 'Competitor Analysis Deep Dive',
    description: 'Mastered competitive analysis techniques',
    date: '2025-06-21',
    material: 'Competitor Analysis',
    materialType: 'video',
    completed: true,
    duration: '35:20',
    serverID: 'srv-content-delivery-007',
    category: 'Market Research',
    views: 1
  },
  {
    id: 'tm5',
    type: 'video',
    title: 'Property Acquisitions Overview',
    description: 'Learned comprehensive acquisition strategies',
    date: '2025-06-22',
    material: 'Property Acquisitions Overview',
    materialType: 'video',
    completed: true,
    duration: '38:45',
    serverID: 'srv-content-delivery-007',
    category: 'Property Acquisitions',
    views: 3
  },
  {
    id: 'tm6',
    type: 'assignment',
    title: 'Live Deal Analysis',
    description: 'Analyzed real properties with mentor guidance',
    date: '2025-06-25',
    material: 'Live Deal Analysis Report.pdf',
    materialType: 'pdf',
    completed: true,
    score: '97%',
    serverID: 'srv-us-central-2-prod-811'
  },
  {
    id: 'tm7',
    type: 'video',
    title: 'Property Listing Optimization',
    description: 'Advanced listing optimization strategies',
    date: '2025-06-26',
    material: 'Property Listing Optimization',
    materialType: 'video',
    completed: true,
    duration: '25:12',
    serverID: 'srv-content-delivery-009',
    category: 'Property Management',
    views: 1
  },
  {
    id: 'tm8',
    type: 'video',
    title: 'Hiring Your VA',
    description: 'Complete guide to virtual assistant recruitment',
    date: '2025-06-28',
    material: 'Hiring Your VA',
    materialType: 'video',
    completed: true,
    duration: '42:15',
    serverID: 'srv-content-delivery-009',
    category: 'Operations',
    views: 1
  },
  {
    id: 'tm9',
    type: 'quiz',
    title: 'Accelerator Mastery Assessment',
    description: 'Comprehensive evaluation of advanced concepts',
    date: '2025-07-01',
    material: 'Mastery Assessment Results.pdf',
    materialType: 'pdf',
    completed: true,
    score: '94%',
    serverID: 'srv-us-east-1-prod-802'
  },

  // Student Learning Activities - Santosh Roka
  {
    id: 'sr1',
    type: 'achievement',
    title: 'Welcome to Rentalizer Academy',
    description: 'Successfully enrolled in Accelerator Pro Program',
    date: '2025-01-15',
    material: 'Welcome Package.pdf',
    materialType: 'pdf',
    completed: true,
    duration: '15 min',
    serverID: 'srv-us-west-1-prod-810'
  },
  {
    id: 'sr2',
    type: 'video',
    title: 'Foundation Business Formation',
    description: 'Watched complete business setup training',
    date: '2025-01-16',
    material: 'Business Formation Basics',
    materialType: 'video',
    completed: true,
    duration: '45:30',
    serverID: 'srv-content-delivery-005',
    category: 'Business Formation',
    views: 1
  },
  {
    id: 'sr3',
    type: 'video',
    title: 'Market Research Fundamentals',
    description: 'Completed market research methodology training',
    date: '2025-01-18',
    material: 'Market Research Fundamentals',
    materialType: 'video',
    completed: true,
    duration: '33:18',
    serverID: 'srv-content-delivery-006',
    category: 'Market Research',
    views: 2
  },

  // Student Learning Activities - Vinod Kumar
  {
    id: 'vk1',
    type: 'achievement',
    title: 'Welcome to Rentalizer Academy',
    description: 'Successfully enrolled in Accelerator Pro Program',
    date: '2025-06-19',
    material: 'Welcome Package.pdf',
    materialType: 'pdf',
    completed: true,
    duration: '15 min',
    serverID: 'srv-us-west-1-prod-810'
  },
  {
    id: 'vk2',
    type: 'video',
    title: 'Foundation Business Formation',
    description: 'Watched complete business setup training',
    date: '2025-06-20',
    material: 'Business Formation Basics',
    materialType: 'video',
    completed: true,
    duration: '45:30',
    serverID: 'srv-content-delivery-005',
    category: 'Business Formation',
    views: 1
  },
  {
    id: 'vk3',
    type: 'video',
    title: 'Market Research Fundamentals',
    description: 'Completed market research methodology training',
    date: '2025-06-22',
    material: 'Market Research Fundamentals',
    materialType: 'video',
    completed: true,
    duration: '33:18',
    serverID: 'srv-content-delivery-006',
    category: 'Market Research',
    views: 2
  },
  {
    id: 'vk4',
    type: 'assignment',
    title: 'Market Research Assignment',
    description: 'Submitted local market analysis report',
    date: '2025-06-24',
    material: 'Assignment Submission.pdf',
    materialType: 'pdf',
    completed: true,
    score: '95%',
    serverID: 'srv-us-central-1-prod-803'
  },
  {
    id: 'vk5',
    type: 'quiz',
    title: 'Foundation Knowledge Quiz',
    description: 'Passed comprehensive knowledge assessment',
    date: '2025-06-25',
    material: 'Quiz Results.pdf',
    materialType: 'pdf',
    completed: true,
    score: '88%',
    serverID: 'srv-us-east-1-prod-801'
  },
  {
    id: 'vk6',
    type: 'video',
    title: 'Property Acquisition Strategies',
    description: 'Learned property finding and evaluation methods',
    date: '2025-06-28',
    material: 'Property Acquisition Masterclass',
    materialType: 'video',
    completed: true,
    duration: '36:40',
    serverID: 'srv-content-delivery-008',
    category: 'Property Acquisitions',
    views: 1
  },
  {
    id: 'vk7',
    type: 'video',
    title: 'Hiring Your Housekeeper',
    description: 'Operations training for property management',
    date: '2025-06-30',
    material: 'Hiring Your Housekeeper',
    materialType: 'video',
    completed: true,
    duration: '31:30',
    serverID: 'srv-content-delivery-008',
    category: 'Property Management',
    views: 1
  },
  {
    id: 'vk8',
    type: 'achievement',
    title: 'First Month Milestone',
    description: 'Completed first month of accelerator program',
    date: '2025-07-01',
    material: 'Milestone Certificate.pdf',
    materialType: 'pdf',
    completed: true,
    serverID: 'srv-us-west-2-prod-804'
  },

  // Default student activities
  {
    id: '1',
    type: 'document',
    title: 'Getting Started Guide',
    description: 'Read introduction to rental arbitrage fundamentals',
    date: '2024-08-01',
    material: 'Getting Started Guide.pdf',
    materialType: 'pdf',
    completed: true,
    duration: '1.5 hours',
    serverID: 'srv-content-delivery-001'
  },
  {
    id: '2',
    type: 'video',
    title: 'Market Research Basics',
    description: 'Watched foundational market research training',
    date: '2024-08-15',
    material: 'Market Research Basics',
    materialType: 'video',
    completed: true,
    duration: '24:30',
    serverID: 'srv-content-delivery-002',
    category: 'Market Research',
    views: 1
  },
  {
    id: '3',
    type: 'assignment',
    title: 'Market Analysis Project',
    description: 'Analyze your local rental market',
    date: '2024-08-20',
    material: 'Project Submission.pdf',
    materialType: 'pdf',
    completed: true,
    score: '92%',
    serverID: 'srv-us-central-1-prod-800'
  },
  {
    id: '4',
    type: 'quiz',
    title: 'Foundation Quiz',
    description: 'Test your understanding of basics',
    date: '2024-08-25',
    material: 'Quiz Report.pdf',
    materialType: 'pdf',
    completed: true,
    score: '85%',
    serverID: 'srv-us-east-1-prod-799'
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Foundation Complete',
    description: 'Successfully mastered the fundamentals',
    date: '2024-09-01',
    material: 'Achievement Badge.pdf',
    materialType: 'pdf',
    completed: true,
    serverID: 'srv-us-west-2-prod-798'
  }
];

const mockStudents = [
  { id: '1', name: 'Lindsay Sherman', email: 'dutchess0085@gmail.com', progress: 100 },
  { id: '2', name: 'Takeisha Moore', email: 'takeisha.moore@metrobrokers.com', progress: 100 },
  { id: '3', name: 'Tiffany Worthy', email: 'tiffany1990worthy@yahoo.com', progress: 100 },
  { id: '4', name: 'Pavlos Michaels', email: 'pavlos.michaels4@gmail.com', progress: 100 },
  { id: '5', name: 'Alex Johnson', email: 'alex.johnson@email.com', progress: 100 },
  { id: '6', name: 'Sarah Wilson', email: 'sarah.wilson@email.com', progress: 100 },
  { id: '7', name: 'Mike Davis', email: 'mike.davis@email.com', progress: 100 },
  { id: '8', name: 'Sanyo Mathew', email: 'sanyo.6677@gmail.com', progress: 100 },
  { id: '9', name: 'Vinod Kumar', email: 'vinodkhatri@hotmail.com', progress: 100 },
  { id: '10', name: 'Mary Fofanah', email: 'maryfofanah18@gmail.com', progress: 100 },
  { id: '11', name: 'Santosh Roka', email: 'santosh.roka@email.com', progress: 100 },
];

const startDateMap: Record<string, string> = {
  '2': '2025-06-18',
  '9': '2025-06-19',
  '11': '2025-01-15'
};

const getMockStartDate = (legacyId?: string) => {
  if (!legacyId) return '2024-08-01';
  return startDateMap[legacyId] || '2024-08-01';
};

const buildMockActivitiesForLegacy = (legacyId?: string): ActivityEntry[] => {
  const targetLegacy = legacyId || '1';
  return mockActivityData
    .filter((activity) => {
      if (targetLegacy === '2') return activity.id.startsWith('tm');
      if (targetLegacy === '9') return activity.id.startsWith('vk');
      if (targetLegacy === '11') return activity.id.startsWith('sr');
      return !activity.id.startsWith('tm') && !activity.id.startsWith('vk') && !activity.id.startsWith('sr');
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((activity) => ({
      ...activity,
      studentId: targetLegacy,
      legacyId: activity.id
    }));
};

const mockStudentOptions: StudentOption[] = mockStudents.map((student) => ({
  id: student.id,
  legacyId: student.id,
  name: student.name,
  email: student.email,
  progress: student.progress,
  startDate: getMockStartDate(student.id),
  status: 'active',
  source: 'mock'
}));

export const StudentPortalActivityLog = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentOption[]>(mockStudentOptions);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(mockStudentOptions[0]?.id ?? '');
  const [activeFilter, setActiveFilter] = useState('All Activity');
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [dataSourceMessage, setDataSourceMessage] = useState<string | null>(null);
  const [activityErrorMessage, setActivityErrorMessage] = useState<string | null>(null);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [studentSubmitting, setStudentSubmitting] = useState(false);
  const [activitySubmitting, setActivitySubmitting] = useState(false);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    progress: 100,
    status: 'active' as StudentOption['status'],
    startDate: '',
    legacyId: '',
    notes: ''
  });
  const [activityForm, setActivityForm] = useState({
    type: 'module' as StudentLogActivity['type'],
    title: '',
    description: '',
    date: '',
    material: '',
    materialType: 'document' as StudentLogActivity['materialType'],
    materialUrl: '',
    completed: true,
    score: '',
    duration: '',
    serverId: '',
    category: '',
    views: '',
    metadataNotes: ''
  });
  const [activitiesByStudent, setActivitiesByStudent] = useState<Record<string, ActivityEntry[]>>(() => {
    const initialStudent = mockStudentOptions[0];
    if (!initialStudent) return {};
    return { [initialStudent.id]: buildMockActivitiesForLegacy(initialStudent.legacyId) };
  });
  const resetStudentForm = useCallback(() => {
    setStudentForm({
      name: '',
      email: '',
      progress: 100,
      status: 'active' as StudentOption['status'],
      startDate: '',
      legacyId: '',
      notes: ''
    });
  }, []);
  const resetActivityForm = useCallback(() => {
    setActivityForm({
      type: 'module' as StudentLogActivity['type'],
      title: '',
      description: '',
      date: '',
      material: '',
      materialType: 'document' as StudentLogActivity['materialType'],
      materialUrl: '',
      completed: true,
      score: '',
      duration: '',
      serverId: '',
      category: '',
      views: '',
      metadataNotes: ''
    });
  }, []);
  const sortStudents = useCallback((list: StudentOption[]) => {
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  const mapActivityToEntry = useCallback((activity: StudentLogActivity): ActivityEntry => {
    const studentIdValue = typeof activity.student === 'string'
      ? activity.student
      : (activity.student as StudentLogStudent | undefined)?._id;

    return {
      id: activity._id,
      type: activity.type,
      title: activity.title,
      description: activity.description || '',
      date: activity.date ? activity.date.split('T')[0] : '',
      material: activity.material || activity.materialUrl || 'Learning Resource',
      materialType: (activity.materialType || 'document') as ActivityEntry['materialType'],
      completed: activity.completed,
      score: activity.score || undefined,
      duration: activity.duration || undefined,
      serverID: activity.serverId || '',
      category: activity.category || undefined,
      views: typeof activity.views === 'number' ? activity.views : undefined,
      studentId: studentIdValue,
      legacyId: activity.legacyId || undefined
    };
  }, []);

  const filterTabs = ['All Activity', 'Module', 'Assignment', 'Quiz', 'Achievement', 'Video', 'Document'];

  useEffect(() => {
    let isMounted = true;

    const loadStudents = async () => {
      setStudentsLoading(true);
      try {
        const response = await apiService.getStudentLogStudents({ sort: 'name' });

        if (!isMounted) return;

        if (response.success && response.data.length) {
          const backendStudents: StudentOption[] = response.data.map((student: StudentLogStudent) => ({
            id: student._id,
            legacyId: student.legacyId || undefined,
            name: student.name,
            email: student.email,
            progress: student.progress ?? 0,
            startDate: student.startDate ? student.startDate.split('T')[0] : undefined,
            status: student.status,
            source: 'backend'
          }));

          const currentLegacySelection = mockStudentOptions.find((option) => option.id === selectedStudentId)?.legacyId;
          let nextSelectedId = backendStudents[0]?.id ?? '';

          if (currentLegacySelection) {
            const matchingBackendStudent = backendStudents.find((student) => student.legacyId === currentLegacySelection);
            if (matchingBackendStudent) {
              nextSelectedId = matchingBackendStudent.id;
            }
          }

          setStudents(sortStudents(backendStudents));
          if (nextSelectedId) {
            setSelectedStudentId(nextSelectedId);
          }
          setDataSourceMessage('Live student log synced from the server.');
        } else {
          setDataSourceMessage('No backend student data found. Showing saved student log.');
        }
      } catch (error) {
        console.error('Failed to load student log students:', error);
        if (isMounted) {
          setDataSourceMessage('Unable to reach the server. Showing saved student log data.');
        }
      } finally {
        if (isMounted) {
          setStudentsLoading(false);
        }
      }
    };

    loadStudents();

    return () => {
      isMounted = false;
    };
  }, []); // We intentionally run this once on mount to fetch backend data.

  const fetchActivitiesForStudent = useCallback(async (student: StudentOption) => {
    if (!student) return;

    if (student.source === 'backend') {
      if (activitiesByStudent[student.id]?.length) {
        return;
      }

      setActivitiesLoading(true);
      try {
        const response = await apiService.getStudentLogActivities(student.id);

        if (response.success) {
          const mappedActivities: ActivityEntry[] = response.data
            .map(mapActivityToEntry)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          setActivitiesByStudent((prev) => ({
            ...prev,
            [student.id]: mappedActivities
          }));
          setActivityErrorMessage(null);
        } else {
          setActivityErrorMessage('Unable to load server activities. Showing saved data.');
          setActivitiesByStudent((prev) => ({
            ...prev,
            [student.id]: buildMockActivitiesForLegacy(student.legacyId || student.id)
          }));
        }
      } catch (error) {
        console.error('Failed to load student activities:', error);
        setActivityErrorMessage('Unable to load server activities. Showing saved data.');
        setActivitiesByStudent((prev) => ({
          ...prev,
          [student.id]: buildMockActivitiesForLegacy(student.legacyId || student.id)
        }));
      } finally {
        setActivitiesLoading(false);
      }
    } else {
      setActivitiesByStudent((prev) => ({
        ...prev,
        [student.id]: buildMockActivitiesForLegacy(student.legacyId || student.id)
      }));
    }
  }, [activitiesByStudent, mapActivityToEntry]);

  useEffect(() => {
    const student = students.find((s) => s.id === selectedStudentId) || students[0];
    if (!student) return;
    fetchActivitiesForStudent(student);
  }, [selectedStudentId, students, fetchActivitiesForStudent]);

  const handleOpenStudentDialog = () => {
    const today = new Date().toISOString().split('T')[0];
    resetStudentForm();
    const current = students.find((s) => s.id === selectedStudentId) || students[0];
    setStudentForm((prev) => ({
      ...prev,
      startDate: current?.startDate || today,
      progress: current?.progress ?? 100,
      legacyId: current?.legacyId || '',
      name: current?.source === 'mock' ? current.name : '',
      email: current?.source === 'mock' ? current.email : ''
    }));
    setIsStudentDialogOpen(true);
  };

  const handleStudentDialogOpenChange = (open: boolean) => {
    setIsStudentDialogOpen(open);
    if (!open) {
      resetStudentForm();
    }
  };

  const handleOpenActivityDialog = () => {
    const today = new Date().toISOString().split('T')[0];
    resetActivityForm();
    setActivityForm((prev) => ({
      ...prev,
      date: today
    }));
    setIsActivityDialogOpen(true);
  };

  const handleActivityDialogOpenChange = (open: boolean) => {
    setIsActivityDialogOpen(open);
    if (!open) {
      resetActivityForm();
    }
  };

  const handleSubmitStudent: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!studentForm.name.trim() || !studentForm.email.trim()) {
      toast({
        variant: 'destructive',
        title: 'Unable to create student',
        description: 'Name and email are required.'
      });
      return;
    }

    setStudentSubmitting(true);
    try {
      const payload = {
        name: studentForm.name.trim(),
        email: studentForm.email.trim(),
        progress: Number.isFinite(studentForm.progress) ? Math.min(Math.max(studentForm.progress, 0), 100) : 0,
        status: studentForm.status,
        startDate: studentForm.startDate ? new Date(studentForm.startDate).toISOString() : undefined,
        notes: studentForm.notes.trim() ? studentForm.notes.trim() : undefined,
        legacyId: studentForm.legacyId?.trim() ? studentForm.legacyId.trim() : undefined
      };

      const response = await apiService.createStudentLogStudent(payload);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create student');
      }

      const created = response.data;
      const mapped: StudentOption = {
        id: created._id,
        legacyId: created.legacyId || undefined,
        name: created.name,
        email: created.email,
        progress: created.progress ?? 0,
        startDate: created.startDate ? created.startDate.split('T')[0] : undefined,
        status: created.status,
        source: 'backend'
      };

      setStudents((prev) => sortStudents([...prev.filter((s) => s.id !== mapped.id), mapped]));
      setActivitiesByStudent((prev) => ({ ...prev, [mapped.id]: [] }));
      setSelectedStudentId(mapped.id);
      setDataSourceMessage('Live student log synced from the server.');
      toast({ title: 'Student added', description: `${mapped.name} is now in the student log.` });
      setIsStudentDialogOpen(false);
      resetStudentForm();
    } catch (error) {
      console.error('Student creation failed:', error);
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast({ variant: 'destructive', title: 'Unable to create student', description });
    } finally {
      setStudentSubmitting(false);
    }
  };

  const handleSubmitActivity: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const current = students.find((s) => s.id === selectedStudentId);

    if (!current || current.source !== 'backend') {
      toast({
        variant: 'destructive',
        title: 'Select a synced student first',
        description: 'Create or select a student that exists on the server before adding activity.'
      });
      return;
    }

    if (!activityForm.title.trim() || !activityForm.date) {
      toast({
        variant: 'destructive',
        title: 'Unable to add activity',
        description: 'Title and date are required.'
      });
      return;
    }

    setActivitySubmitting(true);
    try {
      const trimmedViews = activityForm.views.trim();
      const viewsNumber = trimmedViews ? Number(trimmedViews) : undefined;
      const payload = {
        type: activityForm.type,
        title: activityForm.title.trim(),
        description: activityForm.description.trim() || undefined,
        date: new Date(activityForm.date).toISOString(),
        material: activityForm.material.trim() || undefined,
        materialType: activityForm.materialType,
        materialUrl: activityForm.materialUrl.trim() || undefined,
        completed: activityForm.completed,
        score: activityForm.score.trim() || undefined,
        duration: activityForm.duration.trim() || undefined,
        serverId: activityForm.serverId.trim() || undefined,
        category: activityForm.category.trim() || undefined,
        views: typeof viewsNumber === 'number' && !Number.isNaN(viewsNumber) ? viewsNumber : undefined,
        metadata: activityForm.metadataNotes.trim() ? { notes: activityForm.metadataNotes.trim() } : undefined
      };

      const response = await apiService.createStudentLogActivity(current.id, payload);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create activity');
      }

      const created = mapActivityToEntry(response.data);
      setActivitiesByStudent((prev) => {
        const existing = prev[current.id] || [];
        const updated = [created, ...existing].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return { ...prev, [current.id]: updated };
      });

      toast({ title: 'Activity added', description: `${created.title} was added to ${current.name}.` });
      setIsActivityDialogOpen(false);
      resetActivityForm();
    } catch (error) {
      console.error('Activity creation failed:', error);
      const description = error instanceof Error ? error.message : 'Please try again.';
      toast({ variant: 'destructive', title: 'Unable to add activity', description });
    } finally {
      setActivitySubmitting(false);
    }
  };

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) || students[0],
    [students, selectedStudentId]
  );

  const currentStudentId = selectedStudent?.id ?? '';
  const currentLegacyId = selectedStudent?.legacyId ?? currentStudentId;

  const currentActivities = useMemo(() => {
    const backendActivities = currentStudentId ? activitiesByStudent[currentStudentId] : undefined;
    if (backendActivities && backendActivities.length) {
      return backendActivities;
    }
    return buildMockActivitiesForLegacy(currentLegacyId);
  }, [activitiesByStudent, currentStudentId, currentLegacyId]);

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'All Activity') {
      return currentActivities;
    }
    const loweredFilter = activeFilter.toLowerCase();
    return currentActivities.filter((activity) => activity.type.toLowerCase() === loweredFilter);
  }, [currentActivities, activeFilter]);

  const formattedStartDate = selectedStudent?.startDate
    ? selectedStudent.startDate
    : getMockStartDate(currentLegacyId);

  const courseProgress = selectedStudent?.progress ?? 0;
  const canAddActivity = !!selectedStudent && selectedStudent.source === 'backend';
  const activityButtonTitle = canAddActivity
    ? 'Add a new learning log entry for this student'
    : 'Create or select a synced student before adding activity logs.';

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-white">Student Learning Log</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleOpenStudentDialog}
              variant="secondary"
              size="sm"
              className="h-8 gap-1 px-2 text-xs"
            >
              <Plus className="h-3 w-3" />
              New Student
            </Button>
            <Button
              onClick={handleOpenActivityDialog}
              variant="outline"
              size="sm"
              disabled={!canAddActivity}
              title={activityButtonTitle}
              className="h-8 gap-1 px-2 text-xs"
            >
              <Plus className="h-3 w-3" />
              Add Activity
            </Button>
          </div>
        </div>

        {dataSourceMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
            <Database className="h-4 w-4" />
            <span>{dataSourceMessage}</span>
          </div>
        )}

        {/* Student Selection */}
        <Card className="bg-slate-800/50 border-gray-700/50 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-gray-300 text-sm mb-2">Select Student</p>
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId} disabled={studentsLoading}>
                    <SelectTrigger className="w-80 bg-slate-700/50 border-gray-600/50 text-white disabled:opacity-50">
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-gray-700">
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id} className="text-white hover:bg-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {student.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-gray-400">{student.email}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-right">
                <p className="text-gray-300 text-sm mb-1">Course Progress</p>
                <div className="text-3xl font-bold text-white">{courseProgress}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Info Bar */}
        <Card className="bg-slate-800/50 border-gray-700/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedStudent?.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="text-white font-medium">{selectedStudent?.name}</div>
                  <div className="text-gray-400 text-sm">({selectedStudent?.email})</div>
                </div>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                  {(selectedStudent?.status || 'Active').charAt(0).toUpperCase() + (selectedStudent?.status || 'Active').slice(1)}
                </Badge>
                <Badge className={selectedStudent?.source === 'backend' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-600/30 text-slate-200 border-slate-600/40'}>
                  {selectedStudent?.source === 'backend' ? 'Synced' : 'Saved'}
                </Badge>
              </div>

              <div className="text-right text-sm space-y-1">
                <div className="text-gray-400">Started: <span className="text-white">{formattedStartDate}</span></div>
                <div className="text-gray-400">Progress: <span className="text-white">{courseProgress}%</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Filter className="h-4 w-4 text-gray-400" />
          {filterTabs.map((tab) => (
            <Button
              key={tab}
              variant={activeFilter === tab ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(tab)}
              className={activeFilter === tab
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'}
            >
              {tab === 'Module' && <BookOpen className="h-3 w-3 mr-1" />}
              {tab === 'Achievement' && <Trophy className="h-3 w-3 mr-1" />}
              {tab === 'Assignment' && <FileText className="h-3 w-3 mr-1" />}
              {tab === 'Quiz' && <FileText className="h-3 w-3 mr-1" />}
              {tab === 'Video' && <Play className="h-3 w-3 mr-1" />}
              {tab === 'Document' && <File className="h-3 w-3 mr-1" />}
              {tab}
            </Button>
          ))}
        </div>

        {activityErrorMessage && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {activityErrorMessage}
          </div>
        )}

        {/* Activity Log */}
        <div className="space-y-3">
          {activitiesLoading && (
            <Card className="bg-slate-800/50 border-gray-700/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
                  <span>Loading activity history...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {!activitiesLoading && filteredActivities.length === 0 && (
            <Card className="bg-slate-800/50 border-gray-700/50">
              <CardContent className="p-6 text-center text-gray-400">
                No activity entries match the selected filter yet.
              </CardContent>
            </Card>
          )}

          {filteredActivities.map((activity) => (
            <Card key={`${activity.id}-${activity.studentId || activity.legacyId}`} className="bg-slate-800/50 border-gray-700/50 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                        <span className="text-white font-medium">{activity.title}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-300">{activity.description}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <Badge
                          variant="outline"
                          className={
                            activity.type === 'achievement' ? 'border-purple-500/30 text-purple-300 bg-purple-500/10' :
                            activity.type === 'assignment' ? 'border-orange-500/30 text-orange-300 bg-orange-500/10' :
                            activity.type === 'quiz' ? 'border-green-500/30 text-green-300 bg-green-500/10' :
                            activity.type === 'video' ? 'border-red-500/30 text-red-300 bg-red-500/10' :
                            activity.type === 'document' ? 'border-yellow-500/30 text-yellow-300 bg-yellow-500/10' :
                            'border-blue-500/30 text-blue-300 bg-blue-500/10'
                          }
                        >
                          {activity.type}
                        </Badge>
                        <span className="text-gray-400">{activity.date}</span>
                        {activity.serverID && (
                          <>
                            <span className="text-gray-500">Server ID:</span>
                            <span className="text-gray-400 font-mono text-xs">{activity.serverID}</span>
                          </>
                        )}
                        {activity.category && (
                          <>
                            <span className="text-gray-500">Category:</span>
                            <span className="text-cyan-400 text-xs">{activity.category}</span>
                          </>
                        )}
                        {typeof activity.views === 'number' && (
                          <>
                            <span className="text-gray-500">Views:</span>
                            <span className="text-gray-400 text-xs">{activity.views}</span>
                          </>
                        )}
                        {activity.score && (
                          <>
                            <span className="text-gray-500">Score:</span>
                            <span className="text-green-400 font-medium">{activity.score}</span>
                          </>
                        )}
                        {activity.duration && (
                          <>
                            <span className="text-gray-500">Duration:</span>
                            <span className="text-gray-400 text-xs">{activity.duration}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      {activity.materialType === 'video' ? (
                        <Play className="h-4 w-4 text-red-400" />
                      ) : (
                        <FileText className="h-4 w-4 text-blue-400" />
                      )}
                      <span className={activity.materialType === 'video' ? 'text-red-400' : 'text-blue-400'}>
                        {activity.material}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    <Dialog open={isStudentDialogOpen} onOpenChange={handleStudentDialogOpenChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Create Student Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitStudent} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="student-name" className="text-gray-200">Full Name</Label>
              <Input
                id="student-name"
                value={studentForm.name}
                onChange={(event) => setStudentForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Jane Doe"
                autoComplete="name"
                required
              />
            </div>
            <div>
              <Label htmlFor="student-email" className="text-gray-200">Email</Label>
              <Input
                id="student-email"
                type="email"
                value={studentForm.email}
                onChange={(event) => setStudentForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="name@email.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <Label htmlFor="student-progress" className="text-gray-200">Progress (%)</Label>
              <Input
                id="student-progress"
                type="number"
                min={0}
                max={100}
                value={studentForm.progress}
                onChange={(event) => {
                  const numeric = Number(event.target.value);
                  setStudentForm((prev) => ({
                    ...prev,
                    progress: Number.isNaN(numeric) ? 0 : numeric
                  }));
                }}
              />
            </div>
            <div>
              <Label htmlFor="student-status" className="text-gray-200">Status</Label>
              <Select
                value={studentForm.status ?? 'active'}
                onValueChange={(value) => setStudentForm((prev) => ({ ...prev, status: value as StudentOption['status'] }))}
              >
                <SelectTrigger id="student-status" className="bg-slate-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-gray-700 text-white">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="student-start-date" className="text-gray-200">Start Date</Label>
              <Input
                id="student-start-date"
                type="date"
                value={studentForm.startDate || ''}
                onChange={(event) => setStudentForm((prev) => ({ ...prev, startDate: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="student-legacy" className="text-gray-200">Legacy ID (optional)</Label>
              <Input
                id="student-legacy"
                value={studentForm.legacyId}
                onChange={(event) => setStudentForm((prev) => ({ ...prev, legacyId: event.target.value }))}
                placeholder="Match existing saved student"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="student-notes" className="text-gray-200">Notes</Label>
            <Textarea
              id="student-notes"
              value={studentForm.notes}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Optional context about this student"
              className="bg-slate-800 border-gray-700 text-white"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleStudentDialogOpenChange(false)}
              disabled={studentSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={studentSubmitting}>
              {studentSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Student'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    <Dialog open={isActivityDialogOpen} onOpenChange={handleActivityDialogOpenChange}>
        <DialogContent className="max-w-2xl md:max-w-xl p-0">
          <DialogHeader className="px-6 pt-6 pb-3">
            <DialogTitle>Add Activity</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitActivity} className="space-y-3 px-6 pb-6">
          <div className="grid max-h-[60vh] gap-3 overflow-y-auto pr-2 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-gray-200">Student</Label>
              <div className="rounded-md border border-gray-700 bg-slate-800 px-3 py-2 text-sm text-gray-200">
                {selectedStudent?.name || 'No student selected'}
              </div>
            </div>
            <div>
              <Label htmlFor="activity-type" className="text-gray-200">Type</Label>
              <Select
                value={activityForm.type}
                onValueChange={(value) => setActivityForm((prev) => ({ ...prev, type: value as StudentLogActivity['type'] }))}
              >
                <SelectTrigger id="activity-type" className="h-9 bg-slate-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-gray-700 text-white">
                  <SelectItem value="module">Module</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="activity-date" className="text-gray-200">Completion Date</Label>
              <Input
                id="activity-date"
                type="date"
                value={activityForm.date}
                onChange={(event) => setActivityForm((prev) => ({ ...prev, date: event.target.value }))}
                required
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="activity-title" className="text-gray-200">Title</Label>
              <Input
                id="activity-title"
                className="h-9"
                value={activityForm.title}
                onChange={(event) => setActivityForm((prev) => ({ ...prev, title: event.target.value }))}
                placeholder="Training module or milestone"
                required
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="activity-description" className="text-gray-200">Description</Label>
              <Textarea
                id="activity-description"
                value={activityForm.description}
                onChange={(event) => setActivityForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Optional summary of what was completed"
                className="bg-slate-800 border-gray-700 text-white text-sm"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="activity-material" className="text-gray-200">Material Name</Label>
              <Input
                id="activity-material"
                className="h-9"
                value={activityForm.material}
                onChange={(event) => setActivityForm((prev) => ({ ...prev, material: event.target.value }))}
                placeholder="Resource title"
              />
            </div>
            <div>
              <Label htmlFor="activity-material-type" className="text-gray-200">Material Type</Label>
              <Select
                value={activityForm.materialType}
                onValueChange={(value) => setActivityForm((prev) => ({ ...prev, materialType: value as StudentLogActivity['materialType'] }))}
              >
                <SelectTrigger id="activity-material-type" className="h-9 bg-slate-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-gray-700 text-white">
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="activity-material-url" className="text-gray-200">Material URL</Label>
              <Input
                id="activity-material-url"
                className="h-9"
                value={activityForm.materialUrl}
                onChange={(event) => setActivityForm((prev) => ({ ...prev, materialUrl: event.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Checkbox
                id="activity-completed"
                checked={activityForm.completed}
                onCheckedChange={(checked) => setActivityForm((prev) => ({ ...prev, completed: Boolean(checked) }))}
              />
              <Label htmlFor="activity-completed" className="text-gray-200">Marked complete</Label>
            </div>
            <div>
              <Label htmlFor="activity-score" className="text-gray-200">Score</Label>
              <Input
                id="activity-score"
                className="h-9"
                value={activityForm.score}
                onChange={(event) => setActivityForm((prev) => ({ ...prev, score: event.target.value }))}
                placeholder="e.g. 95%"
              />
            </div>
            <div>
              <Label htmlFor="activity-duration" className="text-gray-200">Duration</Label>
              <Input
                id="activity-duration"
                className="h-9"
                value={activityForm.duration}
                onChange={(event) => setActivityForm((prev) => ({ ...prev, duration: event.target.value }))}
                placeholder="e.g. 45 min"
              />
            </div>
            <div>
              <Label htmlFor="activity-server" className="text-gray-200">Server ID</Label>
              <Input
                id="activity-server"
                className="h-9"
                value={activityForm.serverId}
                onChange={(event) => setActivityForm((prev) => ({ ...prev, serverId: event.target.value }))}
                placeholder="srv-content-001"
              />
            </div>
            <div>
              <Label htmlFor="activity-category" className="text-gray-200">Category</Label>
              <Input
                id="activity-category"
                className="h-9"
                value={activityForm.category}
                onChange={(event) => setActivityForm((prev) => ({ ...prev, category: event.target.value }))}
                placeholder="e.g. Market Research"
              />
            </div>
            <div>
              <Label htmlFor="activity-views" className="text-gray-200">Views</Label>
              <Input
                id="activity-views"
                type="number"
                min={0}
                className="h-9"
                value={activityForm.views}
                onChange={(event) => setActivityForm((prev) => ({ ...prev, views: event.target.value }))}
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="activity-metadata" className="text-gray-200">Internal Notes</Label>
              <Textarea
                id="activity-metadata"
                value={activityForm.metadataNotes}
                onChange={(event) => setActivityForm((prev) => ({ ...prev, metadataNotes: event.target.value }))}
                placeholder="Optional notes that are for internal reference"
                className="bg-slate-800 border-gray-700 text-white text-sm"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleActivityDialogOpenChange(false)}
              disabled={activitySubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={activitySubmitting || !canAddActivity}>
              {activitySubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Activity'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
};
