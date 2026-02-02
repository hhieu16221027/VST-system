
import React from 'react';
import { Observation, Action, Indication, Profession, Procedure } from '../types';
import { PROFESSIONS, INDICATIONS, ACTIONS, NON_HYGIENE_ACTIONS } from '../constants';
import { Trash2, User, ClipboardList, Activity, CheckCircle, CheckSquare, Square } from 'lucide-react';

interface ObservationRowProps {
  observation: Observation;
  onUpdate: (id: string, updates: Partial<Observation>) => void;
  onDelete: (id: string) => void;
  index: number;
}

const ObservationRow: React.FC<ObservationRowProps> = ({ observation, onUpdate, onDelete, index }) => {
  const isNoHygiene = NON_HYGIENE_ACTIONS.includes(observation.action);
  const selectedIndications = observation.indications || [];

  const toggleIndication = (ind: Indication) => {
    let next: Indication[];
    if (selectedIndications.includes(ind)) {
      next = selectedIndications.filter(i => i !== ind);
    } else {
      next = [...selectedIndications, ind];
    }
    onUpdate(observation.id, { indications: next });
  };

  const handleActionChange = (action: Action) => {
    const isNewNoHygiene = NON_HYGIENE_ACTIONS.includes(action);
    onUpdate(observation.id, { 
      action, 
      procedure: isNewNoHygiene ? null : (observation.procedure || "Đúng") 
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden mb-8 transition-all active:scale-[0.99]">
      {/* Header */}
      <div className="bg-slate-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[14px] font-black">
            {index + 1}
          </span>
          <span className="font-black text-slate-700 text-[16px] uppercase tracking-wider">Lượt quan sát</span>
        </div>
        <button 
          onClick={() => onDelete(observation.id)}
          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* 1. NVYT & Đối tượng */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[16px] font-black text-slate-400 uppercase tracking-widest">
            <User size={16} className="text-blue-500" /> 1. NHÂN VIÊN ĐƯỢC GIÁM SÁT <span className="text-red-500 font-black">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Nhập họ tên nhân viên y tế"
            className="w-full px-5 py-4 bg-slate-50 border border-gray-100 rounded-2xl text-[16px] focus:ring-4 focus:ring-blue-500 outline-none placeholder:text-slate-300"
            value={observation.staffName || ''}
            onChange={(e) => onUpdate(observation.id, { staffName: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            {PROFESSIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onUpdate(observation.id, { profession: p })}
                className={`py-3 text-[16px] font-black rounded-xl border transition-all ${
                  observation.profession === p 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                    : 'bg-white border-gray-200 text-slate-500'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Chỉ định */}
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-[16px] font-black text-slate-400 uppercase tracking-widest leading-tight">
              <ClipboardList size={16} className="text-indigo-500" /> 2. Chỉ định <span className="text-red-500 font-black">*</span>
            </label>
            <span className="text-[12px] font-bold text-slate-400 lowercase italic ml-6 -mt-0.5 mb-1">(Chọn một hoặc nhiều)</span>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {INDICATIONS.map((ind) => {
              const isActive = selectedIndications.includes(ind);
              
              return (
                <button
                  key={ind}
                  type="button"
                  onClick={() => toggleIndication(ind)}
                  className={`flex items-start gap-4 text-left px-5 py-3.5 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold shadow-sm'
                      : 'bg-white border-gray-100 text-slate-600'
                  }`}
                >
                  <div className={`shrink-0 mt-0.5 ${isActive ? 'text-indigo-600' : 'text-slate-300'}`}>
                    {isActive ? <CheckSquare size={22} /> : <Square size={22} />}
                  </div>
                  <span className="text-[16px] leading-snug">{ind}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Hành động */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[16px] font-black text-slate-400 uppercase tracking-widest">
            <Activity size={16} className="text-teal-500" /> 3. Hành động
          </label>
          <div className="grid grid-cols-1 gap-3">
            {ACTIONS.map((act) => (
              <button
                key={act}
                type="button"
                onClick={() => handleActionChange(act)}
                className={`flex items-center justify-between px-6 py-4 text-left text-[16px] rounded-2xl border transition-all leading-tight ${
                  observation.action === act
                    ? 'bg-teal-600 border-teal-600 text-white font-black shadow-xl'
                    : 'bg-white border-gray-100 text-slate-500 shadow-sm'
                }`}
              >
                <span>{act}</span>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                  observation.action === act ? 'bg-white border-white shadow-inner' : 'bg-slate-100 border-gray-200'
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* 4. Quy trình */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[16px] font-black text-slate-400 uppercase tracking-widest">
            <CheckCircle size={16} className="text-green-500" /> 4. Quy trình
          </label>
          <div className={`grid grid-cols-2 gap-3 ${isNoHygiene ? 'opacity-20 pointer-events-none' : ''}`}>
            <button
              type="button"
              disabled={isNoHygiene}
              onClick={() => onUpdate(observation.id, { procedure: "Đúng" })}
              className={`py-4 text-[16px] font-black rounded-2xl border transition-all ${
                observation.procedure === "Đúng"
                  ? 'bg-green-600 border-green-600 text-white shadow-xl scale-[1.01]'
                  : 'bg-white border-gray-100 text-slate-400'
              }`}
            >
              ĐÚNG
            </button>
            <button
              type="button"
              disabled={isNoHygiene}
              onClick={() => onUpdate(observation.id, { procedure: "Sai" })}
              className={`py-4 text-[16px] font-black rounded-2xl border transition-all ${
                observation.procedure === "Sai"
                  ? 'bg-red-600 border-red-600 text-white shadow-xl scale-[1.01]'
                  : 'bg-white border-gray-100 text-slate-400'
              }`}
            >
              SAI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservationRow;
