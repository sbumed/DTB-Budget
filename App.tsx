
import React, { useState, useCallback, useEffect } from 'react';
import type { Project, View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectForm from './components/ProjectForm';
import ProgressReport from './components/ProgressReport';
import SummaryReport from './components/SummaryReport';
import Login, { UserInfo } from './components/Login';

const INITIAL_PROJECTS: Project[] = [
    {
        id: 'seed-project-001',
        name: 'โครงการให้บริการดูแลรักษาวัณโรค และวัณโรคดื้อยา โดยผู้ป่วยเป็นศูนย์กลาง (Patient Centered Care) และการคัดกรองเชิงรุกในประชากรกลุ่มเสี่ยงโดยการถ่ายภาพรังสีทรวงอก',
        department: 'กลุ่มงานพัฒนาระบบบริการคลินิกวัณโรค',
        activities: [
            {
                id: 'act-001',
                name: 'ให้บริการดูแลรักษาวัณโรค และวัณโรคดื้อยา โดยผู้ป่วยเป็นศูนย์กลาง (Patient Centered Care)',
                startDate: '2026-10-01',
                endDate: '2027-09-30',
                targetGroup: 'ประชาชนทั่วไป/ประชากรกลุ่มเสี่ยงและผู้ป่วยวัณโรค',
                status: 'not_started',
                progressReport: '',
                attachments: [],
                costItems: [
                    {
                        id: 'cost-1-1',
                        name: 'ค่าวัสดุอุปกรณ์การดำเนินงานโครงการ',
                        pricePerUnit: 20000,
                        quantityUnits: [
                            { id: 'qu-1-1-1', quantity: 1, unit: 'ครั้ง' }
                        ]
                    },
                    {
                        id: 'cost-1-2',
                        name: 'ค่าบำรุงรักษาเครื่องมือและอุปกรณ์ทางการแพทย์',
                        pricePerUnit: 15000,
                        quantityUnits: [
                            { id: 'qu-1-2-1', quantity: 1, unit: 'ครั้ง' }
                        ]
                    },
                    {
                        id: 'cost-1-3',
                        name: 'ค่าวัสดุอุปกรณ์ทางการแพทย์',
                        pricePerUnit: 40000,
                        quantityUnits: [
                            { id: 'qu-1-3-1', quantity: 1, unit: 'ครั้ง' }
                        ]
                    },
                    {
                        id: 'cost-1-4',
                        name: 'ค่าตรวจเลือดผู้ป่วย',
                        pricePerUnit: 80000,
                        quantityUnits: [
                            { id: 'qu-1-4-1', quantity: 1, unit: 'ครั้ง' }
                        ]
                    }
                ]
            },
            {
                id: 'act-002',
                name: 'ให้บริการด้วยการคัดกรองเพื่อค้นหาวัณโรคเชิงรุกโดยการออกหน่วยเคลื่อนที่ในกลุ่มประชากรเสี่ยงต่าง ๆ',
                startDate: '2026-10-01',
                endDate: '2027-09-30',
                targetGroup: 'ประชาชนทั่วไป/ประชากรกลุ่มเสี่ยงและผู้ป่วยวัณโรค',
                status: 'not_started',
                progressReport: '',
                attachments: [],
                costItems: [
                    {
                        id: 'cost-2-1',
                        name: 'ค่าเบี้ยเลี้ยง (1 ครั้ง/3 วัน)',
                        pricePerUnit: 240,
                        quantityUnits: [
                            { id: 'qu-2-1-1', quantity: 1, unit: 'ครั้ง' },
                            { id: 'qu-2-1-2', quantity: 3, unit: 'วัน' },
                            { id: 'qu-2-1-3', quantity: 10, unit: 'คน' }
                        ]
                    },
                    {
                        id: 'cost-2-2',
                        name: 'ค่าเบี้ยเลี้ยง (3 ครั้ง/1 วัน)',
                        pricePerUnit: 240,
                        quantityUnits: [
                            { id: 'qu-2-2-1', quantity: 3, unit: 'ครั้ง' },
                            { id: 'qu-2-2-2', quantity: 1, unit: 'วัน' },
                            { id: 'qu-2-2-3', quantity: 10, unit: 'คน' }
                        ]
                    },
                    {
                        id: 'cost-2-3',
                        name: 'ค่าที่พัก',
                        pricePerUnit: 800,
                        quantityUnits: [
                            { id: 'qu-2-3-1', quantity: 1, unit: 'ครั้ง' },
                            { id: 'qu-2-3-2', quantity: 2, unit: 'วัน' },
                            { id: 'qu-2-3-3', quantity: 10, unit: 'คน' }
                        ]
                    },
                    {
                        id: 'cost-2-4',
                        name: 'ค่าพาหนะเดินทาง',
                        pricePerUnit: 900,
                        quantityUnits: [
                            { id: 'qu-2-4-1', quantity: 4, unit: 'ครั้ง' },
                            { id: 'qu-2-4-2', quantity: 10, unit: 'คน' }
                        ]
                    },
                    {
                        id: 'cost-2-5',
                        name: 'ค่าน้ำมันเชื้อเพลิง/ค่าผ่านทางพิเศษ',
                        pricePerUnit: 5000,
                        quantityUnits: [
                            { id: 'qu-2-5-1', quantity: 2, unit: 'ครั้ง' }
                        ]
                    },
                    {
                        id: 'cost-2-6',
                        name: 'ค่าน้ำมันเชื้อเพลิงรถเอกซเรย์ (ไป - กลับ) สำหรับคัดกรองชุมชนแออัดในกทม.',
                        pricePerUnit: 1500,
                        quantityUnits: [
                            { id: 'qu-2-6-1', quantity: 3, unit: 'ครั้ง' }
                        ]
                    },
                    {
                        id: 'cost-2-7',
                        name: 'ค่าฟิล์มวัดรังสี',
                        pricePerUnit: 1000,
                        quantityUnits: [
                            { id: 'qu-2-7-1', quantity: 1, unit: 'ครั้ง' },
                            { id: 'qu-2-7-2', quantity: 3, unit: 'คน' }
                        ]
                    }
                ]
            },
            {
                id: 'act-003',
                name: 'จ้างเหมาบริการบำรุงรักษาเครื่องเอกซเรย์ดิจิตอล',
                startDate: '2026-10-01',
                endDate: '2027-09-30',
                targetGroup: 'บุคลากรกองวัณโรค',
                status: 'not_started',
                progressReport: '',
                attachments: [],
                costItems: [
                    {
                        id: 'cost-3-1',
                        name: 'ค่าจ้างเหมาบำรุงรักษาเครื่องเอกซเรย์ดิจิทัล',
                        pricePerUnit: 92500,
                        quantityUnits: [
                            { id: 'qu-3-1-1', quantity: 2, unit: 'ครั้ง' }
                        ]
                    }
                ]
            },
            {
                id: 'act-004',
                name: 'ประชุมเพื่อติดตามงานการให้บริการและดูแลรักษาผู้ป่วยวัณโรค',
                startDate: '2026-10-01',
                endDate: '2027-09-30',
                targetGroup: 'บุคลากรกองวัณโรค',
                status: 'not_started',
                progressReport: '',
                attachments: [],
                costItems: [
                    {
                        id: 'cost-4-1',
                        name: 'ค่าอาหารกลางวัน',
                        pricePerUnit: 100,
                        quantityUnits: [
                            { id: 'qu-4-1-1', quantity: 1, unit: 'ครั้ง' },
                            { id: 'qu-4-1-2', quantity: 1, unit: 'วัน' },
                            { id: 'qu-4-1-3', quantity: 1, unit: 'มื้อ' },
                            { id: 'qu-4-1-4', quantity: 30, unit: 'คน' }
                        ]
                    },
                    {
                        id: 'cost-4-2',
                        name: 'ค่าอาหารว่างและเครื่องดื่ม',
                        pricePerUnit: 35,
                        quantityUnits: [
                            { id: 'qu-4-2-1', quantity: 1, unit: 'ครั้ง' },
                            { id: 'qu-4-2-2', quantity: 1, unit: 'วัน' },
                            { id: 'qu-4-2-3', quantity: 2, unit: 'มื้อ' },
                            { id: 'qu-4-2-4', quantity: 30, unit: 'คน' }
                        ]
                    }
                ]
            },
            {
                id: 'act-005',
                name: 'ประชุมราชการเรื่องการพัฒนาระบบบริการคลินิกวัณโรค',
                startDate: '2026-10-01',
                endDate: '2027-09-30',
                targetGroup: 'บุคลากรกองวัณโรค/เจ้าหน้าที่หน่วยบริการคลินิกวัณโรค',
                status: 'not_started',
                progressReport: '',
                attachments: [],
                costItems: [
                    {
                        id: 'cost-5-1',
                        name: 'ค่าเบี้ยเลี้ยง',
                        pricePerUnit: 240,
                        quantityUnits: [
                            { id: 'qu-5-1-1', quantity: 1, unit: 'ครั้ง' },
                            { id: 'qu-5-1-2', quantity: 1, unit: 'วัน' },
                            { id: 'qu-5-1-3', quantity: 20, unit: 'คน' }
                        ]
                    },
                    {
                        id: 'cost-5-2',
                        name: 'ค่าอาหารกลางวัน',
                        pricePerUnit: 100,
                        quantityUnits: [
                            { id: 'qu-5-2-1', quantity: 1, unit: 'ครั้ง' },
                            { id: 'qu-5-2-2', quantity: 1, unit: 'วัน' },
                            { id: 'qu-5-2-3', quantity: 1, unit: 'มื้อ' },
                            { id: 'qu-5-2-4', quantity: 20, unit: 'คน' }
                        ]
                    },
                    {
                        id: 'cost-5-3',
                        name: 'ค่าอาหารว่างและเครื่องดื่ม',
                        pricePerUnit: 35,
                        quantityUnits: [
                            { id: 'qu-5-3-1', quantity: 1, unit: 'ครั้ง' },
                            { id: 'qu-5-3-2', quantity: 1, unit: 'วัน' },
                            { id: 'qu-5-3-3', quantity: 2, unit: 'มื้อ' },
                            { id: 'qu-5-3-4', quantity: 20, unit: 'คน' }
                        ]
                    },
                     {
                        id: 'cost-5-4',
                        name: 'ค่าน้ำมันเชื้อเพลิง/ค่าผ่านทางพิเศษ',
                        pricePerUnit: 1500,
                        quantityUnits: [
                            { id: 'qu-5-4-1', quantity: 2, unit: 'ครั้ง' },
                            { id: 'qu-5-4-2', quantity: 2, unit: 'คัน' }
                        ]
                    }
                ]
            },
            {
                id: 'act-006',
                name: 'จัดพิมพ์เอกสารสื่อสิ่งพิมพ์',
                startDate: '2026-10-01',
                endDate: '2027-09-30',
                targetGroup: 'ประชาชนทั่วไป/ประชากรกลุ่มเสี่ยงและผู้ป่วยวัณโรค',
                status: 'not_started',
                progressReport: '',
                attachments: [],
                costItems: [
                     {
                        id: 'cost-6-1',
                        name: 'ค่าจัดทำเอกสารสื่อสิ่งพิมพ์',
                        pricePerUnit: 30000,
                        quantityUnits: [
                            { id: 'qu-6-1-1', quantity: 1, unit: 'ครั้ง' }
                        ]
                    }
                ]
            }
        ]
    }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const loadProjects = useCallback(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
    } else {
        setProjects(INITIAL_PROJECTS);
        localStorage.setItem('projects', JSON.stringify(INITIAL_PROJECTS));
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
        setUserInfo(JSON.parse(savedUser));
    }
    loadProjects();

    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'projects') {
            loadProjects();
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, [loadProjects]);

  const handleLoginSuccess = (user: UserInfo) => {
      setUserInfo(user);
      localStorage.setItem('userInfo', JSON.stringify(user));
      // Reload projects to ensure latest state is visible after login
      loadProjects();
  };

  const handleLogout = () => {
      setUserInfo(null);
      localStorage.removeItem('userInfo');
      setCurrentView('dashboard');
  };

  const saveProject = (project: Project, shouldRedirect: boolean = true) => {
    let updatedProjects;
    if (project.id && projects.some(p => p.id === project.id)) {
      updatedProjects = projects.map(p => p.id === project.id ? project : p);
    } else {
      updatedProjects = [...projects, { ...project, id: Date.now().toString() }];
    }
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    
    if (shouldRedirect) {
        setCurrentView('dashboard');
        setSelectedProjectId(null);
    }
  };

  const handleEditProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentView('project_form');
  };
  
  const handleViewSummary = (id: string) => {
      setSelectedProjectId(id);
      setCurrentView('summary_report');
  }

  const projectToEdit = projects.find(p => p.id === selectedProjectId) || null;

  if (!userInfo) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen bg-white font-sans">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        setSelectedProject={setSelectedProjectId}
        selectedProjectId={selectedProjectId}
        onLogout={handleLogout}
        userInfo={userInfo}
      />
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* User Profile Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm shrink-0">
             <div className="flex items-center gap-3">
                 <img 
                    src="https://i.postimg.cc/hjBBBF4J/d-sin-th-y-ngmi-di-t-ngch-x.png" 
                    alt="User Profile" 
                    className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                />
                 <div>
                    <h2 className="text-lg font-bold text-gray-800 leading-tight">ยินดีต้อนรับ</h2>
                    <p className="text-sm text-gray-500">{userInfo.workGroup}</p>
                 </div>
             </div>
             <div className="text-right hidden sm:block">
                 <p className="text-xs text-gray-400">ระบบบริหารจัดการงบดำเนินการ</p>
                 <p className="text-xs text-gray-400">กองวัณโรค</p>
             </div>
        </div>

        <div className="p-8 flex-grow">
            {currentView === 'dashboard' && (
            <Dashboard 
                projects={projects} 
                onAddProject={() => { setSelectedProjectId(null); setCurrentView('project_form'); }}
                onEditProject={handleEditProject}
                onViewSummary={handleViewSummary}
                userInfo={userInfo}
            />
            )}
            {currentView === 'project_form' && (
            <ProjectForm 
                projectToEdit={projectToEdit} 
                onSave={(p) => saveProject(p, true)} 
                onCancel={() => { setCurrentView('dashboard'); setSelectedProjectId(null); }}
                userInfo={userInfo}
            />
            )}
            {currentView === 'progress_report' && (
            <ProgressReport 
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
                onSaveReport={(p) => saveProject(p, false)}
                userInfo={userInfo}
            />
            )}
            {currentView === 'summary_report' && (
            <SummaryReport 
                projects={projects}
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
            />
            )}
        </div>
        
        <footer className="py-6 text-center text-gray-500 text-sm flex flex-row items-center justify-center gap-3 mt-auto border-t border-gray-200 bg-white">
             <img src="https://i.postimg.cc/NGHL5FQH/d-sin-th-y-ngmi-di-t-ngch-x.png" alt="Developer" className="h-10 w-10 rounded-full object-cover border border-gray-300 shadow-sm" />
             <p>พัฒนาโดย นางสาวภัทรพร สุขล้อม</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
