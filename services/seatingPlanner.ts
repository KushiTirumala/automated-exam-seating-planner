
import type { Student, Classroom, SeatingPlan, Allotment } from '../types';

// Simple shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateSeatingPlan = (
  students: Student[],
  classrooms: Classroom[]
): SeatingPlan => {
  const totalCapacity = classrooms.reduce((sum, room) => sum + room.capacity, 0);

  if (students.length > totalCapacity) {
    throw new Error(
      `Not enough seats. ${students.length} students need seating, but only ${totalCapacity} seats are available.`
    );
  }

  // Shuffle students to randomize seating
  const shuffledStudents = shuffleArray(students);

  // Create a flat list of all available seats
  const allSeats: { roomName: string; seatNumber: number }[] = [];
  classrooms.forEach(room => {
    for (let i = 1; i <= room.capacity; i++) {
      allSeats.push({ roomName: room.name, seatNumber: i });
    }
  });

  // Assign students to seats
  const allStudentsAllotted: Allotment[] = shuffledStudents.map((student, index) => ({
    student,
    roomName: allSeats[index].roomName,
    seatNumber: allSeats[index].seatNumber,
  }));

  // Group allotments by room
  const allotmentsByRoom: Record<string, Allotment[]> = {};
  allStudentsAllotted.forEach(allotment => {
    if (!allotmentsByRoom[allotment.roomName]) {
      allotmentsByRoom[allotment.roomName] = [];
    }
    allotmentsByRoom[allotment.roomName].push(allotment);
  });

  // Sort students within each room by seat number
  for (const roomName in allotmentsByRoom) {
    allotmentsByRoom[roomName].sort((a, b) => a.seatNumber - b.seatNumber);
  }

  return {
    allotmentsByRoom,
    allStudentsAllotted: allStudentsAllotted.sort((a,b) => a.student.rollNumber.localeCompare(b.student.rollNumber)),
    summary: {
      totalStudents: students.length,
      totalCapacity,
      roomsUsed: Object.keys(allotmentsByRoom).length,
      unseatedStudents: students.length - allStudentsAllotted.length,
    },
  };
};
