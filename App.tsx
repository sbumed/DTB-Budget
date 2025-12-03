
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
                            { id: 'qu-5-4-2', quantity: 2, unit: 'อื่นๆ', customUnit: 'คัน' }
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
    // Helper to load projects from local storage
    const loadProjects = () => {
        try {
            const saved = localStorage.getItem('projects');
            if (saved) {
                const parsedProjects = JSON.parse(saved) as Project[];
                // Re-initialize attachments as empty arrays because File objects are not serializable.
                // If parsedProjects is empty array (user deleted all), we might want to keep it empty.
                // However, if it's the very first load (null saved), we use INITIAL_PROJECTS.
                if (parsedProjects.length === 0) return INITIAL_PROJECTS;

                return parsedProjects.map(project => ({
                    ...project,
                    activities: project.activities.map(activity => ({
                        ...activity,
                        attachments: [],
                        // Ensure status exists for backward compatibility
                        status: activity.status || 'not_started' 
                    })),
                }));
            }
            return INITIAL_PROJECTS;
        } catch {
            return INITIAL_PROJECTS;
        }
    };

    // Load initial state from localStorage
    const [userInfo, setUserInfo] = useState<UserInfo | null>(() => {
        try {
            const saved = localStorage.getItem('userInfo');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!userInfo);
    const [projects, setProjects] = useState<Project[]>(loadProjects);
    const [view, setView] = useState<View>('dashboard');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    // Effect to update localStorage and authentication status when userInfo changes
    useEffect(() => {
        if (userInfo) {
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            setIsAuthenticated(true);
            // Reload projects to ensure fresh data on login or keep existing
            // We don't strictly need to call loadProjects() here if projects state is already maintained,
            // but it safeguards against stale state if multiple tabs are open.
            // However, strictly resetting might lose unsaved edits if we were just toggling auth.
            // Let's trust the projects state unless it's empty.
            if (projects.length === 0) {
                 setProjects(loadProjects());
            }
        } else {
            localStorage.removeItem('userInfo');
            setIsAuthenticated(false);
        }
    }, [userInfo]);

    // Effect to update localStorage when projects change
    useEffect(() => {
        // JSON.stringify will handle File objects by turning them into {},
        // which our loading logic handles by replacing them with [].
        localStorage.setItem('projects', JSON.stringify(projects));
    }, [projects]);

    // Effect to listen for storage changes (Real-time sync across tabs)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'projects') {
                setProjects(loadProjects());
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    const handleLogin = useCallback((info: UserInfo) => {
        setUserInfo(info);
    }, []);

    const handleLogout = useCallback(() => {
        setUserInfo(null);
    }, []);

    const handleSaveProject = useCallback((project: Project) => {
        setProjects(prev => {
            const exists = prev.some(p => p.id === project.id);
            if (exists) {
                return prev.map(p => p.id === project.id ? project : p);
            }
            return [...prev, project];
        });
        setView('dashboard');
        setSelectedProjectId(null);
    }, []);

    const handleEditProject = useCallback((id: string) => {
        setSelectedProjectId(id);
        setView('project_form');
    }, []);

    const handleViewSummary = useCallback((id: string) => {
        setSelectedProjectId(id);
        setView('summary_report');
    }, []);
    
    const handleAddProject = useCallback(() => {
        setSelectedProjectId(null);
        setView('project_form');
    }, []);
    
    const handleCancelForm = useCallback(() => {
        setView('dashboard');
        setSelectedProjectId(null);
    }, []);

    const handleSaveReport = useCallback((updatedProject: Project) => {
        setProjects(prev => prev.map(p => {
            if (p.id === updatedProject.id) {
                return updatedProject;
            }
            return p;
        }));
    }, []);

    const renderView = () => {
        const projectToEdit = projects.find(p => p.id === selectedProjectId) || null;
        switch (view) {
            case 'project_form':
                return <ProjectForm projectToEdit={projectToEdit} onSave={handleSaveProject} onCancel={handleCancelForm} userInfo={userInfo} />;
            case 'progress_report':
                return <ProgressReport projects={projects} selectedProjectId={selectedProjectId} onSelectProject={setSelectedProjectId} onSaveReport={handleSaveReport} userInfo={userInfo} />;
            case 'summary_report':
                 return <SummaryReport projects={projects} selectedProjectId={selectedProjectId} onSelectProject={setSelectedProjectId} />;
            case 'dashboard':
            default:
                return <Dashboard projects={projects} onAddProject={handleAddProject} onEditProject={handleEditProject} onViewSummary={handleViewSummary} userInfo={userInfo} />;
        }
    };

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLogin} />;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100 font-sans">
            <div className="w-full bg-gray-200 print:hidden shrink-0">
                <img 
                    src="https://i.postimg.cc/Qdm127Qy/head.png" 
                    alt="Header Banner" 
                    className="w-full h-auto block shadow-sm" 
                />
            </div>
            <div className="flex flex-1 overflow-hidden relative z-0">
                <style>
                {`
                    @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-area, #print-area * {
                        visibility: visible;
                    }
                    #print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .page-break-before {
                        page-break-before: always;
                    }
                    }
                `}
                </style>
                <Sidebar currentView={view} setCurrentView={setView} setSelectedProject={setSelectedProjectId} selectedProjectId={selectedProjectId} onLogout={handleLogout} userInfo={userInfo} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <header className="flex justify-end items-center mb-8 print:hidden">
                        {userInfo && (
                            <div className="flex items-center gap-4 bg-white py-2 px-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-800">กองวัณโรค</p>
                                    <p className="text-xs text-gray-500">{userInfo.workGroup}</p>
                                </div>
                                <img 
                                    src="https://i.postimg.cc/hjBBBF4J/d-sin-th-y-ngmi-di-t-ngch-x.png" 
                                    alt="Profile" 
                                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                                />
                            </div>
                        )}
                    </header>
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;
