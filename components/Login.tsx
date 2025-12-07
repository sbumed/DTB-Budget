
import React, { useState } from 'react';

export interface UserInfo {
    missionGroup: string;
    workGroup: string;
    organizationName?: string;
}
interface LoginProps {
  onLoginSuccess: (userInfo: UserInfo) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [workGroup, setWorkGroup] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegister) {
        // Validate required fields for registration
        if (!email.trim() || !password || !confirmPassword || !organizationName.trim() || !workGroup.trim()) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง');
            return;
        }

        if (password !== confirmPassword) {
            alert('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน กรุณาลองใหม่อีกครั้ง');
            return;
        }
        // Trigger the confirmation modal
        setShowRegisterConfirm(true);
    } else {
        // Validate required fields for login
        if (!email.trim() || !password) {
             alert('กรุณากรอกอีเมลและรหัสผ่าน');
             return;
        }

        // Login Logic
        let loggedInUser: UserInfo | null = null;
        let isAuthenticated = false;

        // Check hardcoded credentials
        if (email === 'admin.dtb@gmail.com' && password === 'admin123') {
             loggedInUser = { 
                 missionGroup: 'กลุ่มภารกิจยุทธศาสตร์ แผนงาน และพัฒนาองค์กร', 
                 workGroup: 'กลุ่มงานยุทธศาสตร์และแผนงาน (Administrator)',
                 organizationName: 'กองวัณโรค'
             };
             isAuthenticated = true;
        } else if (email === 'opd.dtb@gmail.com' && password === 'opd123') {
             loggedInUser = { 
                 missionGroup: 'กลุ่มภารกิจพัฒนาระบบบริการ', 
                 workGroup: 'กลุ่มงานพัฒนาระบบบริการคลินิกวัณโรค',
                 organizationName: 'กองวัณโรค' 
             };
             isAuthenticated = true;
        } else {
            // Check registered users from local storage
            const storedUsersStr = localStorage.getItem('registered_users');
            if (storedUsersStr) {
                try {
                    const storedUsers = JSON.parse(storedUsersStr);
                    if (Array.isArray(storedUsers)) {
                        const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
                        if (foundUser) {
                            loggedInUser = foundUser.userInfo;
                            isAuthenticated = true;
                        }
                    }
                } catch (e) {
                    console.error("Login error parsing users:", e);
                }
            }
        }

        if (isAuthenticated && loggedInUser) {
            onLoginSuccess(loggedInUser);
        } else {
            alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบข้อมูลอีกครั้ง');
        }
    }
  };

  const handleConfirmRegister = () => {
    try {
        // Save to local storage (Mock Database)
        const finalWorkGroup = role === 'admin' ? `${workGroup} (Administrator)` : workGroup;
        const newUser = {
            email,
            password,
            userInfo: {
                missionGroup: 'General', 
                workGroup: finalWorkGroup, 
                organizationName 
            }
        };

        const storedUsersStr = localStorage.getItem('registered_users');
        let storedUsers = [];
        try {
                storedUsers = storedUsersStr ? JSON.parse(storedUsersStr) : [];
                if (!Array.isArray(storedUsers)) storedUsers = [];
        } catch (e) {
            storedUsers = [];
        }
        
        // Simple check for duplicates
        if (storedUsers.some((u: any) => u.email === email)) {
            alert('อีเมลนี้ถูกใช้งานแล้ว');
            setShowRegisterConfirm(false);
            return;
        }

        storedUsers.push(newUser);
        localStorage.setItem('registered_users', JSON.stringify(storedUsers));

        // Success Alert and Redirect to Login
        alert('ทำการสมัครสมาชิกเรียบร้อยแล้ว');
        setShowRegisterConfirm(false);
        setIsRegister(false);
        setPassword(''); 
        setConfirmPassword('');
        // Keep email for convenience
    } catch (error) {
        console.error("Registration error:", error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div 
        className="min-h-screen flex flex-col font-sans relative"
    >
        {/* Background Image Fixed Layer */}
        <div 
            className="fixed inset-0 z-0 bg-cover bg-no-repeat bg-center"
            style={{
                backgroundImage: `url('https://i.postimg.cc/L6BgXwv0/login.png')`,
            }}
        ></div>
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/20 z-0"></div>

        {/* Content Container */}
        <div className="flex-grow flex items-center justify-center p-4 relative z-10 w-full">
            <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white my-8">
                <div className="text-center mb-8">
                    <div className="text-3xl font-bold text-sky-700 mb-2 flex items-center justify-center tracking-wide">
                        <span>งบดำเนินการ</span>
                    </div>
                    <div className="h-1 w-24 bg-sky-500 mx-auto rounded-full mb-6"></div>
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
                            <input 
                                type="password" 
                                required 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-gray-50 text-gray-900 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">ชื่อหน่วยงาน</label>
                            <input 
                                type="text" 
                                value={organizationName} 
                                onChange={(e) => setOrganizationName(e.target.value)}
                                required
                                placeholder="ระบุชื่อหน่วยงาน"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-gray-50 text-gray-900 transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">กลุ่มงาน</label>
                            <input 
                                type="text"
                                value={workGroup} 
                                onChange={(e) => setWorkGroup(e.target.value)} 
                                required 
                                placeholder="ระบุกลุ่มงาน"
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-gray-50 text-gray-900 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">สถานะผู้ใช้งาน</label>
                            <div className="flex gap-4 px-1">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="role" 
                                        value="user" 
                                        checked={role === 'user'} 
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-4 h-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700">ผู้ใช้งานทั่วไป</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="role" 
                                        value="admin" 
                                        checked={role === 'admin'} 
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-4 h-4 text-sky-600 focus:ring-sky-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700">ผู้ดูแลระบบ</span>
                                </label>
                            </div>
                        </div>
                        </>
                    )}
                    </div>
                    <button type="submit" className="w-full mt-8 py-3.5 px-8 bg-sky-300 hover:bg-sky-400 text-sky-900 font-bold rounded-xl transition-all shadow-lg hover:shadow-sky-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 transform hover:-translate-y-0.5 active:translate-y-0 relative z-20">
                    {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-6">
                    {isRegister ? 'มีบัญชีอยู่แล้ว? ' : 'ยังไม่มีบัญชี? '}
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); setConfirmPassword(''); }} className="font-bold text-sky-600 hover:text-sky-800 transition-colors hover:underline">
                    {isRegister ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                    </a>
                </p>
            </div>
        </div>

        {/* Registration Confirmation Modal */}
        {showRegisterConfirm && (
            <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-fade-in-up">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">ยืนยันข้อมูลการสมัครสมาชิก</h3>
                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                        <div className="flex justify-between">
                            <span className="font-medium">ชื่อหน่วยงาน:</span>
                            <span>{organizationName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">กลุ่มงาน:</span>
                            <span>{workGroup}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">อีเมล:</span>
                            <span>{email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">สถานะ:</span>
                            <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full text-xs">
                                {role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งานทั่วไป'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowRegisterConfirm(false)}
                            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                        >
                            แก้ไข
                        </button>
                        <button 
                            onClick={handleConfirmRegister}
                            className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold shadow-md transition-colors"
                        >
                            ยืนยันสมัคร
                        </button>
                    </div>
                </div>
            </div>
        )}
      
        {/* Footer in Flow */}
       <div className="flex-shrink-0 flex flex-row items-center justify-center gap-3 z-20 pb-4 relative">
            <img src="https://i.postimg.cc/NGHL5FQH/d-sin-th-y-ngmi-di-t-ngch-x.png" alt="Developer" className="h-12 w-12 rounded-full object-cover shadow-lg border-2 border-white/50" />
            <p className="text-white font-medium drop-shadow-md text-sm bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">พัฒนาโดย นางสาวภัทรพร สุขล้อม</p>
       </div>
    </div>
  );
};

export default Login;
