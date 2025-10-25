
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

export interface Allotment {
  roomName: string;
  seatNumber: number;
  student: Student;
}

export interface SeatingPlan {
  allotmentsByRoom: Record<string, Allotment[]>;
  allStudentsAllotted: Allotment[];
  summary: {
    totalStudents: number;
    totalCapacity: number;
    roomsUsed: number;
    unseatedStudents: number;
  };
}
