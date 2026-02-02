
import React, { useState, useEffect } from 'react';
import { MonitoringSession, Observation, Department } from './types';
import { DEPARTMENTS } from './constants';
import ObservationRow from './components/ObservationRow';
import { Plus, History, LayoutDashboard, FileText, CheckCheck, Loader2, Activity, Settings, CloudUpload, Check, Users, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const STORAGE_KEY = 'hand_hygiene_data_v2';
const SCRIPT_URL_KEY = 'hand_hygiene_script_url_v2';
const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyXmB7F2gHRlTMDJThk2THi5Sd7qvstN_eIqncvrPZqL97ZG_8vmdYx7rJggA4yTmeP/exec";

// Hàm tạo ID an toàn không phụ thuộc crypto.randomUUID
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const formatToVN = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'history' | 'stats' | 'settings'>('form');
  const [history, setHistory] = useState<MonitoringSession[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scriptUrl, setScriptUrl] = useState('');
  const [isUrlSaved, setIsUrlSaved] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Form State
  const [observer, setObserver] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [department, setDepartment] = useState<Department>(DEPARTMENTS[0]);
  const [observations, setObservations] = useState<Observation[]>([
    {
      id: generateId(),
      profession: "DD/HS/KTV",
      indications: [], // Bỏ chọn mặc định
      action: "VST với cồn",
      procedure: "Đúng",
      staffName: ""
    }
  ]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setHistory(JSON.parse(stored)); } catch (e) { console.error("Lỗi đọc dữ liệu cũ:", e); }
    }
    
    const storedUrl = localStorage.getItem(SCRIPT_URL_KEY);
    if (storedUrl) {
      setScriptUrl(storedUrl);
    } else {
      setScriptUrl(DEFAULT_SCRIPT_URL);
      localStorage.setItem(SCRIPT_URL_KEY, DEFAULT_SCRIPT_URL);
    }
  }, []);

  const saveScriptUrl = (url: string) => {
    setScriptUrl(url);
    localStorage.setItem(SCRIPT_URL_KEY, url);
    setIsUrlSaved(true);
    setTimeout(() => setIsUrlSaved(false), 2000);
  };

  const handleAddObservation = () => {
    setObservations([...observations, {
      id: generateId(),
      profession: "DD/HS/KTV",
      indications: [], // Bỏ chọn mặc định cho lượt mới
      action: "VST với cồn",
      procedure: "Đúng",
      staffName: ""
    }]);
  };

  const handleUpdateObservation = (id: string, updates: Partial<Observation>) => {
    setObservations(prev => prev.map(obs => obs.id === id ? { ...obs, ...updates } : obs));
  };

  const handleDeleteObservation = (id: string) => {
    if (observations.length <= 1) return;
    setObservations(prev => prev.filter(obs => obs.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    // Validation NV giám sát
    if (!observer.trim()) { 
      alert("Vui lòng nhập tên NHÂN VIÊN GIÁM SÁT!"); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return; 
    }

    // Validation NV được giám sát
    const incompleteName = observations.some(obs => !obs.staffName || !obs.staffName.trim());
    if (incompleteName) {
      alert("Vui lòng nhập đầy đủ tên nhân viên được giám sát ở tất cả các lượt.");
      return;
    }

    // Validation Chỉ định (Bắt buộc chọn ít nhất 1)
    const incompleteIndications = observations.some(obs => !obs.indications || obs.indications.length === 0);
    if (incompleteIndications) {
      alert("Mỗi lượt quan sát cần chọn ít nhất một CHỈ ĐỊNH.");
      return;
    }

    setIsSubmitting(true);
    const now = new Date();
    const timestamp = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN');
    
    const session: MonitoringSession = {
      id: generateId(),
      observer: observer.trim(),
      date, 
      department,
      observations,
      createdAt: timestamp
    };

    try {
      const newHistory = [session, ...history];
      setHistory(newHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));

      if (scriptUrl) {
        const rows = session.observations.map(obs => ({
          date: formatToVN(session.date),
          observer: session.observer,
          department: session.department,
          staffName: obs.staffName || '---',
          profession: obs.profession,
          indication: (obs.indications || []).join(', '),
          action: obs.action,
          procedure: obs.procedure || 'N/A',
          createdAt: session.createdAt
        }));

        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors', 
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ rows })
        });
      }

      setShowSuccess(true);
      setHasAttemptedSubmit(false);
      setObservations([{
        id: generateId(),
        profession: "DD/HS/KTV",
        indications: [], // Reset về rỗng
        action: "VST với cồn",
        procedure: "Đúng",
        staffName: ""
      }]);
      
      setTimeout(() => {
        setShowSuccess(false);
        setActiveTab('history');
        window.scrollTo(0, 0);
      }, 1500);

    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      alert("Có lỗi xảy ra khi gửi dữ liệu. Tuy nhiên, dữ liệu của bạn đã được lưu tạm vào máy.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStats = () => {
    const allObs = history.flatMap(h => h.observations);
    if (allObs.length === 0) return null;
    const total = allObs.length;
    const compliant = allObs.filter(o => o.action !== "Không VST" && o.action !== "Mang găng và không VST");
    
    const profStats = ["Bác sĩ", "DD/HS/KTV", "Hộ lý", "Khác"].map(p => {
      const pObs = allObs.filter(o => o.profession === p);
      const pCompliant = pObs.filter(o => o.action !== "Không VST" && o.action !== "Mang găng và không VST");
      return {
        name: p,
        totalObs: pObs.length,
        compliantObs: pCompliant.length,
        rate: pObs.length > 0 ? (pCompliant.length / pObs.length * 100).toFixed(1) : "0"
      };
    });

    return { 
      total, 
      compliance: (compliant.length / total * 100).toFixed(1), 
      profStats
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-[#F0F9FF] font-sans text-slate-900 overflow-x-hidden pb-40">
      <header className="bg-white/95 backdrop-blur-md border-b border-sky-100 sticky top-0 z-40 px-6 py-4 safe-top shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-2 rounded-2xl text-white shadow-blue-200 shadow-xl">
              <CheckCheck size={24} />
            </div>
            <div>
              <h1 className="text-[20px] font-black tracking-tight leading-none uppercase text-blue-900">VST SYSTEM</h1>
            </div>
          </div>
          <button onClick={() => setActiveTab('settings')} className="p-2.5 text-slate-400 hover:text-blue-600 transition-colors bg-sky-50 rounded-2xl">
            <Settings size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        {activeTab === 'form' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="text-center mb-8 px-2">
              <h2 className="text-[20px] md:text-[24px] font-black text-blue-700 leading-tight uppercase tracking-tight">
                GIÁM SÁT VST THƯỜNG QUY <br /> BỆNH VIỆN ĐA KHOA TÂN PHÚ
              </h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto mt-4 rounded-full shadow-sm shadow-blue-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="bg-white rounded-[28px] shadow-sm border border-sky-100 p-6 space-y-6">
                <div className="flex items-center gap-3 text-blue-600 pb-3 border-b border-sky-50">
                  <FileText size={20} />
                  <h2 className="text-[18px] font-black uppercase tracking-wider">Thông tin chung</h2>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[16px] font-black text-slate-400 uppercase ml-2">
                      NHÂN VIÊN GIÁM SÁT <span className="text-red-500 font-black">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      placeholder="Họ tên nhân viên giám sát" 
                      className={`w-full px-5 py-4 bg-sky-50/50 border-2 rounded-[18px] text-[16px] focus:ring-4 focus:ring-blue-500 outline-none transition-all ${
                        hasAttemptedSubmit && !observer.trim() ? 'border-red-200 bg-red-50' : 'border-transparent'
                      }`} 
                      value={observer} 
                      onChange={(e) => setObserver(e.target.value)} 
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[16px] font-black text-slate-400 uppercase ml-2">KHOA ĐƯỢC GIÁM SÁT</label>
                      <select className="w-full px-5 py-4 bg-sky-50/50 border-none rounded-[18px] text-[16px] font-bold outline-none appearance-none shadow-inner" value={department} onChange={(e) => setDepartment(e.target.value as Department)}>
                        {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </section>

              <div className="px-2">
                 <h2 className="text-[18px] font-black uppercase text-blue-800/60 tracking-wider flex items-center gap-3">
                   <Activity size={20} className="text-teal-500" /> Tổng số: {observations.length} lượt quan sát
                 </h2>
              </div>

              <div className="space-y-4">
                {observations.map((obs, idx) => (
                  <ObservationRow key={obs.id} index={idx} observation={obs} onUpdate={handleUpdateObservation} onDelete={handleDeleteObservation} />
                ))}
              </div>
              
              <div className="pt-4 space-y-3">
                  <button type="button" onClick={handleAddObservation} className="w-full py-4 rounded-[20px] text-blue-700 bg-white font-black text-[16px] uppercase flex items-center justify-center gap-3 active:scale-95 transition-all border-2 border-blue-100 shadow-sm hover:bg-blue-50">
                    <Plus size={20} /> Thêm lượt quan sát mới
                  </button>

                  <button type="submit" disabled={isSubmitting} className={`w-full py-6 rounded-[24px] text-[18px] font-black shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${isSubmitting ? 'bg-slate-300' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'}`}>
                    {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <CloudUpload size={24} />}
                    {isSubmitting ? 'ĐANG GỬI DỮ LIỆU...' : 'HOÀN TẤT & GỬI'}
                  </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
             <div className="flex justify-between items-center px-2">
                <h2 className="text-[22px] font-black text-blue-900">Nhật ký</h2>
                <button onClick={() => { if(confirm("Xóa toàn bộ lịch sử?")) { localStorage.removeItem(STORAGE_KEY); setHistory([]); } }} className="text-[14px] font-bold text-red-500 bg-white px-4 py-2 rounded-full uppercase border border-red-100 shadow-sm">Xóa tất cả</button>
             </div>
             {history.length === 0 ? (
               <div className="bg-white rounded-[28px] py-20 border-2 border-dashed border-sky-100 text-center space-y-5">
                 <History className="mx-auto text-sky-200" size={48} />
                 <p className="text-[16px] font-bold text-sky-400">Chưa có dữ liệu giám sát</p>
               </div>
             ) : (
               <div className="space-y-5">
                 {history.map(session => (
                   <div key={session.id} className="bg-white rounded-[24px] p-6 shadow-sm border border-sky-100 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="text-[16px] font-black text-blue-600 uppercase tracking-tight">{session.department}</div>
                          <div className="text-[14px] text-slate-400 font-bold">{formatToVN(session.date)} • {session.observer}</div>
                        </div>
                        <div className="bg-sky-50 px-3 py-1 rounded-xl text-[14px] font-black text-blue-500 uppercase">{session.observations.length} Lượt</div>
                      </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-7 animate-in zoom-in-95 pb-10">
             {!stats ? (
               <div className="text-center py-20 text-sky-400 font-bold">Cần có dữ liệu để xem báo cáo</div>
             ) : (
               <>
                 <div className="bg-white p-6 rounded-[28px] shadow-sm border-b-8 border-blue-500 text-center">
                    <div className="text-[16px] font-black text-slate-400 uppercase mb-2">Tỉ lệ tuân thủ chung</div>
                    <div className="text-[44px] font-black text-blue-900">{stats.compliance}%</div>
                 </div>

                 <div className="bg-white p-6 rounded-[28px] shadow-sm border border-sky-100">
                    <h3 className="text-[18px] font-black text-slate-400 uppercase mb-6 text-center">Cơ hội theo đối tượng</h3>
                    <div className="h-[240px]">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={stats.profStats} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={90} fontSize={14} fontWeight="black" />
                            <Tooltip contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 8px 12px rgba(0,0,0,0.1)' }} />
                            <Bar dataKey="totalObs" name="Tổng cơ hội" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={20} />
                         </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                    {stats.profStats.map(prof => (
                      <div key={prof.name} className="bg-white p-5 rounded-[24px] shadow-sm border border-sky-100 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[18px] font-black text-blue-900 uppercase">{prof.name}</span>
                          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[16px] font-black">{prof.rate}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-sky-50 p-3 rounded-xl">
                            <div className="text-[12px] font-bold text-blue-400 uppercase">Cơ hội</div>
                            <div className="text-[20px] font-black text-blue-800">{prof.totalObs}</div>
                          </div>
                          <div className="bg-green-50 p-3 rounded-xl">
                            <div className="text-[12px] font-bold text-green-400 uppercase">Có tuân thủ</div>
                            <div className="text-[20px] font-black text-green-600">{prof.compliantObs}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                 </div>
               </>
             )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="bg-white rounded-[28px] p-6 shadow-2xl border border-sky-100 space-y-6">
                <h2 className="text-[22px] font-black text-blue-900 flex items-center gap-4">
                  <Settings className="text-blue-600" size={24} /> Cấu hình
                </h2>
                <div className="space-y-3">
                  <label className="text-[16px] font-black text-slate-400 uppercase">Google Script URL</label>
                  <input 
                    type="url" 
                    className="w-full px-5 py-4 bg-sky-50 rounded-xl text-[14px] font-mono border-2 border-transparent focus:border-blue-500 outline-none" 
                    value={scriptUrl} 
                    onChange={(e) => saveScriptUrl(e.target.value)} 
                  />
                  {isUrlSaved && <p className="text-green-500 text-[12px] font-black">✓ ĐÃ LƯU TỰ ĐỘNG</p>}
                </div>
                <button onClick={() => setActiveTab('form')} className="w-full py-4 bg-blue-900 text-white font-black rounded-xl text-[16px] uppercase shadow-xl">Quay lại</button>
             </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-sky-100 flex justify-around items-center px-4 py-2 safe-bottom z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        {[
          { id: 'form', icon: FileText, label: 'Nhập' },
          { id: 'history', icon: History, label: 'Nhật ký' },
          { id: 'stats', icon: LayoutDashboard, label: 'Báo cáo' }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => { setActiveTab(tab.id as any); window.scrollTo(0, 0); }} 
            className={`flex flex-col items-center gap-1 py-2 px-5 rounded-[18px] transition-all ${activeTab === tab.id ? 'text-blue-600 bg-blue-50 font-black' : 'text-sky-400'}`}
          >
            <tab.icon size={24} strokeWidth={activeTab === tab.id ? 3 : 2} />
            <span className="text-[14px] uppercase font-bold">{tab.label}</span>
          </button>
        ))}
      </nav>

      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-blue-950/40 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-[40px] p-8 text-center shadow-2xl animate-in zoom-in-95 max-w-sm w-[85%] border border-white">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCheck size={32} />
            </div>
            <h3 className="text-[24px] font-black text-slate-800 mb-2">Thành công</h3>
            <p className="text-slate-400 font-bold text-[16px] uppercase">Dữ liệu đã được ghi nhận.</p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .safe-top { padding-top: env(safe-area-inset-top); }
        .safe-bottom { padding-bottom: calc(env(safe-area-inset-bottom) + 8px); }
      `}} />
    </div>
  );
};

export default App;
