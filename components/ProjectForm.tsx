
import React, { useState, useEffect, useMemo } from 'react';
import type { Project, Activity, CostItem, QuantityUnitPair } from '../types';
import type { UserInfo } from './Login';
import { ICONS, formatThaiDate } from '../constants';

const UNIT_OPTIONS = ['ครั้ง', 'วัน', 'มื้อ', 'คน', 'อื่นๆ'];

interface ProjectFormProps {
  projectToEdit: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
  userInfo: UserInfo | null;
}

const CostItemRow: React.FC<{
    item: CostItem;
    onUpdate: (item: CostItem) => void;
    onRemove: () => void;
}> = ({ item, onUpdate, onRemove }) => {

    const handleQuantityUnitChange = (pairId: string, field: 'quantity' | 'unit', value: string | number) => {
        const newQuantityUnits = item.quantityUnits.map(p => {
            if (p.id === pairId) {
                const updatedPair = { ...p, [field]: field === 'quantity' ? parseFloat(value.toString()) || 0 : value };
                // If unit is changed away from 'อื่นๆ', clear the custom unit.
                if (field === 'unit' && value !== 'อื่นๆ') {
                    updatedPair.customUnit = '';
                }
                return updatedPair;
            }
            return p;
        });
        onUpdate({ ...item, quantityUnits: newQuantityUnits });
    };

    const handleCustomUnitChange = (pairId: string, value: string) => {
        const newQuantityUnits = item.quantityUnits.map(p =>
            p.id === pairId ? { ...p, customUnit: value } : p
        );
        onUpdate({ ...item, quantityUnits: newQuantityUnits });
    };


    const addQuantityUnit = () => {
        const newPair: QuantityUnitPair = { id: Date.now().toString(), quantity: 1, unit: '', customUnit: '' };
        onUpdate({ ...item, quantityUnits: [...item.quantityUnits, newPair] });
    };

    const removeQuantityUnit = (pairId: string) => {
        const newQuantityUnits = item.quantityUnits.filter(p => p.id !== pairId);
        onUpdate({ ...item, quantityUnits: newQuantityUnits });
    };

    const total = useMemo(() => {
        const totalQuantity = item.quantityUnits.reduce((prod, p) => prod * (p.quantity || 1), 1);
        return totalQuantity * (item.pricePerUnit || 0);
    }, [item.quantityUnits, item.pricePerUnit]);


    return (
        <tr className="border-b border-gray-200">
            <td className="p-2 align-top">
                <input type="text" value={item.name} onChange={e => onUpdate({...item, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"/>
            </td>
            <td className="p-2 align-top" colSpan={2}>
                <div className="space-y-2">
                    {item.quantityUnits.map((pair, index) => (
                        <div key={pair.id} className="flex items-center gap-1 flex-wrap">
                            <input type="number" value={pair.quantity} onChange={e => handleQuantityUnitChange(pair.id, 'quantity', e.target.value)} className="w-24 p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"/>
                            <select value={pair.unit} onChange={e => handleQuantityUnitChange(pair.id, 'unit', e.target.value)} className="w-28 p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900">
                                <option value="">--เลือก--</option>
                                {UNIT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                             {pair.unit === 'อื่นๆ' && (
                                <input
                                    type="text"
                                    value={pair.customUnit || ''}
                                    onChange={e => handleCustomUnitChange(pair.id, e.target.value)}
                                    placeholder="ระบุหน่วย"
                                    className="w-28 p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"
                                />
                            )}
                            {item.quantityUnits.length > 1 && (
                                <button type="button" onClick={() => removeQuantityUnit(pair.id)} className="p-1 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 12H6" /></svg>
                                </button>
                            )}
                            {index === item.quantityUnits.length - 1 && (
                                <button type="button" onClick={addQuantityUnit} className="p-1 rounded-full hover:bg-sky-100 text-sky-600 hover:text-sky-800" title="เพิ่มตัวคูณ">
                                    <span dangerouslySetInnerHTML={{ __html: ICONS.plus.replace('h-5 w-5', 'h-4 w-4') }} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </td>
            <td className="p-2 align-top">
                <input type="number" value={item.pricePerUnit} onChange={e => onUpdate({...item, pricePerUnit: parseFloat(e.target.value) || 0})} className="w-32 p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"/>
            </td>
            <td className="p-2 text-right font-semibold text-gray-800 align-top">{total.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</td>
            <td className="p-2 text-center align-top">
                <button type="button" onClick={onRemove} className="p-1 rounded-full text-red-500 hover:bg-red-100">
                    <span dangerouslySetInnerHTML={{ __html: ICONS.trash }} />
                </button>
            </td>
        </tr>
    );
};

const ActivityForm: React.FC<{
    activity: Activity;
    onUpdate: (activity: Activity) => void;
    onRemove: () => void;
    index: number;
}> = ({ activity, onUpdate, onRemove, index }) => {

    const handleCostItemUpdate = (updatedItem: CostItem) => {
        onUpdate({
            ...activity,
            costItems: activity.costItems.map(item => item.id === updatedItem.id ? updatedItem : item)
        });
    };

    const addCostItem = () => {
        const newItem: CostItem = {
            id: Date.now().toString(),
            name: '',
            quantityUnits: [{ id: Date.now().toString() + '_qu', quantity: 1, unit: '', customUnit: '' }],
            pricePerUnit: 0,
        };
        onUpdate({...activity, costItems: [...activity.costItems, newItem]});
    };

    const removeCostItem = (id: string) => {
        onUpdate({...activity, costItems: activity.costItems.filter(item => item.id !== id)});
    };
    
    const activityTotal = useMemo(() => {
        return activity.costItems.reduce((sum, item) => {
             const totalQuantity = item.quantityUnits.reduce((prod, p) => prod * (p.quantity || 1), 1);
             const itemTotal = totalQuantity * (item.pricePerUnit || 0);
            return sum + itemTotal;
        }, 0);
    }, [activity.costItems]);

    return (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">กิจกรรมที่ {index + 1}</h3>
                {index > 0 && (
                     <button type="button" onClick={onRemove} className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1 p-2 rounded-lg hover:bg-red-50">
                        <span dangerouslySetInnerHTML={{ __html: ICONS.trash }} />
                        ลบกิจกรรมนี้
                    </button>
                )}
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อกิจกรรม</label>
                    <input type="text" value={activity.name} onChange={e => onUpdate({...activity, name: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900" required/>
                </div>
                
                {/* Date Inputs */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">วันที่เริ่มต้น</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="date" 
                            value={activity.startDate} 
                            onChange={e => onUpdate({...activity, startDate: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"
                        />
                    </div>
                    {activity.startDate && (
                         <p className="text-sm text-sky-700 mt-1 font-medium">
                            {formatThaiDate(activity.startDate)}
                        </p>
                    )}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สิ้นสุด</label>
                    <div className="flex items-center gap-2">
                        <input 
                            type="date" 
                            value={activity.endDate} 
                            onChange={e => onUpdate({...activity, endDate: e.target.value})}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"
                        />
                    </div>
                     {activity.endDate && (
                         <p className="text-sm text-sky-700 mt-1 font-medium">
                            {formatThaiDate(activity.endDate)}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">กลุ่มเป้าหมาย</label>
                    <input type="text" value={activity.targetGroup} onChange={e => onUpdate({...activity, targetGroup: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900"/>
                </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-700 mt-6 mb-2">ประมาณการค่าใช้จ่าย</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="p-2 text-left font-medium border-b border-gray-300 w-2/5">รายการ</th>
                            <th className="p-2 text-left font-medium border-b border-gray-300" colSpan={2}>จำนวน/หน่วย</th>
                            <th className="p-2 text-left font-medium border-b border-gray-300">ราคาต่อหน่วย (บาท)</th>
                            <th className="p-2 text-right font-medium border-b border-gray-300">รวม</th>
                            <th className="p-2 text-center font-medium border-b border-gray-300">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activity.costItems.map(item => (
                            <CostItemRow key={item.id} item={item} onUpdate={handleCostItemUpdate} onRemove={() => removeCostItem(item.id)} />
                        ))}
                    </tbody>
                </table>
            </div>
             <button type="button" onClick={addCostItem} className="mt-4 flex items-center gap-2 text-sky-700 hover:text-sky-900 font-medium py-2 px-3 rounded-lg hover:bg-sky-50 transition-colors">
                <span dangerouslySetInnerHTML={{ __html: ICONS.plus }} />
                เพิ่มรายการค่าใช้จ่าย
            </button>
            <div className="text-right mt-4 font-bold text-lg text-gray-800">
                ยอดรวมของกิจกรรม: {activityTotal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท
            </div>
        </div>
    );
};

const ProjectForm: React.FC<ProjectFormProps> = ({ projectToEdit, onSave, onCancel, userInfo }) => {
    const [project, setProject] = useState<Project>(
        projectToEdit || {
            id: '',
            name: '',
            activities: [],
            department: userInfo?.workGroup || '',
        }
    );
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        if (projectToEdit) {
            setProject(projectToEdit);
        } else {
            resetForm();
        }
    }, [projectToEdit]);

    const resetForm = () => {
        setProject({
            id: '',
            name: '',
            department: userInfo?.workGroup || '',
            activities: [{
                id: Date.now().toString(),
                name: '',
                startDate: '',
                endDate: '',
                targetGroup: '',
                costItems: [],
                progressReport: '',
                attachments: [],
                status: 'not_started',
            }],
        });
    }

    const handleActivityUpdate = (updatedActivity: Activity) => {
        setProject({
            ...project,
            activities: project.activities.map(act => act.id === updatedActivity.id ? updatedActivity : act)
        });
    };

    const addActivity = () => {
        const newActivity: Activity = {
            id: Date.now().toString(),
            name: '',
            startDate: '',
            endDate: '',
            targetGroup: '',
            costItems: [],
            progressReport: '',
            attachments: [],
            status: 'not_started',
        };
        setProject({...project, activities: [...project.activities, newActivity]});
    };
    
    const removeActivity = (id: string) => {
        setProject({...project, activities: project.activities.filter(act => act.id !== id)});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    const handleConfirmSave = () => {
        const projectToSave = { ...project, id: project.id || Date.now().toString() };
        if (!projectToSave.department && userInfo) {
            projectToSave.department = userInfo.workGroup;
        }
        onSave(projectToSave);
        setShowConfirmModal(false);
    };

    const totalProjectCost = useMemo(() => {
        return project.activities.reduce((total, activity) => {
            const activityTotal = activity.costItems.reduce((sum, item) => {
                const totalQuantity = item.quantityUnits.reduce((prod, p) => prod * (p.quantity || 1), 1);
                const itemTotal = totalQuantity * (item.pricePerUnit || 0);
                return sum + itemTotal;
            }, 0);
            return total + activityTotal;
        }, 0);
    }, [project.activities]);

    return (
        <div className="p-8 bg-white rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{projectToEdit ? 'แก้ไขโครงการ' : 'สร้างโครงการใหม่'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="projectName" className="block text-lg font-medium text-gray-700 mb-2">ชื่อโครงการ</label>
                    <input 
                        type="text" 
                        id="projectName" 
                        value={project.name} 
                        onChange={e => setProject({...project, name: e.target.value})} 
                        className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-gray-500 focus:border-gray-500 bg-white text-gray-900" 
                        required
                    />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">กิจกรรม</h3>
                <div className="space-y-8">
                    {project.activities.map((activity, index) => (
                        <ActivityForm 
                            key={activity.id} 
                            activity={activity} 
                            onUpdate={handleActivityUpdate} 
                            onRemove={() => removeActivity(activity.id)}
                            index={index}
                        />
                    ))}
                </div>

                <button type="button" onClick={addActivity} className="w-full flex justify-center items-center gap-2 text-sky-700 hover:text-sky-900 font-bold py-3 px-4 rounded-lg border-2 border-dashed border-sky-400 hover:bg-sky-50 transition-colors my-8">
                    <span dangerouslySetInnerHTML={{ __html: ICONS.plus }} />
                    เพิ่มกิจกรรม
                </button>

                <div className="bg-sky-100 text-sky-900 p-6 rounded-lg text-right mb-8 border border-sky-200">
                    <span className="text-2xl font-bold">ยอดรวมทั้งโครงการ:</span>
                    <span className="text-3xl font-bold ml-4">{totalProjectCost.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</span>
                </div>

                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="py-3 px-6 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">ยกเลิก</button>
                    <button type="submit" className="py-3 px-8 bg-sky-300 text-sky-900 font-bold rounded-lg hover:bg-sky-400 transition-colors shadow-md">บันทึกโครงการ</button>
                </div>
            </form>

            {showConfirmModal && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-modal-title"
                >
                    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full m-4">
                        <h3 id="confirm-modal-title" className="text-2xl font-bold text-gray-800 mb-4">ยืนยันการบันทึก</h3>
                        <p className="text-gray-600 mb-8">คุณแน่ใจว่าต้องการบันทึกการเปลี่ยนแปลงสำหรับโครงการนี้?</p>
                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={() => setShowConfirmModal(false)} className="py-2 px-6 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                                ยกเลิก
                            </button>
                            <button type="button" onClick={handleConfirmSave} className="py-2 px-6 bg-sky-300 text-sky-900 font-bold rounded-lg hover:bg-sky-400 transition-colors shadow-md">
                                ยืนยันการบันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectForm;
