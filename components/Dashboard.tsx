import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { QCResult, Sample, SampleStatus, QCStatus } from '../types';
import { Activity, AlertTriangle, FileText, FlaskConical } from 'lucide-react';

interface DashboardProps {
  samples: Sample[];
  qcData: QCResult[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; colorClass: string }> = ({ title, value, icon, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ samples, qcData }) => {
  const pendingSamples = samples.filter(s => s.status !== SampleStatus.ARCHIVED && s.status !== SampleStatus.ANALYZED).length;
  const outOfControl = qcData.filter(qc => qc.status === QCStatus.OUT_OF_CONTROL).length;
  const recentQC = qcData.slice(-10);

  // Mean is 100, SD is 5 for the chart
  const mean = 100;
  const sd = 5;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Samples in Process" 
          value={pendingSamples} 
          icon={<FlaskConical className="w-6 h-6 text-blue-600" />} 
          colorClass="bg-blue-50"
        />
        <StatCard 
          title="QC Alerts (30d)" 
          value={outOfControl} 
          icon={<AlertTriangle className="w-6 h-6 text-red-600" />} 
          colorClass="bg-red-50"
        />
        <StatCard 
          title="Instruments Active" 
          value="4" 
          icon={<Activity className="w-6 h-6 text-green-600" />} 
          colorClass="bg-green-50"
        />
        <StatCard 
          title="Pending Reviews" 
          value="12" 
          icon={<FileText className="w-6 h-6 text-purple-600" />} 
          colorClass="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">HbA1c Quality Control Trend</h3>
            <span className="text-sm text-gray-500">Last 10 Runs</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recentQC}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="timestamp" hide />
                <YAxis domain={[mean - (3.5*sd), mean + (3.5*sd)]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  formatter={(value: number) => [value, 'Value']}
                />
                <ReferenceLine y={mean} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Mean', position: 'right', fill: '#10b981', fontSize: 10 }} />
                <ReferenceLine y={mean + 2*sd} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: '+2SD', position: 'right', fill: '#f59e0b', fontSize: 10 }} />
                <ReferenceLine y={mean - 2*sd} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: '-2SD', position: 'right', fill: '#f59e0b', fontSize: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Alerts List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Notifications</h3>
          <div className="space-y-4">
            {outOfControl > 0 ? (
               <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                 <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                 <div>
                   <p className="text-sm font-medium text-red-800">QC Violation: HbA1c</p>
                   <p className="text-xs text-red-600 mt-1">Instrument INST-01 exceeded +3SD limit.</p>
                 </div>
               </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No critical alerts.</p>
            )}
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
               <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
               <div>
                 <p className="text-sm font-medium text-blue-800">Maintenance Due</p>
                 <p className="text-xs text-blue-600 mt-1">Weekly cleaning for Centrifuge C-02 due tomorrow.</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
