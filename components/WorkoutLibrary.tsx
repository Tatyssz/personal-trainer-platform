import React, { useState } from 'react';
import { WorkoutTemplate } from '../types';
import { Plus, Trash2, Search, FileText, Sparkles, X, Save, Calendar, Tag } from 'lucide-react';
import { generateWorkoutText } from '../services/geminiService';

interface WorkoutLibraryProps {
  templates: WorkoutTemplate[];
  onAddTemplate: (template: WorkoutTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export const WorkoutLibrary: React.FC<WorkoutLibraryProps> = ({ templates, onAddTemplate, onDeleteTemplate }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null); // For viewing
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const filteredTemplates = templates.filter(t => {
    const term = searchTerm.toLowerCase();
    // Allow searching for "#legs" to find "legs" tag, or just "legs"
    const tagSearchTerm = term.startsWith('#') ? term.slice(1) : term;
    
    return (
      t.title.toLowerCase().includes(term) || 
      t.content.toLowerCase().includes(term) ||
      t.tags.some(tag => tag.toLowerCase().includes(tagSearchTerm))
    );
  });

  const handleOpenCreateModal = () => {
    setFormData({ title: '', content: '', tags: '' });
    setIsCreateModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
        alert("Por favor, preencha o título e o conteúdo do treino.");
        return;
    }

    const newTemplate: WorkoutTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      content: formData.content,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: new Date().toISOString()
    };

    onAddTemplate(newTemplate);
    setIsCreateModalOpen(false);
    setShowAiInput(false);
  };

  const handleDelete = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    // Critical: stop propagation completely
    e.preventDefault();
    e.stopPropagation();
    
    // Move confirmation here to ensure event handling is clean
    if (window.confirm('Tem certeza que deseja excluir este modelo de treino?')) {
        onDeleteTemplate(id);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const text = await generateWorkoutText(aiPrompt);
      setFormData(prev => ({ ...prev, content: text }));
      setShowAiInput(false);
    } catch (error) {
      alert('Erro ao gerar texto com IA. Verifique sua conexão ou chave de API.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full p-4 md:p-8 flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Biblioteca de Treinos</h1>
          <p className="text-gray-400">Gerencie modelos e guias de treino escritos.</p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-3 rounded-xl shadow-lg shadow-primary-900/20 flex items-center gap-2 transition-all hover:translate-y-[-2px]"
        >
          <Plus size={20} /> Novo Modelo
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-gray-500" size={20} />
        <input 
          type="text" 
          placeholder="Buscar (#perna, título, conteúdo)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pb-20 pr-2">
        {filteredTemplates.length === 0 ? (
           <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-500 border-2 border-dashed border-dark-700 rounded-xl bg-dark-800/30">
              <FileText size={48} className="mb-4 opacity-30" />
              <p>Nenhum treino encontrado.</p>
           </div>
        ) : (
           filteredTemplates.map(template => (
             <div 
               key={template.id} 
               className="bg-dark-800 border border-dark-700 rounded-xl hover:border-dark-500 transition-all flex flex-col h-72 group relative shadow-lg shadow-black/20 isolate"
             >
                {/* 
                   ISOLATED DELETE ACTION 
                   Using onMouseDown to catch interaction early and stop propagation.
                   High Z-index to ensure it sits above content.
                */}
                <div className="absolute top-4 right-4 z-[100]">
                  <button 
                     type="button"
                     onClick={(e) => handleDelete(e, template.id)}
                     onMouseDown={(e) => e.stopPropagation()} // Critical for preventing drag/click conflation
                     onTouchStart={(e) => e.stopPropagation()}
                     className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors bg-dark-800/90 backdrop-blur-sm border border-dark-700/50 shadow-sm cursor-pointer"
                     title="Excluir modelo"
                  >
                     <Trash2 size={18} />
                  </button>
                </div>
                
                {/* CLICKABLE CONTENT AREA */}
                <div 
                  onClick={() => setSelectedTemplate(template)}
                  className="p-5 h-full w-full flex flex-col cursor-pointer hover:bg-dark-700/30 rounded-xl transition-colors relative z-0"
                >
                    <h3 className="text-xl font-bold text-white mb-2 pr-12 truncate">{template.title}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                       {template.tags.slice(0, 3).map(tag => (
                         <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-dark-900 text-primary-300 border border-dark-600">
                            #{tag}
                         </span>
                       ))}
                       {template.tags.length > 3 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-900 text-gray-500 border border-dark-600">
                            +{template.tags.length - 3}
                          </span>
                       )}
                    </div>

                    <div className="flex-1 overflow-hidden relative mb-3 bg-dark-900/50 p-3 rounded-lg border border-dark-800/50">
                       <p className="text-gray-400 text-sm whitespace-pre-wrap font-mono leading-relaxed opacity-80">
                            {template.content}
                       </p>
                       {/* Gradient fade */}
                       <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-dark-900/50 via-dark-900/20 to-transparent"></div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-3 border-t border-dark-700">
                       <span className="flex items-center gap-1">
                         <Calendar size={12} />
                         {new Date(template.createdAt).toLocaleDateString()}
                       </span>
                       <span className="text-primary-500 font-semibold group-hover:underline">
                        Ver Completo
                       </span>
                    </div>
                </div>
             </div>
           ))
        )}
      </div>

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-dark-800 border border-dark-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-dark-700 flex justify-between items-center bg-dark-900/50 rounded-t-2xl">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                   <FileText className="text-primary-500" />
                   Criar Novo Modelo
                </h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                   <X size={24} />
                </button>
            </div>

            <form className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">Título do Treino *</label>
                   <input 
                     type="text" 
                     value={formData.title}
                     onChange={e => setFormData({...formData, title: e.target.value})}
                     placeholder="Ex: Treino de Peito Avançado"
                     className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:border-primary-500 focus:outline-none transition-all placeholder-gray-600"
                   />
                </div>
                
                <div className="relative">
                   <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-400">Conteúdo do Treino *</label>
                      <button 
                        type="button"
                        onClick={() => setShowAiInput(!showAiInput)}
                        className={`text-xs flex items-center gap-1 px-3 py-1 rounded-full border transition-all ${showAiInput ? 'bg-purple-900/30 text-purple-300 border-purple-500/50' : 'text-purple-400 border-transparent hover:bg-purple-900/20'}`}
                      >
                         <Sparkles size={14} /> 
                         {showAiInput ? 'Fechar IA' : 'Auxiliar com IA'}
                      </button>
                   </div>
                   
                   {showAiInput && (
                     <div className="mb-4 p-4 bg-gradient-to-r from-purple-900/20 to-dark-800 border border-purple-500/30 rounded-xl animate-fadeIn">
                        <label className="block text-xs font-bold text-purple-300 mb-2 uppercase tracking-wide">Descreva o treino para a IA:</label>
                        <div className="flex gap-2">
                           <input 
                              type="text" 
                              value={aiPrompt}
                              onChange={e => setAiPrompt(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAiGenerate())}
                              placeholder="Ex: Treino HIIT de 20 minutos focado em queima de gordura..."
                              className="flex-1 bg-dark-900 border border-purple-500/30 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-400 placeholder-purple-500/30"
                           />
                           <button 
                             type="button"
                             onClick={handleAiGenerate}
                             disabled={isGenerating}
                             className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20 transition-all"
                           >
                              {isGenerating ? 'Criando...' : 'Gerar Texto'}
                           </button>
                        </div>
                     </div>
                   )}

                   <textarea 
                     value={formData.content}
                     onChange={e => setFormData({...formData, content: e.target.value})}
                     className="w-full h-80 bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-gray-200 focus:border-primary-500 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                     placeholder="Digite o treino aqui ou use a IA para gerar um rascunho..."
                   />
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-400 mb-1">Tags</label>
                   <div className="flex items-center gap-2 bg-dark-900 border border-dark-600 rounded-lg px-3 py-1">
                     <Tag size={16} className="text-gray-500" />
                     <input 
                       type="text" 
                       value={formData.tags}
                       onChange={e => setFormData({...formData, tags: e.target.value})}
                       placeholder="hipertrofia, pernas, avançado (separados por vírgula)"
                       className="w-full bg-transparent border-none py-2 text-white focus:outline-none text-sm"
                     />
                   </div>
                </div>
            </form>

            <div className="p-5 border-t border-dark-700 flex justify-end gap-3 bg-dark-900/30 rounded-b-2xl">
               <button 
                 type="button" 
                 onClick={() => setIsCreateModalOpen(false)}
                 className="px-5 py-2.5 rounded-lg border border-dark-600 text-gray-300 hover:bg-dark-700 transition-colors font-medium text-sm"
               >
                 Cancelar
               </button>
               <button 
                 onClick={handleSubmit}
                 className="px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium shadow-lg shadow-primary-900/50 flex items-center gap-2 transition-transform active:scale-95 text-sm"
               >
                 <Save size={18} /> Salvar Modelo
               </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-dark-800 border border-dark-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-dark-700 flex justify-between items-start bg-dark-900/50 rounded-t-2xl">
                    <div className="pr-8">
                        <h2 className="text-2xl font-bold text-white mb-2">{selectedTemplate.title}</h2>
                        <div className="flex flex-wrap gap-2">
                            {selectedTemplate.tags.map(tag => (
                                <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full bg-primary-900/30 text-primary-300 border border-primary-500/30">
                                    #{tag}
                                </span>
                            ))}
                            <span className="text-xs text-gray-500 flex items-center gap-1 ml-2 border-l border-dark-600 pl-3">
                                <Calendar size={12} /> Criado em {new Date(selectedTemplate.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setSelectedTemplate(null)} 
                        className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-dark-900/30">
                    <div className="prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-gray-200 text-base leading-relaxed">
                            {selectedTemplate.content}
                        </pre>
                    </div>
                </div>

                <div className="p-4 border-t border-dark-700 bg-dark-800 rounded-b-2xl flex justify-end">
                    <button 
                        onClick={() => setSelectedTemplate(null)}
                        className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors font-medium"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
