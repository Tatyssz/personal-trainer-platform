import React from 'react';
import { Exercise } from '../types';
import { Play, Info } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise }) => {
  return (
    <div className="flex bg-dark-800 rounded-lg p-3 mb-3 border border-dark-700 hover:border-primary-500 transition-colors group">
      {/* Video Thumbnail Placeholder */}
      <div className="relative w-24 h-24 flex-shrink-0 bg-dark-900 rounded-md overflow-hidden mr-4">
        <img 
          src={`https://picsum.photos/seed/${exercise.id}/200`} 
          alt={exercise.name}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-primary-500/80 rounded-full p-1.5 cursor-pointer hover:bg-primary-400 transition-colors">
            <Play size={16} className="text-white fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex justify-between items-start">
            <h4 className="font-semibold text-gray-100 text-base leading-tight">{exercise.name}</h4>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-dark-700 text-gray-400 border border-dark-600">
                {exercise.muscleGroup}
            </span>
        </div>
        
        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-300">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-bold">Séries</span>
            <span className="font-mono text-primary-400 font-bold">{exercise.sets}</span>
          </div>
          <div className="w-px h-6 bg-dark-700"></div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase font-bold">Reps</span>
            <span className="font-mono text-primary-400 font-bold">{exercise.reps}</span>
          </div>
        </div>
        
        {exercise.notes && (
          <div className="mt-2 flex items-start text-xs text-gray-500">
             <Info size={12} className="mr-1 mt-0.5 flex-shrink-0" />
             <p>{exercise.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};
