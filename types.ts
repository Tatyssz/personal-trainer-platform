export enum MuscleGroup {
  Chest = "Peito",
  Back = "Costas",
  Legs = "Pernas",
  Shoulders = "Ombros",
  Arms = "Braços",
  Abs = "Abdômen",
  Cardio = "Cardio",
  FullBody = "Corpo Inteiro"
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: string;
  videoUrl?: string; // Placeholder for youtube/vimeo link
  notes?: string;
}

export interface WorkoutSession {
  dayOfWeek: string; // "Segunda", "Terça", etc.
  focus: string; // "Hipertrofia Peito", "Cardio", "Descanso"
  exercises: Exercise[];
}

export interface WorkoutTemplate {
  id: string;
  title: string;
  content: string; // Text based description
  tags: string[];
  createdAt: string;
}

export type Gender = 'masculino' | 'feminino' | 'outro' | 'nao_informar';
export type ExperienceLevel = 'iniciante' | 'intermediario' | 'avancado';
export type TrainingType = 'individual' | 'coletivo';

export interface Schedule {
  days: string[]; // ["Segunda", "Quarta", "Sexta"]
  time: string;   // "18:00"
}

export interface Student {
  // Identificação
  id: string;
  name: string; // full_name
  email: string;
  phone: string;
  avatarUrl: string;
  status: 'active' | 'inactive';
  createdAt: string;

  // Perfil Básico
  birthDate: string;
  age: number; // Derivado para facilidade de uso na IA
  gender: Gender;
  height: number; // cm
  weight: number; // kg

  // Objetivo e Treino
  goal: string; // Hipertrofia, Emagrecimento, etc.
  experienceLevel: ExperienceLevel;
  trainingType: TrainingType; 
  schedule: Schedule; // New detailed schedule field
  startDate: string;

  // Saúde (Opcionais)
  injuries?: string;
  medicalNotes?: string;
  
  // Dados do App
  weeklyPlan: WorkoutSession[];
}

export type ViewState = 'DASHBOARD' | 'STUDENTS' | 'STUDENT_DETAIL' | 'WORKOUTS';