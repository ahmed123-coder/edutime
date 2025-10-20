import { useState, useEffect } from "react";

interface Room {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  capacity: number;
  area?: number;
  hourlyRate: number;
  equipment: string[];
  amenities: string[];
  photos: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  _count: {
    bookings: number;
  };
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

export function useTimetableState() {
  // State variables
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [organizationHours, setOrganizationHours] = useState<any>(null);
  const [currentOrganizationHours, setCurrentOrganizationHours] = useState<any>(null);

  // Get week number in the year
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  // Mapping from French day names to English keys
  const frenchToEnglishDayMapping: { [key: string]: string } = {
    'lundi': 'monday',
    'mardi': 'tuesday',
    'mercredi': 'wednesday',
    'jeudi': 'thursday',
    'vendredi': 'friday',
    'samedi': 'saturday',
    'dimanche': 'sunday'
  };

  // Calculate timetable time range from organization hours
  const getTimetableTimeRange = (hours: any) => {
    if (!hours) return { startHour: 8, endHour: 19 };

    let earliestOpen = 24;
    let latestClose = 0;

    Object.values(hours).forEach((dayHours: any) => {
      if (dayHours && !dayHours.closed && dayHours.open && dayHours.close) {
        const openHour = parseInt(dayHours.open.split(':')[0]);
        const closeHour = parseInt(dayHours.close.split(':')[0]);
        if (openHour < earliestOpen) earliestOpen = openHour;
        if (closeHour > latestClose) latestClose = closeHour;
      }
    });

    // If no valid hours found, use default
    if (earliestOpen === 24 || latestClose === 0) {
      return { startHour: 8, endHour: 21 };
    }

    return { startHour: earliestOpen, endHour: latestClose };
  };

  // Fetch organization hours when room is selected
  useEffect(() => {
    const fetchCurrentOrgHours = async () => {
      if (selectedRoom) {
        try {
          const response = await fetch(`/api/organizations/${selectedRoom.organizationId}`);
          if (response.ok) {
            const data = await response.json();
            setCurrentOrganizationHours(data.organization.hours);
          } else {
            // Fallback to general organization hours if specific fetch fails
            setCurrentOrganizationHours(organizationHours);
          }
        } catch (error) {
          console.error("Error fetching organization hours:", error);
          // Fallback to general organization hours
          setCurrentOrganizationHours(organizationHours);
        }
      }
    };

    fetchCurrentOrgHours();
  }, [selectedRoom]);

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatWeekRange = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${endOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    if (direction === 'prev') {
      newDate.setDate(currentWeek.getDate() - 7);
    } else {
      newDate.setDate(currentWeek.getDate() + 7);
    }
    setCurrentWeek(newDate);
  };

  return {
    // State
    currentWeek,
    setCurrentWeek,
    selectedRoom,
    setSelectedRoom,
    calendarOpen,
    setCalendarOpen,
    organizationHours,
    setOrganizationHours,
    currentOrganizationHours,
    setCurrentOrganizationHours,

    // Helper functions
    getWeekNumber,
    getTimetableTimeRange,
    getWeekDays,
    formatWeekRange,
    navigateWeek,
    frenchToEnglishDayMapping,
  };
}