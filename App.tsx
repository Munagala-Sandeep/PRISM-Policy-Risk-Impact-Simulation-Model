
import React, { useState, useRef } from 'react';
import { Activity, Map as MapIcon, Database, Cpu, Search, AlertCircle, Globe, FileText, Zap, Split, ArrowRightLeft, Layers, CheckCircle2, ShieldCheck, Calculator, TrendingUp, Anchor, AlertTriangle, ArrowRight, Info, Quote, Lightbulb, ExternalLink, Link2, Eye, Gauge, ShieldAlert, Sparkles, Network, FlaskConical, Radio, Scale, Trophy, Users, AlertOctagon, Link, PlusCircle, XCircle, MinusCircle, MoveHorizontal, Siren } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapVisualization } from './components/MapVisualization';
import { ImpactBarChart } from './components/Charts';
import { TransparencyPanel } from './components/TransparencyPanel';
import { DEMO_POLICY, DEMO_POLICY_B, generateDemoResult, REGIONS } from './constants';
import { AnalysisMode, SimulationResult, Region, ComparisonResult } from './types';
import { analyzePolicyWithGemini, generateComparisonSummary } from './services/gemini';

const App = () => {
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.DEMO);
  const [isCompare, setIsCompare] = useState(false);
  const [showTransparency, setShowTransparency] = useState(false);
  
  // DYNAMIC REGIONS STATE (Lifting the knowledge base up)
  const [regionsData, setRegionsData] = useState<Region[]>(REGIONS);

  // Policy A State
  const [policyA, setPolicyA] = useState(DEMO_POLICY);
  const [resultA, setResultA] = useState<SimulationResult | null>(null);

  // Policy B State
  const [policyB, setPolicyB] = useState(DEMO_POLICY_B);
  const [resultB, setResultB] = useState<SimulationResult | null>(null);

  const [comparisonSummary, setComparisonSummary] = useState<ComparisonResult | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isRealTime, setIsRealTime] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMap, setActiveMap] = useState<'A' | 'B'>('A');

  // Simple In-Memory Cache
  const cacheRef = useRef<Map<string, SimulationResult>>(new Map());

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setResultA(null);
    setResultB(null);
    setComparisonSummary(null);

    try {
      if (mode === AnalysisMode.DEMO) {
        // Dynamic Demo Simulation
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
        
        // PASS dynamic regionsData here!
        const resultAData = generateDemoResult(policyA, regionsData);
        setResultA(resultAData);

        if (isCompare) {
            const resultBData = generateDemoResult(policyB, regionsData);
            setResultB(resultBData);
            // Mock Comparison for Demo
            setComparisonSummary({
                executiveSummary: "Demo comparison logic actively evaluating matrix...",
                dimensions: [
                    { dimension: "Economic Efficiency", scoreA: 8, scoreB: 6, winner: "A", reasoning: "Better capital allocation." },
                    { dimension: "Social Equity", scoreA: 4, scoreB: 9, winner: "B", reasoning: "Targeted vulnerability support." },
                    { dimension: "Admin Friction", scoreA: 7, scoreB: 5, winner: "A", reasoning: "Digital-first implementation." },
                    { dimension: "Pol. Feasibility", scoreA: 6, scoreB: 6, winner: "Tie", reasoning: "Both face stakeholder pushback." },
                    { dimension: "Risk Exposure", scoreA: 8, scoreB: 7, winner: "A", reasoning: "Less reliance on external funding." }
                ],
                tradeOffs: [
                    { sacrifice: "Short-term Equity", gain: "Long-term Efficiency" },
                    { sacrifice: "Central Control", gain: "Federal Synergy" }
                ],
                regionalAnalysis: {
                    deltaSummary: "Policy A benefits industrial hubs; Policy B benefits agrarian states.",
                    vulnerableGroupImpact: "Policy B provides 30% higher support to high-vulnerability regions."
                },
                interactionAnalysis: {
                    type: "Synergy",
                    mechanism: "Shared Digital Backbone: Health ID infrastructure from Policy A reduces beneficiary verification costs for Agrarian Subsidies in Policy B.",
                    affectedRegions: ["Uttar Pradesh", "Bihar", "Madhya Pradesh"],
                    recommendation: "Strongly Recommended"
                },
                recommendation: {
                    winner: "Conditional",
                    rationale: "Choose A for growth, B for stability. Combined rollout yields high synergy."
                },
                decisionConfidence: {
                    strength: "High",
                    explanation: "Uncertainty ranges do not overlap. Policy A's worst-case efficiency score is higher than Policy B's best-case."
                }
            });
        }
      } else {
        // Live Mode with Caching
        
        // Policy A
        let resA: SimulationResult;
        if (cacheRef.current.has(policyA)) {
            resA = cacheRef.current.get(policyA)!;
        } else {
            // Pass the DYNAMIC regionsData context
            resA = await analyzePolicyWithGemini(policyA, isRealTime, regionsData);
            cacheRef.current.set(policyA, resA);
        }
        setResultA(resA);

        // Policy B (if Compare)
        let resB: SimulationResult | null = null;
        if (isCompare) {
            if (cacheRef.current.has(policyB)) {
                resB = cacheRef.current.get(policyB)!;
            } else {
                resB = await analyzePolicyWithGemini(policyB, isRealTime, regionsData);
                cacheRef.current.set(policyB, resB);
            }
            setResultB(resB);
        }

        if (isCompare && resA && resB) {
            const summary = await generateComparisonSummary(policyA, resA, policyB, resB);
            setComparisonSummary(summary);
        }
      }
    } catch (e) {
      console.error(e);
      setError("Analysis failed. Please check your API Key or try Demo mode.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get active results for display
  const activeResult = activeMap === 'A' ? resultA : (resultB || resultA);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-prism-accent/20 font-sans pb-20">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-prism-accent to-prism-glow rounded-xl flex items-center justify-center shadow-lg shadow-prism-accent/20">
              <Activity className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-prism-accent to-prism-glow tracking-tight">
                PRISM
              </h1>
              <p className="text-sm text-slate-500 font-medium tracking-wide">POLICY RISK & IMPACT SIMULATION MODEL</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Transparency Toggle */}
             <button 
                onClick={() => setShowTransparency(!showTransparency)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all shadow-sm ${showTransparency ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
             >
                <Eye className="w-4 h-4" />
                {showTransparency ? 'Logic Inspector: ON' : 'Logic Inspector: OFF'}
             </button>

             {/* Mode Switcher */}
             <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 relative">
                <div 
                    className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out border border-slate-200 ${mode === AnalysisMode.LIVE ? 'left-[calc(50%-4px)] translate-x-1' : 'left-1'}`} 
                />
                <button 
                  onClick={() => setMode(AnalysisMode.DEMO)}
                  className={`relative z-10 px-5 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${mode === AnalysisMode.DEMO ? 'text-slate-700' : 'text-slate-500 hover:text-slate-600'}`}
                >
                  <FlaskConical className="w-4 h-4" />
                  Demo Mode
                </button>
                <button 
                  onClick={() => setMode(AnalysisMode.LIVE)}
                  className={`relative z-10 px-5 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 ${mode === AnalysisMode.LIVE ? 'text-prism-glow' : 'text-slate-500 hover:text-slate-600'}`}
                >
                  <Radio className={`w-4 h-4 ${mode === AnalysisMode.LIVE ? 'animate-pulse' : ''}`} />
                  Live AI
                </button>
             </div>
          </div>
        </div>
      </header>

      {/* Transparency Overlay / Dashboard */}
      <AnimatePresence>
        {showTransparency && (
            <TransparencyPanel 
                regions={regionsData} 
                onUpdateRegions={setRegionsData} 
            />
        )}
      </AnimatePresence>

      <main className="max-w-[1600px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Input & Logic */}
        <div className="lg:col-span-5 space-y-8">
          <div className="glass-panel p-8 rounded-3xl shadow-xl bg-white/80 border border-slate-200/60 relative overflow-hidden">
             {/* Background Decoration */}
             <div className={`absolute top-0 left-0 w-full h-1.5 ${mode === AnalysisMode.LIVE ? 'bg-gradient-to-r from-prism-glow to-purple-500' : 'bg-slate-300'}`} />
             
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                <FileText className="w-6 h-6 text-prism-accent" />
                Policy Input
              </h2>
              
              <button 
                onClick={() => setIsCompare(!isCompare)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${isCompare ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Split className="w-4 h-4" />
                {isCompare ? 'Comparison Mode' : 'Enable Comparison'}
              </button>
            </div>
            
            <div className="space-y-6">
                <div className="relative">
                    {isCompare && <span className="absolute -top-3 left-4 bg-white px-2 text-xs text-prism-accent border border-slate-200 rounded shadow-sm font-bold tracking-wide">Policy A</span>}
                    <textarea
                    value={policyA}
                    onChange={(e) => setPolicyA(e.target.value)}
                    className={`w-full bg-white border border-slate-300 rounded-2xl p-5 text-base text-slate-800 focus:ring-4 focus:ring-prism-accent/10 focus:border-prism-accent transition-all outline-none resize-none font-mono leading-relaxed placeholder:text-slate-400 shadow-sm ${isCompare ? 'h-40' : 'h-72'}`}
                    placeholder="Enter Policy A text..."
                    />
                </div>

                {isCompare && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        className="relative"
                    >
                         <span className="absolute -top-3 left-4 bg-white px-2 text-xs text-purple-600 border border-slate-200 rounded shadow-sm font-bold tracking-wide">Policy B</span>
                        <textarea
                            value={policyB}
                            onChange={(e) => setPolicyB(e.target.value)}
                            className="w-full h-40 bg-white border border-slate-300 rounded-2xl p-5 text-base text-slate-800 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none resize-none font-mono leading-relaxed placeholder:text-slate-400 shadow-sm"
                            placeholder="Enter Policy B text..."
                        />
                    </motion.div>
                )}
            </div>

            <div className="mt-6 flex flex-col gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isRealTime ? 'bg-prism-success/10 text-prism-success' : 'bg-slate-200 text-slate-500'}`}>
                           <Globe className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-slate-800 font-bold">Google Search Grounding</span>
                            <span className="text-xs text-slate-500 font-medium">
                                {mode === AnalysisMode.DEMO ? "Not available in Demo Mode" : "Enable real-time fact checking & attribution"}
                            </span>
                        </div>
                    </div>
                    <button 
                        disabled={mode === AnalysisMode.DEMO}
                        onClick={() => setIsRealTime(!isRealTime)}
                        className={`w-12 h-7 rounded-full relative transition-colors ${mode === AnalysisMode.DEMO ? 'opacity-50 cursor-not-allowed bg-slate-200' : (isRealTime ? 'bg-prism-success' : 'bg-slate-300')}`}
                    >
                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${isRealTime ? 'left-6' : 'left-1'}`} />
                    </button>
                </div>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className={`w-full mt-8 bg-gradient-to-r text-white font-bold text-lg py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed
                ${isCompare ? 'from-prism-glow to-purple-600 hover:from-prism-glow/90 hover:to-purple-500 shadow-purple-500/30' : 'from-prism-accent to-prism-glow hover:from-prism-accent/90 hover:to-prism-glow/90 shadow-prism-accent/30'}
              `}
            >
              {isLoading ? (
                <>
                  <Cpu className="w-6 h-6 animate-spin" />
                  {isCompare ? 'Simulating Comparison...' : 'Simulating...'}
                </>
              ) : (
                <>
                  {isCompare ? <ArrowRightLeft className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                  {isCompare ? 'Compare Impacts' : 'Run Simulation'}
                </>
              )}
            </button>
          </div>

          {/* Dynamic Analysis Logic Explanation */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all">
             <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  {activeResult ? "Analysis Logic Chain" : "How PRISM Works"}
                </h3>
             </div>
            
            {activeResult ? (
                <div className="space-y-4">
                   <div className="text-base text-slate-800">
                      <span className="text-slate-400 text-xs uppercase font-bold block mb-1.5">Identified Sector</span>
                      <span className="bg-prism-accent/10 text-prism-accent px-3 py-1.5 rounded-lg text-sm font-bold border border-prism-accent/20">
                        {activeResult.identifiedSector}
                      </span>
                   </div>
                   
                   <div className="text-base text-slate-800">
                      <span className="text-slate-400 text-xs uppercase font-bold block mb-1.5">Keywords Extracted</span>
                      <div className="flex flex-wrap gap-2">
                        {activeResult.identifiedKeywords.map((k, i) => (
                            <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-semibold">{k}</span>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-3 mt-6">
                       <span className="text-slate-400 text-xs uppercase font-bold block">Processing Steps</span>
                       {activeResult.analysisSteps.map((step, idx) => (
                           <div key={idx} className="flex gap-4 text-sm text-slate-700">
                                <div className="min-w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold border border-slate-200 mt-0.5 text-slate-500 shadow-sm">{idx + 1}</div>
                                <span className="text-sm leading-relaxed font-medium">{step}</span>
                           </div>
                       ))}
                   </div>
                </div>
            ) : (
                <ul className="space-y-4">
                <li className="flex gap-4 text-sm text-slate-700">
                    <div className="min-w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold border border-slate-200 text-slate-500 shadow-sm">1</div>
                    <span className="font-medium leading-relaxed">Analyzes policy text to identify the specific economic sector (e.g., Health, Education, Agri, Business).</span>
                </li>
                <li className="flex gap-4 text-sm text-slate-700">
                    <div className="min-w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold border border-slate-200 text-slate-500 shadow-sm">2</div>
                    <span className="font-medium leading-relaxed">Retrieves relevant regional data (e.g., healthcare index for health policies, literacy for education).</span>
                </li>
                <li className="flex gap-4 text-sm text-slate-700">
                    <div className="min-w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold border border-slate-200 text-slate-500 shadow-sm">3</div>
                    <span className="font-medium leading-relaxed">Simulates impact by weighing benefits against implementation costs and negative externalities.</span>
                </li>
                </ul>
            )}
          </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-7 space-y-8">
          {error && (
            <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-4 text-lg font-medium shadow-sm">
               <AlertCircle className="w-6 h-6" />
               {error}
            </div>
          )}

          {!resultA && !isLoading && !error && (
            <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-3xl bg-white/50">
               <Database className="w-20 h-20 mb-6 opacity-20" />
               <p className="text-2xl font-semibold text-slate-500">Ready to Simulate</p>
               <p className="text-base text-slate-400 mt-2">Enter policy text or use demo data to begin.</p>
            </div>
          )}

          {resultA && (
            <AnimatePresence mode="wait">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Simulation Context Banner */}
                <div className={`w-full py-3 px-6 rounded-2xl flex flex-col md:flex-row items-center justify-between text-xs font-bold uppercase tracking-widest border ${
                    mode === AnalysisMode.LIVE 
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100 text-indigo-700' 
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}>
                    <div className="flex items-center gap-3">
                        {mode === AnalysisMode.LIVE ? <Sparkles className="w-4 h-4 text-prism-glow" /> : <FlaskConical className="w-4 h-4" />}
                        {mode === AnalysisMode.LIVE ? "Live AI Analysis • Real-time Grounding Active" : "Static Demo Scenario • Pre-computed Deterministic Result"}
                    </div>
                    {mode === AnalysisMode.LIVE && <div className="flex items-center gap-1.5 opacity-80 mt-2 md:mt-0"><Globe className="w-3.5 h-3.5" /> Connected</div>}
                </div>

                {/* EQUITY WATCHDOG ALERT (New) */}
                {activeResult.equityAlert && activeResult.equityAlert.triggered && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl shadow-md"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-100 rounded-full shrink-0">
                                <Siren className="w-6 h-6 text-red-600 animate-pulse" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-red-800">Equity Watchdog Alert Triggered</h3>
                                    <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded uppercase">
                                        Severity: {activeResult.equityAlert.severity}
                                    </span>
                                </div>
                                <p className="text-red-700 font-medium mb-3 leading-relaxed">
                                    {activeResult.equityAlert.cause}
                                </p>
                                
                                {activeResult.equityAlert.affectedRegions.length > 0 && (
                                    <div className="mb-4">
                                        <span className="text-xs font-bold text-red-800 uppercase tracking-wide block mb-1">Affected Vulnerable Regions</span>
                                        <div className="flex flex-wrap gap-2">
                                            {activeResult.equityAlert.affectedRegions.map((region, i) => (
                                                <span key={i} className="bg-white px-2 py-1 rounded text-xs font-semibold text-red-600 border border-red-200">
                                                    {region}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="bg-white/60 p-4 rounded-lg border border-red-100">
                                    <span className="text-xs font-bold text-red-800 uppercase tracking-wide block mb-2 flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3" /> Recommended Mitigation
                                    </span>
                                    <ul className="space-y-1">
                                        {activeResult.equityAlert.mitigationStrategies.map((strat, i) => (
                                            <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                                <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                                                {strat}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Comparison Matrix or Single Summary */}
                {isCompare && resultB && comparisonSummary ? (
                    <div className="glass-panel p-8 rounded-3xl border-l-[6px] border-prism-glow bg-gradient-to-r from-white to-indigo-50/40 relative overflow-hidden">
                         <div className="flex items-center justify-between mb-6">
                             <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                                <Scale className="w-6 h-6 text-prism-glow" />
                                Comparative Decision Matrix
                             </h3>
                             <div className="flex items-center gap-2">
                                 <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-prism-accent/10 text-prism-accent text-xs font-bold border border-prism-accent/20">
                                     A
                                 </span>
                                 <span className="text-slate-400 text-xs">vs</span>
                                 <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-prism-glow/10 text-prism-glow text-xs font-bold border border-prism-glow/20">
                                     B
                                 </span>
                             </div>
                         </div>

                         {/* Scoreboard */}
                         <div className="space-y-3 mb-8">
                             {comparisonSummary.dimensions.map((dim, idx) => (
                                 <div key={idx} className="bg-white/80 p-3 rounded-xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                     <div className="flex flex-col w-full md:w-1/3">
                                         <span className="text-sm font-bold text-slate-700">{dim.dimension}</span>
                                         <span className="text-xs text-slate-500 leading-tight mt-0.5">{dim.reasoning}</span>
                                     </div>
                                     <div className="flex items-center gap-4 flex-1 w-full justify-end">
                                         <div className="flex items-center gap-2 flex-1 justify-end">
                                             <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden flex justify-end">
                                                 <div style={{ width: `${dim.scoreA * 10}%` }} className="h-full bg-prism-accent rounded-full" />
                                             </div>
                                             <span className={`text-sm font-mono font-bold ${dim.winner === 'A' ? 'text-prism-accent' : 'text-slate-400'}`}>{dim.scoreA}</span>
                                         </div>
                                         <div className="flex items-center gap-2 flex-1">
                                             <span className={`text-sm font-mono font-bold ${dim.winner === 'B' ? 'text-prism-glow' : 'text-slate-400'}`}>{dim.scoreB}</span>
                                             <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                                 <div style={{ width: `${dim.scoreB * 10}%` }} className="h-full bg-prism-glow rounded-full" />
                                             </div>
                                         </div>
                                     </div>
                                 </div>
                             ))}
                         </div>
                         
                         {/* Interaction Matrix */}
                         <div className={`mb-6 p-5 rounded-xl border ${
                                comparisonSummary.interactionAnalysis.type === 'Synergy' ? 'bg-emerald-50 border-emerald-200' :
                                comparisonSummary.interactionAnalysis.type === 'Conflict' ? 'bg-red-50 border-red-200' :
                                'bg-slate-50 border-slate-200'
                            }`}>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {comparisonSummary.interactionAnalysis.type === 'Synergy' ? <Link className="w-5 h-5 text-emerald-600" /> : 
                                         comparisonSummary.interactionAnalysis.type === 'Conflict' ? <XCircle className="w-5 h-5 text-red-600" /> :
                                         <MinusCircle className="w-5 h-5 text-slate-500" />
                                        }
                                        <h4 className={`text-sm font-bold uppercase tracking-widest ${
                                            comparisonSummary.interactionAnalysis.type === 'Synergy' ? 'text-emerald-700' :
                                            comparisonSummary.interactionAnalysis.type === 'Conflict' ? 'text-red-700' :
                                            'text-slate-700'
                                        }`}>
                                            Interaction Effect: {comparisonSummary.interactionAnalysis.type}
                                        </h4>
                                    </div>
                                    <div className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                         comparisonSummary.interactionAnalysis.recommendation === 'Strongly Recommended' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                         comparisonSummary.interactionAnalysis.recommendation === 'Avoid Combined Rollout' ? 'bg-red-100 text-red-800 border-red-200' :
                                         'bg-slate-100 text-slate-800 border-slate-200'
                                    }`}>
                                        {comparisonSummary.interactionAnalysis.recommendation}
                                    </div>
                                </div>
                                
                                <p className="text-sm text-slate-800 leading-relaxed font-medium mb-3">
                                    {comparisonSummary.interactionAnalysis.mechanism}
                                </p>
                                
                                {comparisonSummary.interactionAnalysis.affectedRegions && comparisonSummary.interactionAnalysis.affectedRegions.length > 0 && (
                                    <div className="flex items-start gap-2 text-xs">
                                        <span className="font-bold text-slate-500 shrink-0 mt-0.5">High Impact Regions:</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {comparisonSummary.interactionAnalysis.affectedRegions.map((r, i) => (
                                                <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm text-slate-600">
                                                    {r}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                         </div>

                         {/* Trade-offs & Analysis */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                             <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100/60">
                                 <h4 className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                     <AlertOctagon className="w-4 h-4" /> Strategic Trade-offs
                                 </h4>
                                 <ul className="space-y-2">
                                     {comparisonSummary.tradeOffs.map((t, i) => (
                                         <li key={i} className="text-sm text-slate-700 flex gap-2">
                                             <span className="text-amber-500 font-bold">•</span>
                                             <span>Sacrifice <strong className="text-slate-900">{t.sacrifice}</strong> for <strong className="text-emerald-700">{t.gain}</strong></span>
                                         </li>
                                     ))}
                                 </ul>
                             </div>
                             <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200/60">
                                 <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                     <Users className="w-4 h-4" /> Regional Delta
                                 </h4>
                                 <div className="space-y-3">
                                     <p className="text-sm text-slate-600 leading-relaxed">
                                         <strong className="text-slate-800">Impact Shift:</strong> {comparisonSummary.regionalAnalysis.deltaSummary}
                                     </p>
                                     <p className="text-sm text-slate-600 leading-relaxed">
                                         <strong className="text-slate-800">Equity Check:</strong> {comparisonSummary.regionalAnalysis.vulnerableGroupImpact}
                                     </p>
                                 </div>
                             </div>
                         </div>
                         
                         {/* Final Recommendation & Confidence */}
                         <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-start gap-4">
                             <Trophy className="w-8 h-8 text-yellow-400 shrink-0" />
                             <div className="flex-1">
                                 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">AI Recommendation</div>
                                 <div className="flex items-center gap-4 mb-2">
                                     <div className="text-xl font-bold text-white">Winner: {comparisonSummary.recommendation.winner}</div>
                                     {/* Confidence Badge */}
                                     {comparisonSummary.decisionConfidence && (
                                         <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border tracking-wider ${
                                             comparisonSummary.decisionConfidence.strength === 'High' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                                             comparisonSummary.decisionConfidence.strength === 'Medium' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
                                             'bg-red-500/20 border-red-500/50 text-red-400'
                                         }`}>
                                             Confidence: {comparisonSummary.decisionConfidence.strength}
                                         </div>
                                     )}
                                 </div>
                                 <p className="text-sm text-slate-300 leading-relaxed">{comparisonSummary.recommendation.rationale}</p>
                                 {comparisonSummary.decisionConfidence && (
                                     <p className="text-xs text-slate-500 mt-2 font-mono">
                                         * {comparisonSummary.decisionConfidence.explanation}
                                     </p>
                                 )}
                             </div>
                         </div>

                    </div>
                ) : (
                    <div className="glass-panel p-8 rounded-3xl border-l-[6px] border-prism-accent bg-white">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center justify-between">
                            Executive Summary
                            {/* NEW: Risk & Confidence Badges */}
                            <div className="flex gap-3">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${resultA.confidenceScore > 80 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                                    <Gauge className="w-4 h-4" />
                                    Conf: {resultA.confidenceScore}%
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border ${resultA.riskLevel === 'Low' ? 'bg-blue-50 border-blue-200 text-blue-700' : resultA.riskLevel === 'Medium' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                    <ShieldAlert className="w-4 h-4" />
                                    Risk: {resultA.riskLevel}
                                </div>
                            </div>
                        </h3>
                        <p className="text-slate-700 text-lg leading-relaxed mb-6 font-medium">{resultA.summary}</p>

                        {/* NEW: Risk Factors List */}
                        {resultA.riskFactors && resultA.riskFactors.length > 0 && (
                            <div className="mb-6 bg-amber-50/50 p-5 rounded-xl border border-amber-100">
                                <h4 className="text-xs font-bold text-amber-600/80 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Detected Risk Factors
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {resultA.riskFactors.map((rf, i) => (
                                        <li key={i} className="text-sm text-slate-800 font-medium flex items-start gap-2">
                                            <span className="text-amber-500 mt-1">•</span> {rf}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {/* New Grounding Visualization */}
                        {resultA.grounding && resultA.grounding.sources.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg ${mode === AnalysisMode.LIVE ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <Search className="w-4 h-4" />
                                        </div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                            {mode === AnalysisMode.LIVE ? "Validated Knowledge Graph (Live)" : "Illustrative Knowledge Graph (Demo)"}
                                        </h4>
                                    </div>
                                    {mode === AnalysisMode.DEMO && (
                                        <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded border border-slate-200 font-medium">Static Mock Data</span>
                                    )}
                                </div>
                                
                                <div className={`space-y-4 ${mode === AnalysisMode.DEMO ? 'opacity-70 grayscale-[0.5]' : ''}`}>
                                    {/* Search Queries */}
                                    {resultA.grounding.queries.length > 0 && (
                                        <div className="flex flex-wrap gap-2.5 mb-3">
                                            {resultA.grounding.queries.map((q, i) => (
                                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 font-semibold">
                                                    <Search className="w-3 h-3 opacity-50" />
                                                    {q}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Sources */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {resultA.grounding.sources.map((source, i) => (
                                            <a 
                                                key={i} 
                                                href={source.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="group flex items-start gap-3 bg-white hover:bg-slate-50 p-3 rounded-xl border border-slate-200 hover:border-prism-accent transition-all text-sm"
                                            >
                                                <div className="mt-0.5 min-w-[14px]">
                                                    <Link2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-prism-accent transition-colors" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="text-slate-800 truncate font-semibold group-hover:text-prism-accent transition-colors" title={source.title}>{source.title}</div>
                                                    <div className="text-xs text-slate-400 truncate mt-0.5">{source.uri}</div>
                                                </div>
                                                <ExternalLink className="w-3 h-3 text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Policy Suggestions */}
                        {resultA.suggestions && resultA.suggestions.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <h4 className="text-base font-bold text-prism-accent mb-4 flex items-center gap-2.5">
                                    <ShieldCheck className="w-5 h-5" />
                                    Mitigation Strategies & Improvements
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {resultA.suggestions.map((s, i) => (
                                        <li key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-700 font-medium leading-relaxed flex gap-3 hover:bg-slate-100 transition-colors shadow-sm">
                                            <div className="min-w-2 h-2 rounded-full bg-prism-accent mt-2" />
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Main Viz Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {/* Map Viz */}
                   <div className="glass-panel p-8 rounded-3xl relative bg-white">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                          <MapIcon className="w-5 h-5 text-prism-glow" />
                          Geospatial Impact
                        </h3>
                        {isCompare && (
                            <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                                <button onClick={() => setActiveMap('A')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${activeMap === 'A' ? 'bg-prism-accent text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Pol A</button>
                                <button onClick={() => setActiveMap('B')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${activeMap === 'B' ? 'bg-prism-glow text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Pol B</button>
                            </div>
                        )}
                      </div>
                      <MapVisualization 
                        scores={activeMap === 'A' ? resultA.scores : (resultB?.scores || [])} 
                        regions={regionsData} // Pass DYNAMIC regions
                        mode={mode}
                      />
                      {isCompare && <div className={`absolute top-24 right-10 text-xs font-bold px-3 py-1.5 rounded-lg border shadow-lg ${activeMap === 'A' ? 'bg-prism-accent/10 border-prism-accent text-prism-accent' : 'bg-prism-glow/10 border-prism-glow text-prism-glow'}`}>Showing Policy {activeMap}</div>}
                   </div>

                   {/* Stats/Chart Viz */}
                   <div className="glass-panel p-8 rounded-3xl flex flex-col h-[650px] bg-white">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                          <Activity className="w-5 h-5 text-prism-success" />
                          Net Impact Score
                        </h3>
                      </div>
                      <div className="flex-1 w-full min-h-0">
                         <ImpactBarChart 
                            scoresA={resultA.scores} 
                            scoresB={isCompare ? resultB?.scores : undefined} 
                            regions={regionsData} // Pass DYNAMIC regions
                            mode={mode}
                         />
                      </div>
                   </div>
                </div>

                {/* Detailed Reasoning Cards */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center justify-between px-2">
                     <h3 className="text-lg font-bold text-slate-700 flex items-center gap-3">
                         <Calculator className="w-5 h-5" />
                         Impact Score Breakdown {isCompare && `(Policy ${activeMap})`}
                     </h3>
                     <span className="text-xs text-slate-400 uppercase tracking-widest font-bold font-mono">MCDA VECTOR ANALYSIS</span>
                  </div>
                  
                  {(activeMap === 'A' ? resultA.scores : (resultB?.scores || [])).map((score) => {
                    const vectors = score.vectorBreakdown;
                    // Find region details from DYNAMIC data
                    const regionDetails = regionsData.find(r => r.id === score.regionId);

                    return (
                        <div key={score.regionId} className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-start gap-6 hover:border-slate-300 hover:shadow-md transition-all group">
                        
                        {/* Top Row: Score + Vectors */}
                        <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                            <div className="flex items-center gap-4 w-full md:w-1/4">
                                <div className={`w-4 h-4 rounded-full shadow-sm ${score.economicScore > 0 ? 'bg-prism-success' : score.economicScore < 0 ? 'bg-prism-danger' : 'bg-prism-warning'}`} />
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 text-lg">{regionDetails?.name || score.regionId}</h4>
                                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Net Impact</div>
                                </div>
                                <span className={`text-3xl font-mono font-bold ${score.economicScore > 0 ? 'text-prism-success' : score.economicScore < 0 ? 'text-prism-danger' : 'text-prism-warning'}`}>
                                    {score.economicScore > 0 ? '+' : ''}{score.economicScore}
                                </span>
                            </div>

                            {/* Vector Visualization */}
                            {vectors && (
                                <div className="flex-1 grid grid-cols-3 gap-4 w-full">
                                    {/* Vector 1: Alignment */}
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col items-center text-center relative overflow-hidden group/vector">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                                        <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold uppercase mb-1">
                                            <Anchor className="w-3.5 h-3.5" /> Alignment
                                        </div>
                                        <div className="text-emerald-600 font-mono font-bold text-lg">+{vectors.alignment.value}</div>
                                        
                                        {/* Transparency Trace */}
                                        {showTransparency ? (
                                             <div className="text-[10px] text-slate-500 font-mono mt-1 opacity-75">
                                                {vectors.alignment.value} × 0.40 = <span className="text-emerald-600">{(vectors.alignment.value * 0.4).toFixed(1)}</span>
                                             </div>
                                        ) : (
                                            <div className="text-xs text-slate-600 font-medium truncate w-full px-2" title={vectors.alignment.label}>{vectors.alignment.label}</div>
                                        )}
                                    </div>

                                    {/* Vector 2: Urgency */}
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col items-center text-center relative overflow-hidden group/vector">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                                        <div className="flex items-center gap-2 text-xs text-amber-600 font-bold uppercase mb-1">
                                            <TrendingUp className="w-3.5 h-3.5" /> Urgency
                                        </div>
                                        <div className="text-amber-600 font-mono font-bold text-lg">+{vectors.urgency.value}</div>
                                        
                                         {/* Transparency Trace */}
                                         {showTransparency ? (
                                             <div className="text-[10px] text-slate-500 font-mono mt-1 opacity-75">
                                                {vectors.urgency.value} × 0.30 = <span className="text-amber-600">{(vectors.urgency.value * 0.3).toFixed(1)}</span>
                                             </div>
                                        ) : (
                                            <div className="text-xs text-slate-600 font-medium truncate w-full px-2" title={vectors.urgency.label}>{vectors.urgency.label}</div>
                                        )}
                                    </div>

                                    {/* Vector 3: Friction */}
                                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col items-center text-center relative overflow-hidden group/vector">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
                                        <div className="flex items-center gap-2 text-xs text-red-600 font-bold uppercase mb-1">
                                            <AlertTriangle className="w-3.5 h-3.5" /> Friction
                                        </div>
                                        <div className="text-red-600 font-mono font-bold text-lg">-{vectors.friction.value}</div>
                                        
                                        {/* Transparency Trace */}
                                        {showTransparency ? (
                                             <div className="text-[10px] text-slate-500 font-mono mt-1 opacity-75">
                                                -{vectors.friction.value} × 0.30 = <span className="text-red-600">{(-1 * vectors.friction.value * 0.3).toFixed(1)}</span>
                                             </div>
                                        ) : (
                                            <div className="text-xs text-slate-600 font-medium truncate w-full px-2" title={vectors.friction.label}>{vectors.friction.label}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Middle Row: Uncertainty Analysis (New) */}
                        {score.confidenceInterval && (
                            <div className="w-full pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <MoveHorizontal className="w-3.5 h-3.5" /> Uncertainty Range
                                    </h5>
                                    {score.uncertaintyDrivers && score.uncertaintyDrivers.length > 0 && (
                                        <div className="flex gap-2">
                                            {score.uncertaintyDrivers.map((driver, i) => (
                                                <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                                    {driver}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="relative h-6 w-full flex items-center">
                                    {/* Track */}
                                    <div className="absolute w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        {/* Range Bar */}
                                        <div 
                                            className="h-full bg-slate-300 opacity-50"
                                            style={{ 
                                                width: `${((score.confidenceInterval.upperBound - score.confidenceInterval.lowerBound) / 20) * 100}%`,
                                                left: `${((score.confidenceInterval.lowerBound + 10) / 20) * 100}%`,
                                                position: 'absolute'
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Worst Case Marker */}
                                    <div 
                                        className="absolute w-0.5 h-3 bg-red-400 top-1.5"
                                        style={{ left: `${((score.confidenceInterval.lowerBound + 10) / 20) * 100}%` }}
                                    />
                                    <div 
                                        className="absolute text-[9px] font-bold text-red-500 -bottom-3 transform -translate-x-1/2"
                                        style={{ left: `${((score.confidenceInterval.lowerBound + 10) / 20) * 100}%` }}
                                    >
                                        {score.confidenceInterval.lowerBound}
                                    </div>

                                    {/* Best Case Marker */}
                                    <div 
                                        className="absolute w-0.5 h-3 bg-emerald-400 top-1.5"
                                        style={{ left: `${((score.confidenceInterval.upperBound + 10) / 20) * 100}%` }}
                                    />
                                    <div 
                                        className="absolute text-[9px] font-bold text-emerald-500 -bottom-3 transform -translate-x-1/2"
                                        style={{ left: `${((score.confidenceInterval.upperBound + 10) / 20) * 100}%` }}
                                    >
                                        {score.confidenceInterval.upperBound}
                                    </div>

                                    {/* Mean Marker */}
                                    <div 
                                        className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 ${score.economicScore > 0 ? 'bg-prism-success' : 'bg-prism-danger'}`}
                                        style={{ left: `calc(${((score.economicScore + 10) / 20) * 100}% - 6px)` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Bottom Row: Detailed Explanation & Citation & Suggestions */}
                        <div className="w-full flex flex-col gap-3 pt-6 mt-2 border-t border-slate-100">
                             {score.detailedExplanation && (
                                <div className="flex gap-3">
                                    <Info className="w-5 h-5 text-prism-accent mt-0.5 shrink-0" />
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                        {score.detailedExplanation}
                                    </p>
                                </div>
                            )}
                             {score.policyCitation && (
                                <div className="flex gap-3 pl-8">
                                    <Quote className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                    <p className="text-xs text-slate-500 font-mono italic">
                                        "{score.policyCitation}"
                                    </p>
                                </div>
                            )}
                            {score.suggestions && score.suggestions.length > 0 && (
                                <div className="flex gap-3 pl-8 pt-2">
                                    <Lightbulb className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                                    <div className="flex flex-col gap-2">
                                        {score.suggestions.map((s, i) => (
                                            <p key={i} className="text-sm text-amber-800 leading-relaxed font-semibold">• {s}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
