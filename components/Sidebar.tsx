
import React from 'react';
import type { View } from '../types';
import { ICONS } from '../constants';
import type { UserInfo } from './Login';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  setSelectedProject: (id: string | null) => void;
  selectedProjectId: string | null;
  onLogout: () => void;
  userInfo: UserInfo | null;
}

const NavItem: React.FC<{
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-700 rounded-lg transition-colors duration-200 ${
        isActive ? 'bg-sky-100 text-sky-700 font-bold' : ''
      }`}
    >
      <span dangerouslySetInnerHTML={{ __html: icon }} className="mr-3" />
      <span className="text-sm">{label}</span>
    </a>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, setSelectedProject, selectedProjectId, onLogout, userInfo }) => {
  const handleNav = (view: View) => {
    setCurrentView(view);
    setSelectedProject(null);
  };

  const isAdmin = userInfo?.workGroup.includes('Administrator');

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col print:hidden shrink-0 h-full overflow-y-auto">
      <div className="text-2xl font-bold text-gray-800 mb-8 flex items-center px-2 mt-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        <span>งบดำเนินการ</span>
      </div>
      <nav className="flex-grow space-y-1">
        <NavItem
          icon={ICONS.dashboard}
          label={isAdmin ? "โครงการทั้งหมด" : "โครงการทั้งหมด"}
          isActive={currentView === 'dashboard'}
          onClick={() => handleNav('dashboard')}
        />
        {!isAdmin && (
            <NavItem
            icon={ICONS.addProject}
            label="เพิ่มโครงการใหม่"
            isActive={currentView === 'project_form' && !selectedProjectId}
            onClick={() => handleNav('project_form')}
            />
        )}
        <NavItem
          icon={ICONS.progressReport}
          label={isAdmin ? "ผลการดำเนินงาน" : "รายงานผลการดำเนินงาน"}
          isActive={currentView === 'progress_report'}
          onClick={() => handleNav('progress_report')}
        />
        <NavItem
          icon={ICONS.summaryReport}
          label="สรุปรายงาน"
          isActive={currentView === 'summary_report'}
          onClick={() => handleNav('summary_report')}
        />
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-100">
         <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onLogout();
            }}
            className="flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200"
          >
            <span dangerouslySetInnerHTML={{ __html: ICONS.logout }} className="mr-3" />
            ออกจากระบบ
          </a>
      </div>
    </aside>
  );
};

export default Sidebar;
