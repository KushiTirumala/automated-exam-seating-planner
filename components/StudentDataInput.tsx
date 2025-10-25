
import React, { useState } from 'react';
import type { Student } from '../types';

interface StudentDataInputProps {
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const StudentDataInput: React.FC<StudentDataInputProps> = ({ setStudents }) => {
  const [csvData, setCsvData] = useState('');

  const handleDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const data = e.target.value;
    setCsvData(data);
    
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const parsedStudents: Student[] = lines.map(line => {
      const [rollNumber, name, subjectCode] = line.split(',').map(item => item.trim());
      return { rollNumber, name, subjectCode };
    }).filter(s => s.rollNumber && s.name && s.subjectCode); // Ensure all fields are present

    setStudents(parsedStudents);
  };

  return (
    <div className="flex flex-col h-full">
      <label htmlFor="student-data" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Paste student data below.
      </label>
       <p className="text-xs text-gray-500 mb-2">Format: Roll Number, Student Name, Subject Code</p>
      <textarea
        id="student-data"
        value={csvData}
        onChange={handleDataChange}
        placeholder="e.g., 21CS001, John Doe, CS101&#10;21EC002, Jane Smith, EC102"
        className="flex-grow w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
        rows={10}
      />
    </div>
  );
};

export default StudentDataInput;
