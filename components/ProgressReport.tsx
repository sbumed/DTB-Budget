
import React, { useState } from 'react';
import type { Project, Activity, ActivityStatus } from '../types';
import { ICONS, formatThaiDate, MISSION_GROUPS } from '../constants';
import type { UserInfo } from './Login';

interface ProgressReportProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onSaveReport: (project: Project) => void;
  userInfo: UserInfo | null;
}

const STATUS_OPTIONS: { value: ActivityStatus; label: string; colorClass: string; icon: string }[] = [
    { 
        value: 'not_started', 
        label: 'ยังไม่ได้ดำเนินการ', 
        colorClass: 'text-red-600 border-red-200 focus:ring-red-500',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    },
    { 
        value: 'in_progress', 
        label: 'กำลังดำเนินการ', 
        colorClass: 'text-amber-600 border-amber-200 focus:ring-amber-500',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    },
    { 
        value: 'completed', 
        label: 'เสร็จสิ้น', 
        colorClass: 'text-green-600 border-green-200 focus:ring-green-500',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`
    },
];

const ActivityDetailModal: React.FC<{
    activity: Activity;
    projectName: string;
    onClose: () => void;
    onSave: (updatedActivity: Activity) => void;
}> = ({ activity, projectName, onClose, onSave }) => {
    const [tempActivity, setTempActivity] = useState<Activity>(activity);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
          const newFiles = Array.from(event.target.files);
          const currentAttachments = tempActivity.attachments || [];
          setTempActivity({ ...tempActivity, attachments: [...currentAttachments, ...newFiles] });
        }
    };
      
    const removeAttachment = (fileName: string) => {
        setTempActivity({ ...tempActivity, attachments: tempActivity.attachments.filter(f => f.name !== fileName) });
    };

    const handleSave = () => {
        onSave(tempActivity);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">รายละเอียดกิจกรรม</h3>
                        <p className="text-sm text-gray-500">{projectName} &gt; {activity.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                     <div className="mb-4">
                        <label className="block text-lg font-medium text-gray-700 mb-2">ความก้าวหน้าของการดำเนินงาน</label>
                        <textarea
                            rows={6}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
                            value={tempActivity.progressReport}
                            onChange={e => setTempActivity({ ...tempActivity, progressReport: e.target.value })}
                            placeholder="กรอกรายละเอียดความก้าวหน้า..."
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">แนบไฟล์</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-700">
                                        <span>อัปโหลดไฟล์</span>
                                        <input type="file" className="sr-only" multiple onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>
                        </div>
                        {tempActivity.attachments && tempActivity.attachments.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold text-gray-700 text-sm">ไฟล์ที่แนบ:</h4>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    {tempActivity.attachments.map((file, fileIndex) => (
                                        <li key={fileIndex} className="text-sm text-gray-600 flex justify-between items-center">
                                            <span>{file.name}</span>
                                            <button type="button" onClick={() => removeAttachment(file.name)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                                                <span dangerouslySetInnerHTML={{ __html: ICONS.trash }} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">ยกเลิก</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-sky-300 text-sky-900 rounded-lg hover:bg-sky-400 shadow-sm font-bold">บันทึก</button>
                </div>
            </div>
        </div>
    );
};

const ProjectActivitiesTable: React.FC<{
    project: Project;
    onStatusChange: (projectId: string, activityId: string, newStatus: ActivityStatus) => void;
    openEditModal: (projectId: string, activityId: string) => void;
    isAdmin: boolean;
}> = ({ project, onStatusChange, openEditModal, isAdmin }) => {
    if (project.activities.length === 0) {
        return (
            <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                    {project.department && <p className="text-sm text-gray-500 mt-1">{project.department}</p>}
                </div>
                <div className="p-6 text-center text-gray-500">ไม่มีกิจกรรมในโครงการนี้</div>
            </div>
        )
    }

    return (
        <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
                {project.department && <p className="text-sm text-gray-500 mt-1">{project.department}</p>}
            </div>
            <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-5/12">ชื่อกิจกรรม</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ระยะเวลา</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">งบประมาณ (บาท)</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">สถานะ</th>
                            {!isAdmin && <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">จัดการ</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {project.activities.map((item) => {
                            const currentStatus = STATUS_OPTIONS.find(s => s.value === (item.status || 'not_started')) || STATUS_OPTIONS[0];
                            const activityCost = item.costItems.reduce((sum, cItem) => {
                                const totalQuantity = cItem.quantityUnits.reduce((prod, p) => prod * (p.quantity || 1), 1);
                                return sum + (totalQuantity * (cItem.pricePerUnit || 0));
                            }, 0);

                            return (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 align-top">
                                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                        {item.progressReport && (
                                            <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                                {item.progressReport}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-top">
                                        {formatThaiDate(item.startDate)} - {formatThaiDate(item.endDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 align-top text-right">
                                        {activityCost.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center align-top">
                                        <div className="relative inline-block text-left">
                                            <select
                                                value={item.status || 'not_started'}
                                                onChange={(e) => onStatusChange(project.id, item.id, e.target.value as ActivityStatus)}
                                                disabled={isAdmin}
                                                className={`bg-white text-sm rounded-full pl-8 pr-8 py-1.5 font-medium appearance-none border focus:outline-none focus:ring-2 focus:ring-offset-1 ${currentStatus.colorClass} ${isAdmin ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                                    backgroundPosition: 'right 0.5rem center',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: '1.5em 1.5em'
                                                }}
                                            >
                                                {STATUS_OPTIONS.map(opt => (
                                                    <option key={opt.value} value={opt.value} className="text-gray-900">{opt.label}</option>
                                                ))}
                                            </select>
                                            <div className={`absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${currentStatus.colorClass.split(' ')[0]}`} 
                                                 dangerouslySetInnerHTML={{ __html: currentStatus.icon.replace('h-5 w-5', 'h-4 w-4') }} 
                                            />
                                        </div>
                                    </td>
                                    {!isAdmin && (
                                        <td className="px-6 py-4 whitespace-nowrap text-center align-top">
                                            <button 
                                                onClick={() => openEditModal(project.id, item.id)}
                                                className="inline-flex items-center px-3 py-1.5 border border-sky-600 text-xs font-medium rounded-md text-sky-600 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                            >
                                                <span dangerouslySetInnerHTML={{__html: ICONS.edit.replace('h-5 w-5', 'h-4 w-4 mr-1')}} />
                                                รายละเอียด
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const ProgressReport: React.FC<ProgressReportProps> = ({ projects, onSaveReport, userInfo }) => {
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const handleStatusChange = (projectId: string, activityId: string, newStatus: ActivityStatus) => {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      const updatedProject = {
          ...project,
          activities: project.activities.map(a => 
            a.id === activityId ? { ...a, status: newStatus } : a
          )
      };
      onSaveReport(updatedProject);
  };

  const handleDetailSave = (updatedActivity: Activity) => {
      if (!editingProjectId) return;
      const project = projects.find(p => p.id === editingProjectId);
      if (!project) return;

      const updatedProject = {
          ...project,
          activities: project.activities.map(a => 
            a.id === updatedActivity.id ? updatedActivity : a
          )
      };
      onSaveReport(updatedProject);
  };

  const openEditModal = (projectId: string, activityId: string) => {
      setEditingProjectId(projectId);
      setEditingActivityId(activityId);
  };

  const isAdmin = userInfo?.workGroup.includes('Administrator') || false;

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg min-h-[80vh]">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {isAdmin ? "ผลการดำเนินงาน" : "รายงานผลการดำเนินงาน"}
      </h2>
      
      {projects.length > 0 ? (
        <>
            {isAdmin ? (
                 <div className="space-y-8">
                    {Object.entries(MISSION_GROUPS).map(([missionGroup, workGroups]) => {
                         const projectsInMission = projects.filter(p => 
                            p.department && workGroups.includes(p.department)
                        );
                        if (projectsInMission.length === 0) return null;

                        return (
                             <div key={missionGroup} className="bg-gray-50 rounded-2xl border border-gray-200 p-4 md:p-6">
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
                                            {workGroupProjects.map(project => (
                                                <ProjectActivitiesTable 
                                                    key={project.id}
                                                    project={project}
                                                    onStatusChange={handleStatusChange}
                                                    openEditModal={openEditModal}
                                                    isAdmin={isAdmin}
                                                />
                                            ))}
                                        </div>
                                    );
                                })}
                             </div>
                        )
                    })}
                    {/* Other projects */}
                     {projects.some(p => !p.department || !Object.values(MISSION_GROUPS).flat().includes(p.department)) && (
                         <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 md:p-6">
                            <h3 className="text-xl font-bold text-gray-600 mb-4 border-b border-gray-200 pb-2">อื่นๆ / ไม่ระบุหน่วยงาน</h3>
                             {projects.filter(p => !p.department || !Object.values(MISSION_GROUPS).flat().includes(p.department)).map(project => (
                                <ProjectActivitiesTable 
                                    key={project.id}
                                    project={project}
                                    onStatusChange={handleStatusChange}
                                    openEditModal={openEditModal}
                                    isAdmin={isAdmin}
                                />
                             ))}
                         </div>
                    )}
                 </div>
            ) : (
                <div>
                    {projects.map(project => (
                        <ProjectActivitiesTable 
                            key={project.id}
                            project={project}
                            onStatusChange={handleStatusChange}
                            openEditModal={openEditModal}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
            )}
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">ยังไม่มีโครงการ</p>
        </div>
      )}

      {editingActivityId && editingProjectId && (
          <ActivityDetailModal 
            activity={projects.find(p => p.id === editingProjectId)!.activities.find(a => a.id === editingActivityId)!}
            projectName={projects.find(p => p.id === editingProjectId)!.name}
            onClose={() => { setEditingActivityId(null); setEditingProjectId(null); }}
            onSave={handleDetailSave}
          />
      )}
    </div>
  );
};

export default ProgressReport;
