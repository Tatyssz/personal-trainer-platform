import { Student, MuscleGroup } from './types';

export const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Ana Clara',
    email: 'ana.clara@email.com',
    phone: '11999999999',
    status: 'active',
    createdAt: '2023-01-15',
    birthDate: '1995-05-20',
    age: 28,
    gender: 'feminino',
    height: 165,
    weight: 62,
    goal: 'Hipertrofia e Definição',
    experienceLevel: 'intermediario',
    trainingDays: 5,
    trainingType: 'individual',
    startDate: '2023-01-20',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=60',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=60',
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
    email: 'carlos.m@email.com',
    phone: '11988888888',
    status: 'active',
    createdAt: '2023-02-10',
    birthDate: '1988-11-10',
    age: 35,
    gender: 'masculino',
    height: 180,
    weight: 95,
    goal: 'Perda de Peso',
    experienceLevel: 'iniciante',
    trainingDays: 3,
    trainingType: 'coletivo',
    startDate: '2023-02-12',
    injuries: 'Condromalácia patelar leve no joelho direito',
    avatarUrl: 'https://picsum.photos/seed/carlos/200/200',
    weeklyPlan: []
  }
];

export const DAYS_OF_WEEK = [
  'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
];