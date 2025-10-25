
import React, { useState } from 'react';
import type { SeatingPlan, Allotment } from '../types';
import { ClipboardIcon, TicketIcon, PrintIcon } from './icons/IconComponents';

interface SeatingPlanDisplayProps {
  plan: SeatingPlan;
}

type ActiveTab = 'allotments' | 'halltickets';

const SeatingPlanDisplay: React.FC<SeatingPlanDisplayProps> = ({ plan }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('allotments');

  const { allotmentsByRoom, allStudentsAllotted, summary } = plan;

  const handlePrint = () => {
    window.print();
  };
  
  const TabButton = ({ tabName, currentTab, setTab, children }: {tabName: ActiveTab, currentTab: ActiveTab, setTab: (tab: ActiveTab) => void, children: React.ReactNode}) => (
      <button
          onClick={() => setTab(tabName)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              currentTab === tabName 
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
      >
          {children}
      </button>
  )

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Seating Plan Generated</h2>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <span><strong>{summary.totalStudents}</strong> Students</span>
                    <span><strong>{summary.roomsUsed}</strong> Rooms Used</span>
                    <span><strong>{summary.totalCapacity}</strong> Total Capacity</span>
                </div>
            </div>
             <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors print:hidden"
            >
              <PrintIcon className="w-5 h-5" />
              Print
            </button>
        </div>
      
      <div className="border-b border-gray-200 dark:border-gray-700 print:hidden">
        <nav className="-mb-px flex gap-4" aria-label="Tabs">
            <TabButton tabName="allotments" currentTab={activeTab} setTab={setActiveTab}>
                <ClipboardIcon className="w-5 h-5" /> Room Allotments
            </TabButton>
            <TabButton tabName="halltickets" currentTab={activeTab} setTab={setActiveTab}>
                <TicketIcon className="w-5 h-5" /> Hall Tickets
            </TabButton>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'allotments' && <RoomAllotmentView allotmentsByRoom={allotmentsByRoom} />}
        {activeTab === 'halltickets' && <HallTicketView allStudentsAllotted={allStudentsAllotted} />}
      </div>
    </div>
  );
};


const RoomAllotmentView: React.FC<{ allotmentsByRoom: Record<string, Allotment[]> }> = ({ allotmentsByRoom }) => (
  <div className="space-y-6">
    {Object.entries(allotmentsByRoom).sort(([roomA], [roomB]) => roomA.localeCompare(roomB)).map(([roomName, allotments]) => (
      <div key={roomName} className="p-4 border dark:border-gray-700 rounded-lg break-inside-avoid">
        <h3 className="text-lg font-semibold mb-3">Room: {roomName} ({allotments.length} students)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Seat No.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Roll No.</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {allotments.map(({ seatNumber, student }) => (
                <tr key={student.rollNumber}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{seatNumber}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{student.rollNumber}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{student.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{student.subjectCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ))}
  </div>
);

const HallTicketView: React.FC<{ allStudentsAllotted: Allotment[] }> = ({ allStudentsAllotted }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {allStudentsAllotted.map(({ student, roomName, seatNumber }) => (
      <div key={student.rollNumber} className="border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 break-inside-avoid">
        <h4 className="font-bold text-center text-lg">Exam Hall Ticket</h4>
        <div className="mt-4 space-y-2 text-sm">
          <p><strong>Roll Number:</strong> {student.rollNumber}</p>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Subject:</strong> {student.subjectCode}</p>
          <hr className="my-2 dark:border-gray-600"/>
          <p className="text-base"><strong>Room:</strong> <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{roomName}</span></p>
          <p className="text-base"><strong>Seat Number:</strong> <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{seatNumber}</span></p>
        </div>
      </div>
    ))}
  </div>
);

export default SeatingPlanDisplay;
