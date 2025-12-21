
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { Activity, BookOpen, Heart, Sprout, Wifi, Building2, AlertTriangle, ArrowRight, Info, Quote, Lightbulb, FlaskConical, Sparkles, TrendingUp, MoveHorizontal } from 'lucide-react';
import { Region, ImpactScore, AnalysisMode } from '../types';

interface MapVisualizationProps {
  scores: ImpactScore[];
  regions: Region[]; 
  mode?: AnalysisMode;
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({ scores, regions, mode }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true
    }).setView([22.5, 82.0], 5);

    // Light Mode Tiles (CartoDB Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      className: 'map-tiles' 
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // Filter regions to ONLY those that have a score. 
    const relevantRegions = regions.filter(region => scores.some(s => s.regionId === region.id));

    relevantRegions.forEach((region) => {
      const scoreData = scores.find(s => s.regionId === region.id);
      const score = scoreData?.economicScore || 0;
      
      let fillColor = '#fbbf24'; 
      let color = '#d97706';
      
      if (score > 2) {
        fillColor = '#34d399'; 
        color = '#059669';
      } else if (score < 0) {
        fillColor = '#f87171'; 
        color = '#dc2626';
      }

      const radius = Math.max(6, Math.min(Math.abs(score) * 2 + 5, 20));

      const popupHtml = renderToStaticMarkup(
        <div className="min-w-[320px]">
            <div className="flex justify-between items-start mb-4 border-b border-slate-200 pb-3">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{region.name}</h3>
                    <div className="text-xs text-prism-accent uppercase tracking-wide font-bold mt-1">Regional Impact Analysis</div>
                </div>
                <div className="text-right">
                    <span className={`text-3xl font-mono font-bold ${score > 0 ? 'text-prism-success' : score < 0 ? 'text-prism-danger' : 'text-prism-warning'}`}>
                        {score > 0 ? '+' : ''}{score}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5 text-slate-600">
                    <StatItem icon={<Building2 />} label="MSME Density" value={region.msme_density} />
                    <StatItem icon={<AlertTriangle />} label="Vulnerability" value={region.vulnerability_score} max={10} />
                    <StatItem icon={<BookOpen />} label="Literacy" value={region.literacy_rate + '%'} />
                    <StatItem icon={<Heart />} label="Health Index" value={region.healthcare_index} />
                    <StatItem icon={<Sprout />} label="Agri Depend." value={region.agriculture_dependency + '%'} />
                    <StatItem icon={<Wifi />} label="Digital Pen." value={region.digital_penetration + '%'} />
            </div>

            {scoreData?.vectorBreakdown && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="text-xs uppercase text-slate-500 font-bold flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-prism-glow" /> 
                            Vector Breakdown
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm font-mono text-slate-700 shadow-sm flex flex-col gap-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-emerald-700 font-bold">Align: +{scoreData.vectorBreakdown.alignment.value}</span>
                                <span className="text-slate-500 text-xs font-sans">{scoreData.vectorBreakdown.alignment.label}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-amber-700 font-bold">Urg: +{scoreData.vectorBreakdown.urgency.value}</span>
                                <span className="text-slate-500 text-xs font-sans">{scoreData.vectorBreakdown.urgency.label}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-red-700 font-bold">Fric: -{scoreData.vectorBreakdown.friction.value}</span>
                                <span className="text-slate-500 text-xs font-sans">{scoreData.vectorBreakdown.friction.label}</span>
                            </div>
                        </div>
                    </div>

                    {/* Uncertainty Visualizer */}
                    {scoreData.confidenceInterval && (
                         <div className="space-y-1.5 py-1">
                             <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                 <span>Worst Case</span>
                                 <span>Best Case</span>
                             </div>
                             <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden w-full">
                                 {/* Full Range Bar */}
                                 <div 
                                     className="absolute h-full bg-slate-300 opacity-50"
                                     style={{ 
                                         left: `${((scoreData.confidenceInterval.lowerBound + 10) / 20) * 100}%`,
                                         width: `${((scoreData.confidenceInterval.upperBound - scoreData.confidenceInterval.lowerBound) / 20) * 100}%` 
                                     }}
                                 />
                                 {/* Mean Dot */}
                                 <div 
                                     className={`absolute h-full w-1 ${score > 0 ? 'bg-prism-success' : 'bg-prism-danger'}`}
                                     style={{ left: `${((score + 10) / 20) * 100}%` }}
                                 />
                             </div>
                             <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500">
                                 <span>{scoreData.confidenceInterval.lowerBound}</span>
                                 <span>{scoreData.confidenceInterval.upperBound}</span>
                             </div>
                         </div>
                    )}

                    {scoreData.detailedExplanation && (
                        <div className="space-y-2 mt-2">
                            <div className="text-xs uppercase text-slate-500 font-bold flex items-center gap-2">
                                <Info className="w-3.5 h-3.5 text-prism-accent" /> 
                                Analysis & Recommendation
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-slate-200 text-sm text-slate-800 shadow-sm leading-relaxed font-medium">
                                {scoreData.detailedExplanation}
                            </div>
                        </div>
                    )}
                    
                     {scoreData.policyCitation && (
                        <div className="flex gap-2 pl-2 border-l-4 border-slate-300">
                            <Quote className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-slate-600 font-mono italic leading-tight">
                                "{scoreData.policyCitation}"
                            </p>
                        </div>
                    )}

                    {scoreData.suggestions && scoreData.suggestions.length > 0 && (
                         <div className="mt-3 pt-3 border-t border-slate-200">
                            <div className="text-xs uppercase text-amber-700/80 font-bold mb-2 flex items-center gap-2">
                                <Lightbulb className="w-3.5 h-3.5" /> Key Action Items
                            </div>
                            <ul className="list-disc pl-4 space-y-1">
                                {scoreData.suggestions.map((s, i) => (
                                    <li key={i} className="text-xs text-slate-700 font-semibold leading-tight pl-0.5">{s}</li>
                                ))}
                            </ul>
                         </div>
                    )}
                </div>
            )}
        </div>
      );

      const tooltipHtml = renderToStaticMarkup(
         <div className="text-center bg-white p-2 rounded border border-slate-200 shadow-md min-w-[100px]">
            <div className="font-bold text-base text-slate-800">{region.name}</div>
            <div className={`font-mono font-bold text-lg ${score > 0 ? 'text-prism-success' : score < 0 ? 'text-prism-danger' : 'text-prism-warning'}`}>
                {score > 0 ? '+' : ''}{score}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Click for details</div>
         </div>
      );

      const marker = L.circleMarker([region.lat, region.lon], {
        radius: radius,
        fillColor: fillColor,
        color: color,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });

      marker.bindPopup(popupHtml, { 
        minWidth: 340, 
        className: 'glass-popup'
      });

      marker.bindTooltip(tooltipHtml, {
        direction: 'top',
        offset: [0, -10],
        opacity: 1,
        sticky: true,
        className: 'custom-leaflet-tooltip'
      });

      marker.addTo(layerGroup);
    });

  }, [scores, regions]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 group">
        <div ref={mapRef} className="w-full h-full z-0" />
        
        {/* Mode Watermark */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-1 pointer-events-none">
             {mode === AnalysisMode.LIVE ? (
                <div className="bg-white/90 backdrop-blur-md border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wide">Live AI View</span>
                </div>
             ) : (
                <div className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-wide">Demo View</span>
                </div>
             )}
        </div>

        <div className="absolute bottom-6 left-6 bg-white/95 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 backdrop-blur-md z-[400] shadow-lg pointer-events-none">
            <div className="font-bold mb-2 text-slate-800 text-sm">Impact Intensity</div>
            <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded-full bg-prism-success border border-green-700"></span> 
                <span className="font-medium">Positive ({'>'}2.0)</span>
            </div>
            <div className="flex items-center gap-2 mb-1.5">
                <span className="w-3 h-3 rounded-full bg-prism-warning border border-yellow-700"></span> 
                <span className="font-medium">Mixed/Neutral (0-2)</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-prism-danger border border-red-700"></span> 
                <span className="font-medium">Negative ({'<'}0)</span>
            </div>
        </div>
        <style>{`
            .leaflet-tooltip.custom-leaflet-tooltip {
                background-color: transparent;
                border: none;
                box-shadow: none;
                padding: 0;
            }
            .leaflet-tooltip-top:before {
                display: none;
            }
            .leaflet-popup-content-wrapper {
                border-radius: 1rem;
            }
        `}</style>
    </div>
  );
};

const StatItem = ({ icon, label, value, max }: { icon: React.ReactNode, label: string, value: string | number, max?: number }) => (
    <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200 flex flex-col gap-1 hover:bg-slate-200/60 transition-colors">
        <div className="flex items-center gap-2 text-slate-500">
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-3.5 h-3.5" })}
            <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
        </div>
        <div className="text-sm font-bold text-slate-800 truncate pl-5">
            {value} {max && <span className="text-slate-400 text-[10px] font-normal">/{max}</span>}
        </div>
    </div>
);
