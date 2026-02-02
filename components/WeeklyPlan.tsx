import React, { useState } from 'react';
import { WorkoutSession, Student } from '../types';
import { ExerciseCard } from './ExerciseCard';
import { Calendar, RefreshCw, Dumbbell, CheckCircle2, XCircle } from 'lucide-react';
import { generateWorkoutPlan } from '../services/geminiService';
import { DAYS_OF_WEEK } from '../constants';

interface WeeklyPlanProps {
  student: Student;
  onUpdatePlan: (studentId: string, newPlan: WorkoutSession[]) => void;
}

export const WeeklyPlan: React.FC<WeeklyPlanProps> = ({ student, onUpdatePlan }) => {
  const [activeDay, setActiveDay] = useState<string>('Segunda');
  const [isGenerating, setIsGenerating] = useState(false);

  const currentSession = student.weeklyPlan.find(s => s.dayOfWeek === activeDay);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const newPlan = await generateWorkoutPlan(student);
      onUpdatePlan(student.id, newPlan);
      // Automatically select the first day with exercises
      const firstActiveDay = newPlan.find(d => d.exercises.length > 0)?.dayOfWeek || 'Segunda';
      setActiveDay(firstActiveDay);
    } catch (e) {
      alert("Falha ao gerar treino com IA. Verifique sua chave de API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const isDayScheduled = (day: string) => student.schedule?.days.includes(day);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-primary-500" />
            Ficha Semanal
           </h2>
           <p className="text-gray-400 text-sm mt-1">Gerencie a rotina de {student.name}</p>
        </div>
        <button 
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${isGenerating 
              ? 'bg-dark-700 text-gray-500 cursor-not-allowed' 
              : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/50'
            }
          `}
        >
          {isGenerating ? (
            <RefreshCw className="animate-spin" size={16} />
          ) : (
            <div className="flex items-center gap-2">
                <span className="text-lg">✨</span>
                <span>Gerar com IA</span>
            </div>
          )}
        </button>
      </div>

      {/* Days Navigation */}
      <div className="flex overflow-x-auto pb-4 gap-2 mb-2 scrollbar-thin">
        {DAYS_OF_WEEK.map((day) => {
          const session = student.weeklyPlan.find(s => s.dayOfWeek === day);
          const hasWorkout = session && session.exercises.length > 0;
          const isActive = activeDay === day;
          const isScheduled = isDayScheduled(day);

          let buttonStyle = "";
          
          if (isActive) {
             if (isScheduled) {
                // Active + Scheduled (Green)
                buttonStyle = "bg-primary-900/30 border-primary-500 text-primary-400";
             } else {
                // Active + Not Scheduled (Yellow Highlight)
                buttonStyle = "bg-yellow-900/20 border-yellow-500 text-yellow-400";
             }
          } else {
             if (isScheduled) {
                // Inactive + Scheduled (Greenish Gray)
                buttonStyle = "bg-dark-800 border-primary-900 text-primary-500/80 hover:border-primary-500/50";
             } else {
                // Inactive + Not Scheduled (Yellowish Gray)
                buttonStyle = "bg-yellow-900/5 border-yellow-900/30 text-yellow-700 hover:border-yellow-600/50 hover:text-yellow-600";
             }
          }

          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`
                flex flex-col items-center justify-center min-w-[80px] py-3 rounded-xl border-2 transition-all relative
                ${buttonStyle}
              `}
            >
              {isScheduled && (
                <div className="absolute top-1.5 right-1.5">
                   <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary-400' : 'bg-primary-600'}`}></div>
                </div>
              )}
              
              <span className="text-xs font-bold uppercase mb-1">{day.slice(0, 3)}</span>
              {!isScheduled ? (
                 <span className="text-[10px] opacity-80">Desc</span>
              ) : hasWorkout ? (
                <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-current' : 'bg-gray-500'}`} />
              ) : (
                 <span className="text-[10px] opacity-50">-</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Day Content */}
      <div className="flex-1 bg-dark-800/50 border border-dark-700 rounded-2xl p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {activeDay}
                {isDayScheduled(activeDay) ? (
                    <span className="text-xs font-normal text-primary-400 bg-primary-900/20 px-2 py-0.5 rounded border border-primary-900/50 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Dia de Treino
                    </span>
                ) : (
                    <span className="text-xs font-normal text-yellow-400 bg-yellow-900/20 px-2 py-0.5 rounded border border-yellow-700/50 flex items-center gap-1">
                        <XCircle size={12} /> Dia de Descanso
                    </span>
                )}
            </h3>
            {currentSession && (
                <span className="px-3 py-1 bg-dark-700 rounded-full text-xs text-primary-300 font-medium border border-primary-900/50">
                    Foco: {currentSession.focus}
                </span>
            )}
        </div>

        {!currentSession || currentSession.exercises.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-dark-700 rounded-xl bg-dark-800/20">
             <Dumbbell size={32} className="mb-3 opacity-50" />
             {isDayScheduled(activeDay) ? (
                 <div className="text-center">
                    <p className="text-gray-300 font-medium mb-1">Dia de treino sem exercícios.</p>
                    <p className="text-sm">Clique em "Gerar com IA" para criar o treino.</p>
                 </div>
             ) : (
                 <p className="text-yellow-600/80">Dia de descanso programado.</p>
             )}
          </div>
        ) : (
          <div className="space-y-1">
            {currentSession.exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};