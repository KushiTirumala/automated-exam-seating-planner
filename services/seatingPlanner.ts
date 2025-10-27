
import type { Student, Classroom, SeatingPlan, Allotment, Teacher } from '../types';

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
  classrooms: Classroom[],
  teachers: Teacher[],
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
  
  const usedRoomNames = Object.keys(allotmentsByRoom);

  // Assign invigilators
  if (usedRoomNames.length > teachers.length) {
    throw new Error(
      `Not enough invigilators. ${usedRoomNames.length} rooms require an invigilator, but only ${teachers.length} are available.`
    );
  }

  const shuffledTeachers = shuffleArray(teachers);
  const invigilatorsByRoom: Record<string, Teacher> = {};
  usedRoomNames.forEach((roomName, index) => {
    invigilatorsByRoom[roomName] = shuffledTeachers[index];
  });


  // Sort students within each room by seat number
  for (const roomName in allotmentsByRoom) {
    allotmentsByRoom[roomName].sort((a, b) => a.seatNumber - b.seatNumber);
  }

  return {
    allotmentsByRoom,
    invigilatorsByRoom,
    allStudentsAllotted: allStudentsAllotted.sort((a,b) => a.student.rollNumber.localeCompare(b.student.rollNumber)),
    summary: {
      totalStudents: students.length,
      totalCapacity,
      roomsUsed: usedRoomNames.length,
      unseatedStudents: students.length - allStudentsAllotted.length,
      totalTeachers: teachers.length,
    },
  };
};
