
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SimulationResult, GroundingSource, Region, ComparisonResult } from '../types';

// Define the response schema strictly with nested objects
const impactSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Executive summary (max 2 sentences).",
    },
    identifiedSector: {
      type: Type.STRING,
      description: "Primary policy domain."
    },
    identifiedKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Top 3 policy levers."
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "0-100 confidence score."
    },
    riskLevel: {
      type: Type.STRING,
      enum: ["Low", "Medium", "High"],
      description: "Implementation risk level."
    },
    riskFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 2 major risks."
    },
    
    // Equity Watchdog Schema
    equityAlert: {
        type: Type.OBJECT,
        properties: {
            triggered: { type: Type.BOOLEAN },
            severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
            affectedRegions: { type: Type.ARRAY, items: { type: Type.STRING } },
            cause: { type: Type.STRING },
            mitigationStrategies: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["triggered", "severity", "affectedRegions", "cause", "mitigationStrategies"]
    },

    analysisSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-4 bullet points on model logic."
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2 high-level recommendations."
    },
    scores: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          regionId: { type: Type.STRING },
          economicScore: { type: Type.NUMBER },
          
          // New Uncertainty Fields
          confidenceInterval: {
            type: Type.OBJECT,
            properties: {
                lowerBound: { type: Type.NUMBER },
                upperBound: { type: Type.NUMBER }
            },
            required: ["lowerBound", "upperBound"]
          },
          uncertaintyDrivers: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },

          // Strict JSON Structure for Vectors
          vectorBreakdown: {
            type: Type.OBJECT,
            properties: {
              alignment: { 
                type: Type.OBJECT, 
                properties: { 
                  value: { type: Type.NUMBER }, 
                  label: { type: Type.STRING } 
                },
                required: ["value", "label"]
              },
              urgency: { 
                type: Type.OBJECT, 
                properties: { 
                  value: { type: Type.NUMBER }, 
                  label: { type: Type.STRING } 
                },
                required: ["value", "label"]
              },
              friction: { 
                type: Type.OBJECT, 
                properties: { 
                  value: { type: Type.NUMBER }, 
                  label: { type: Type.STRING } 
                },
                required: ["value", "label"]
              }
            },
            required: ["alignment", "urgency", "friction"]
          },

          detailedExplanation: { type: Type.STRING, description: "Max 20 words." },
          policyCitation: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "1 tactical recommendation (Max 10 words)."
          }
        },
        required: ["regionId", "economicScore", "confidenceInterval", "uncertaintyDrivers", "vectorBreakdown", "detailedExplanation", "policyCitation", "suggestions"],
      },
    }
  },
  required: ["summary", "identifiedSector", "identifiedKeywords", "analysisSteps", "suggestions", "confidenceScore", "riskLevel", "riskFactors", "scores", "equityAlert"],
  // Force 'scores' to be last so that if truncation happens, we save the metadata
  propertyOrdering: ["summary", "identifiedSector", "identifiedKeywords", "confidenceScore", "riskLevel", "riskFactors", "equityAlert", "analysisSteps", "suggestions", "scores"]
};

// --- COMPARISON SCHEMA ---
const comparisonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: { type: Type.STRING, description: "30-word comparison summary." },
    dimensions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dimension: { type: Type.STRING },
          scoreA: { type: Type.NUMBER, description: "0-10 score" },
          scoreB: { type: Type.NUMBER, description: "0-10 score" },
          winner: { type: Type.STRING, enum: ["A", "B", "Tie"] },
          reasoning: { type: Type.STRING, description: "Why it won this dimension" }
        },
        required: ["dimension", "scoreA", "scoreB", "winner", "reasoning"]
      }
    },
    tradeOffs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sacrifice: { type: Type.STRING },
          gain: { type: Type.STRING }
        },
        required: ["sacrifice", "gain"]
      }
    },
    regionalAnalysis: {
      type: Type.OBJECT,
      properties: {
        deltaSummary: { type: Type.STRING, description: "Which regions benefit more from A vs B" },
        vulnerableGroupImpact: { type: Type.STRING, description: "Analysis of impact on regions with high vulnerability scores" }
      },
      required: ["deltaSummary", "vulnerableGroupImpact"]
    },
    interactionAnalysis: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING, enum: ["Synergy", "Conflict", "Neutral"] },
            mechanism: { type: Type.STRING, description: "Mechanism of interaction (e.g., 'Shared Infrastructure', 'Resource Cannibalization', 'Conflicting Mandates')." },
            affectedRegions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of states/regions where this interaction is most pronounced." },
            recommendation: { type: Type.STRING, enum: ["Strongly Recommended", "Proceed with Caution", "Avoid Combined Rollout"] }
        },
        required: ["type", "mechanism", "affectedRegions", "recommendation"]
    },
    recommendation: {
      type: Type.OBJECT,
      properties: {
        winner: { type: Type.STRING, enum: ["Policy A", "Policy B", "Conditional"] },
        rationale: { type: Type.STRING }
      },
      required: ["winner", "rationale"]
    },
    // New Confidence Assessment
    decisionConfidence: {
        type: Type.OBJECT,
        properties: {
            strength: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
            explanation: { type: Type.STRING, description: "Analyze the overlap of uncertainty ranges. If Winner's Worst Case > Loser's Best Case, strength is High." }
        },
        required: ["strength", "explanation"]
    }
  },
  required: ["executiveSummary", "dimensions", "tradeOffs", "regionalAnalysis", "interactionAnalysis", "recommendation", "decisionConfidence"]
};

// Robust JSON Cleaner and Parser
const cleanAndParseJSON = (text: string) => {
    if (!text) return null;

    // 1. Remove Markdown code blocks
    let cleaned = text.replace(/```json\s*|\s*```/g, "");
    
    // 2. Find start of JSON structure
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    if (firstBrace === -1 && firstBracket === -1) return null;
    
    const startIndex = (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) ? firstBrace : firstBracket;
    cleaned = cleaned.substring(startIndex);

    // 3. Basic formatting fix: Remove trailing commas before closing braces
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');

    try {
        return JSON.parse(cleaned);
    } catch (e) {
        console.warn("JSON Parse failed, attempting truncation repair...", e);
        
        // 4. Truncation Repair Logic
        // We look backwards for the last valid '}' that likely closes a region object in the 'scores' array.
        let lastClose = cleaned.lastIndexOf('}');
        
        while (lastClose > 0) {
            const potential = cleaned.substring(0, lastClose + 1);
            
            // Try closing as is (if root object)
            try { return JSON.parse(potential); } catch (e) {}
            
            // Try closing as array end + root object end (common case: scores array cutoff)
            try { return JSON.parse(potential + "]}"); } catch (e) {}
            
            // Try closing just array
            try { return JSON.parse(potential + "]"); } catch (e) {}

            // If we are deep inside a string or nested object, this check might fail, so we iterate backwards.
            lastClose = cleaned.lastIndexOf('}', lastClose - 1);
        }
        
        // 5. Last Resort: control character cleaning (rarely the issue with modern Gemini, but possible)
        const simplified = cleaned.replace(/[\x00-\x1F\x7F]/g, "");
        try { return JSON.parse(simplified); } catch(e) {}

        console.error("Repair failed.");
        throw new Error("Data stream incomplete. Please try again or use a shorter policy text.");
    }
}

export const analyzePolicyWithGemini = async (
  policyText: string,
  useSearch: boolean,
  regions: Region[] // Now accepts dynamic regions
): Promise<SimulationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment");
  }

  const ai = new GoogleGenAI({ apiKey });

  // 1. INTELLIGENT REGION FILTERING
  // Check if the user mentioned specific states in the prompt.
  // If yes, only analyze those states. If no, analyze ALL states.
  let targetRegions = regions;
  
  const lowerPolicy = policyText.toLowerCase();
  
  // Create a list of regions mentioned in the text
  const mentionedRegions = regions.filter(r => {
      const name = r.name.toLowerCase();
      return lowerPolicy.includes(name) || 
             lowerPolicy.includes(name.replace('&', 'and')) ||
             (r.id === 'JK' && lowerPolicy.includes('jammu')) || 
             (r.id === 'AN' && lowerPolicy.includes('andaman'));
  });

  if (mentionedRegions.length > 0) {
      console.log(`Detected ${mentionedRegions.length} specific regions in prompt. Filtering analysis.`);
      targetRegions = mentionedRegions;
  } else {
      console.log("No specific regions detected. Analyzing full dataset.");
  }

  // Pass raw data with explicit labels for the LLM
  // Minify context to save tokens
  const regionsContext = JSON.stringify(targetRegions.map(r => ({
    id: r.id,
    n: r.name,
    m: {
        msme: r.msme_density,
        vuln: r.vulnerability_score,
        lit: r.literacy_rate,
        hlth: r.healthcare_index,
        agri: r.agriculture_dependency,
        digi: r.digital_penetration
    }
  })));

  const systemInstruction = `
    You are PRISM (Policy Risk & Impact Simulation Model).
    Perform Multi-Criteria Decision Analysis (MCDA).

    **DOMAINS**: Economy, Social Welfare, Infrastructure, Environment, Human Capital.

    **CONTEXT**:
    ${regionsContext}

    **SCORING (Net Impact -10 to +10)**:
    Score = (Structural_Alignment * 0.4) + (Socio_Urgency * 0.3) - (Implementation_Friction * 0.3)

    **TASKS**:
    1. Identify Sector.
    2. Score EACH provided region.
    3. **Confidence Interval**: Provide Lower/Upper bounds based on region's friction/vulnerability.
    4. **Equity Watchdog**: Trigger 'equityAlert' if regions with 'vuln > 7' are harmed (negative score) while others benefit.

    **OUTPUT RULES**:
    - **CRITICAL**: Return PURE JSON. No Markdown.
    - **CONCISE**: 'detailedExplanation' MAX 20 words. 'suggestions' MAX 10 words.
    - **ESCAPING**: Escape all quotes in strings.
    - **COMPLETENESS**: You MUST generate a 'scores' entry for EVERY region in the input list. Do not skip.
  `;

  try {
    const modelId = 'gemini-2.0-flash'; 
    const tools = useSearch ? [{ googleSearch: {} }] : [];

    const response = await ai.models.generateContent({
      model: modelId,
      contents: policyText,
      config: {
        systemInstruction,
        tools,
        responseMimeType: "application/json",
        responseSchema: impactSchema,
        temperature: 0.2, // Lower temperature for more stable JSON
        maxOutputTokens: 8192,
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const result = cleanAndParseJSON(resultText) as SimulationResult;

    // Extract Native Grounding Metadata
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata && useSearch) {
        const sources = groundingMetadata.groundingChunks
            ?.map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => !!web)
            .map(web => ({ uri: web.uri, title: web.title })) || [];
        
        const queries = groundingMetadata.webSearchQueries || [];

        result.grounding = {
            sources,
            queries
        };
    }

    return result;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};

export const generateComparisonSummary = async (
    policyA: string,
    resultA: SimulationResult,
    policyB: string,
    resultB: SimulationResult
): Promise<ComparisonResult | null> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;

    const ai = new GoogleGenAI({ apiKey });
    
    // Construct context that includes the calculated scores
    const context = `
      **Policy A**: ${policyA}
      **Policy A Results**:
      Sector: ${resultA.identifiedSector}
      Summary: ${resultA.summary}
      Aggregated Score: ${(resultA.scores.reduce((a,b) => a + b.economicScore, 0)/resultA.scores.length).toFixed(1)}

      **Policy B**: ${policyB}
      **Policy B Results**:
      Sector: ${resultB.identifiedSector}
      Summary: ${resultB.summary}
      Aggregated Score: ${(resultB.scores.reduce((a,b) => a + b.economicScore, 0)/resultB.scores.length).toFixed(1)}
    `;

    const systemInstruction = `
      Act as Chief Policy Economist. Compare Policy A vs Policy B.

      **EVALUATION DIMENSIONS (0-10)**:
      1. Economic Efficiency
      2. Social Equity (Weight 2x for vulnerable regions)
      3. Administrative Friction
      4. Political Feasibility
      5. Risk Exposure

      **TASKS**:
      - Calculate Delta Impact.
      - Analyze Synergy/Conflict if combined.
      - Assess **Decision Confidence** (High/Medium/Low) based on score gaps and uncertainty.

      **OUTPUT**:
      Return structured JSON. Concise rationale.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: context,
            config: {
                systemInstruction,
                temperature: 0.2,
                responseMimeType: "application/json",
                responseSchema: comparisonSchema
            }
        });
        
        const text = response.text;
        if (!text) return null;
        return cleanAndParseJSON(text) as ComparisonResult;

    } catch (e) {
        console.error("Comparison generation failed.", e);
        return null;
    }
}

// NEW: Function to fetch live metrics via Grounding
export const updateRegionMetricsWithLiveSearch = async (currentRegions: Region[]): Promise<Region[]> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing");

    const ai = new GoogleGenAI({ apiKey });

    // Limit to subset to avoid token limits if necessary, or do in batches.
    // For now, prompt instruction to handle array.

    const prompt = `
        Find latest 'NITI Aayog Health Index' & 'SDG India Index' scores for these Indian states.
        Update:
        1. 'healthcare_index' (0-100).
        2. 'vulnerability_score' (Derived: 100 - SDG / 10).

        Input JSON:
        ${JSON.stringify(currentRegions.map(r => ({ id: r.id, name: r.name, h: r.healthcare_index, v: r.vulnerability_score })))}

        Return JSON Array: { "id": "string", "healthcare_index": number, "vulnerability_score": number }
    `;

    const updateSchema: Schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                healthcare_index: { type: Type.NUMBER },
                vulnerability_score: { type: Type.NUMBER }
            },
            required: ["id", "healthcare_index", "vulnerability_score"]
        }
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: updateSchema
            }
        });

        const updates = cleanAndParseJSON(response.text || "[]") as any[];
        
        // Merge updates
        const updatedRegions = currentRegions.map(region => {
            const update = updates.find(u => u.id === region.id);
            if (update) {
                return {
                    ...region,
                    healthcare_index: update.healthcare_index,
                    vulnerability_score: update.vulnerability_score
                };
            }
            return region;
        });

        return updatedRegions;

    } catch (error) {
        console.error("Failed to update regions:", error);
        throw error;
    }
}
