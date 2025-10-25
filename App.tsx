
import React, { useState, useCallback } from 'react';
import type { Student, Classroom, SeatingPlan } from './types';
import { generateSeatingPlan } from './services/seatingPlanner';
import ClassroomManager from './components/ClassroomManager';
import StudentDataInput from './components/StudentDataInput';
import SeatingPlanDisplay from './components/SeatingPlanDisplay';
import { BuildingOfficeIcon, UsersIcon } from './components/icons/IconComponents';

type AppStep = 'input' | 'results';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('input');
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [seatingPlan, setSeatingPlan] = useState<SeatingPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePlanGeneration = useCallback(() => {
    setError(null);
    if (students.length === 0 || classrooms.length === 0) {
      setError("Please provide both student data and classroom information.");
      return;
    }
    try {
      const plan = generateSeatingPlan(students, classrooms);
      setSeatingPlan(plan);
      setStep('results');
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred during plan generation.");
      }
    }
  }, [students, classrooms]);

  const handleBackToInput = () => {
    setStep('input');
    setSeatingPlan(null);
    setError(null);
  };

  const totalCapacity = classrooms.reduce((acc, room) => acc + room.capacity, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Automated Exam Seating Planner
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Efficiently generate and manage exam seating arrangements.
          </p>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {step === 'input' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                 <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <BuildingOfficeIcon className="w-6 h-6 mr-2" />
                    1. Define Classrooms
                </h2>
                <ClassroomManager classrooms={classrooms} setClassrooms={setClassrooms} />
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <UsersIcon className="w-6 h-6 mr-2" />
                    2. Input Student Data
                </h2>
                <StudentDataInput setStudents={setStudents} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <div className="mb-4 flex justify-center items-center space-x-8 text-lg">
                    <p><strong className="font-semibold text-indigo-600 dark:text-indigo-400">{students.length}</strong> Students</p>
                    <p><strong className="font-semibold text-indigo-600 dark:text-indigo-400">{totalCapacity}</strong> Total Seats</p>
                </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}
              
              <button 
                onClick={handlePlanGeneration}
                disabled={students.length === 0 || classrooms.length === 0}
                className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Generate Seating Plan
              </button>
            </div>
          </div>
        )}

        {step === 'results' && seatingPlan && (
          <div>
            <button 
              onClick={handleBackToInput}
              className="mb-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              &larr; Back to Inputs
            </button>
            <SeatingPlanDisplay plan={seatingPlan} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
