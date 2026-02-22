
import React, { useState } from 'react';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { ALLOWED_USERS, AUTH_KEY } from '../constants';
import { User as UserType } from '../types';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Giả lập độ trễ mạng
    setTimeout(() => {
      const user = ALLOWED_USERS.find(u => u.username === username && u.password === password);
      
      if (user) {
        const userData: UserType = {
          username: user.username,
          fullName: user.fullName,
          role: user.role as 'admin' | 'observer'
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
        onLogin(userData);
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center p-4 border border-sky-100">
              <img 
                src="https://raw.githubusercontent.com/hhieu16221027/VST-system/refs/heads/main/logo.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/3063/3063204.png";
                }}
              />
            </div>
          </div>
          <div>
            <h1 className="text-[28px] font-black text-blue-600 uppercase tracking-tighter leading-none">
              BỆNH VIỆN ĐA KHOA
            </h1>
            <h2 className="text-[28px] font-black text-blue-600 uppercase tracking-tighter leading-tight">
              TÂN PHÚ
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[12px] mt-2">
              Hệ thống giám sát vệ sinh tay
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 p-8 border border-sky-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[14px] font-black text-slate-400 uppercase ml-2 tracking-wider">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-300">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-sky-50/50 border-2 border-transparent rounded-[20px] text-[16px] focus:border-blue-500 focus:bg-white outline-none transition-all font-bold"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[14px] font-black text-slate-400 uppercase ml-2 tracking-wider">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-300">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-5 py-4 bg-sky-50/50 border-2 border-transparent rounded-[20px] text-[16px] focus:border-blue-500 focus:bg-white outline-none transition-all font-bold"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-500 bg-rose-50 p-4 rounded-[18px] border border-rose-100 animate-in shake duration-300">
                <AlertCircle size={18} />
                <span className="text-[14px] font-bold">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 rounded-[24px] text-[18px] font-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
                isLoading 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={22} />
                  ĐĂNG NHẬP
                </>
              )}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-slate-400 text-[12px] font-bold uppercase tracking-widest">
            Phiên bản 2.0.1 • 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
