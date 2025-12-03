
export interface QuantityUnitPair {
  id: string;
  quantity: number;
  unit: string;
  customUnit?: string;
}

export interface CostItem {
  id:string;
  name: string;
  quantityUnits: QuantityUnitPair[];
  pricePerUnit: number;
}

export type ActivityStatus = 'not_started' | 'in_progress' | 'completed';

export interface Activity {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  targetGroup: string;
  costItems: CostItem[];
  progressReport: string;
  attachments: File[];
  status: ActivityStatus;
}

export interface Project {
  id: string;
  name: string;
  department?: string; // Work group that owns the project
  activities: Activity[];
}

export type View = 'dashboard' | 'project_form' | 'progress_report' | 'summary_report';
