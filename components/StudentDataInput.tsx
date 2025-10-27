
import React, { useState, useRef } from 'react';
import type { Student } from '../types';
import { DocumentArrowUpIcon, TrashIcon } from './icons/IconComponents';

interface StudentDataInputProps {
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const StudentDataInput: React.FC<StudentDataInputProps> = ({ setStudents }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      
      const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
      if (lines.length <= 1) { // Header only or empty file
        setStudents([]);
        return;
      }
      
      const parsedStudents: Student[] = lines
        .slice(1) // Assume first line is header
        .map(line => {
          const [rollNumber, name, subjectCode] = line.split(',').map(item => item.trim());
          return { rollNumber, name, subjectCode };
        }).filter(s => s.rollNumber && s.name && s.subjectCode);

      setStudents(parsedStudents);
    };
    reader.readAsText(file);
  };
  
  const handleClearFile = () => {
    setStudents([]);
    setFileName(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
        <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upload student data as a CSV file.
            </p>
            <p className="text-xs text-gray-500">
                Required columns: Roll Number, Student Name, Subject Code (with header)
            </p>
        </div>

        {!fileName ? (
            <label htmlFor="student-csv-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-200">
                    Click to upload a file
                </span>
                <input ref={fileInputRef} id="student-csv-upload" name="student-csv-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
            </label>
        ) : (
            <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                <span className="font-medium truncate">{fileName}</span>
                <button onClick={handleClearFile} className="ml-4 text-red-500 hover:text-red-700">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        )}
    </div>
  );
};

export default StudentDataInput;
