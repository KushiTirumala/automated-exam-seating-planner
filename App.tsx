import React, { useState, useCallback, useMemo } from 'react';
import type { Student, Classroom, SeatingPlan, Teacher, User } from './types';
import { generateSeatingPlan } from './services/seatingPlanner';
import ClassroomManager from './components/ClassroomManager';
import StudentDataInput from './components/StudentDataInput';
import SeatingPlanDisplay from './components/SeatingPlanDisplay';
import TeacherManager from './components/TeacherManager';
import { BuildingOfficeIcon, UsersIcon, ArrowRightOnRectangleIcon, AcademicCapIcon, TicketIcon } from './components/icons/IconComponents';

// --- MOCK DATA ---
// In a real application, this would come from a backend server.
const MOCK_USERS: User[] = [
  // Admin/Teacher User
  { id: 'T01', name: 'Dr. Evelyn Reed', password: 'password', role: 'teacher' },
  // Student Users (Roll Number is their ID)
  { id: '21CS001', name: 'John Doe', password: 'password', role: 'student' },
  { id: '21EC002', name: 'Jane Smith', password: 'password', role: 'student' },
  { id: '21ME003', name: 'Peter Jones', password: 'password', role: 'student' },
];

// --- SUB-COMPONENTS (for different pages/views) ---

const LoginPage: React.FC<{ onLoginSuccess: (user: User) => void }> = ({ onLoginSuccess }) => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const user = MOCK_USERS.find(u => u.id === id && u.password === password);
        if (user) {
            onLoginSuccess(user);
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Seating Planner</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                         <label htmlFor="id" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            ID (Roll Number / Employee ID)
                        </label>
                        <input
                            id="id"
                            type="text"
                            value={id}
                            onChange={e => setId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., 21CS001 or T01"
                            required
                        />
                    </div>
                     <div className="space-y-2">
                         <label htmlFor="password"  className="text-sm font-medium text-gray-700 dark:text-gray-300">
                           Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Default: password"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

const StudentDashboard: React.FC<{ student: User, plan: SeatingPlan | null }> = ({ student, plan }) => {
    const allotment = useMemo(() => {
        return plan?.allStudentsAllotted.find(a => a.student.rollNumber === student.id) ?? null;
    }, [plan, student.id]);

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <TicketIcon className="w-16 h-16 mx-auto text-indigo-500" />
                <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Your Exam Hall Ticket</h2>
                {!plan && (
                    <p className="mt-4 text-lg text-yellow-600 dark:text-yellow-400">
                        The seating plan has not been generated yet. Please check back later.
                    </p>
                )}
                {plan && !allotment && (
                     <p className="mt-4 text-lg text-red-500">
                        Your roll number was not found in the generated seating plan. Please contact the administrator.
                    </p>
                )}
                {plan && allotment && (
                    <div className="mt-6 border dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700/50 text-left">
                        <div className="space-y-3 text-base">
                            <p><strong>Roll Number:</strong> {allotment.student.rollNumber}</p>
                            <p><strong>Name:</strong> {allotment.student.name}</p>
                            <p><strong>Subject:</strong> {allotment.student.subjectCode}</p>
                            <hr className="my-3 dark:border-gray-600" />
                            <div className="flex justify-around items-center text-center pt-2">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Room</p>
                                    <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{allotment.roomName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Seat</p>
                                    <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{allotment.seatNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPlanGenerated, setIsPlanGenerated] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [seatingPlan, setSeatingPlan] = useState<SeatingPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlanGeneration = useCallback(() => {
    setError(null);
    if (students.length === 0) {
      setError("Please upload student data.");
      return;
    }
    if (classrooms.length === 0) {
        setError("Please define classrooms.");
        return;
    }
    if (teachers.length === 0) {
        setError("Please add invigilators.");
        return;
    }

    try {
      const plan = generateSeatingPlan(students, classrooms, teachers);
      setSeatingPlan(plan);
      setIsPlanGenerated(true);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred during plan generation.");
      }
    }
  }, [students, classrooms, teachers]);

  const handleBackToInput = () => {
    setIsPlanGenerated(false);
    setSeatingPlan(null); // Optionally clear plan to allow re-generation
    setError(null);
  };
  
  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => {
    setCurrentUser(null);
    // Reset all state on logout
    setIsPlanGenerated(false);
    setStudents([]);
    setClassrooms([]);
    setTeachers([]);
    setSeatingPlan(null);
    setError(null);
  };

  const totalCapacity = classrooms.reduce((acc, room) => acc + room.capacity, 0);

  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Automated Exam Seating Planner
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {currentUser.role === 'student' ? 'Student Portal' : 'Admin Portal'}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <span className="hidden sm:block text-sm text-gray-700 dark:text-gray-300">Welcome, <strong>{currentUser.name}</strong></span>
             <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                <span className="hidden sm:inline">Logout</span>
             </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {currentUser.role === 'student' ? (
           <StudentDashboard student={currentUser} plan={seatingPlan} />
        ) : (
            <>
            {!isPlanGenerated && (
            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <BuildingOfficeIcon className="w-6 h-6 mr-2" />
                        1. Define Classrooms
                    </h2>
                    <ClassroomManager classrooms={classrooms} setClassrooms={setClassrooms} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <AcademicCapIcon className="w-6 h-6 mr-2" />
                        2. Define Invigilators
                    </h2>
                    <TeacherManager teachers={teachers} setTeachers={setTeachers} />
                </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <UsersIcon className="w-6 h-6 mr-2" />
                        3. Upload Student Data
                    </h2>
                    <StudentDataInput setStudents={setStudents} />
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                    <div className="mb-4 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-lg">
                        <p><strong className="font-semibold text-indigo-600 dark:text-indigo-400">{students.length}</strong> Students</p>
                        <p><strong className="font-semibold text-indigo-600 dark:text-indigo-400">{totalCapacity}</strong> Total Seats</p>
                        <p><strong className="font-semibold text-indigo-600 dark:text-indigo-400">{teachers.length}</strong> Invigilators</p>
                    </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                <button 
                    onClick={handlePlanGeneration}
                    disabled={students.length === 0 || classrooms.length === 0 || teachers.length === 0}
                    className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                    Generate Seating Plan
                </button>
                </div>
            </div>
            )}

            {isPlanGenerated && seatingPlan && (
            <div>
                <button 
                onClick={handleBackToInput}
                className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors print:hidden"
                >
                &larr; Back to Inputs
                </button>
                <SeatingPlanDisplay plan={seatingPlan} />
            </div>
            )}
            </>
        )}
      </main>
    </div>
  );
};

export default App;
