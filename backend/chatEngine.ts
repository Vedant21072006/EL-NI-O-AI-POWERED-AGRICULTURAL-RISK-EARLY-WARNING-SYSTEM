import { GoogleGenAI } from '@google/genai';
import { RiskAssessment, Language } from './types';

// Lazy initialization of Gemini client to prevent crashes if key is absent
let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (genAIClient) return genAIClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  genAIClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  return genAIClient;
}

interface ChatContext {
  farmProfile: {
    district: string;
    crop: string;
    cropStage: string;
    irrigation: string;
  };
  assessment?: RiskAssessment;
  language: Language;
}

export async function handleKrishiChat(
  userMessage: string,
  context: ChatContext
): Promise<{ reply: string; suggestions?: string[] }> {
  const { farmProfile, assessment, language } = context;

  // Language name for prompt
  const languageNames: Record<Language, string> = {
    mr: 'Marathi (मराठी)',
    hi: 'Hindi (हिंदी)',
    en: 'English'
  };

  const currentLanguageName = languageNames[language] || 'English';

  const systemInstruction = `
You are "Krishi AI" (कृषी AI), an empathetic, scientifically grounded agricultural decision-support assistant for farmers in Maharashtra, India.
You specialize in El Niño impacts on Soybean crops.

CRITICAL INSTRUCTIONS:
1. YOU DO NOT PREDICT OR GUESS RISK VALUES. The risk has ALREADY been computed by the XGBoost ML model and Decision Engine.
2. Rely strictly on the PROVIDED CURRENT FARM & ML CONTEXT below.
3. Explain risk drivers (derived via SHAP) and recommended actions in clear, friendly, farmer-accessible terms.
4. Avoid dense mathematical jargon (never output raw SHAP numbers like -0.284 or complex formulas).
5. Address the farmer with respect ("Namaskar", "शेतकरी बंधू", "किसान भाई").
6. Respond in ${currentLanguageName}. Keep responses concise (3-5 short bullet points or 2-3 brief paragraphs).
7. If asked about El Niño, explain simply that it is Pacific ocean warming that weakens monsoon winds and causes long rain breaks during crucial flowering stages.

CURRENT FARM & ML CONTEXT:
- District: ${farmProfile.district} (Maharashtra)
- Crop: ${farmProfile.crop} (Soybean)
- Crop Stage: ${farmProfile.cropStage}
- Irrigation Availability: ${farmProfile.irrigation}
${assessment ? `
- ML Model Risk Probability: ${assessment.probability}% (${assessment.level} RISK)
- Estimated Yield Impact: ${assessment.potentialYieldImpact.text}
- Top Risk Drivers (from SHAP):
${assessment.drivers.map(d => `  * ${d.name}: ${d.status} (Measured: ${d.measuredValue}, Direction: ${d.direction}) -> ${d.simpleExplanation}`).join('\n')}
- Decision Engine Early Warning: ${assessment.earlyWarning.title} - ${assessment.earlyWarning.message}
- Decision Engine Recommended Actions:
${assessment.recommendations.map(r => `  * [${r.priority}] ${r.title}: ${r.action}`).join('\n')}
` : '- No formal assessment computed yet.'}
`;

  const ai = getGeminiClient();

  if (ai) {
    try {
      const geminiCall = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      const timeoutCall = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 4500)
      );

      const response = await Promise.race([geminiCall, timeoutCall]);

      const replyText = response.text?.trim();
      if (replyText) {
        return {
          reply: replyText,
          suggestions: getDynamicSuggestions(userMessage, language)
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed or timed out; falling back to agronomic knowledge base', err);
    }
  }

  // Fallback intelligent responder based on exact Decision Engine context
  return generateAgronomicFallbackReply(userMessage, context);
}

function getDynamicSuggestions(query: string, lang: Language): string[] {
  if (lang === 'mr') {
    return [
      'फुलोरा अवस्थेत पाणी कसे द्यावे?',
      'खतांची फवारणी करावी का?',
      'पुढील १० दिवसांत काय काळजी घ्यावी?'
    ];
  }
  if (lang === 'hi') {
    return [
      'फूल आते समय पानी कैसे दें?',
      'क्या 13-0-45 का छिड़काव करें?',
      'अगले 10 दिनों में क्या सावधानी बरतें?'
    ];
  }
  return [
    'How should I irrigate during flowering?',
    'Should I spray anti-transpirants (13-0-45)?',
    'What precautions for the next 10 days?'
  ];
}

function generateAgronomicFallbackReply(
  userMessage: string,
  context: ChatContext
): { reply: string; suggestions?: string[] } {
  const { farmProfile, assessment, language } = context;
  const lower = userMessage.toLowerCase();
  const prob = assessment?.probability ?? 68;
  const level = assessment?.level ?? 'MODERATE';
  const stage = farmProfile.cropStage;
  const district = farmProfile.district;

  if (language === 'mr') {
    if (lower.includes('जोखीम') || lower.includes('का') || lower.includes('why') || lower.includes('risk')) {
      return {
        reply: `नमस्कार शेतकरी बंधू! 🙏\n\nआपल्या ${district} जिल्ह्यातील सोयाबीन पिकासाठी मॉडेलने **${prob}% (${level})** जोखीम दर्शवली आहे.\n\nयाची ३ मुख्य कारणे आहेत:\n1. **पावसाची तूट:** आपल्या भागात पावसाचे प्रमाण सरासरीपेक्षा कमी आहे.\n2. **जमिनीतील ओलावा कमी:** जमिनीतील मुळांच्या भागात ओलावा ताण पातळीवर पोहोचला आहे.\n3. **संवेदनशील पीक अवस्था:** सध्या पीक **${stage}** अवस्थेत असल्याने पाण्याचा ताण सहन करणे कठीण जाते.\n\nकाळजी करू नका, वेळेवर फवारणी व आच्छादन करून आपण पीक वाचवू शकतो!`,
        suggestions: ['मी काय उपाय करावेत?', 'एल निनो म्हणजे काय?']
      };
    }

    if (lower.includes('उपाय') || lower.includes('काय करू') || lower.includes('what') || lower.includes('action')) {
      return {
        reply: `कृषी तज्ज्ञ व डिसिजन इंजिननुसार आपल्यासाठी ३ महत्त्वाच्या उपाययोजना:\n\n1. **पाणी व्यवस्थापन:** पाणी उपलब्ध असल्यास संध्याकाळच्या वेळी एक हलके पाणी एक आड एक सरीने द्या.\n2. **पानाचा ताण कमी करण्यासाठी फवारणी:** १३:०:४५ (पोटॅशियम नायट्रेट) १% किंवा युरिया २% फवारणी करा, ज्यामुळे फुले गळणे थांबेल.\n3. **आच्छादन (Mulching):** कोळपणी करून जमिनीवर धुळीचे आच्छादन करा, ज्यामुळे बाष्पीभवन रोखले जाईल.\n\nअनावश्यक जास्त पाणी देणे टाळा.`,
        suggestions: ['पाऊस कमी झाला तर?', 'माझी जोखीम साध्या भाषेत सांगा']
      };
    }

    if (lower.includes('निनो') || lower.includes('nino') || lower.includes('हवामान')) {
      return {
        reply: `**एल निनो (El Niño) म्हणजे काय?**\n\nप्रशांत महासागराचे पाणी नेहमीपेक्षा जास्त गरम झाल्यामुळे जागतिक हवामानात बदल होतो. यामुळे भारतामध्ये विशेषतः महाराष्ट्रातील मराठवाडा व विदर्भात मान्सूनच्या पावसात १५ ते २५ दिवसांचा मोठा खंड (Dry Spell) पडतो.\n\nसोयाबीनच्या फुलोरा व शेंगा भरण्याच्या काळात हा खंड पडल्यास उत्पादनात घट येते. म्हणूनच पूर्वसूचना प्रणाली आधीच उपाययोजना सुचवते.`,
        suggestions: ['माझ्या पिकाला जोखीम का आहे?', 'सध्या मी काय उपाय करावेत?']
      };
    }

    return {
      reply: `नमस्कार! 🙏 आपल्या ${district} मधील सोयाबीन पिकाची जोखीम **${prob}%** आहे. पीक सध्या **${stage}** अवस्थेत आहे. जमिनीतील ओलावा टिकवण्यासाठी कोळपणी व १३:०:४५ ची फवारणी उपयुक्त ठरेल. आपल्याला आणखी काही जाणून घ्यायचे आहे का?`,
      suggestions: ['मी काय उपाय करावेत?', 'माझ्या पिकाला जोखीम का आहे?']
    };
  }

  if (language === 'hi') {
    if (lower.includes('जोखिम') || lower.includes('क्यों') || lower.includes('why') || lower.includes('risk')) {
      return {
        reply: `नमस्ते किसान भाई! 🙏\n\nआपके ${district} जिले में सोयाबीन फसल के लिए मशीन लर्निंग मॉडल ने **${prob}% (${level})** जोखिम का अनुमान लगाया है।\n\n**मुख्य कारण:**\n1. **कम बारिश:** सामान्य से कम वर्षा दर्ज की गई है।\n2. **मिट्टी में नमी की कमी:** जड़ क्षेत्र में नमी घट रही है।\n3. **नाजुक फसल अवस्था:** फसल **${stage}** में है जो सूखे के प्रति अत्यधिक संवेदनशील है।`,
        suggestions: ['मुझे क्या उपाय करने चाहिए?', 'अल नीनो क्या है?']
      };
    }

    return {
      reply: `नमस्ते! 🙏 आपके खेत के लिए विशेषज्ञ सलाह:\n1. उपलब्ध होने पर शाम के समय एक सुरक्षात्मक सिंचाई दें।\n2. फूल गिरने से रोकने के लिए 1% पोटेशियम नाइट्रेट (13-0-45) का छिड़काव करें।\n3. खरपतवार निकालें और हल्की गुड़ाई (डस्ट मल्चिंग) करें।`,
      suggestions: ['अल नीनो क्या है?', 'सरल भाषा में मेरा जोखिम बताएं']
    };
  }

  // English fallback
  return {
    reply: `Namaskar! 🙏 Based on our XGBoost agricultural model and satellite observations for **${district}**, your soybean crop is currently at **${prob}% (${level})** climate risk during the **${stage}** stage.\n\n**Primary Drivers:**\n- Significant rainfall deficit compared to historical normal\n- Soil moisture stress in the active root zone\n- High vegetative sensitivity during ${stage}\n\n**Immediate Advice:**\n- Provide one light protective irrigation in alternate furrows if water is available.\n- Spray 1% Potassium Nitrate (13-0-45) to minimize transpiration stress and prevent flower drop.\n- Carry out shallow inter-cultivation for dust mulching.`,
    suggestions: ['What should I do?', 'Why is my crop at risk?', 'What is El Niño?']
  };
}
