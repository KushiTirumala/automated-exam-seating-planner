
import React, { useState } from 'react';
import type { Teacher } from '../types';
import { PlusIcon, TrashIcon } from './icons/IconComponents';

interface TeacherManagerProps {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

const TeacherManager: React.FC<TeacherManagerProps> = ({ teachers, setTeachers }) => {
  const [teacherName, setTeacherName] = useState('');
  const [teacherId, setTeacherId] = useState('');

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherName.trim() && teacherId.trim()) {
      const newTeacher: Teacher = {
        id: teacherId.trim(),
        name: teacherName.trim(),
      };
      setTeachers(prev => [...prev, newTeacher]);
      setTeacherName('');
      setTeacherId('');
    }
  };

  const handleRemoveTeacher = (id: string) => {
    setTeachers(teachers.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTeacher} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={teacherName}
          onChange={e => setTeacherName(e.target.value)}
          placeholder="Teacher Name"
          className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <input
          type="text"
          value={teacherId}
          onChange={e => setTeacherId(e.target.value)}
          placeholder="ID"
          className="w-full sm:w-24 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center">
          <PlusIcon className="w-5 h-5" />
        </button>
      </form>
      
      <div className="max-h-60 overflow-y-auto pr-2">
        <ul className="space-y-2">
          {teachers.length === 0 && <p className="text-gray-500 text-center py-4">No invigilators added yet.</p>}
          {teachers.map(t => (
            <li key={t.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                <div>
                    <span className="font-medium">{t.name}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">ID: {t.id}</span>
                </div>
              <button onClick={() => handleRemoveTeacher(t.id)} className="text-red-500 hover:text-red-700">
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TeacherManager;
