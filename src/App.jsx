import React, { useState, useEffect } from 'react';
import { Trophy, AlertCircle, CheckCircle, Flame, BarChart3, Wallet, Calendar, Save, RefreshCw } from 'lucide-react';
import { supabase } from './supabaseClient';

const App = () => {
  // Configuración inicial de las metas según el prompt
  const initialData = [
    {
      id: 1,
      name: 'Sheila',
      avatar: '👩🏻‍💻',
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      barColor: 'bg-pink-500',
      goals: [
        { id: 's1', text: 'Leer 10 págs Data Engineering (6:30 am)', total: 7, current: 0, type: 'daily' },
        { id: 's2', text: 'Speaking/Listening Inglés (Wiser 30min)', total: 7, current: 0, type: 'daily' },
        { id: 's3', text: 'Leetcode (1 al día: 5 easy, 2 medium)', total: 7, current: 0, type: 'daily' },
        { id: 's4', text: 'Correr (20 min: Lun, Mié, Vie, Sáb)', total: 4, current: 0, type: 'weekly' },
        { id: 's5', text: 'Dormir máx 12 am (Lun-Vie)', total: 5, current: 0, type: 'daily' }
      ]
    },
    {
      id: 2,
      name: 'Ale',
      avatar: '👨🏻‍🚀',
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      barColor: 'bg-blue-500',
      goals: [
        { id: 'a1', text: 'Files Gestor (Organizar archivos 30min/día)', total: 7, current: 0, type: 'daily' },
        { id: 'a2', text: 'Robot Rocketbot (8 horas fin de semana)', total: 2, current: 0, type: 'weekly', note: 'Dividido en 2 bloques de 4h' },
        { id: 'a3', text: 'Estudio consistente (60 min al día)', total: 7, current: 0, type: 'daily' },
        { id: 'a4', text: 'Eliminar tareas Notion (Bajo/Medio)', total: 4, current: 0, type: 'task' }
      ]
    },
    {
      id: 3,
      name: 'Agustín',
      avatar: '🧑🏻‍💻',
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      barColor: 'bg-emerald-500',
      goals: [
        { id: 'g1', text: 'Reto 5 programa STHEPS', total: 1, current: 0, type: 'task' },
        { id: 'g2', text: 'Wasi Space (Front & Backend)', total: 1, current: 0, type: 'task', note: 'Inspiración learn.deeplearning.ai' },
        { id: 'g3', text: '20 flexiones y 20 sentadillas diarias', total: 7, current: 0, type: 'daily' },
        { id: 'g4', text: '3 insignias Google Skills (Mar, Vie, Dom)', total: 3, current: 0, type: 'weekly' },
        { id: 'g5', text: '2 Pomodoros enfocados (50min) diarios', total: 7, current: 0, type: 'daily' },
        { id: 'g6', text: 'Crear agente correos/calendario', total: 1, current: 0, type: 'task', note: 'Notificaciones: 8am, 12pm, 3pm, 8pm' }
      ]
    },
    {
      id: 4,
      name: 'Danner',
      avatar: '🧑‍💻',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      barColor: 'bg-orange-500',
      goals: [
        { id: 'd1', text: 'Leer Documentación entrada Next.js', total: 1, current: 0, type: 'task' },
        { id: 'd2', text: 'Culminar branding de marca personal', total: 1, current: 0, type: 'task' },
        { id: 'd3', text: 'Hacer ejercicio (Todos los días)', total: 7, current: 0, type: 'daily' },
        { id: 'd4', text: 'Leer 5 páginas al día', total: 7, current: 0, type: 'daily' }
      ]
    }
  ];

  const [participants, setParticipants] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Cargar datos desde Supabase SOLO al iniciar (una vez)
  useEffect(() => {
    loadData();
  }, []);

  // Función para cargar datos desde Supabase
  const loadData = async () => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setParticipants(data);
      } else {
        // Si no hay datos, insertar los datos iniciales
        await initializeData();
      }
    } catch (error) {
      console.error('Error cargando datos:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función MANUAL para guardar datos en Supabase (se llama con botón)
  const saveData = async () => {
    setSaving(true);
    try {
      console.log('💾 Guardando cambios en Supabase...');
      
      // Hacer un UPSERT para cada participante
      // UPSERT = INSERT si no existe, UPDATE si ya existe (como SQL MERGE)
      for (const participant of participants) {
        const { error } = await supabase
          .from('goals')
          .upsert(participant, { onConflict: 'id' });

        if (error) throw error;
      }
      
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      console.log('✅ Cambios guardados exitosamente');
      alert('✅ ¡Cambios guardados correctamente!');
    } catch (error) {
      console.error('❌ Error guardando datos:', error.message);
      alert('❌ Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Función MANUAL para recargar datos desde Supabase
  const reloadData = async () => {
    if (hasUnsavedChanges) {
      const confirmReload = window.confirm(
        '⚠️ Tienes cambios sin guardar. ¿Estás seguro de recargar? Se perderán los cambios.'
      );
      if (!confirmReload) return;
    }
    
    setLoading(true);
    await loadData();
    setHasUnsavedChanges(false);
    console.log('🔄 Datos recargados desde Supabase');
  };

  // Función para inicializar datos por primera vez
  const initializeData = async () => {
    try {
      const { error } = await supabase
        .from('goals')
        .insert(initialData);

      if (error) throw error;
      setParticipants(initialData);
    } catch (error) {
      console.error('Error inicializando datos:', error.message);
    }
  };

  // Función para calcular la multa basada en la tabla proporcionada
  const calculateFine = (percentage) => {
    // Tabla estricta
    if (percentage === 100) return 0;
    if (percentage >= 90) return 10;
    if (percentage >= 80) return 20;
    if (percentage >= 70) return 30;
    if (percentage >= 60) return 40;
    if (percentage >= 50) return 50;
    if (percentage >= 40) return 60;
    if (percentage >= 30) return 70;
    if (percentage >= 20) return 80;
    if (percentage >= 10) return 90;
    return 100;
  };

  const getPercentage = (user) => {
    const totalPoints = user.goals.reduce((acc, goal) => acc + goal.total, 0);
    const earnedPoints = user.goals.reduce((acc, goal) => acc + goal.current, 0);
    return totalPoints === 0 ? 0 : Math.round((earnedPoints / totalPoints) * 100);
  };

  const handleProgress = (userId, goalId, increment) => {
    setParticipants(prev => prev.map(user => {
      if (user.id !== userId) return user;
      
      const updatedGoals = user.goals.map(goal => {
        if (goal.id !== goalId) return goal;
        
        let newCurrent = goal.current + increment;
        // Limites
        if (newCurrent < 0) newCurrent = 0;
        if (newCurrent > goal.total) newCurrent = goal.total;
        
        return { ...goal, current: newCurrent };
      });
      
      return { ...user, goals: updatedGoals };
    }));
    
    // Marcar que hay cambios sin guardar
    setHasUnsavedChanges(true);
  };



  // Renderizar la barra de progreso individual por meta
  const RenderGoalTracker = ({ user, goal }) => {
    const isComplete = goal.current === goal.total;
    
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between items-start mb-1">
          <span className={`text-sm font-medium ${isComplete ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
            {goal.text}
          </span>
          <span className="text-xs font-bold text-gray-500 ml-2 whitespace-nowrap">
            {goal.current}/{goal.total}
          </span>
        </div>
        {goal.note && <p className="text-xs text-gray-400 mb-2 italic">{goal.note}</p>}
        
        <div className="flex items-center gap-2">
           {/* Visualización de progreso tipo "píldoras" para días/repeticiones */}
           <div className="flex flex-wrap gap-1 flex-1">
              {[...Array(goal.total)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // Lógica inteligente: Si tocas una píldora inactiva, incrementa hasta ahí. 
                    // Si tocas la última activa, decrementa.
                    // Para simplificar: Botones +/- controlan el estado, esto es solo visualización en esta versión,
                    // PERO vamos a hacer que los clicks funcionen como toggles simples de izquierda a derecha.
                    if (index < goal.current) {
                        // Si clickeo en uno ya hecho, reduzco el count
                        handleProgress(user.id, goal.id, -1);
                    } else {
                        // Si clickeo en uno vacio, aumento
                        handleProgress(user.id, goal.id, 1);
                    }
                  }}
                  className={`h-6 w-6 rounded-md flex items-center justify-center transition-all duration-200 border ${
                    index < goal.current 
                      ? `${user.barColor} text-white border-transparent shadow-sm` 
                      : 'bg-gray-50 text-gray-300 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {index < goal.current && <CheckCircle size={14} />}
                </button>
              ))}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Prime Season</h1>
              <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
                Semana 6 • Guarda tus cambios manualmente
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Indicador de cambios sin guardar */}
            {hasUnsavedChanges && (
              <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-amber-700 font-medium">Cambios sin guardar</span>
              </div>
            )}
            
            {/* Última vez guardado */}
            {lastSaved && !hasUnsavedChanges && (
              <span className="text-xs text-slate-400">
                Guardado: {lastSaved.toLocaleTimeString('es-ES')}
              </span>
            )}
            
            {/* Botón de recargar */}
            <button
              onClick={reloadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Recargar datos desde Supabase"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span className="text-sm font-medium">Recargar</span>
            </button>
            
            {/* Botón de guardar */}
            <button
              onClick={saveData}
              disabled={saving || !hasUnsavedChanges}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
                hasUnsavedChanges
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              } disabled:opacity-50`}
              title={hasUnsavedChanges ? 'Guardar cambios en Supabase' : 'No hay cambios para guardar'}
            >
              <Save size={16} />
              <span>{saving ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Resumen General (Benchmark Dashboard) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {participants.map(user => {
            const pct = getPercentage(user);
            const fine = calculateFine(pct);
            const isSafe = fine === 0;
            const isDanger = fine >= 50;

            return (
              <div key={user.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                {/* Background Decoration */}
                <div className={`absolute top-0 left-0 w-full h-1 ${user.barColor}`}></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl filter drop-shadow-sm">{user.avatar}</span>
                    <div>
                      <h2 className="font-bold text-lg">{user.name}</h2>
                      <span className="text-xs text-slate-400 font-medium">Nivel Productividad</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    isSafe ? 'bg-green-100 text-green-700' : 
                    isDanger ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {pct}%
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-500">Progreso</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${user.barColor} transition-all duration-500 ease-out`} 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 flex items-center justify-between border-2 ${
                    fine === 0 ? 'bg-slate-50 border-slate-100' : 'bg-red-50 border-red-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Wallet size={18} className={fine > 0 ? "text-red-500" : "text-slate-400"} />
                      <span className="text-sm font-medium text-slate-600">Multa actual</span>
                    </div>
                    <span className={`text-xl font-black ${fine > 0 ? "text-red-600" : "text-slate-300"}`}>
                      {fine} Bs
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detalle de Metas */}
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Calendar size={20} className="text-indigo-500"/>
          Seguimiento de Metas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {participants.map(user => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
              <div className={`p-4 border-b border-slate-100 rounded-t-xl ${user.color} bg-opacity-20 flex items-center justify-between`}>
                 <h4 className="font-bold">{user.name}'s Goals</h4>
                 <BarChart3 size={16} className="opacity-50"/>
              </div>
              
              <div className="p-5 flex-1">
                {user.goals.map(goal => (
                  <RenderGoalTracker key={goal.id} user={user} goal={goal} />
                ))}
              </div>
              
              <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                  {user.goals.filter(g => g.current === g.total).length} de {user.goals.length} metas completadas
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabla de Consecuencias (Referencia) */}
        <div className="mt-12 bg-slate-800 rounded-2xl p-8 text-slate-300 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6 text-white">
            <AlertCircle size={24} />
            <h3 className="text-lg font-bold">Tabla de Penalizaciones</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-700 pb-2 mb-2 font-bold text-slate-400">
              <span>Porcentaje</span>
              <span>Multa (Bs)</span>
            </div>
            <div className="flex justify-between border-b border-slate-700 pb-2 mb-2 font-bold text-slate-400">
              <span>Porcentaje</span>
              <span>Multa (Bs)</span>
            </div>

            {/* Columna Izq */}
            <div className="contents">
                <div className="flex justify-between py-1 px-2 rounded hover:bg-slate-700">
                  <span className="text-green-400 font-bold">100%</span>
                  <span>0 Bs</span>
                </div>
                <div className="flex justify-between py-1 px-2 rounded hover:bg-slate-700">
                    <span className="text-amber-400">50%</span>
                    <span>50 Bs</span>
                </div>
                
                <div className="flex justify-between py-1 px-2 rounded hover:bg-slate-700">
                  <span>90%</span>
                  <span>10 Bs</span>
                </div>
                <div className="flex justify-between py-1 px-2 rounded hover:bg-slate-700">
                    <span className="text-orange-400">40%</span>
                    <span>60 Bs</span>
                </div>

                <div className="flex justify-between py-1 px-2 rounded hover:bg-slate-700">
                  <span>80%</span>
                  <span>20 Bs</span>
                </div>
                 <div className="flex justify-between py-1 px-2 rounded hover:bg-slate-700">
                    <span className="text-orange-500">30%</span>
                    <span>70 Bs</span>
                </div>

                <div className="flex justify-between py-1 px-2 rounded hover:bg-slate-700">
                  <span>70%</span>
                  <span>30 Bs</span>
                </div>
                 <div className="flex justify-between py-1 px-2 rounded hover:bg-slate-700">
                    <span className="text-red-400">20%</span>
                    <span>80 Bs</span>
                </div>

                <div className="flex justify-between py-1 px-2 rounded hover:bg-slate-700">
                  <span>60%</span>
                  <span>40 Bs</span>
                </div>
                 <div className="flex justify-between py-1 px-2 rounded hover:bg-slate-700">
                    <span className="text-red-500 font-bold">10% - 0%</span>
                    <span>90 - 100 Bs</span>
                </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;