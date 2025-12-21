
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine, Legend, ErrorBar } from 'recharts';
import { ImpactScore, Region, AnalysisMode } from '../types';

interface ChartsProps {
  scoresA: ImpactScore[];
  scoresB?: ImpactScore[];
  labelA?: string;
  labelB?: string;
  regions: Region[]; 
  mode?: AnalysisMode;
}

export const ImpactBarChart: React.FC<ChartsProps> = ({ scoresA, scoresB, labelA = "Policy A", labelB = "Policy B", regions, mode }) => {
  // Filter regions: Only include regions that exist in either scoresA or scoresB (if comparison active)
  const relevantRegions = regions.filter(region => {
      const inA = scoresA.some(s => s.regionId === region.id);
      const inB = scoresB ? scoresB.some(s => s.regionId === region.id) : false;
      return inA || inB;
  });

  const data = relevantRegions.map(region => {
    const scoreA = scoresA.find(s => s.regionId === region.id);
    const scoreB = scoresB ? scoresB.find(s => s.regionId === region.id) : null;
    
    // Prepare Data for Error Bars
    // Recharts ErrorBar typically expects the error magnitude relative to the value
    // But since our bounds might be asymmetric, we can calculate a symmetric approximation for the chart
    // OR, we can pass [min, max] if using range charts. For simple ErrorBar, we use an error value.
    // Here we calculate the symmetric error for visualization purposes: (Upper - Lower) / 2
    
    const errA = scoreA && scoreA.confidenceInterval 
        ? (scoreA.confidenceInterval.upperBound - scoreA.confidenceInterval.lowerBound) / 2 
        : 0;

    const errB = scoreB && scoreB.confidenceInterval
        ? (scoreB.confidenceInterval.upperBound - scoreB.confidenceInterval.lowerBound) / 2
        : 0;

    return {
      name: region.name,
      scoreA: scoreA ? scoreA.economicScore : 0,
      errorA: errA,
      rangeA: scoreA ? `[${scoreA.confidenceInterval.lowerBound} to ${scoreA.confidenceInterval.upperBound}]` : '',
      scoreB: scoreB ? scoreB.economicScore : 0,
      errorB: errB,
      rangeB: scoreB ? `[${scoreB.confidenceInterval.lowerBound} to ${scoreB.confidenceInterval.upperBound}]` : '',
      reasonA: scoreA ? scoreA.detailedExplanation : '',
      reasonB: scoreB ? scoreB.detailedExplanation : '',
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xl text-sm max-w-[300px] z-50 backdrop-blur-md">
          <p className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 text-base">{label}</p>
          
          {/* Policy A */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <span className="text-prism-accent font-bold text-sm">{labelA}</span>
                <div className="text-right">
                    <span className={`font-mono font-bold text-base ${payload[0].value > 0 ? 'text-prism-success' : 'text-prism-danger'}`}>{payload[0].value}</span>
                    <div className="text-[10px] text-slate-400 font-mono">Range: {payload[0].payload.rangeA}</div>
                </div>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">{payload[0].payload.reasonA}</p>
          </div>

          {/* Policy B */}
          {payload[1] && (
             <div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-prism-glow font-bold text-sm">{labelB}</span>
                    <div className="text-right">
                         <span className={`font-mono font-bold text-base ${payload[1].value > 0 ? 'text-prism-success' : 'text-prism-danger'}`}>{payload[1].value}</span>
                         <div className="text-[10px] text-slate-400 font-mono">Range: {payload[1].payload.rangeB}</div>
                    </div>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed font-medium">{payload[1].payload.reasonB}</p>
             </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[600px] relative">
      {/* Chart Watermark */}
      <div className="absolute top-0 right-0 z-10 opacity-10 pointer-events-none">
          <span className="text-5xl font-black uppercase text-slate-900 tracking-tighter">
              {mode === AnalysisMode.LIVE ? "LIVE AI" : "DEMO"}
          </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" domain={[-12, 12]} hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={110} 
            tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Inter', fontWeight: 600 }} 
            interval={0} 
          />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(56, 189, 248, 0.05)'}} />
          <ReferenceLine x={0} stroke="#94a3b8" />
          <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '15px', color: '#475569', fontWeight: 500 }} />
          
          <Bar dataKey="scoreA" name={labelA} fill="#0284c7" radius={[0, 4, 4, 0]} barSize={scoresB ? 10 : 16}>
            <ErrorBar dataKey="errorA" width={4} strokeWidth={2} stroke="#0c4a6e" />
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.scoreA >= 0 ? '#0284c7' : '#ef4444'} />
            ))}
          </Bar>
          
          {scoresB && (
            <Bar dataKey="scoreB" name={labelB} fill="#6366f1" radius={[0, 4, 4, 0]} barSize={10}>
                <ErrorBar dataKey="errorB" width={4} strokeWidth={2} stroke="#312e81" />
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.scoreB >= 0 ? '#6366f1' : '#f59e0b'} />
                ))}
            </Bar>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
