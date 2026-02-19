import React from 'react';
import { AlertCircle } from 'lucide-react';

const PenaltiesTable = () => (
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
);

export default PenaltiesTable;
