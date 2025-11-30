export enum SampleStatus {
  COLLECTED = 'Collected',
  RECEIVED = 'Received',
  PROCESSING = 'Processing',
  ANALYZED = 'Analyzed',
  ARCHIVED = 'Archived'
}

export enum QCStatus {
  IN_CONTROL = 'In Control',
  WARNING = 'Warning',
  OUT_OF_CONTROL = 'Out of Control'
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  mrn: string; // Medical Record Number
  gender: 'Male' | 'Female' | 'Other';
}

export interface Sample {
  id: string;
  patientId: string;
  type: string; // e.g., Blood, Tissue, Urine
  collectionDate: string;
  status: SampleStatus;
  barcode: string;
}

export interface QCResult {
  id: string;
  testName: string;
  timestamp: string;
  value: number;
  mean: number;
  sd: number; // Standard Deviation
  status: QCStatus;
  instrumentId: string;
}

export interface DocumentSOP {
  id: string;
  title: string;
  content: string;
  version: string;
  lastUpdated: string;
  status: 'Draft' | 'Approved' | 'Deprecated';
}

export interface AIAnalysisResult {
  summary: string;
  recommendations: string[];
  severity: 'low' | 'medium' | 'high';
}
