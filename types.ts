
export interface Student {
  rollNumber: string;
  name: string;
  subjectCode: string;
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
}

export interface Teacher {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  // FIX: Corrected a typo in the 'password' property definition. It should be a colon, not a semicolon.
  password: string;
  role: 'student' | 'teacher';
}

export interface Allotment {
  roomName: string;
  seatNumber: number;
  student: Student;
}

export interface SeatingPlan {
  allotmentsByRoom: Record<string, Allotment[]>;
  allStudentsAllotted: Allotment[];
  invigilatorsByRoom: Record<string, Teacher>;
  summary: {
    totalStudents: number;
    totalCapacity: number;
    roomsUsed: number;
    unseatedStudents: number;
    totalTeachers: number;
  };
}