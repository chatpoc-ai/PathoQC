import React, { useState } from 'react';
import { LayoutDashboard, FlaskConical, Activity, FileText, UserCircle, Menu, X } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { SampleManager } from './components/SampleManager';
import { QCCharts } from './components/QCCharts';
import { DocumentControl } from './components/DocumentControl';
import { MOCK_PATIENTS, MOCK_SAMPLES, MOCK_QC_DATA, MOCK_DOCUMENTS } from './constants';
import { Sample, DocumentSOP } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'samples' | 'qc' | 'docs'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // App State (In a real app, this would be Redux/Context/React Query)
  const [samples, setSamples] = useState<Sample[]>(MOCK_SAMPLES);
  const [documents, setDocuments] = useState<DocumentSOP[]>(MOCK_DOCUMENTS);

  const addSample = (sample: Sample) => {
    setSamples([sample, ...samples]);
  };

  const addDocument = (doc: DocumentSOP) => {
    setDocuments([doc, ...documents]);
  };

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab; label: string; icon: React.ElementType }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-teal-50 text-teal-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 h-full fixed left-0 top-0 z-10">
        <div className="p-6 flex items-center space-x-2 border-b border-gray-100">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-gray-800">PathoQC</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="samples" label="Sample Management" icon={FlaskConical} />
          <NavItem id="qc" label="QC Charts" icon={Activity} />
          <NavItem id="docs" label="SOP Documents" icon={FileText} />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 px-4 py-3">
            <UserCircle className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-800">Dr. J. Doe</p>
              <p className="text-xs text-gray-500">Lab Director</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}
      
      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-200 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <span className="text-xl font-bold text-gray-800">PathoQC</span>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <NavItem id="samples" label="Samples" icon={FlaskConical} />
          <NavItem id="qc" label="Quality Control" icon={Activity} />
          <NavItem id="docs" label="Documents" icon={FileText} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:hidden">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-3 font-semibold text-gray-800">PathoQC</span>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <Dashboard samples={samples} qcData={MOCK_QC_DATA} />}
            {activeTab === 'samples' && <SampleManager samples={samples} patients={MOCK_PATIENTS} onAddSample={addSample} />}
            {activeTab === 'qc' && <QCCharts data={MOCK_QC_DATA} />}
            {activeTab === 'docs' && <DocumentControl documents={documents} onAddDocument={addDocument} />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
