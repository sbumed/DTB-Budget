
import React, { useState } from 'react';
import type { Project } from '../types';
import { ICONS, formatThaiDate, MISSION_GROUPS } from '../constants';
import type { UserInfo } from './Login';

interface DashboardProps {
  projects: Project[];
  onAddProject: () => void;
  onEditProject: (id: string) => void;
  onViewSummary: (id: string) => void;
  userInfo: UserInfo | null;
}

const ProjectTable: React.FC<{
    projects: Project[];
    expandedProjectIds: Set<string>;
    toggleExpand: (id: string) => void;
    onViewSummary: (id: string) => void;
    onEditProject: (id: string) => void;
    isAdmin: boolean;
}> = ({ projects, expandedProjectIds, toggleExpand, onViewSummary, onEditProject, isAdmin }) => {
    
    const getProjectTotal = (project: Project) => {
         return project.activities.reduce((total, activity) => {
            return total + activity.costItems.reduce((sum, item) => {
                const totalQuantity = item.quantityUnits.reduce((prod, p) => prod * (p.quantity || 1), 1);
                const itemTotal = totalQuantity * (item.pricePerUnit || 0);
                return sum + itemTotal;
            }, 0);
        }, 0);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12"></th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">ชื่อโครงการ</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">กลุ่มงาน/ผู้รับผิดชอบ</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนกิจกรรม</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">งบประมาณ (บาท)</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {projects.map((p) => {
                            const isExpanded = expandedProjectIds.has(p.id);
                            return (
                            <React.Fragment key={p.id}>
                                <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-gray-50' : ''}`}>
                                    <td className="px-6 py-4 text-center cursor-pointer" onClick={() => toggleExpand(p.id)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => toggleExpand(p.id)}>
                                        <div className="text-sm font-bold text-gray-900 break-words">{p.name}</div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell cursor-pointer" onClick={() => toggleExpand(p.id)}>
                                        <div className="text-sm text-gray-600">{p.department || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {p.activities.length}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-sm font-bold text-sky-700">
                                            {getProjectTotal(p).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm font-medium whitespace-nowrap">
                                        <button onClick={() => onViewSummary(p.id)} className="text-sky-600 hover:text-sky-900 mr-4 inline-flex items-center" title="ดูสรุป/ส่งออก">
                                            <span dangerouslySetInnerHTML={{ __html: ICONS.summaryReport.replace('h-6 w-6', 'h-5 w-5 mr-1') }} />
                                            <span className="hidden sm:inline">ดูสรุป</span>
                                        </button>
                                        {!isAdmin && (
                                            <button onClick={() => onEditProject(p.id)} className="text-amber-600 hover:text-amber-900 inline-flex items-center" title="แก้ไขโครงการ">
                                                <span dangerouslySetInnerHTML={{ __html: ICONS.edit.replace('h-5 w-5', 'h-5 w-5 mr-1') }} />
                                                <span className="hidden sm:inline">แก้ไข</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={6} className="px-6 py-4">
                                            <div className="ml-8 border-l-2 border-gray-200 pl-4">
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">รายการกิจกรรม</h4>
                                                {p.activities.length > 0 ? (
                                                    <table className="min-w-full text-sm">
                                                        <thead className="text-gray-500 border-b border-gray-200">
                                                            <tr>
                                                                <th className="pb-2 text-left font-medium">ชื่อกิจกรรม</th>
                                                                <th className="pb-2 text-left font-medium">ระยะเวลา</th>
                                                                <th className="pb-2 text-right font-medium">งบประมาณ (บาท)</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {p.activities.map((act) => {
                                                                 const activityCost = act.costItems.reduce((sum, item) => {
                                                                    const totalQuantity = item.quantityUnits.reduce((prod, p) => prod * (p.quantity || 1), 1);
                                                                    return sum + (totalQuantity * (item.pricePerUnit || 0));
                                                                }, 0);
                                                                return (
                                                                    <tr key={act.id} className="border-b border-gray-100 last:border-0">
                                                                        <td className="py-2 pr-4 text-black">{act.name}</td>
                                                                        <td className="py-2 pr-4 text-gray-600">
                                                                            {formatThaiDate(act.startDate)} - {formatThaiDate(act.endDate)}
                                                                        </td>
                                                                        <td className="py-2 text-right font-medium text-gray-700">
                                                                            {activityCost.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p className="text-sm text-gray-400 italic">ไม่มีกิจกรรมในโครงการนี้</p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )})}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onAddProject, onEditProject, onViewSummary, userInfo }) => {
    const [expandedProjectIds, setExpandedProjectIds] = useState<Set<string>>(new Set());

    const toggleExpand = (projectId: string) => {
        const newSet = new Set(expandedProjectIds);
        if (newSet.has(projectId)) {
            newSet.delete(projectId);
        } else {
            newSet.add(projectId);
        }
        setExpandedProjectIds(newSet);
    };

    const grandTotal = projects.reduce((total, project) => {
        const projectCost = project.activities.reduce((projectTotal, activity) => {
            const activityTotal = activity.costItems.reduce((activitySum, item) => {
                const totalQuantity = item.quantityUnits.reduce((prod, p) => prod * (p.quantity || 1), 1);
                const itemTotal = totalQuantity * (item.pricePerUnit || 0);
                return activitySum + itemTotal;
            }, 0);
            return projectTotal + activityTotal;
        }, 0);
        return total + projectCost;
    }, 0);

    const isAdmin = userInfo?.workGroup.includes('Administrator') || false;

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">
            {isAdmin ? "โครงการทั้งหมด" : "โครงการทั้งหมด"}
        </h2>
        {!isAdmin && (
            <button onClick={onAddProject} className="flex items-center gap-2 bg-sky-300 text-sky-900 font-bold py-3 px-5 rounded-lg hover:bg-sky-400 transition-colors shadow-md">
                <span dangerouslySetInnerHTML={{__html: ICONS.plus}} />
                <span>สร้างโครงการใหม่</span>
            </button>
        )}
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-sky-50 p-6 rounded-xl border border-sky-100 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">จำนวนโครงการทั้งหมด</p>
                <p className="text-3xl font-bold text-sky-800">{projects.length}</p>
            </div>
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">งบประมาณรวมทุกโครงการ</p>
                <p className="text-3xl font-bold text-emerald-800">{grandTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</p>
            </div>
        </div>

      {projects.length > 0 ? (
        <>
            {isAdmin ? (
                <div className="space-y-8">
                    {Object.entries(MISSION_GROUPS).map(([missionGroup, workGroups]) => {
                        // Check if any projects exist in this mission group
                        const projectsInMission = projects.filter(p => 
                            p.department && workGroups.includes(p.department)
                        );
                        
                        if (projectsInMission.length === 0) return null;

                        return (
                            <div key={missionGroup} className="bg-gray-50/50 rounded-2xl border border-gray-200 p-4 md:p-6">
                                <h3 className="text-xl font-bold text-sky-800 mb-4 border-b border-sky-200 pb-2">{missionGroup}</h3>
                                {workGroups.map(workGroup => {
                                    const workGroupProjects = projects.filter(p => p.department === workGroup);
                                    if (workGroupProjects.length === 0) return null;

                                    return (
                                        <div key={workGroup} className="mb-6 last:mb-0 ml-2 md:ml-4">
                                            <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                                                <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                                                {workGroup}
                                            </h4>
                                            <ProjectTable 
                                                projects={workGroupProjects}
                                                expandedProjectIds={expandedProjectIds}
                                                toggleExpand={toggleExpand}
                                                onViewSummary={onViewSummary}
                                                onEditProject={onEditProject}
                                                isAdmin={isAdmin}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                    {/* Handle projects with no department or unmatched department */}
                    {projects.some(p => !p.department || !Object.values(MISSION_GROUPS).flat().includes(p.department)) && (
                         <div className="bg-gray-50/50 rounded-2xl border border-gray-200 p-4 md:p-6">
                            <h3 className="text-xl font-bold text-gray-600 mb-4 border-b border-gray-200 pb-2">อื่นๆ / ไม่ระบุหน่วยงาน</h3>
                            <ProjectTable 
                                projects={projects.filter(p => !p.department || !Object.values(MISSION_GROUPS).flat().includes(p.department))}
                                expandedProjectIds={expandedProjectIds}
                                toggleExpand={toggleExpand}
                                onViewSummary={onViewSummary}
                                onEditProject={onEditProject}
                                isAdmin={isAdmin}
                            />
                         </div>
                    )}
                </div>
            ) : (
                <ProjectTable 
                    projects={projects}
                    expandedProjectIds={expandedProjectIds}
                    toggleExpand={toggleExpand}
                    onViewSummary={onViewSummary}
                    onEditProject={onEditProject}
                    isAdmin={isAdmin}
                />
            )}
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div
                className="mx-auto h-12 w-12 text-gray-400"
                dangerouslySetInnerHTML={{__html: ICONS.addProject.replace('h-6 w-6', 'h-12 w-12')}}
            />
            <h3 className="mt-2 text-sm font-medium text-gray-900">ยังไม่มีโครงการ</h3>
            {!isAdmin && (
                <>
                    <p className="mt-1 text-sm text-gray-500">เริ่มต้นโดยการสร้างโครงการใหม่</p>
                    <div className="mt-6">
                        <button
                            type="button"
                            onClick={onAddProject}
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-sky-900 bg-sky-300 hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                        >
                            <span className="mr-2" dangerouslySetInnerHTML={{__html: ICONS.plus}} />
                            สร้างโครงการใหม่
                        </button>
                    </div>
                </>
            )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
