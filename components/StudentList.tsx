import React, { useState } from 'react';
import { Student, Gender, ExperienceLevel, TrainingType } from '../types';
import { ChevronRight, UserPlus, X, Trash2, Calendar, Weight, Activity, FileText, Users } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onAddStudent: (studentData: Omit<Student, 'id' | 'weeklyPlan' | 'avatarUrl' | 'age' | 'status' | 'createdAt'>) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onSelectStudent, onAddStudent, onDeleteStudent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Initial Form State
  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'nao_informar' as Gender,
    height: '',
    weight: '',
    goal: '',
    experienceLevel: 'iniciante' as ExperienceLevel,
    trainingDays: 3,
    trainingType: 'individual' as TrainingType,
    startDate: new Date().toISOString().split('T')[0],
    injuries: '',
    medicalNotes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.email || !formData.birthDate || !formData.goal) return;

    onAddStudent({
      ...formData,
      height: Number(formData.height),
      weight: Number(formData.weight),
      trainingDays: Number(formData.trainingDays)
    });

    setFormData(initialFormState);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation(); 
    if (window.confirm(`Tem certeza que deseja remover o aluno ${name}?`)) {
      onDeleteStudent(id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-full p-6 relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Alunos</h1>
          <p className="text-gray-400">Gerencie o progresso e fichas dos seus alunos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-500 text-white p-3 rounded-full shadow-lg shadow-primary-900/20 transition-all transform hover:scale-105"
        >
          <UserPlus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div 
            key={student.id}
            onClick={() => onSelectStudent(student)}
            className="group relative bg-dark-800 border border-dark-700 hover:border-primary-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-xl hover:shadow-primary-900/10"
          >
            <button
              onClick={(e) => handleDeleteClick(e, student.id, student.name)}
              className="absolute top-4 right-4 p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors z-10"
              title="Remover aluno"
            >
              <Trash2 size={18} />
            </button>

            <div className="flex items-center gap-4 mb-4 pr-8">
              <img 
                src={student.avatarUrl} 
                alt={student.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-dark-600 group-hover:border-primary-500 transition-colors"
              />
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">{student.name}</h3>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-gray-500">{student.age} anos • {student.experienceLevel}</span>
                  {student.trainingType === 'coletivo' && (
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 w-fit">Treino Coletivo</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
               <div className="flex justify-between text-sm">
                 <span className="text-gray-500">Objetivo</span>
                 <span className="text-gray-300 font-medium text-right truncate max-w-[150px]">{student.goal}</span>
               </div>
               {student.injuries && (
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400 flex items-center gap-1"><Activity size={12}/> Atenção</span>
                    <span className="text-gray-400 text-xs truncate max-w-[150px]">{student.injuries}</span>
                  </div>
               )}
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

      {/* Improved Modal Add Student */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-dark-800 border border-dark-700 w-full max-w-2xl rounded-2xl shadow-2xl relative my-8 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-dark-700 flex justify-between items-center sticky top-0 bg-dark-800 z-10 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white">Novo Aluno</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              
              {/* Seção 1: Identificação */}
              <div>
                <h3 className="text-primary-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <UserPlus size={16} /> Identificação e Acesso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Nome Completo *</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none" placeholder="Ex: João da Silva" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Email *</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none" placeholder="email@exemplo.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Telefone/WhatsApp *</label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none" placeholder="(00) 00000-0000" />
                    </div>
                </div>
              </div>

              <hr className="border-dark-700" />

              {/* Seção 2: Perfil Físico */}
              <div>
                <h3 className="text-primary-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar size={16} /> Perfil Físico
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Data de Nascimento *</label>
                        <input type="date" name="birthDate" required value={formData.birthDate} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none" />
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Gênero</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none">
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                            <option value="outro">Outro</option>
                            <option value="nao_informar">Não informar</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Altura (cm)</label>
                            <input type="number" name="height" value={formData.height} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none" placeholder="175" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1">Peso (kg)</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none" placeholder="70" />
                        </div>
                    </div>
                </div>
              </div>

              <hr className="border-dark-700" />

              {/* Seção 3: Treino e Objetivo */}
              <div>
                <h3 className="text-primary-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Weight size={16} /> Treino e Objetivo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Objetivo Principal *</label>
                        <input type="text" name="goal" required value={formData.goal} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none" placeholder="Ex: Emagrecimento, Hipertrofia..." />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Nível de Experiência</label>
                        <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none">
                            <option value="iniciante">Iniciante</option>
                            <option value="intermediario">Intermediário</option>
                            <option value="avancado">Avançado</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Tipo de Acompanhamento</label>
                        <select name="trainingType" value={formData.trainingType} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none">
                            <option value="individual">Individual (Personal)</option>
                            <option value="coletivo">Coletivo (Aulas)</option>
                        </select>
                        <p className="text-[10px] text-gray-500 mt-1">Selecione "Coletivo" se o aluno for participar de turmas devido a restrições de horários ou recomendação médica de socialização.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Dias de Treino/Semana</label>
                        <input type="number" min="1" max="7" name="trainingDays" value={formData.trainingDays} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none" />
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Data de Início</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-primary-500 focus:outline-none" />
                    </div>
                </div>
              </div>

               {/* Seção 4: Saúde */}
              <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
                <h3 className="text-red-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity size={16} /> Saúde e Restrições
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Lesões ou Restrições (Opcional)</label>
                        <textarea name="injuries" value={formData.injuries} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none h-20 resize-none" placeholder="Ex: Dor no joelho direito, Hérnia de disco..." />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Observações Médicas (Opcional)</label>
                        <textarea name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} className="w-full bg-dark-900 border border-dark-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none h-20 resize-none" placeholder="Medicamentos, condições cardíacas, etc." />
                    </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-dark-800 pb-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-dark-600 text-gray-300 hover:bg-dark-700 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium shadow-lg shadow-primary-900/50 transition-colors"
                >
                  Salvar Aluno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};