
import React, { useState } from 'react';
import { MISSION_GROUPS } from '../constants';

export interface UserInfo {
    missionGroup: string;
    workGroup: string;
}
interface LoginProps {
  onLoginSuccess: (userInfo: UserInfo) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [missionGroup, setMissionGroup] = useState('');
  const [workGroup, setWorkGroup] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const workGroups = missionGroup ? MISSION_GROUPS[missionGroup as keyof typeof MISSION_GROUPS] || [] : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegister) {
        // Simulating registration
        onLoginSuccess({ missionGroup, workGroup });
    } else {
        // Check credentials
        if (email === 'admin.dtb@gmail.com' && password === 'admin123') {
             onLoginSuccess({ 
                 missionGroup: 'กลุ่มภารกิจยุทธศาสตร์ แผนงาน และพัฒนาองค์กร', 
                 workGroup: 'กลุ่มงานยุทธศาสตร์และแผนงาน (Administrator)' 
             });
        } else if (email === 'opd.dtb@gmail.com' && password === 'opd123') {
             onLoginSuccess({ 
                 missionGroup: 'กลุ่มภารกิจพัฒนาระบบบริการ', 
                 workGroup: 'กลุ่มงานพัฒนาระบบบริการคลินิกวัณโรค' 
             });
        } else {
            alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
    }
  };

  return (
    <div 
        className="min-h-screen flex flex-col justify-center items-center p-4 bg-cover bg-no-repeat relative font-sans"
        style={{
            backgroundImage: `url('https://i.postimg.cc/mr6MDG63/login.png')`,
            backgroundPosition: 'center'
        }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>
      
      <div className="w-full max-w-md relative z-10 p-8 rounded-3xl shadow-2xl bg-white">
        <div className="text-center mb-8">
            <div className="text-3xl font-bold text-sky-700 mb-2 flex items-center justify-center tracking-wide">
                <span>งบดำเนินการ</span>
            </div>
            <div className="h-1 w-24 bg-sky-500 mx-auto rounded-full mb-6"></div>
            
            <img 
                src="https://i.postimg.cc/fWc01Fh3/logo-1.png" 
                alt="กองวัณโรค" 
                className="mx-auto h-32 object-contain"
            />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6 pb-2 border-b border-gray-200">
            {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
        </h2>
        <form onSubmit={handleSubmit}>
            <div className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">อีเมล</label>
                <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400 transition-all" 
                    placeholder="เช่น user@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">รหัสผ่าน</label>
                <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-gray-50 text-gray-900 transition-all" 
                />
            </div>
            {isRegister && (
                <>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">ยืนยันรหัสผ่าน</label>
                    <input type="password" required className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-gray-50 text-gray-900 transition-all" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">ชื่อหน่วยงาน</label>
                    <input type="text" value="กองวัณโรค" disabled className="w-full p-3 border border-gray-300 rounded-xl bg-gray-200 text-gray-600" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">กลุ่มภารกิจ</label>
                    <select 
                        value={missionGroup} 
                        onChange={(e) => { setMissionGroup(e.target.value); setWorkGroup(''); }} 
                        required 
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-gray-50 text-gray-900 transition-all"
                    >
                    <option value="">-- เลือกกลุ่มภารกิจ --</option>
                    {Object.keys(MISSION_GROUPS).map(group => (
                        <option key={group} value={group}>{group}</option>
                    ))}
                    </select>
                </div>
                {missionGroup && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">กลุ่มงาน</label>
                        <select 
                            value={workGroup} 
                            onChange={(e) => setWorkGroup(e.target.value)} 
                            required 
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-gray-50 text-gray-900 transition-all"
                        >
                        <option value="">-- เลือกกลุ่มงาน --</option>
                        {workGroups.map(work => (
                            <option key={work} value={work}>{work}</option>
                        ))}
                        </select>
                    </div>
                )}
                </>
            )}
            </div>
            <button type="submit" className="w-full mt-8 py-3.5 px-8 bg-sky-300 hover:bg-sky-400 text-sky-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 transform hover:-translate-y-0.5 active:translate-y-0">
            {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
            </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
            {isRegister ? 'มีบัญชีอยู่แล้ว? ' : 'ยังไม่มีบัญชี? '}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); }} className="font-bold text-sky-600 hover:text-sky-800 transition-colors hover:underline">
            {isRegister ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
