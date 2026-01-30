import { Student, MuscleGroup } from './types';

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Ana Clara',
    age: 28,
    goal: 'Hipertrofia e Definição',
    avatarUrl: 'https://picsum.photos/seed/ana/200/200',
    weeklyPlan: [
      {
        dayOfWeek: 'Segunda',
        focus: 'Pernas (Inferior Completo)',
        exercises: [
          { id: 'e1', name: 'Agachamento Livre', muscleGroup: MuscleGroup.Legs, sets: 4, reps: '8-10', videoUrl: '#' },
          { id: 'e2', name: 'Leg Press 45', muscleGroup: MuscleGroup.Legs, sets: 3, reps: '12-15', videoUrl: '#' },
          { id: 'e3', name: 'Cadeira Extensora', muscleGroup: MuscleGroup.Legs, sets: 3, reps: '15', videoUrl: '#' },
        ]
      },
      {
        dayOfWeek: 'Terça',
        focus: 'Superiores (Empurrar)',
        exercises: [
          { id: 'e4', name: 'Supino Reto', muscleGroup: MuscleGroup.Chest, sets: 4, reps: '8-10', videoUrl: '#' },
          { id: 'e5', name: 'Desenvolvimento com Halteres', muscleGroup: MuscleGroup.Shoulders, sets: 3, reps: '10-12', videoUrl: '#' },
        ]
      },
      {
        dayOfWeek: 'Quarta',
        focus: 'Descanso Ativo',
        exercises: []
      }
    ]
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    age: 35,
    goal: 'Perda de Peso',
    avatarUrl: 'https://picsum.photos/seed/carlos/200/200',
    weeklyPlan: []
  }
];

export const DAYS_OF_WEEK = [
  'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
];
