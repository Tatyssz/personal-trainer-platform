import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Student, WorkoutSession, MuscleGroup } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema definitions for strict JSON output
const exerciseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Nome do exercício em Português" },
    muscleGroup: { 
      type: Type.STRING, 
      enum: Object.values(MuscleGroup),
      description: "Grupo muscular principal" 
    },
    sets: { type: Type.INTEGER, description: "Número de séries" },
    reps: { type: Type.STRING, description: "Intervalo de repetições (ex: '8-12')" },
    notes: { type: Type.STRING, description: "Dicas de execução breves" }
  },
  required: ["name", "muscleGroup", "sets", "reps"]
};

const sessionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    dayOfWeek: { type: Type.STRING, description: "Dia da semana (Segunda, Terça...)" },
    focus: { type: Type.STRING, description: "Foco do treino (ex: Peito e Tríceps, Descanso)" },
    exercises: { 
      type: Type.ARRAY, 
      items: exerciseSchema,
      description: "Lista de exercícios para o dia. Vazio se for descanso."
    }
  },
  required: ["dayOfWeek", "focus", "exercises"]
};

const weekPlanSchema: Schema = {
  type: Type.ARRAY,
  items: sessionSchema,
  description: "Plano semanal completo de Segunda a Domingo"
};

export const generateWorkoutPlan = async (student: Student, specificGoal?: string): Promise<WorkoutSession[]> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning empty plan.");
    return [];
  }

  const prompt = `
    Atue como um Personal Trainer de elite.
    Crie uma ficha de treino semanal (Segunda a Domingo) para o seguinte aluno:
    Nome: ${student.name}
    Idade: ${student.age}
    Objetivo Principal: ${specificGoal || student.goal}
    
    Regras:
    1. O treino deve ser equilibrado e seguro.
    2. Responda APENAS com o JSON seguindo o schema.
    3. Use nomes de exercícios comuns em academias no Brasil.
    4. Se for dia de descanso, o array de exercises deve ser vazio.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: weekPlanSchema,
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for speed on simple tasks
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const plan = JSON.parse(jsonText) as WorkoutSession[];
    
    // Post-process to ensure IDs exist (Gemini won't generate UUIDs reliably)
    const processedPlan = plan.map((session) => ({
      ...session,
      exercises: session.exercises.map((ex) => ({
        ...ex,
        id: Math.random().toString(36).substr(2, 9),
        videoUrl: '#' // Default placeholder
      }))
    }));

    return processedPlan;

  } catch (error) {
    console.error("Error generating workout:", error);
    throw error;
  }
};
