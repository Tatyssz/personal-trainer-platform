import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Student, WorkoutSession, MuscleGroup } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  const scheduleDays = student.schedule?.days || [];
  const scheduleTime = student.schedule?.time || 'Horário não definido';

  const prompt = `
    Atue como um Personal Trainer de elite.
    Crie uma ficha de treino semanal (Segunda a Domingo) para o seguinte aluno:
    
    PERFIL DO ALUNO:
    Nome: ${student.name}
    Idade: ${student.age} anos
    Gênero: ${student.gender}
    Nível de Experiência: ${student.experienceLevel}
    
    AGENDA DE TREINO (MUITO IMPORTANTE):
    Dias de Treino Ativos: ${scheduleDays.join(', ')}
    Horário: ${scheduleTime}
    Modalidade: ${student.trainingType === 'individual' ? 'Personal (Individual - Foco em técnica e especificidade)' : 'Treino Coletivo (Adaptável para grupos)'}
    
    OBJETIVO:
    ${specificGoal || student.goal}
    
    RESTRIÇÕES E SAÚDE:
    Lesões/Restrições: ${student.injuries || "Nenhuma relatada"}
    Notas Médicas: ${student.medicalNotes || "Nenhuma"}
    
    Regras de Ouro:
    1. O treino deve ser SEGURO. Se houver lesões, evite exercícios que agravem a condição.
    2. Respeite o nível de experiência (Iniciante = menos volume, mais máquinas; Avançado = mais volume, pesos livres).
    3. GERE TREINOS (lista de exercícios) APENAS PARA OS DIAS LISTADOS EM "Dias de Treino Ativos".
    4. Para os dias que NÃO estão na lista de ativos, o array 'exercises' deve ser vazio e o foco deve ser "Descanso".
    5. Responda APENAS com o JSON seguindo o schema fornecido.
    6. Use nomes de exercícios comuns em academias no Brasil.
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

export const generateWorkoutText = async (topic: string): Promise<string> => {
  const prompt = `
    Atue como um Personal Trainer Expert.
    Escreva um guia de treino completo e detalhado (formato texto/artigo) sobre o seguinte tema: "${topic}".
    
    O texto deve incluir:
    - Aquecimento sugerido
    - Lista de Exercícios (Séries x Repetições)
    - Dicas de técnica
    - Intervalos de descanso
    
    Formate o texto de forma limpa e direta, usando markdown simples se necessário.
    Idioma: Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Não foi possível gerar o texto.";
  } catch (error) {
    console.error("Error generating text workout:", error);
    throw error;
  }
};