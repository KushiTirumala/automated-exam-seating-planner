
import React, { useState } from 'react';
import type { Classroom } from '../types';
import { PlusIcon, TrashIcon } from './icons/IconComponents';

interface ClassroomManagerProps {
  classrooms: Classroom[];
  setClassrooms: React.Dispatch<React.SetStateAction<Classroom[]>>;
}

const ClassroomManager: React.FC<ClassroomManagerProps> = ({ classrooms, setClassrooms }) => {
  const [roomName, setRoomName] = useState('');
  const [capacity, setCapacity] = useState('');

  const handleAddClassroom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim() && capacity) {
      const newClassroom: Classroom = {
        id: new Date().toISOString(),
        name: roomName.trim(),
        capacity: parseInt(capacity, 10),
      };
      setClassrooms([...classrooms, newClassroom]);
      setRoomName('');
      setCapacity('');
    }
  };

  const handleRemoveClassroom = (id: string) => {
    setClassrooms(classrooms.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddClassroom} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={roomName}
          onChange={e => setRoomName(e.target.value)}
          placeholder="Room Name (e.g., A-101)"
          className="flex-grow p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <input
          type="number"
          value={capacity}
          onChange={e => setCapacity(e.target.value)}
          placeholder="Capacity"
          className="w-full sm:w-24 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
          min="1"
          required
        />
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center">
          <PlusIcon className="w-5 h-5" />
        </button>
      </form>
      
      <div className="max-h-60 overflow-y-auto pr-2">
        <ul className="space-y-2">
          {classrooms.length === 0 && <p className="text-gray-500 text-center py-4">No classrooms added yet.</p>}
          {classrooms.map(c => (
            <li key={c.id} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
              <span className="font-medium">{c.name}</span>
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400">Capacity: {c.capacity}</span>
                <button onClick={() => handleRemoveClassroom(c.id)} className="text-red-500 hover:text-red-700">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClassroomManager;
