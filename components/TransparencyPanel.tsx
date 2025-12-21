
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sigma, Code, Database, BookCheck, Info, RefreshCcw, CheckCircle2, CloudLightning } from 'lucide-react';
import { Region } from '../types';
import { updateRegionMetricsWithLiveSearch } from '../services/gemini';

interface TransparencyPanelProps {
    regions: Region[];
    onUpdateRegions: (newRegions: Region[]) => void;
}

export const TransparencyPanel: React.FC<TransparencyPanelProps> = ({ regions, onUpdateRegions }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleSync = async () => {
      setIsUpdating(true);
      try {
          // This calls the service which uses Google Search Grounding to find latest NITI Aayog/SDG scores
          const updated = await updateRegionMetricsWithLiveSearch(regions);
          onUpdateRegions(updated);
          setLastUpdated(new Date());
      } catch (e) {
          console.error("Failed to sync:", e);
      } finally {
          setIsUpdating(false);
      }
  };

  return (
    <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-white/95 border-b border-indigo-200 overflow-hidden"
    >
        <div className="max-w-[1600px] mx-auto px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-indigo-700">
                    <Sigma className="w-6 h-6" />
                    <h2 className="text-base font-bold uppercase tracking-widest">System Transparency & Logic Inspector</h2>
                </div>
                
                {/* Live Sync Button */}
                <button 
                    onClick={handleSync}
                    disabled={isUpdating}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
                        lastUpdated 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                        : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                    }`}
                >
                    {isUpdating ? (
                        <RefreshCcw className="w-4 h-4 animate-spin" />
                    ) : lastUpdated ? (
                        <CheckCircle2 className="w-4 h-4" />
                    ) : (
                        <CloudLightning className="w-4 h-4" />
                    )}
                    {isUpdating ? "Syncing..." : lastUpdated ? "Knowledge Updated" : "Sync Live Data"}
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. The Algorithm */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col shadow-sm">
                    <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                        <Code className="w-4 h-4" /> MCDA Algorithm
                    </h3>
                    <div className="bg-slate-50 p-5 rounded-xl font-mono text-sm text-slate-700 border border-slate-200 leading-relaxed">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-purple-700 font-bold">let</span> 
                            <span className="text-blue-700 font-bold">NetImpactScore</span> 
                            <span className="text-slate-500 font-bold">=</span>
                        </div>
                        <div className="pl-6 space-y-2">
                            <div>( <span className="text-emerald-700 font-semibold">Structural_Alignment</span> <span className="text-slate-500">*</span> <span className="text-amber-700 font-bold">0.40</span> ) <span className="text-slate-400 opacity-80 text-xs ml-2">// Weight: 40%</span></div>
                            <div><span className="text-slate-500 font-bold">+</span> ( <span className="text-amber-700 font-semibold">Socio_Urgency</span> <span className="text-slate-500">*</span> <span className="text-amber-700 font-bold">0.30</span> ) <span className="text-slate-400 opacity-80 text-xs ml-2">// Weight: 30%</span></div>
                            <div><span className="text-slate-500 font-bold">-</span> ( <span className="text-red-700 font-semibold">Implementation_Friction</span> <span className="text-slate-500">*</span> <span className="text-amber-700 font-bold">0.30</span> ) <span className="text-slate-400 opacity-80 text-xs ml-2">// Weight: 30%</span></div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">
                        The system uses a fixed-weight Multi-Criteria Decision Analysis (MCDA) model. 
                        It normalizes regional metrics (0-10) and applies these coefficients to derive a net economic impact score.
                    </p>
                </div>

                {/* 2. The Dataset */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col max-h-[350px] shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase flex items-center gap-2">
                                <Database className="w-4 h-4" /> Knowledge Base (State Metrics)
                            </h3>
                            {lastUpdated && <span className="text-xs text-emerald-600 font-mono font-bold">Updated via Google Search</span>}
                        </div>
                    <div className="overflow-auto custom-scrollbar flex-1 border border-slate-200 rounded-xl">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 sticky top-0 z-10">
                                <tr>
                                    <th className="p-3 text-slate-700 font-bold border-b border-slate-200">State/UT</th>
                                    <th className="p-3 text-slate-600 font-semibold border-b border-slate-200">Health Idx</th>
                                    <th className="p-3 text-slate-600 font-semibold border-b border-slate-200">Vuln. (SDG)</th>
                                    <th className="p-3 text-slate-600 font-semibold border-b border-slate-200">Literacy</th>
                                    <th className="p-3 text-slate-600 font-semibold border-b border-slate-200">MSME Dens.</th>
                                    <th className="p-3 text-slate-600 font-semibold border-b border-slate-200">Digital</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {regions.map(r => (
                                    <tr key={r.id} className={`hover:bg-slate-50 transition-colors ${lastUpdated ? 'animate-pulse bg-emerald-50' : ''}`}>
                                        <td className="p-3 text-slate-800 font-bold">{r.name}</td>
                                        <td className="p-3 text-slate-600 font-mono font-medium">{r.healthcare_index}</td>
                                        <td className="p-3 text-slate-600 font-mono font-medium">{r.vulnerability_score}/10</td>
                                        <td className="p-3 text-slate-600 font-medium">{r.literacy_rate}%</td>
                                        <td className="p-3 text-slate-600 font-medium">{r.msme_density}</td>
                                        <td className="p-3 text-slate-600 font-medium">{r.digital_penetration}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Data Source Footer */}
            <div className="mt-8 border-t border-slate-200 pt-6 flex flex-col md:flex-row gap-8 text-xs text-slate-500">
                <div className="flex gap-3 max-w-lg">
                    <BookCheck className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                        <strong className="block text-slate-700 text-sm mb-1.5 font-bold">Baseline Data References</strong>
                        <p className="leading-relaxed">Metric values (Literacy, Health Index, MSME Density) are approximations derived from <span className="text-slate-800 font-semibold">NITI Aayog SDG India Index 2023-24</span>, <span className="text-slate-800 font-semibold">NFHS-5 (2019-21)</span>, and <span className="text-slate-800 font-semibold">RBI Handbook of Statistics on Indian States</span>.</p>
                    </div>
                </div>
                <div className="flex gap-3 max-w-lg">
                    <CloudLightning className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                        <strong className="block text-slate-700 text-sm mb-1.5 font-bold">Live Grounding Methodology</strong>
                        <p className="leading-relaxed">Clicking "Sync Live Data" triggers an AI Agent to search for the latest available reports (e.g. 2024-25 Economic Survey) and overwrites the static baseline with the newly discovered values.</p>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
  );
};
