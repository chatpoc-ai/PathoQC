import React, { useState } from 'react';
import { Sample, Patient, SampleStatus } from '../types';
import { Plus, Search, Filter, QrCode, X, User, TestTube, Clock, Activity, Loader } from 'lucide-react';

interface SampleManagerProps {
  samples: Sample[];
  patients: Patient[];
  onAddSample: (sample: Sample) => void;
}

export const SampleManager: React.FC<SampleManagerProps> = ({ samples, patients, onAddSample }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  
  // Filter & Scan States
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<SampleStatus | 'All'>('All');
  const [isScanning, setIsScanning] = useState(false);

  const [newSampleData, setNewSampleData] = useState<Partial<Sample>>({
    type: 'Whole Blood',
    status: SampleStatus.COLLECTED
  });
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');

  const filteredSamples = samples.filter(s => {
    const matchesSearch = s.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patients.find(p => p.id === s.patientId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'All' || s.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const handleScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setSearchTerm(''); // Clear current search
    
    // Simulate a scanning delay
    setTimeout(() => {
      // Pick a random sample to simulate a successful scan
      if (samples.length > 0) {
        const randomSample = samples[Math.floor(Math.random() * samples.length)];
        setSearchTerm(randomSample.barcode);
      }
      setIsScanning(false);
    }, 800);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `S00${samples.length + 1}`;
    const timestamp = new Date().toISOString();
    const barcode = `${patients.find(p => p.id === selectedPatientId)?.mrn.split('-')[1]}-S${Math.floor(Math.random() * 100)}`;
    
    const sample: Sample = {
      id: newId,
      patientId: selectedPatientId,
      type: newSampleData.type || 'Unknown',
      status: newSampleData.status || SampleStatus.COLLECTED,
      collectionDate: timestamp,
      barcode: barcode
    };

    onAddSample(sample);
    setShowAddModal(false);
  };

  const getStatusColor = (status: SampleStatus) => {
    switch (status) {
      case SampleStatus.COLLECTED: return 'bg-gray-100 text-gray-700';
      case SampleStatus.RECEIVED: return 'bg-blue-100 text-blue-700';
      case SampleStatus.PROCESSING: return 'bg-yellow-100 text-yellow-700';
      case SampleStatus.ANALYZED: return 'bg-green-100 text-green-700';
      case SampleStatus.ARCHIVED: return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  // Helper to simulate a chain of custody timeline based on current status
  const getTimelineEvents = (sample: Sample) => {
    const statusOrder = [
        SampleStatus.COLLECTED,
        SampleStatus.RECEIVED,
        SampleStatus.PROCESSING,
        SampleStatus.ANALYZED,
        SampleStatus.ARCHIVED
    ];
    const currentIndex = statusOrder.indexOf(sample.status);
    const dateObj = new Date(sample.collectionDate);

    // Filter status list up to current status
    return statusOrder.slice(0, currentIndex + 1).map((status, index) => {
        // Simulate time passing for each step
        const eventDate = new Date(dateObj);
        eventDate.setHours(eventDate.getHours() + index * 2 + (index * 30 / 60)); 
        
        return {
            status,
            date: eventDate.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: index === 0 ? 'Phlebotomist' : index === 1 ? 'Lab Reception' : 'Lab Tech'
        };
    }).reverse(); // Show newest first
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Sample Management</h2>
          <p className="text-gray-500 text-sm">Track and manage patient specimens.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Sample</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder={isScanning ? "Scanning barcode..." : "Search by barcode, ID, or patient name..."}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm transition-colors ${isScanning ? 'bg-gray-50 border-teal-500 text-teal-600' : 'border-gray-200'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isScanning}
            />
            {isScanning && <Loader className="absolute right-3 top-2.5 w-4 h-4 text-teal-600 animate-spin" />}
          </div>
          <div className="flex space-x-2 w-full sm:w-auto justify-end">
             <button 
               onClick={() => setShowFilter(!showFilter)}
               className={`p-2 rounded-lg border transition-colors ${showFilter ? 'bg-teal-50 border-teal-200 text-teal-600' : 'text-gray-500 border-gray-200 hover:bg-gray-50'}`}
               title="Filter Samples"
             >
               <Filter className="w-4 h-4" />
             </button>
             <button 
               onClick={handleScan}
               className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg border border-gray-200"
               title="Simulate Barcode Scan"
             >
               <QrCode className="w-4 h-4" />
             </button>
          </div>
        </div>

        {/* Filter Row */}
        {showFilter && (
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
             <button
               onClick={() => setStatusFilter('All')}
               className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                 statusFilter === 'All' 
                   ? 'bg-teal-600 text-white border-teal-600' 
                   : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
               }`}
             >
               All
             </button>
             {Object.values(SampleStatus).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                    statusFilter === status
                      ? 'bg-teal-600 text-white border-teal-600' 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
             ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-3">Barcode</th>
                <th className="px-6 py-3">Patient</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Collection Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSamples.map((sample) => {
                const patient = patients.find(p => p.id === sample.patientId);
                return (
                  <tr key={sample.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-700">{sample.barcode}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{patient?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">MRN: {patient?.mrn}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{sample.type}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(sample.collectionDate).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(sample.status)}`}>
                        {sample.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedSample(sample)}
                        className="text-teal-600 hover:text-teal-800 font-medium text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredSamples.length === 0 && (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <div className="bg-gray-50 p-3 rounded-full mb-3">
                 <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p>No samples found.</p>
              {statusFilter !== 'All' && (
                <button 
                  onClick={() => setStatusFilter('All')}
                  className="mt-2 text-teal-600 hover:underline text-xs"
                >
                  Clear Status Filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Sample Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800">Log New Sample</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.mrn})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sample Type</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                  value={newSampleData.type}
                  onChange={(e) => setNewSampleData({...newSampleData, type: e.target.value})}
                >
                  <option>Whole Blood (EDTA)</option>
                  <option>Serum</option>
                  <option>Plasma</option>
                  <option>Urine</option>
                  <option>Tissue Biopsy</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Log Sample
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Sample Details Modal */}
      {selectedSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <TestTube className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Sample Details</h3>
                  <p className="text-xs text-gray-500 font-mono">{selectedSample.barcode}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSample(null)} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Patient Info Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-3 border-b border-gray-50 pb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <h4 className="text-sm font-semibold text-gray-700">Patient Information</h4>
                  </div>
                  {(() => {
                    const p = patients.find(pt => pt.id === selectedSample.patientId);
                    if (!p) return <p className="text-sm text-gray-500">Unknown Patient</p>;
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-800">{p.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">MRN:</span> <span className="font-mono text-gray-600">{p.mrn}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">DOB:</span> <span>{p.dob}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Gender:</span> <span>{p.gender}</span></div>
                      </div>
                    )
                  })()}
                </div>

                {/* Sample Info Card */}
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center space-x-2 mb-3 border-b border-gray-50 pb-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <h4 className="text-sm font-semibold text-gray-700">Specimen Data</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Type:</span> <span className="font-medium text-gray-800">{selectedSample.type}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Collected:</span> <span>{new Date(selectedSample.collectionDate).toLocaleDateString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Time:</span> <span>{new Date(selectedSample.collectionDate).toLocaleTimeString()}</span></div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedSample.status)}`}>
                        {selectedSample.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chain of Custody / Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" /> Chain of Custody
                </h4>
                <div className="relative pl-4 border-l-2 border-gray-100 space-y-6 pb-2">
                  {getTimelineEvents(selectedSample).map((event, idx) => (
                    <div key={idx} className="relative pl-4">
                      {/* Dot */}
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-teal-500 border-2 border-white ring-1 ring-gray-100"></div>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                         <div>
                            <p className="text-sm font-medium text-gray-900">{event.status}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Performed by {event.actor}</p>
                         </div>
                         <div className="text-xs font-mono text-gray-400 mt-1 sm:mt-0">
                            {event.date}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
               <button
                  onClick={() => setSelectedSample(null)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
               >
                  Close Details
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};