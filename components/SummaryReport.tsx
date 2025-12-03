
import React, { useState, useEffect } from 'react';
import type { Project, Activity, ActivityStatus } from '../types';
import { ICONS, formatThaiDate } from '../constants';

declare const html2canvas: any;
declare const jspdf: any;

interface SummaryReportProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
}

const STATUS_LABELS: Record<ActivityStatus, { label: string; color: string }> = {
    'not_started': { label: 'ยังไม่ได้ดำเนินการ', color: 'bg-red-100 text-red-800 border-red-200' },
    'in_progress': { label: 'กำลังดำเนินการ', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    'completed': { label: 'เสร็จสิ้น', color: 'bg-green-100 text-green-800 border-green-200' },
};

const SummaryReport: React.FC<SummaryReportProps> = ({ projects, selectedProjectId, onSelectProject }) => {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(selectedProjectId);

  // Update expanded state if selectedProjectId changes (e.g. coming from Dashboard)
  useEffect(() => {
    if (selectedProjectId) {
        setExpandedProjectId(selectedProjectId);
    }
  }, [selectedProjectId]);

  const toggleExpand = (projectId: string) => {
      setExpandedProjectId(curr => curr === projectId ? null : projectId);
  };

  const getProjectCost = (project: Project) => {
      return project.activities.reduce((total, activity) => {
        const activityTotal = activity.costItems.reduce((sum, item) => {
            const totalQuantity = item.quantityUnits.reduce((prod, p) => prod * (p.quantity || 1), 1);
            const itemTotal = totalQuantity * (item.pricePerUnit || 0);
            return sum + itemTotal;
        }, 0);
        return total + activityTotal;
    }, 0);
  };

  const handleDownloadPdf = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation(); // Prevent row expansion when clicking download
    const { jsPDF } = jspdf;
    
    const input = document.getElementById(`print-area-${project.id}`);
    if (!input) {
        console.error("Element not found", `print-area-${project.id}`);
        return;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageMargin = 10;
    const contentWidth = pdfWidth - (pageMargin * 2);

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas: any) => {
        const imgData = canvas.toDataURL('image/png');
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight() - (pageMargin * 2);

        pdf.addImage(imgData, 'PNG', pageMargin, pageMargin, contentWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', pageMargin, position + pageMargin, contentWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`รายงานโครงการ-${project.name}.pdf`);
    });
  };

  // Filter projects if one is selected via props, otherwise show all
  const displayProjects = selectedProjectId 
    ? projects.filter(p => p.id === selectedProjectId)
    : projects;

  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg min-h-[80vh]">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h2 className="text-3xl font-bold text-gray-800">สรุปรายงานและติดตามผลการดำเนินงาน</h2>
        {selectedProjectId && (
            <button onClick={() => onSelectProject('')} className="text-sm text-sky-600 hover:underline">
                แสดงทั้งหมด
            </button>
        )}
      </div>

      {/* Print Templates (Hidden) */}
      <div className="fixed top-0 left-[-9999px] w-[800px] z-[-1]">
         {projects.map((project) => (
             <div key={`print-${project.id}`} id={`print-area-${project.id}`} className="bg-white p-12 mb-8">
                <div className="border-b-2 border-gray-300 pb-4 mb-6">
                    <h1 className="text-3xl font-bold text-center text-gray-800">รายงานผลการดำเนินงานโครงการ</h1>
                    <h3 className="text-xl font-bold text-center text-gray-800 mt-2">{project.name}</h3>
                    <p className="text-center text-gray-600 mt-1">{project.department && `หน่วยงาน: ${project.department}`}</p>
                </div>

                {project.activities.map((activity, index) => {
                    const status = STATUS_LABELS[activity.status || 'not_started'];
                    return (
                    <div key={activity.id} className="mb-8 break-inside-avoid">
                        <div className="flex justify-between items-center bg-gray-100 p-3 rounded-t-lg border-b-2 border-gray-200">
                            <h4 className="text-lg font-bold text-gray-900">กิจกรรมที่ {index + 1}: {activity.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full border ${status.color}`}>{status.label}</span>
                        </div>
                        <div className="bg-white p-4 rounded-b-lg border border-t-0 border-gray-200">
                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-800">
                                <p><strong>ระยะเวลา:</strong> {formatThaiDate(activity.startDate)} ถึง {formatThaiDate(activity.endDate)}</p>
                                <p><strong>กลุ่มเป้าหมาย:</strong> {activity.targetGroup}</p>
                            </div>
                            <h5 className="font-semibold text-gray-800 mb-2 text-sm">รายละเอียดค่าใช้จ่าย</h5>
                            <table className="w-full text-xs text-gray-800 mb-4">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-2 text-left font-medium border-b">รายการ</th>
                                        <th className="p-2 text-left font-medium border-b">จำนวน/หน่วย</th>
                                        <th className="p-2 text-right font-medium border-b">ราคา/หน่วย</th>
                                        <th className="p-2 text-right font-medium border-b">รวม</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.costItems.map(item => {
                                        const totalQuantity = item.quantityUnits.reduce((prod, p) => prod * (p.quantity || 1), 1);
                                        const itemTotal = totalQuantity * (item.pricePerUnit || 0);
                                        return (
                                        <tr key={item.id} className="border-b">
                                            <td className="p-2">{item.name}</td>
                                            <td className="p-2 text-left">{item.quantityUnits.map(p => `${p.quantity.toLocaleString()} ${p.unit === 'อื่นๆ' ? p.customUnit || '' : p.unit}`).join(' x ')}</td>
                                            <td className="p-2 text-right">{item.pricePerUnit.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                            <td className="p-2 text-right font-semibold">{itemTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                <h5 className="font-semibold text-gray-800 text-sm">ความก้าวหน้า/ผลการดำเนินงาน</h5>
                                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{activity.progressReport || 'ยังไม่มีการรายงานผล'}</p>
                            </div>
                        </div>
                    </div>
                )})}
                <div className="bg-gray-200 text-gray-900 p-4 rounded-lg text-right mt-8 border border-gray-300">
                    <span className="text-xl font-bold">ยอดรวมงบประมาณ: {getProjectCost(project).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
                </div>
             </div>
         ))}
      </div>

      {/* Main Table View */}
      {displayProjects.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-10"></th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ชื่อโครงการ</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">หน่วยงาน</th>
                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">งบประมาณ</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">กิจกรรม</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">เอกสาร</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {displayProjects.map((project) => {
                        const isExpanded = expandedProjectId === project.id;
                        const totalCost = getProjectCost(project);
                        
                        return (
                            <React.Fragment key={project.id}>
                                <tr 
                                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${isExpanded ? 'bg-sky-50/50' : ''}`}
                                    onClick={() => toggleExpand(project.id)}
                                >
                                    <td className="px-6 py-4 text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-gray-900">{project.name}</div>
                                        <div className="text-xs text-gray-500 mt-1 md:hidden">{project.department}</div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="text-sm text-gray-600">{project.department || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-sm font-bold text-sky-700">{totalCost.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {project.activities.length}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={(e) => handleDownloadPdf(e, project)}
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                                        >
                                            <span dangerouslySetInnerHTML={{__html: ICONS.print.replace('h-5 w-5 mr-2', 'h-4 w-4 mr-1')}} />
                                            Export PDF
                                        </button>
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={6} className="px-4 py-4 sm:px-6">
                                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-inner">
                                                <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700 text-sm">
                                                    รายละเอียดกิจกรรมและความคืบหน้า
                                                </div>
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">กิจกรรม</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ระยะเวลา</th>
                                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">งบประมาณ (บาท)</th>
                                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">ผลการดำเนินงานล่าสุด</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {project.activities.length > 0 ? project.activities.map((act) => {
                                                             const actCost = act.costItems.reduce((s, i) => s + (i.quantityUnits.reduce((p, qu) => p * (qu.quantity || 1), 1) * i.pricePerUnit), 0);
                                                             const status = STATUS_LABELS[act.status || 'not_started'];
                                                             return (
                                                                <tr key={act.id}>
                                                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium align-top">{act.name}</td>
                                                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap align-top">
                                                                        {formatThaiDate(act.startDate)}<br/>ถึง {formatThaiDate(act.endDate)}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-900 text-right align-top">{actCost.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                                    <td className="px-4 py-3 text-center align-top">
                                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-4 rounded-full border ${status.color}`}>
                                                                            {status.label}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-sm text-gray-600 align-top">
                                                                        <div className="line-clamp-2">{act.progressReport || '-'}</div>
                                                                    </td>
                                                                </tr>
                                                             )
                                                        }) : (
                                                            <tr>
                                                                <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500 italic">ไม่มีข้อมูลกิจกรรม</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
      ) : (
         <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">ไม่พบข้อมูลโครงการ</p>
        </div>
      )}
    </div>
  );
};

export default SummaryReport;
