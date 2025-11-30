import React, { useState } from 'react';
import { DocumentSOP } from '../types';
import { generateSOPDraft } from '../services/geminiService';
import { FileText, Wand2, Clock, X, Sparkles } from 'lucide-react';

interface DocumentControlProps {
  documents: DocumentSOP[];
  onAddDocument: (doc: DocumentSOP) => void;
}

const EXAMPLE_PROMPTS = [
  {
    label: "Daily Calibration",
    title: "Daily Hematology Analyzer Calibration",
    context: "Standard operating procedure for calibrating the Sysmex XN-1000. Must be performed daily before 08:00 AM. Include steps for running low, normal, and high controls. Require check of reagent levels."
  },
  {
    label: "Biohazard Spill",
    title: "Biohazard Spill Clean-up Procedure",
    context: "Protocol for managing blood or body fluid spills larger than 10mL. Specify PPE requirements (gown, gloves, face shield). Use 1:10 bleach solution. Include incident reporting steps."
  },
  {
    label: "Critical Values",
    title: "Reporting Critical Test Results",
    context: "Workflow for communicating life-threatening results (panic values) to clinicians. Must be reported within 15 minutes of verification. Requires 'read-back' confirmation from the provider. Log requirements."
  }
];

export const DocumentControl: React.FC<DocumentControlProps> = ({ documents, onAddDocument }) => {
  const [isDrafting, setIsDrafting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentSOP | null>(null);
  
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContext, setDraftContext] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    const content = await generateSOPDraft(draftTitle, draftContext);
    
    const newDoc: DocumentSOP = {
      id: `DOC-${Date.now()}`,
      title: draftTitle,
      content: content,
      version: '0.1-DRAFT',
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'Draft'
    };

    onAddDocument(newDoc);
    setIsGenerating(false);
    setIsDrafting(false);
    setDraftTitle('');
    setDraftContext('');
  };

  const applyExample = (example: typeof EXAMPLE_PROMPTS[0]) => {
    setDraftTitle(example.title);
    setDraftContext(example.context);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Document Control</h2>
          <p className="text-gray-500 text-sm">SOPs, Policies, and Procedures.</p>
        </div>
        <button 
          onClick={() => setIsDrafting(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm"
        >
          <Wand2 className="w-4 h-4" />
          <span>Draft with AI</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-50 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                doc.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {doc.status}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2 truncate" title={doc.title}>{doc.title}</h3>
            <p className="text-xs text-gray-500 mb-4">Version {doc.version} • Updated {doc.lastUpdated}</p>
            <div className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow whitespace-pre-line">
              {doc.content.substring(0, 150)}...
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100 mt-auto">
               <button 
                 onClick={() => setSelectedDoc(doc)}
                 className="text-indigo-600 text-sm font-medium hover:text-indigo-800 focus:outline-none"
               >
                 Read Full SOP
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* View SOP Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-start rounded-t-xl">
              <div>
                <h3 className="font-semibold text-xl text-gray-800 leading-tight">{selectedDoc.title}</h3>
                <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                  <span className={`px-2 py-0.5 rounded font-medium text-xs ${
                    selectedDoc.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedDoc.status}
                  </span>
                  <span>Version {selectedDoc.version}</span>
                  <span>•</span>
                  <span>Last Updated: {selectedDoc.lastUpdated}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDoc(null)} 
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-white font-mono text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
              {selectedDoc.content}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end rounded-b-xl">
              <button 
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Drafting Modal */}
      {isDrafting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                 <Wand2 className="w-5 h-5 text-indigo-600" />
                 <h3 className="font-semibold text-gray-800">AI SOP Assistant</h3>
              </div>
              <button onClick={() => setIsDrafting(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleGenerate} className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Describe the procedure you need an SOP for, and Gemini will generate a compliant draft structure.
              </p>

              {/* Quick Start Examples */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Try an example
                </p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((example, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyExample(example)}
                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Procedure Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Daily Hematology Calibration"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Context / Requirements</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="e.g., Must include safety check for biohazards, using Sysmex XN-1000, daily before 8 AM."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={draftContext}
                  onChange={(e) => setDraftContext(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setIsDrafting(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isGenerating}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 disabled:opacity-70"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Drafting...</span>
                    </>
                  ) : (
                    <span>Generate Draft</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};