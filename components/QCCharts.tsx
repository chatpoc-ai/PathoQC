import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { QCResult, QCStatus } from '../types';
import { analyzeQCTrends } from '../services/geminiService';
import { Brain, RefreshCw, AlertCircle } from 'lucide-react';

interface QCChartsProps {
  data: QCResult[];
}

export const QCCharts: React.FC<QCChartsProps> = ({ data }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const mean = data[0]?.mean || 100;
  const sd = data[0]?.sd || 5;

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysis(null);
    const result = await analyzeQCTrends(data);
    setAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-2xl font-bold text-gray-800">Quality Control Dashboard</h2>
          <p className="text-gray-500 text-sm">Levey-Jennings Charts & Trend Analysis</p>
        </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Hemoglobin A1c (Level 1)</h3>
            <p className="text-xs text-gray-500">Instrument: INST-01 | Lot: 88219A</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Mean: {mean}
            </span>
            <span className="flex items-center text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span> 2SD: {sd * 2}
            </span>
          </div>
        </div>

        <div className="h-96 w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 10 }} 
                tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              />
              <YAxis domain={[mean - (4*sd), mean + (4*sd)]} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <ReferenceLine y={mean} stroke="#10b981" strokeDasharray="3 3" label="Mean" />
              <ReferenceLine y={mean + 1*sd} stroke="#d1d5db" strokeDasharray="3 3" />
              <ReferenceLine y={mean - 1*sd} stroke="#d1d5db" strokeDasharray="3 3" />
              <ReferenceLine y={mean + 2*sd} stroke="#f59e0b" label="+2SD" />
              <ReferenceLine y={mean - 2*sd} stroke="#f59e0b" label="-2SD" />
              <ReferenceLine y={mean + 3*sd} stroke="#ef4444" label="+3SD" />
              <ReferenceLine y={mean - 3*sd} stroke="#ef4444" label="-3SD" />
              
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={(props: any) => {
                    const isOut = props.payload.status === QCStatus.OUT_OF_CONTROL;
                    const isWarn = props.payload.status === QCStatus.WARNING;
                    return (
                        <circle 
                            cx={props.cx} 
                            cy={props.cy} 
                            r={isOut ? 6 : 4} 
                            fill={isOut ? '#ef4444' : isWarn ? '#f59e0b' : '#3b82f6'} 
                            stroke="none"
                        />
                    );
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
               <div className="bg-purple-100 p-3 rounded-lg">
                 <Brain className="w-6 h-6 text-purple-600" />
               </div>
            </div>
            <div className="flex-grow">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                AI Trend Analysis
                {analyzing && <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />}
              </h4>
              
              {!analysis && !analyzing && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-3">
                    Use Gemini AI to detect non-random patterns, shifts, or trends in your QC data that might indicate early instrument failure.
                  </p>
                  <button 
                    onClick={handleAnalyze}
                    className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Analyze Recent Data
                  </button>
                </div>
              )}

              {analysis && (
                <div className="mt-3 bg-purple-50 p-4 rounded-lg border border-purple-100 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed animate-fade-in">
                  {analysis}
                  <div className="mt-3 flex justify-end">
                    <button onClick={() => setAnalysis(null)} className="text-xs text-purple-600 hover:text-purple-800 underline">
                      Clear Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
