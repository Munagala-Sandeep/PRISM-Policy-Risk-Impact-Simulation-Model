

export interface Region {
  id: string;
  name: string;
  lat: number;
  lon: number;
  // Multi-domain Metrics
  msme_density: number;       // Business (Units per 100k pop)
  vulnerability_score: number; // Welfare (1-10)
  literacy_rate: number;      // Education (%)
  healthcare_index: number;   // Health (0-100 NITI Aayog style)
  agriculture_dependency: number; // Agriculture (% of workforce)
  digital_penetration: number; // Tech (% internet access)
}

export interface VectorComponent {
  value: number;
  label: string;
}

export interface ImpactScore {
  regionId: string;
  economicScore: number; // -10 to +10 (Most Likely / Mean)
  
  // New Uncertainty Modeling
  confidenceInterval: {
    lowerBound: number; // Worst Case
    upperBound: number; // Best Case
  };
  uncertaintyDrivers: string[]; // e.g., "High Bureaucracy", "Data Gaps"

  // Structured MCDA Breakdown (Replaces raw string)
  vectorBreakdown: {
    alignment: VectorComponent;
    urgency: VectorComponent;
    friction: VectorComponent;
  };
  
  detailedExplanation: string; 
  policyCitation: string; // The specific clause triggering the score
  suggestions: string[]; // New field: Actionable recommendations for this specific state
}

export interface EquityAlert {
  triggered: boolean;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  affectedRegions: string[];
  cause: string;
  mitigationStrategies: string[];
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface SimulationResult {
  summary: string;
  scores: ImpactScore[];
  // Replaced simple string with structured metadata
  grounding?: {
    queries: string[];
    sources: GroundingSource[];
  };
  identifiedSector: string;
  identifiedKeywords: string[];
  analysisSteps: string[]; 
  suggestions: string[]; 
  
  // Equity Watchdog
  equityAlert?: EquityAlert;

  // Transparency & Risk Metrics
  confidenceScore: number; // 0-100% confidence in the simulation
  riskLevel: 'Low' | 'Medium' | 'High';
  riskFactors: string[]; // Reasons for the risk/uncertainty
}

export enum AnalysisMode {
  DEMO = 'DEMO',
  LIVE = 'LIVE'
}

// --- NEW COMPARISON TYPES ---

export interface InteractionAnalysis {
  type: 'Synergy' | 'Conflict' | 'Neutral';
  mechanism: string; // "Shared digital infrastructure reduces cost for both..."
  affectedRegions: string[]; // List of region names impacted by this interaction
  recommendation: 'Strongly Recommended' | 'Proceed with Caution' | 'Avoid Combined Rollout';
}

export interface ComparisonDimension {
  dimension: string; // e.g., "Economic Efficiency", "Social Equity"
  scoreA: number; // 0-10
  scoreB: number; // 0-10
  winner: 'A' | 'B' | 'Tie';
  reasoning: string;
}

export interface ComparisonResult {
  executiveSummary: string;
  dimensions: ComparisonDimension[];
  tradeOffs: {
    sacrifice: string;
    gain: string;
  }[];
  regionalAnalysis: {
    deltaSummary: string;
    vulnerableGroupImpact: string; // Specific impact on high-vulnerability regions
  };
  interactionAnalysis: InteractionAnalysis; // New field for combinatorial analysis
  recommendation: {
    winner: 'Policy A' | 'Policy B' | 'Conditional';
    rationale: string;
  };
  // New Confidence Assessment
  decisionConfidence: {
    strength: 'High' | 'Medium' | 'Low';
    explanation: string; // e.g. "Low overlap in uncertainty ranges indicates a stable ranking."
  };
}
