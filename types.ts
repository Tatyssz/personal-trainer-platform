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

export interface Student {
  id: string;
  name: string;
  age: number;
  goal: string; // "Perda de peso", "Hipertrofia", "Resistência"
  weeklyPlan: WorkoutSession[];
  avatarUrl: string;
}

export type ViewState = 'DASHBOARD' | 'STUDENTS' | 'STUDENT_DETAIL';
