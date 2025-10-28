// Helper function to detect overlapping bookings (conflicts)
export const detectBookingConflicts = (bookings: any[]) => {
  const conflicts: { [key: string]: any[] } = {};

  // Group bookings by room and date
  bookings.forEach(booking => {
    const key = `${booking.roomId}-${booking.date}`;
    if (!conflicts[key]) {
      conflicts[key] = [];
    }
    conflicts[key].push(booking);
  });

  // Find overlaps within each group
  const overlappingGroups: any[][] = [];
  Object.values(conflicts).forEach((roomBookings: any[]) => {
    // Sort by start time
    roomBookings.sort((a, b) => {
      const aStart = new Date(`${a.date}T${a.startTime}`).getTime();
      const bStart = new Date(`${b.date}T${b.startTime}`).getTime();
      return aStart - bStart;
    });

    // Find overlapping bookings
    for (let i = 0; i < roomBookings.length; i++) {
      const current = roomBookings[i];
      const currentStart = new Date(`${current.date}T${current.startTime}`).getTime();
      const currentEnd = new Date(`${current.date}T${current.endTime}`).getTime();

      const overlappingBookings = [current];

      for (let j = i + 1; j < roomBookings.length; j++) {
        const next = roomBookings[j];
        const nextStart = new Date(`${next.date}T${next.startTime}`).getTime();
        const nextEnd = new Date(`${next.date}T${next.endTime}`).getTime();

        // Check for overlap
        if (currentStart < nextEnd && currentEnd > nextStart) {
          overlappingBookings.push(next);
        } else {
          // Since bookings are sorted, no more overlaps possible
          break;
        }
      }

      if (overlappingBookings.length > 1) {
        // Check if this group is already in overlappingGroups
        const exists = overlappingGroups.some(group =>
          group.every(b => overlappingBookings.some(ob => ob.id === b.id)) &&
          overlappingBookings.every(ob => group.some(b => b.id === ob.id))
        );

        if (!exists) {
          overlappingGroups.push(overlappingBookings);
        }
      }
    }
  });

  return overlappingGroups;
};

// Get color based on booking status
export const getBookingStatusColor = (status: string, isConflicted: boolean = false) => {
  if (isConflicted) {
    return 'bg-red-500';
  }

  switch (status?.toLowerCase()) {
    case 'confirmed':
    case 'confirmée':
      return 'bg-green-500';
    case 'pending':
    case 'en attente':
      return 'bg-yellow-500';
    case 'cancelled':
    case 'annulée':
      return 'bg-gray-500';
    case 'completed':
    case 'terminée':
      return 'bg-blue-500';
    default:
      return 'bg-orange-500';
  }
};