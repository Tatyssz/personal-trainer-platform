import React, { useState } from 'react';
import { MOCK_STUDENTS } from './constants';
import { Student, ViewState, WorkoutSession } from './types';
import { StudentList } from './components/StudentList';
import { WeeklyPlan } from './components/WeeklyPlan';
import { LayoutDashboard, Users, Settings, LogOut, ArrowLeft, Dumbbell, LucideIcon } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewState>('DASHBOARD');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleUpdatePlan = (studentId: string, newPlan: WorkoutSession[]) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, weeklyPlan: newPlan };
      }
      return s;
    }));
  };

  const handleAddStudent = (data: Omit<Student, 'id' | 'weeklyPlan' | 'avatarUrl' | 'age' | 'status' | 'createdAt'>) => {
    // Calculate Age
    const birth = new Date(data.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    const newStudent: Student = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      age: age,
      status: 'active',
      createdAt: new Date().toISOString(),
      // Generates a deterministic-looking avatar based on name length for visual consistency
      avatarUrl: `https://picsum.photos/seed/${data.name.replace(/\s/g, '')}/200`,
      weeklyPlan: []
    };
    setStudents([...students, newStudent]);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    if (selectedStudentId === id) {
      setSelectedStudentId(null);
      setView('STUDENTS');
    }
  };

  interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    active: boolean;
    onClick: () => void;
  }

  const SidebarItem = ({ icon: Icon, label, active, onClick }: SidebarItemProps) => (
    <button 
      onClick={onClick}
      title={label}
      className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all mb-2 ${
        active 
        ? 'bg-primary-900/30 text-primary-400 font-semibold' 
        : 'text-gray-400 hover:bg-dark-800 hover:text-gray-200'
      }`}
    >
      <Icon size={20} className="flex-shrink-0" />
      <span className="hidden lg:block whitespace-nowrap">{label}</span>
    </button>
  );

  const renderContent = () => {
    if (view === 'STUDENT_DETAIL' && selectedStudent) {
      return (
        <div className="h-full flex flex-col p-6 animate-fadeIn">
            <button 
                onClick={() => setView('STUDENTS')}
                className="self-start flex items-center text-gray-500 hover:text-white mb-4 transition-colors text-sm font-medium"
            >
                <ArrowLeft size={16} className="mr-1" /> Voltar para Alunos
            </button>
            
            <div className="flex items-center gap-4 mb-8">
                <img src={selectedStudent.avatarUrl} className="w-16 h-16 rounded-full border-2 border-primary-500" />
                <div>
                    <h1 className="text-3xl font-bold text-white">{selectedStudent.name}</h1>
                    <div className="flex gap-2 mt-1 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-dark-700 text-xs text-gray-300 border border-dark-600">
                            {selectedStudent.goal}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-dark-700 text-xs text-gray-300 border border-dark-600">
                            {selectedStudent.age} Anos
                        </span>
                         <span className="px-2 py-0.5 rounded bg-dark-700 text-xs text-gray-300 border border-dark-600 capitalize">
                            {selectedStudent.experienceLevel}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs border capitalize ${
                            selectedStudent.trainingType === 'individual' 
                            ? 'bg-primary-900/30 text-primary-300 border-primary-800' 
                            : 'bg-blue-900/30 text-blue-300 border-blue-800'
                        }`}>
                            Treino {selectedStudent.trainingType}
                        </span>
                    </div>
                    {selectedStudent.injuries && (
                         <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            Restrição: {selectedStudent.injuries}
                         </p>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <WeeklyPlan 
                    student={selectedStudent} 
                    onUpdatePlan={handleUpdatePlan}
                />
            </div>
        </div>
      );
    }

    if (view === 'STUDENTS') {
      return (
        <StudentList 
          students={students} 
          onSelectStudent={(s) => {
            setSelectedStudentId(s.id);
            setView('STUDENT_DETAIL');
          }} 
          onAddStudent={handleAddStudent}
          onDeleteStudent={handleDeleteStudent}
        />
      );
    }

    // Dashboard View
    return (
      <div className="p-8 h-full overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Olá, Treinador</h1>
          <p className="text-gray-400">Aqui está o resumo das suas atividades hoje.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           <div className="bg-gradient-to-br from-primary-900/50 to-dark-800 p-6 rounded-2xl border border-primary-900/50 relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-primary-300 font-medium text-sm">Alunos Ativos</span>
                <div className="text-4xl font-bold text-white mt-2">{students.length}</div>
              </div>
              <Users className="absolute right-4 bottom-4 text-primary-500/20" size={64} />
           </div>
           
           <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-gray-400 font-medium text-sm">Treinos Gerados (IA)</span>
                <div className="text-4xl font-bold text-white mt-2">12</div>
              </div>
              <div className="absolute right-4 bottom-4 text-yellow-500/20 text-4xl">✨</div>
           </div>

           <div className="bg-dark-800 p-6 rounded-2xl border border-dark-700 relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-gray-400 font-medium text-sm">Sessões Hoje</span>
                <div className="text-4xl font-bold text-white mt-2">4</div>
              </div>
              <Dumbbell className="absolute right-4 bottom-4 text-purple-500/20" size={64} />
           </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <button 
                onClick={() => setView('STUDENTS')}
                className="p-4 bg-dark-800 hover:bg-dark-700 rounded-xl border border-dark-700 flex items-center gap-4 transition-colors text-left"
             >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Users size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-white">Gerenciar Alunos</h3>
                    <p className="text-xs text-gray-500">Ver e editar fichas</p>
                </div>
             </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-dark-900 text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-dark-900 border-r border-dark-800 flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-dark-800">
           <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-900/50 flex-shrink-0">
             <Dumbbell className="text-white" size={24} />
           </div>
           <span className="ml-3 font-bold text-xl hidden lg:block tracking-tight text-white whitespace-nowrap">TrainerPro</span>
        </div>

        <nav className="flex-1 p-4">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={view === 'DASHBOARD'} 
            onClick={() => setView('DASHBOARD')} 
          />
          <SidebarItem 
            icon={Users} 
            label="Alunos" 
            active={view === 'STUDENTS' || view === 'STUDENT_DETAIL'} 
            onClick={() => setView('STUDENTS')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Configurações" 
            active={false} 
            onClick={() => {}} 
          />
        </nav>

        <div className="p-4 border-t border-dark-800">
            <SidebarItem icon={LogOut} label="Sair" active={false} onClick={() => {}} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-dark-900">
        {renderContent()}
      </main>
    </div>
  );
}