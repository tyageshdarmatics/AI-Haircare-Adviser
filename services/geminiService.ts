
import { GoogleGenAI, GenerateContentResponse, Type, GenerateContentParameters } from "@google/genai";
import { HairProfileData, SkinConditionCategory, SkincareRoutine } from '../types';
import { DERMATICS_INDIA_PRODUCTS } from "../productData";

const importMetaEnv = typeof import.meta !== 'undefined' ? (import.meta.env as Record<string, string | undefined>) : undefined;
const processEnv = typeof process !== 'undefined' ? process.env : undefined;

const getRawApiKeys = (): string => {
    const rawApiKeys = (importMetaEnv?.VITE_API_KEY as string | undefined)
        ?? importMetaEnv?.GEMINI_API_KEY
        ?? processEnv?.GEMINI_API_KEY
        ?? processEnv?.API_KEY
        ?? processEnv?.VITE_API_KEY;

    if (!rawApiKeys) {
        throw new Error("API key environment variable is not set. Please set GEMINI_API_KEY in Netlify environment variables.");
    }
    return rawApiKeys;
};

const getAiInstances = () => {
    const rawApiKeys = getRawApiKeys();
    const apiKeys = rawApiKeys.split(',').map(key => key.trim()).filter(key => key);
    if (apiKeys.length === 0) {
        throw new Error("API key environment variable is set, but contains no valid keys.");
    }
    return apiKeys.map(apiKey => new GoogleGenAI({ apiKey }));
};

async function generateContentWithFailover(params: GenerateContentParameters): Promise<GenerateContentResponse> {
    let lastError: Error | null = null;
    const instances = getAiInstances();

    for (let i = 0; i < instances.length; i++) {
        const ai = instances[i];
        try {
            const response = await ai.models.generateContent(params);
            return response;
        } catch (error) {
            lastError = error as Error;
            console.warn(`API key ${i + 1}/${instances.length} failed: ${lastError.message}`);

            const errorMessage = lastError.message.toLowerCase();
            const isRetriable =
                errorMessage.includes('api key not valid') ||
                errorMessage.includes('quota') ||
                errorMessage.includes('internal error') ||
                errorMessage.includes('500') ||
                errorMessage.includes('503');

            if (!isRetriable) {
                throw lastError;
            }
        }
    }

    throw new Error(`All ${instances.length} API keys failed. Last error: ${lastError?.message || 'Unknown error'}`);
}


const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export interface AnalysisResponse {
    analysis: SkinConditionCategory[] | null;
    error?: 'irrelevant_image' | string | null;
    message?: string | null;
}

export const analyzeImage = async (images: File[]): Promise<AnalysisResponse> => {
    if (images.length === 0) {
        throw new Error("No images provided for analysis.");
    }
    try {
        const imageParts = await Promise.all(images.map(fileToGenerativePart));
        const textPart = {
            text: `You are an expert AI trichologist. Your primary task is to analyze images of a person's hair and scalp.

**Step 1: Image Validity Check**
First, determine if the uploaded image(s) are relevant for a hair and scalp analysis. A relevant image must clearly show a human head, hair, or scalp. Images of objects (like flowers), animals, landscapes, or other body parts are not relevant.

- If the image(s) ARE NOT RELEVANT, you MUST return a JSON object with an "error" field set to "irrelevant_image" and a user-friendly "message" explaining the issue. The "analysis" field should be null.
- If the image(s) ARE RELEVANT, proceed to Step 2. The "error" and "message" fields should be null, and the "analysis" field should contain your findings.

**Step 2: Detailed Analysis (only if images are relevant)**
Analyze these relevant images in detail. The images may show different angles (e.g., front/hairline, top/crown, temples, back). Provide one single, consolidated analysis based on all images provided.

Your task is to identify all potential conditions and characteristics from the comprehensive list below.

**Comprehensive List of Detectable Items:**

**1. Hair Loss Types:**
- **Common Types:** Androgenetic Alopecia (Genetic / Pattern Hair Loss), Telogen Effluvium (stress/illness related shedding), Anagen Effluvium (chemotherapy induced), Alopecia Areata (autoimmune, patchy bald spots), Traction Alopecia (from tight hairstyles), Cicatricial Alopecia (Scarring types), Trichotillomania (compulsive hair pulling), Diffuse Alopecia (systemic causes).
- **Types More Common in Men:** Male Pattern Baldness (receding hairline + crown thinning), Crown & Vertex Baldness.
- **Types More Common in Women:** Female Pattern Hair Loss (diffuse thinning, widened part), Postpartum Hair Loss, Menopausal Hair Loss, PCOS-related Hair Loss.

**2. Scalp Conditions & Infestations:**
- Seborrheic Dermatitis, Dandruff (Mild Seborrhea), Psoriasis, Tinea Capitis (Fungal), Folliculitis / Folliculitis Decalvans, Xerosis (Dry Scalp), Oily Scalp / Sebaceous Hypersecretion, Contact / Atopic Dermatitis, Pityriasis Amiantacea, Cradle Cap (Infant), Pediculosis Capitis (Lice / Nits), Demodex Infestation.

**3. Hair Shaft Disorders & Damage:**
- Trichorrhexis Nodosa, Monilethrix, Pili Torti, Loose Anagen Hair, Bubble Hair, Split Ends / Weathering, Color Damage, Heat Damage, Breakage.

**4. Cosmetic Quality:**
- Frizz, Porosity, Product Build-up.

**5. Hair & Scalp Typing:**
- Hair Density (Low / Medium / High), Hair Fiber Thickness (Fine / Medium / Coarse), Curl Type (1A–4C), Scalp Type (Dry / Normal / Oily / Combination).

After identifying conditions or characteristics, group them into the most relevant category from the list below. Use your expert judgment. For example, 'Androgenetic Alopecia' goes into 'Pattern Hair Loss', 'Dandruff' goes into 'Scalp Conditions', and 'Frizz' would go into 'Hair Quality'.
**Categories for Grouping:**
- 'Pattern Hair Loss'
- 'Diffuse Thinning'
- 'Patchy Hair Loss'
- 'Hairline Recession'
- 'Scalp Conditions' (Includes infestations and fungal infections like Tinea Capitis)
- 'Hair Breakage' (Includes hair shaft disorders and damage)
- 'Hair Quality' (Includes cosmetic quality issues like frizz and porosity)
- 'Hair & Scalp Type' (For hair and scalp typing characteristics)

For each specific condition or characteristic you identify, provide:
1. A 'name' (e.g., 'Androgenetic Alopecia', 'Dandruff', 'Frizz', 'High Density').
2. A 'confidence' score from 0 to 100 on how certain you are.
3. A 'location' string describing the primary area (e.g., "Crown", "Hairline", "General Scalp"). For typing, use "General Scalp".
4. An array of 'boundingBoxes'. Each box must have an 'imageId' (0-based index) and normalized coordinates (x1, y1, x2, y2). If a condition is general (like Diffuse Thinning or Hair Density) and not localized to a specific box, use a location like "General Scalp" and return an empty array for boundingBoxes.

Provide the output strictly in JSON format according to the provided schema. Be thorough. If the scalp and hair appear healthy with no issues, include a 'Healthy Hair & Scalp' category.
`
        };

        const response: GenerateContentResponse = await generateContentWithFailover({
            model: 'gemini-2.5-flash',
            contents: { parts: [...imageParts, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        analysis: {
                            type: Type.ARRAY,
                            nullable: true,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    category: { type: Type.STRING, description: "The category of hair/scalp conditions, e.g., 'Pattern Hair Loss'." },
                                    conditions: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                name: { type: Type.STRING, description: "The specific hair/scalp condition name, e.g., 'Androgenetic Alopecia'." },
                                                confidence: { type: Type.NUMBER, description: "The confidence score from 0 to 100." },
                                                location: { type: Type.STRING, description: "The primary scalp location of the condition, e.g., 'Crown'." },
                                                boundingBoxes: {
                                                    type: Type.ARRAY,
                                                    description: "Array of bounding boxes for this condition.",
                                                    items: {
                                                        type: Type.OBJECT,
                                                        properties: {
                                                            imageId: { type: Type.NUMBER, description: "0-based index of the image this box applies to." },
                                                            box: {
                                                                type: Type.OBJECT,
                                                                properties: {
                                                                    x1: { type: Type.NUMBER, description: "Normalized top-left x coordinate." },
                                                                    y1: { type: Type.NUMBER, description: "Normalized top-left y coordinate." },
                                                                    x2: { type: Type.NUMBER, description: "Normalized bottom-right x coordinate." },
                                                                    y2: { type: Type.NUMBER, description: "Normalized bottom-right y coordinate." }
                                                                },
                                                                required: ["x1", "y1", "x2", "y2"]
                                                            }
                                                        },
                                                        required: ["imageId", "box"]
                                                    }
                                                }
                                            },
                                            required: ["name", "confidence", "location", "boundingBoxes"]
                                        }
                                    }
                                },
                                required: ["category", "conditions"]
                            }
                        },
                        error: {
                            type: Type.STRING,
                            nullable: true,
                            description: "An error code like 'irrelevant_image' if the image is not valid."
                        },
                        message: {
                            type: Type.STRING,
                            nullable: true,
                            description: "An error message if the image is not valid."
                        }
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        const errMsg = (error as Error).message || 'Unknown error';
        console.error("Error analyzing image:", errMsg);
        throw new Error(`Failed to analyze hair & scalp image. Reason: ${errMsg}`);
    }
};


export const generateRoutine = async (
    hairProfile: Partial<HairProfileData>,
    analysis: SkinConditionCategory[],
    goals: string[],
    pastUserHistory: any[] = []
): Promise<{ recommendation: SkincareRoutine, title: string }> => {

    const analysisString = analysis.map(cat =>
        `${cat.category}: ${cat.conditions.map(c => `${c.name} at ${c.location} (${c.confidence}% confidence)`).join(', ')}`
    ).join('; ');

    const goalsString = goals.join(', ');

    const productCatalogString = JSON.stringify(DERMATICS_INDIA_PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        url: p.url,
        imageUrl: p.imageUrl,
        description: p.description,
        suitableFor: p.suitableFor,
        keyIngredients: p.keyIngredients,
        variantId: p.variantId,
        price: p.price,
        originalPrice: p.originalPrice
    })), null, 2);

    const requiresDoctorConsultation = hairProfile.hairlossImageMale === 'Stage - 6' || hairProfile.hairlossImageMale === 'Stage - 7' || hairProfile.hairlossImageMale === 'Coin Size Patch';

    const basePrompt = `
        **ROLE & GOAL:**
        You are an expert dermatological AI for the brand "Dermatics India". Your mission is to create the single BEST, scientifically-backed, and hyper-personalized haircare routine for a user. Your recommendations must be effective, easy to follow, and safe. You MUST use products exclusively from the provided Dermatics India catalog.

        **USER DATA (In Order of Priority):**
        1.  **AI Hair & Scalp Analysis (PRIMARY DATA):** This is your most critical input. The conditions identified here are the primary problems you must solve.
        2.  **User Hair Profile from Questionnaire (SECONDARY DATA):** Use this to understand the user's history, lifestyle, and concerns not visible in photos. If AI Analysis is not provided, this becomes your primary data source.
        3.  **Primary Haircare Goals (DESIRED OUTCOME):** The user's stated goals. Your routine must directly address these goals, using the analysis and questionnaire to inform HOW you achieve them.
        
        **User's Information:**
        - **AI Analysis:** ${analysisString || 'Not provided.'}
        - **Questionnaire Profile:** ${JSON.stringify(hairProfile, null, 2)}
        - **Goals:** ${goalsString}
        - **Past User History:** ${pastUserHistory.length > 0 ? JSON.stringify(pastUserHistory, null, 2) : 'No past history available.'}

        **Dermatics India Product Catalog:**
        ${productCatalogString}

        **YOUR TASK (Follow these steps precisely):**

        **STEP 1: Synthesize a Clinical Summary.**
        Based on all user data (especially including their Past User History if it exists to understand how their condition has evolved over time), write a brief, internal summary of the user's condition.
        *Example:* "User presents with moderate androgenetic alopecia on the crown (95% confidence) and reports high stress, which may exacerbate hair shedding. Goal is to reduce hair fall."

        **STEP 2: Devise a Treatment Strategy.**
        Based on your summary, outline a clear strategy.
        *Example:* "Strategy: 1. Aggressively target follicular miniaturization using a topical solution with proven actives. 2. Support scalp health with a gentle, pH-balanced cleanser. 3. Reduce breakage reported in the questionnaire with a strengthening conditioner."

        **STEP 3: Select Products Using an Ingredient-First Approach.**
        For each part of your strategy, scan the catalog for the best product match.
        - **Prioritize Active Ingredients:** Match products based on their effectiveness for the diagnosed conditions (e.g., for hair loss, look for Minoxidil, Finasteride, Procapil; for dandruff, look for Ketoconazole).
        - **Use 'suitableFor' as a Filter:** Ensure the product's intended use matches the user's condition.
        - **Build the Routine:** Construct a simple but powerful AM and PM routine (or a single "General" routine). Start with the 2-4 most critical products. Only add more if truly necessary.

        **STEP 4: Generate the Final JSON Output.**
        Provide your response in the specified JSON format. Your explanations must be exceptional.

        - **\`purpose\` Field is CRITICAL:** For each product, write a highly personalized 'purpose'. Directly reference the user's data.
            - **GOOD example:** "Because your analysis identified 'Androgenetic Alopecia' and you want to 'Promote Hair Growth', this solution containing 5% Minoxidil is the most effective choice to reactivate hair follicles."
            - **BAD example:** "This product is for hair loss."
        - **\`keyIngredients\` is MANDATORY:** Extract these directly from the catalog data for each product.
        - **\`alternatives\`:** If available, provide 1-2 suitable alternatives from the catalog for the primary recommended product.
        - **Lifestyle Tips:** Provide actionable, personalized tips that complement the routine.
        - **Routine Title:** Create a powerful, goal-oriented title.

        **OUTPUT FORMAT:**
        Return a single JSON object. The root object must have "title" and "recommendation" keys. The "recommendation" object must contain "introduction", "am", "pm", "keyIngredients", "lifestyleTips", and "disclaimer". If a general routine is best, put all steps in the "am" array and leave "pm" empty. DO NOT recommend any products not in the provided catalog.
    `;

    const doctorConsultationOverride = `
        CRITICAL MEDICAL ALERT: 
        The user has indicated severe hair loss (e.g., Stage 6 baldness or Coin Size Patch). Cosmetic topical products or shampoos from the catalog WILL NOT be effective for this level of hair loss. Medical intervention is required.
        
        YOUR NEW INSTRUCTIONS:
        1. DO NOT recommend any products from the catalog.
        2. The "am" array MUST be completely empty: []. This is valid JSON and you MUST output it exactly as [].
        3. The "pm" array MUST be completely empty: []. This is valid JSON and you MUST output it exactly as [].
        4. The "keyIngredients" array MUST be completely empty: []. Output it exactly as [].
        5. Use the "title" field to state exactly: "Medical Consultation Strongly Recommended".
        6. Use the "introduction" field to gently but firmly explain that their current stage of hair loss cannot be treated with cosmetic serums or shampoos and they need to see a doctor for prescription medication (like oral Finasteride/Minoxidil) or a hair transplant consultation.
        7. Use the "lifestyleTips" array to suggest 3-4 tips such as booking a dermatologist appointment, managing stress, and eating a balanced diet.
        8. Use the "disclaimer" field to state clearly that you are an AI and this is not medical advice.

        CRITICAL FORMAT REQUIREMENT: You MUST still return a complete, valid JSON object that exactly matches the required response schema. The only difference is that "am", "pm", and "keyIngredients" will be empty arrays. Do NOT return plain text. Do NOT wrap your response in markdown code fences. Return ONLY raw JSON.
    `;

    const prompt = requiresDoctorConsultation
        ? `${basePrompt}\n\n${doctorConsultationOverride}`
        : basePrompt;


    const alternativeProductSchema = {
        type: Type.OBJECT,
        properties: {
            productId: { type: Type.STRING },
            variantId: { type: Type.STRING },
            productName: { type: Type.STRING },
            productUrl: { type: Type.STRING },
            productImageUrl: { type: Type.STRING },
            price: { type: Type.STRING },
            originalPrice: { type: Type.STRING },
            keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["productId", "variantId", "productName", "productUrl", "productImageUrl", "price", "originalPrice", "keyIngredients"]
    };

    const routineStepSchema = {
        type: Type.OBJECT,
        properties: {
            stepType: { type: Type.STRING, description: "A single, descriptive word for the routine step." },
            productId: { type: Type.STRING, description: "The exact ID of the product from the catalog." },
            variantId: { type: Type.STRING, description: "The exact Shopify variant ID for the product." },
            productName: { type: Type.STRING, description: "The full name of the recommended product." },
            productUrl: { type: Type.STRING, description: "The direct URL to the product page." },
            productImageUrl: { type: Type.STRING, description: "The direct URL to the product's image from the catalog." },
            purpose: { type: Type.STRING, description: "Why this specific product is recommended for the user." },
            alternatives: {
                type: Type.ARRAY,
                description: "An array of suitable alternative products from the catalog for this step. Can be empty.",
                items: alternativeProductSchema
            },
            price: { type: Type.STRING },
            originalPrice: { type: Type.STRING },
            keyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["stepType", "productId", "variantId", "productName", "productUrl", "productImageUrl", "purpose", "alternatives", "price", "originalPrice", "keyIngredients"]
    };

    try {
        const response = await generateContentWithFailover({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "A short, powerful title for the plan." },
                        recommendation: {
                            type: Type.OBJECT,
                            properties: {
                                introduction: { type: Type.STRING, description: "A brief, encouraging intro to the plan." },
                                am: {
                                    type: Type.ARRAY,
                                    items: routineStepSchema,
                                    description: "Array of steps for the morning/main routine using Dermatics India products."
                                },
                                pm: {
                                    type: Type.ARRAY,
                                    items: routineStepSchema,
                                    description: "Array of steps for the evening/secondary routine. Can be empty."
                                },
                                keyIngredients: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                    description: "Array of key ingredient names from the recommended products."
                                },
                                lifestyleTips: {
                                    type: Type.ARRAY,
                                    items: { type: Type.STRING },
                                    description: "Array of lifestyle and wellness tips."
                                },
                                disclaimer: {
                                    type: Type.STRING,
                                    description: "A final important disclaimer message."
                                }
                            },
                            required: ["introduction", "am", "pm", "keyIngredients", "lifestyleTips", "disclaimer"]
                        }
                    },
                    required: ["title", "recommendation"]
                }
            }
        });

        // Safely strip any accidental markdown code fences (e.g. ```json ... ```) before parsing
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
        }
        return JSON.parse(jsonText);
    } catch (error) {
        const errMsg = (error as Error).message || 'Unknown error';
        console.error("Error generating routine with Gemini:", errMsg);
        throw new Error(`Failed to generate haircare routine. Reason: ${errMsg}`);
    }
};
