
import { Region, SimulationResult, ImpactScore, EquityAlert } from './types';

export const REGIONS: Region[] = [
  // --- NORTH ---
  { id: 'JK', name: 'Jammu & Kashmir', lat: 33.7782, lon: 76.5762, msme_density: 310, vulnerability_score: 5, literacy_rate: 67.2, healthcare_index: 58, agriculture_dependency: 60, digital_penetration: 55 },
  { id: 'LA', name: 'Ladakh', lat: 34.1526, lon: 77.5770, msme_density: 150, vulnerability_score: 6, literacy_rate: 74.2, healthcare_index: 52, agriculture_dependency: 40, digital_penetration: 45 },
  { id: 'HP', name: 'Himachal Pradesh', lat: 31.1048, lon: 77.1734, msme_density: 420, vulnerability_score: 3, literacy_rate: 82.8, healthcare_index: 74, agriculture_dependency: 58, digital_penetration: 70 },
  { id: 'PB', name: 'Punjab', lat: 31.1471, lon: 75.3412, msme_density: 590, vulnerability_score: 3, literacy_rate: 75.8, healthcare_index: 68, agriculture_dependency: 65, digital_penetration: 72 },
  { id: 'HR', name: 'Haryana', lat: 29.0588, lon: 76.0856, msme_density: 610, vulnerability_score: 3, literacy_rate: 75.6, healthcare_index: 65, agriculture_dependency: 50, digital_penetration: 70 },
  { id: 'UK', name: 'Uttarakhand', lat: 30.0668, lon: 79.0193, msme_density: 380, vulnerability_score: 5, literacy_rate: 78.8, healthcare_index: 62, agriculture_dependency: 55, digital_penetration: 60 },
  { id: 'DL', name: 'Delhi', lat: 28.7041, lon: 77.1025, msme_density: 850, vulnerability_score: 2, literacy_rate: 86.2, healthcare_index: 78, agriculture_dependency: 2, digital_penetration: 95 },
  { id: 'UP', name: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462, msme_density: 320, vulnerability_score: 7, literacy_rate: 67.7, healthcare_index: 38, agriculture_dependency: 68, digital_penetration: 45 },
  { id: 'CH', name: 'Chandigarh', lat: 30.7333, lon: 76.7794, msme_density: 780, vulnerability_score: 2, literacy_rate: 86.0, healthcare_index: 80, agriculture_dependency: 5, digital_penetration: 92 },

  // --- WEST ---
  { id: 'RJ', name: 'Rajasthan', lat: 27.0238, lon: 74.2179, msme_density: 380, vulnerability_score: 6, literacy_rate: 66.1, healthcare_index: 41, agriculture_dependency: 62, digital_penetration: 55 },
  { id: 'GJ', name: 'Gujarat', lat: 22.2587, lon: 71.1924, msme_density: 690, vulnerability_score: 4, literacy_rate: 78.0, healthcare_index: 64, agriculture_dependency: 45, digital_penetration: 70 },
  { id: 'MH', name: 'Maharashtra', lat: 19.7515, lon: 75.7139, msme_density: 650, vulnerability_score: 4, literacy_rate: 82.3, healthcare_index: 64, agriculture_dependency: 52, digital_penetration: 78 },
  { id: 'GA', name: 'Goa', lat: 15.2993, lon: 74.1240, msme_density: 620, vulnerability_score: 2, literacy_rate: 88.7, healthcare_index: 70, agriculture_dependency: 15, digital_penetration: 85 },
  { id: 'DH', name: 'Dadra & Nagar Haveli', lat: 20.1809, lon: 73.0169, msme_density: 500, vulnerability_score: 5, literacy_rate: 76.2, healthcare_index: 55, agriculture_dependency: 30, digital_penetration: 60 },

  // --- CENTRAL ---
  { id: 'MP', name: 'Madhya Pradesh', lat: 22.9734, lon: 78.6569, msme_density: 340, vulnerability_score: 7, literacy_rate: 69.3, healthcare_index: 36, agriculture_dependency: 70, digital_penetration: 42 },
  { id: 'CG', name: 'Chhattisgarh', lat: 21.2787, lon: 81.8661, msme_density: 310, vulnerability_score: 7, literacy_rate: 70.3, healthcare_index: 40, agriculture_dependency: 72, digital_penetration: 38 },

  // --- EAST ---
  { id: 'BR', name: 'Bihar', lat: 25.0961, lon: 85.3131, msme_density: 210, vulnerability_score: 8, literacy_rate: 61.8, healthcare_index: 32, agriculture_dependency: 74, digital_penetration: 35 },
  { id: 'JH', name: 'Jharkhand', lat: 23.6102, lon: 85.2799, msme_density: 280, vulnerability_score: 8, literacy_rate: 66.4, healthcare_index: 35, agriculture_dependency: 65, digital_penetration: 40 },
  { id: 'WB', name: 'West Bengal', lat: 22.9868, lon: 87.8550, msme_density: 410, vulnerability_score: 6, literacy_rate: 76.3, healthcare_index: 48, agriculture_dependency: 55, digital_penetration: 50 },
  { id: 'OD', name: 'Odisha', lat: 20.9517, lon: 85.0985, msme_density: 350, vulnerability_score: 7, literacy_rate: 72.9, healthcare_index: 45, agriculture_dependency: 60, digital_penetration: 45 },

  // --- SOUTH ---
  { id: 'KA', name: 'Karnataka', lat: 15.3173, lon: 75.7139, msme_density: 580, vulnerability_score: 3, literacy_rate: 75.4, healthcare_index: 61, agriculture_dependency: 49, digital_penetration: 81 },
  { id: 'TG', name: 'Telangana', lat: 18.1124, lon: 79.0193, msme_density: 560, vulnerability_score: 4, literacy_rate: 72.8, healthcare_index: 60, agriculture_dependency: 55, digital_penetration: 75 },
  { id: 'AP', name: 'Andhra Pradesh', lat: 15.9129, lon: 79.7400, msme_density: 540, vulnerability_score: 4, literacy_rate: 67.0, healthcare_index: 58, agriculture_dependency: 62, digital_penetration: 65 },
  { id: 'TN', name: 'Tamil Nadu', lat: 11.1271, lon: 78.6569, msme_density: 720, vulnerability_score: 3, literacy_rate: 80.1, healthcare_index: 72, agriculture_dependency: 35, digital_penetration: 75 },
  { id: 'KL', name: 'Kerala', lat: 10.8505, lon: 76.2711, msme_density: 550, vulnerability_score: 2, literacy_rate: 94.0, healthcare_index: 82, agriculture_dependency: 28, digital_penetration: 85 },
  { id: 'PY', name: 'Puducherry', lat: 11.9416, lon: 79.8083, msme_density: 600, vulnerability_score: 3, literacy_rate: 85.8, healthcare_index: 70, agriculture_dependency: 20, digital_penetration: 80 },
  { id: 'LD', name: 'Lakshadweep', lat: 10.5667, lon: 72.6417, msme_density: 100, vulnerability_score: 4, literacy_rate: 91.8, healthcare_index: 65, agriculture_dependency: 30, digital_penetration: 70 },
  { id: 'AN', name: 'Andaman & Nicobar', lat: 11.7401, lon: 92.6586, msme_density: 200, vulnerability_score: 5, literacy_rate: 86.6, healthcare_index: 60, agriculture_dependency: 35, digital_penetration: 65 },

  // --- NORTH EAST ---
  { id: 'SK', name: 'Sikkim', lat: 27.5330, lon: 88.5122, msme_density: 250, vulnerability_score: 3, literacy_rate: 81.4, healthcare_index: 68, agriculture_dependency: 50, digital_penetration: 65 },
  { id: 'AS', name: 'Assam', lat: 26.2006, lon: 92.9376, msme_density: 300, vulnerability_score: 6, literacy_rate: 72.2, healthcare_index: 45, agriculture_dependency: 65, digital_penetration: 45 },
  { id: 'ML', name: 'Meghalaya', lat: 25.4670, lon: 91.3662, msme_density: 220, vulnerability_score: 6, literacy_rate: 74.4, healthcare_index: 50, agriculture_dependency: 60, digital_penetration: 50 },
  { id: 'AR', name: 'Arunachal Pradesh', lat: 28.2180, lon: 94.7278, msme_density: 150, vulnerability_score: 6, literacy_rate: 65.3, healthcare_index: 48, agriculture_dependency: 65, digital_penetration: 40 },
  { id: 'NL', name: 'Nagaland', lat: 26.1584, lon: 94.5624, msme_density: 200, vulnerability_score: 6, literacy_rate: 79.6, healthcare_index: 50, agriculture_dependency: 68, digital_penetration: 45 },
  { id: 'MN', name: 'Manipur', lat: 24.6637, lon: 93.9063, msme_density: 240, vulnerability_score: 7, literacy_rate: 76.9, healthcare_index: 52, agriculture_dependency: 60, digital_penetration: 48 },
  { id: 'MZ', name: 'Mizoram', lat: 23.1645, lon: 92.9376, msme_density: 230, vulnerability_score: 4, literacy_rate: 91.3, healthcare_index: 65, agriculture_dependency: 55, digital_penetration: 60 },
  { id: 'TR', name: 'Tripura', lat: 23.9408, lon: 91.9882, msme_density: 290, vulnerability_score: 5, literacy_rate: 87.2, healthcare_index: 58, agriculture_dependency: 50, digital_penetration: 55 },
];

export const DEMO_POLICY = "National Digital Health Mission: A unified digital health infrastructure to bridge the gap in healthcare access and provide universal health IDs.";
export const DEMO_POLICY_B = "Agrarian Reform Bill 2024: Subsidies for organic farming equipment, MSP guarantees, and cold chain infrastructure development.";

export const generateDemoResult = (policyText: string, overrideRegions?: Region[]): SimulationResult => {
  const text = policyText.toLowerCase();
  
  // Use passed regions (e.g. from transparency updates) or default to constants
  const targetRegions = overrideRegions || REGIONS;

  // 1. MECHANISM & SECTOR DETECTION
  const isIncentive = /subsidy|grant|fund|scheme|bonus|incentive|investment|support|free|allowance/i.test(text);
  const isRestrictive = /tax|compliance|audit|ban|fine|penalty|regulation|mandatory|restriction|cess|duty/i.test(text);
  const isDigital = /digital|online|portal|tech|smart|app|platform|internet|cyber|data/i.test(text);
  
  // Standardized weights to match Transparency Panel & Live Gemini Logic
  const W_ALIGNMENT = 0.40;
  const W_URGENCY = 0.30;
  const W_FRICTION = 0.30;

  const sectors = [
    { name: 'Healthcare', weight: 0, keywords: ['health', 'hospital', 'medical', 'doctor', 'patient', 'disease', 'vaccine'], metric: 'healthcare_index' as keyof Region },
    { name: 'Education', weight: 0, keywords: ['education', 'school', 'literacy', 'student', 'university', 'skill', 'teacher'], metric: 'literacy_rate' as keyof Region },
    { name: 'Agriculture', weight: 0, keywords: ['agri', 'farm', 'crop', 'harvest', 'rural', 'seed', 'fertilizer', 'msp', 'irrigation'], metric: 'agriculture_dependency' as keyof Region },
    { name: 'Manufacturing', weight: 0, keywords: ['industry', 'manufacturing', 'factory', 'msme', 'trade', 'export', 'production'], metric: 'msme_density' as keyof Region },
    { name: 'Technology', weight: 0, keywords: ['tech', 'digital', 'cyber', 'data', 'software', 'network', 'ai', 'broadband'], metric: 'digital_penetration' as keyof Region },
    { name: 'Environment', weight: 0, keywords: ['climate', 'carbon', 'green', 'pollution', 'sustainable', 'forest', 'water', 'waste', 'solar', 'energy'], metric: 'vulnerability_score' as keyof Region },
    { name: 'Social Welfare', weight: 0, keywords: ['welfare', 'poverty', 'ration', 'housing', 'labor', 'employment', 'social', 'inclusion', 'women', 'child'], metric: 'vulnerability_score' as keyof Region },
    { name: 'Infrastructure', weight: 0, keywords: ['road', 'transport', 'highway', 'power', 'grid', 'urban', 'logistics', 'rail', 'metro'], metric: 'msme_density' as keyof Region },
    { name: 'Finance', weight: 0, keywords: ['tax', 'gst', 'bank', 'loan', 'credit', 'fiscal', 'audit', 'monetary', 'insurance'], metric: 'msme_density' as keyof Region },
  ];

  sectors.forEach(s => {
    s.keywords.forEach(k => {
      if (text.includes(k)) s.weight += 1;
    });
  });

  sectors.sort((a, b) => b.weight - a.weight);
  // Default to Manufacturing if no keywords found, otherwise top hit
  const primarySector = sectors[0].weight > 0 ? sectors[0] : sectors[3]; 

  const analysisSteps: string[] = [
    `Detected Domain: ${primarySector.name} (Relevance Score: ${primarySector.weight})`,
    `Policy Mechanism: ${isIncentive ? 'Incentive-based' : isRestrictive ? 'Regulatory/Restrictive' : 'Structural Reform'}`,
    `MCDA Weights: Alignment (${(W_ALIGNMENT*100).toFixed(0)}%), Urgency (${(W_URGENCY*100).toFixed(0)}%), Friction (${(W_FRICTION*100).toFixed(0)}%)`
  ];

  // 2. REGIONAL MCDA SCORING
  const scores: ImpactScore[] = targetRegions.map(region => {
      // Metrics (Normalized 0-1)
      const mDigital = region.digital_penetration / 100;
      const mLiteracy = region.literacy_rate / 100;
      const mVuln = region.vulnerability_score / 10;
      const mHealth = region.healthcare_index / 100;
      const mAgri = region.agriculture_dependency / 100;
      const mBiz = Math.min(region.msme_density / 800, 1); 

      // --- VECTOR 1: STRUCTURAL ALIGNMENT ---
      let alignment = 0;
      let alignReason = "";
      
      switch(primarySector.name) {
          case 'Technology':
              alignment = mDigital * 10; alignReason = "Digital Infra"; break;
          case 'Agriculture':
              alignment = mAgri * 10; alignReason = "Agri Economy"; break;
          case 'Manufacturing':
          case 'Finance':
              alignment = mBiz * 10; alignReason = "Industrial Base"; break;
          case 'Education':
              alignment = mLiteracy * 10; alignReason = "Literacy Rate"; break;
          case 'Healthcare':
              alignment = mHealth * 10; alignReason = "Health Index"; break;
          case 'Environment':
              alignment = mHealth * 10; alignReason = "Admin Capacity"; break; 
          case 'Infrastructure':
              alignment = mBiz * 10; alignReason = "Economic Density"; break;
          case 'Social Welfare':
              alignment = mLiteracy * 10; alignReason = "Delivery Network"; break; 
          default:
              alignment = 5; alignReason = "General Capacity";
      }

      // Modifier: Digital mode policies need digital alignment regardless of sector
      if (isDigital && primarySector.name !== 'Technology') {
          alignment = (alignment * 0.6) + (mDigital * 4);
          alignReason += " + Connectivity";
      }

      // --- VECTOR 2: SOCIO-ECONOMIC URGENCY ---
      let urgency = 0;
      let urgencyReason = "";

      switch(primarySector.name) {
          case 'Healthcare':
              urgency = (1 - mHealth) * 10; urgencyReason = "Health Gaps"; break;
          case 'Education':
              urgency = (1 - mLiteracy) * 10; urgencyReason = "Skill Gap"; break;
          case 'Environment':
              urgency = mVuln * 10; urgencyReason = "Eco-Fragility"; break;
          case 'Social Welfare':
              urgency = mVuln * 10; urgencyReason = "Poverty Levels"; break;
          case 'Infrastructure':
              urgency = (1 - mBiz) * 10; urgencyReason = "Infra Deficit"; break;
          case 'Finance':
              urgency = mBiz * 10; urgencyReason = "Credit Demand"; break; 
          default:
              urgency = mVuln * 10; urgencyReason = "Social Need";
      }
      
      if (isIncentive) urgency = Math.min(10, urgency * 1.2);

      // --- VECTOR 3: IMPLEMENTATION FRICTION ---
      let friction = 0;
      let frictionReason = "";

      let baseFriction = isRestrictive ? 7 : 3;
      
      // Calculate capacity to absorb/implement
      const capacity = (mLiteracy + mDigital + mHealth) / 3;
      
      // Sector specific friction logic
      if (primarySector.name === 'Environment' && isRestrictive) {
          friction = mBiz * 8; // Industrial states resist environmental restrictions
          frictionReason = "Industry Pushback";
      } else if (primarySector.name === 'Social Welfare') {
          friction = (1 - mDigital) * 8; // Low digital states struggle with leakage/delivery
          frictionReason = "Leakage Risk";
      } else if (primarySector.name === 'Agriculture' && isRestrictive) {
          friction = mAgri * 9; // High agri states resist farm restrictions
          frictionReason = "Agrarian Unrest";
      } else {
          friction = (baseFriction * (1 - capacity)) + (mVuln * 1);
          frictionReason = capacity < 0.6 ? "Admin Capacity" : "Compliance Cost";
      }

      // --- FINAL SCORE ---
      const valAlignment = alignment * W_ALIGNMENT;
      const valUrgency = urgency * W_URGENCY;
      const valFriction = friction * W_FRICTION;

      let totalScore = valAlignment + valUrgency - valFriction;
      totalScore = Math.max(-9.8, Math.min(9.8, totalScore));
      totalScore += (Math.random() * 0.4 - 0.2); 
      
      // --- UNCERTAINTY MODELLING (New) ---
      // Logic: Uncertainty increases with Friction (volatility) and Vulnerability (instability)
      const baseUncertainty = 1.0;
      const frictionRisk = friction * 0.3; 
      const instability = mVuln * 0.2; 
      
      const spreadDown = baseUncertainty + frictionRisk + instability; // Downside risk
      const spreadUp = baseUncertainty + (capacity * 1.0); // Upside potential

      const lowerBound = Math.max(-10, parseFloat((totalScore - spreadDown).toFixed(1)));
      const upperBound = Math.min(10, parseFloat((totalScore + spreadUp).toFixed(1)));

      const uncertaintyDrivers = [];
      if (friction > 5) uncertaintyDrivers.push("Implementation Friction");
      if (mVuln > 6) uncertaintyDrivers.push("Socio-Economic Instability");
      if (mDigital < 0.5 && isDigital) uncertaintyDrivers.push("Digital Gap");
      if (uncertaintyDrivers.length === 0) uncertaintyDrivers.push("Standard Variance");

      // --- DYNAMIC EXPLANATION GENERATOR ---
      let explanation = "";
      if (totalScore > 4) {
          explanation = `Strong synergy detected. ${region.name}'s robust **${alignReason}** (${(alignment).toFixed(1)}/10) positions it to maximize policy benefits, outweighing minor **${frictionReason}**.`;
      } else if (totalScore < 0) {
          explanation = `Implementation risks dominate. Despite urgent **${urgencyReason}**, severe **${frictionReason}** suggests the state lacks the capacity to absorb this reform effectively.`;
      } else {
          explanation = `Balanced outlook. While **${alignReason}** offers potential, significant **${frictionReason}** acts as a bottleneck, neutralizing the impact of addressing **${urgencyReason}**.`;
      }

      // --- DYNAMIC SUGGESTION ENGINE ---
      const suggestions = [];

      // 1. Digital Divide Suggestions
      if (isDigital && region.digital_penetration < 55) {
          suggestions.push("Mandate offline assistance kiosks (CSCs) for last-mile access.");
          suggestions.push("Launch voice-assisted vernacular interfaces for low-literacy users.");
      }

      // 2. High Vulnerability Suggestions
      if (region.vulnerability_score > 6) {
          suggestions.push("Ring-fence 15% of funds for direct beneficiary transfer (DBT).");
          suggestions.push("Deploy mobile enforcement units to prevent leakage.");
      }

      // 3. Sector Specific Suggestions
      if (primarySector.name === 'Agriculture') {
          if (region.agriculture_dependency > 60) {
              suggestions.push("Partner with local FPOs for grassroots adoption.");
          } else {
              suggestions.push("Focus on urban-peri-urban supply chain links.");
          }
      } else if (primarySector.name === 'Healthcare') {
          if (region.healthcare_index < 50) {
              suggestions.push("Prioritize brownfield upgrades of PHCs over new builds.");
          }
      } else if (primarySector.name === 'Manufacturing') {
          if (region.msme_density > 500) {
              suggestions.push("Create a single-window clearance portal for MSMEs.");
          } else {
              suggestions.push("Incentivize cluster development to build critical mass.");
          }
      }

      // 4. Fallback Generic Suggestions
      if (suggestions.length === 0) {
          if (friction > 6) {
              suggestions.push("Implement a phased rollout starting with district pilots.");
          } else {
              suggestions.push("Establish a real-time monitoring dashboard.");
          }
      }

      // Slice to ensure we don't overwhelm the UI
      const finalSuggestions = suggestions.slice(0, 2);

      // --- CITATION VARIATION ---
      const citations = [
          isRestrictive ? `Section 4(b): Compliance Mandate` : `Clause 12: Incentive Structure`,
          `Appendix A: Regional Allocation Framework`,
          `Section 8: Implementation Guidelines`,
          `Notification 2024-25: Fiscal Provisions`
      ];
      const randomCitation = citations[Math.floor(Math.random() * citations.length)];

      return {
          regionId: region.id,
          economicScore: parseFloat(totalScore.toFixed(1)),
          confidenceInterval: {
              lowerBound,
              upperBound
          },
          uncertaintyDrivers,
          vectorBreakdown: {
            alignment: { value: parseFloat(valAlignment.toFixed(1)), label: alignReason },
            urgency: { value: parseFloat(valUrgency.toFixed(1)), label: urgencyReason },
            friction: { value: parseFloat(valFriction.toFixed(1)), label: frictionReason }
          },
          detailedExplanation: explanation,
          policyCitation: randomCitation,
          suggestions: finalSuggestions
      };
  });
  
  const avgScore = scores.reduce((sum, s) => sum + s.economicScore, 0) / scores.length;
  const sentiment = avgScore > 2 ? "Positive" : avgScore < 0 ? "Negative" : "Mixed";
  const winningRegion = scores.reduce((prev, current) => (prev.economicScore > current.economicScore) ? prev : current);
  const losingRegion = scores.reduce((prev, current) => (prev.economicScore < current.economicScore) ? prev : current);
  const winningName = targetRegions.find(r => r.id === winningRegion.regionId)?.name;
  const losingName = targetRegions.find(r => r.id === losingRegion.regionId)?.name;

  // --- EQUITY WATCHDOG LOGIC (Mock) ---
  const vulnerableRegions = targetRegions.filter(r => r.vulnerability_score >= 7);
  const vulnerableScores = scores.filter(s => vulnerableRegions.some(vr => vr.id === s.regionId));
  const vulnerableAvg = vulnerableScores.reduce((sum, s) => sum + s.economicScore, 0) / (vulnerableScores.length || 1);
  const developedRegions = targetRegions.filter(r => r.vulnerability_score <= 3);
  const developedScores = scores.filter(s => developedRegions.some(dr => dr.id === s.regionId));
  const developedAvg = developedScores.reduce((sum, s) => sum + s.economicScore, 0) / (developedScores.length || 1);

  // Trigger if Vulnerable Gap is significant or absolute score is bad
  const equityGap = developedAvg - vulnerableAvg;
  let equityAlert: EquityAlert | undefined;
  
  if (equityGap > 4.0 || vulnerableAvg < -1.5) {
      equityAlert = {
          triggered: true,
          severity: vulnerableAvg < -3 ? 'High' : 'Medium',
          affectedRegions: vulnerableScores.filter(s => s.economicScore < 0).map(s => targetRegions.find(r => r.id === s.regionId)?.name || s.regionId),
          cause: isDigital ? "Digital Exclusion in Low-Connectivity Regions" : "Disproportionate Compliance Burden on Low-Capacity States",
          mitigationStrategies: [
              "Introduce progressive tiers based on state vulnerability index.",
              "Allocate 15% 'Equity Grant' top-up for affected regions."
          ]
      };
  } else {
       equityAlert = {
          triggered: false,
          severity: 'Low',
          affectedRegions: [],
          cause: "",
          mitigationStrategies: []
       };
  }

  // Strategic Global Suggestions Generation
  const suggestions: string[] = [];
  
  if (primarySector.name === 'Environment') {
      suggestions.push("Establish a 'Green Transition Fund' to compensate industrial states for compliance costs.");
      suggestions.push("Create inter-state river/forest corridor authorities to manage cross-border externalities.");
      suggestions.push("Link fiscal transfers to specific climate adaptation outcomes.");
  } else if (primarySector.name === 'Social Welfare') {
      suggestions.push("Implement a portable benefits architecture to support migrant labor across state lines.");
      suggestions.push("Create a federal digital registry to de-duplicate beneficiaries and reduce leakage.");
      suggestions.push("Incentivize states with matching grants based on last-mile delivery performance.");
  } else if (primarySector.name === 'Infrastructure') {
      suggestions.push("Standardize land acquisition norms to reduce project delays across regions.");
      suggestions.push("Introduce 'Infrastructure Investment Trusts' (InvITs) with tax breaks for retail investors.");
      suggestions.push("Focus on multi-modal logistics parks in high-density corridors like " + winningName + ".");
  } else {
      // Default / General
      suggestions.push(isRestrictive 
          ? `Introduce a tiered compliance framework to reduce burden on smaller entities in ${losingName}.` 
          : `Expand the incentive pool for lagging regions like ${losingName} to prevent regional divergence.`);
      suggestions.push(`Establish a central data exchange for real-time ${primarySector.name} monitoring.`);
      suggestions.push(`Launch a 'Model State' program in ${winningName} to blueprint best practices.`);
  }

  // MOCK GROUNDING DATA FOR DEMO MODE
  const demoGrounding = {
      queries: [
          `impact of ${primarySector.name} policies in India state-wise`,
          `current ${primarySector.name} budget allocation 2024`,
          `${primarySector.name} challenges in ${losingName} vs ${winningName}`
      ],
      sources: [
          { title: `NITI Aayog: ${primarySector.name} Index Report`, uri: "https://niti.gov.in/" },
          { title: "Ministry of Statistics: Regional Data", uri: "https://mospi.gov.in/data" },
          { title: "Economic Times: Sector Analysis", uri: "https://economictimes.indiatimes.com" }
      ]
  };

  // RISK & CONFIDENCE MOCK LOGIC
  const confidenceScore = text.length > 50 ? 92 : 75; // Shorter policies are ambiguous
  const riskLevel = isRestrictive ? "High" : "Medium";
  const riskFactors = isRestrictive 
    ? ["Compliance friction for MSMEs", "Potential legal challenges by states"]
    : ["Funding leakage risks", "Infrastructure readiness delays"];


  return {
    summary: `Simulation suggests a ${sentiment} net impact (Avg: ${avgScore.toFixed(1)}). The policy leverages the high ${primarySector.name === 'Environment' ? 'institutional capacity' : 'infrastructure base'} of ${winningName}, but ${losingName} faces risks due to ${isRestrictive ? 'compliance burden' : 'implementation gaps'}. Strategic alignment with federal goals is recommended.`,
    scores,
    identifiedSector: primarySector.name,
    identifiedKeywords: primarySector.keywords.filter(k => text.includes(k)).slice(0, 3),
    analysisSteps,
    suggestions,
    grounding: demoGrounding,
    confidenceScore,
    riskLevel,
    riskFactors,
    equityAlert
  };
};

export const DEMO_RESULT = generateDemoResult(DEMO_POLICY);
export const DEMO_RESULT_B = generateDemoResult(DEMO_POLICY_B);
