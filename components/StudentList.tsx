import React from 'react';
import { Student } from '../types';
import { Users, ChevronRight, UserPlus } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent }) => {
  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Alunos</h1>
          <p className="text-gray-400">Gerencie o progresso e fichas dos seus alunos.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-500 text-white p-3 rounded-full shadow-lg shadow-primary-900/20 transition-all">
          <UserPlus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div 
            key={student.id}
            onClick={() => onSelectStudent(student)}
            className="group bg-dark-800 border border-dark-700 hover:border-primary-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-xl hover:shadow-primary-900/10"
          >
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={student.avatarUrl} 
                alt={student.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-dark-600 group-hover:border-primary-500 transition-colors"
              />
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">{student.name}</h3>
                <span className="text-sm text-gray-500">{student.age} anos</span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Objetivo</span>
                 <span className="text-gray-300 font-medium text-right truncate max-w-[150px]">{student.goal}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Treinos na semana</span>
                 <span className="text-primary-400 font-mono font-bold">
                    {student.weeklyPlan.filter(d => d.exercises.length > 0).length} / 7
                 </span>
               </div>
            </div>

            <div className="pt-4 border-t border-dark-700 flex justify-end">
               <span className="text-xs font-bold text-primary-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                 VER FICHA <ChevronRight size={14} />
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
