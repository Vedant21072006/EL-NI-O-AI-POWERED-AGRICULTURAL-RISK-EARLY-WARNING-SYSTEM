import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  chooseLanguage: string;
  changeLanguageAnytime: string;
  continueBtn: string;
  loginHeading: string;
  loginSubheading: string;
  mobileNumber: string;
  enterMobile: string;
  otp: string;
  enterOtp: string;
  getOtpBtn: string;
  verifyOtpBtn: string;
  demoOtpHint: string;
  loginBtn: string;
  createAccountBtn: string;
  logoutBtn: string;
  demoFarmerTag: string;

  // Onboarding
  tellUsAboutFarm: string;
  onboardingSub: string;
  step1Location: string;
  state: string;
  district: string;
  selectDistrict: string;
  talukaOptional: string;
  step2Crop: string;
  soybean: string;
  comingSoon: string;
  step3CropInfo: string;
  sowingDate: string;
  cropStage: string;
  stages: {
    germination: string;
    vegetative: string;
    flowering: string;
    pod_development: string;
    maturity: string;
  };
  step4Irrigation: string;
  irrigationQuestion: string;
  irrigationYes: string;
  irrigationPartial: string;
  irrigationNo: string;
  getRiskAssessmentBtn: string;

  // Dashboard
  yourSoybeanRisk: string;
  riskLevels: {
    LOW: string;
    MODERATE: string;
    HIGH: string;
    CRITICAL: string;
  };
  riskProbability: string;
  potentialYieldImpact: string;
  whyThisRisk: string;
  whyThisRiskSubtitle: string;
  rainfallDriver: string;
  tempDriver: string;
  soilDriver: string;
  vegetationDriver: string;
  ensoDriver: string;
  shapExplanationNotice: string;
  technicalDetailsToggle: string;

  // Early warning
  earlyWarningTitle: string;
  earlyWarningSubtitle: string;
  recommendedActionHeading: string;

  // Recommendations
  recommendationsHeading: string;
  recommendationsSubtitle: string;
  waterManagement: string;
  cropManagement: string;
  fieldManagement: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;

  // What-If
  whatIfHeading: string;
  whatIfSubheading: string;
  rainfallControl: string;
  tempControl: string;
  soilMoistureControl: string;
  runSimulationBtn: string;
  runningSimulation: string;
  currentRisk: string;
  scenarioRisk: string;
  riskChange: string;
  mainReason: string;
  currentLabel: string;

  // Officer Dashboard
  officerDashboardHeading: string;
  officerDashboardSub: string;
  districtMapTitle: string;
  highRiskDistricts: string;
  districtName: string;
  riskCol: string;
  cropStageCol: string;
  actionCol: string;
  viewIntervention: string;
  switchRoleOfficer: string;
  switchRoleFarmer: string;

  // Historical
  historicalReplayHeading: string;
  historicalReplaySub: string;
  selectYear: string;
  runHistoricalAnalysis: string;
  historicalConditions: string;
  predictedRisk: string;
  actualOutcome: string;
  keyTakeawayTitle: string;

  // Navigation
  navHome: string;
  navMyCrop: string;
  navRisk: string;
  navRecommendations: string;
  navWhatIf: string;
  navOfficer: string;
  navHistorical: string;
  navProfile: string;

  // Chatbot
  askKrishiAi: string;
  chatWelcome: string;
  quickQuestionsTitle: string;
  qWhyRisk: string;
  qWhatShouldIDo: string;
  qWhatIsElNino: string;
  qLessRainSoybean: string;
  qExplainSimple: string;
  chatPlaceholder: string;
  sendBtn: string;
  listeningVoice: string;
  speakResponse: string;
}

export const translations: Record<Language, Translations> = {
  mr: {
    appName: "कृषी अलर्ट (KrishiAlert)",
    tagline: "एल निनो व सोयाबीन पीक जोखीम पूर्वसूचना प्रणाली",
    chooseLanguage: "तुमची भाषा निवडा",
    changeLanguageAnytime: "तुम्ही सेटिंग्जमधून कधीही भाषा बदलू शकता.",
    continueBtn: "पुढे जा",
    loginHeading: "शेतकरी लॉगिन",
    loginSubheading: "तुमच्या पिकाची जोखीम जाणून घेण्यासाठी मोबाईल नंबर टाका",
    mobileNumber: "मोबाईल नंबर",
    enterMobile: "+91 मोबाईल क्रमांक",
    otp: "ओटीपी (OTP)",
    enterOtp: "६ अंकी ओटीपी टाका",
    getOtpBtn: "ओटीपी पाठवा",
    verifyOtpBtn: "प्रमाणित करा व पुढे जा",
    demoOtpHint: "चाचणीसाठी कोणताही ६ अंकी क्रमांक (उदा. 123456) वापरा",
    loginBtn: "लॉगिन करा",
    createAccountBtn: "नवीन खाते तयार करा",
    logoutBtn: "बाहेर पडा",
    demoFarmerTag: "सोयाबीन उत्पादक शेतकरी",

    tellUsAboutFarm: "तुमच्या शेतीबद्दल माहिती द्या",
    onboardingSub: "अचूक जोखीम माहितीसाठी केवळ ४ सोपे प्रश्न",
    step1Location: "पायरी १ — स्थान",
    state: "राज्य",
    district: "जिल्हा",
    selectDistrict: "तुमचा जिल्हा निवडा",
    talukaOptional: "तालुका (ऐच्छिक)",
    step2Crop: "पायरी २ — पीक",
    soybean: "🌱 सोयाबीन",
    comingSoon: "(लवकरच: कापूस, मका, ज्वारी)",
    step3CropInfo: "पायरी ३ — पिकाची स्थिती",
    sowingDate: "पेरणीची तारीख",
    cropStage: "सध्याची पीक अवस्था",
    stages: {
      germination: "उगवण अवस्था (Germination)",
      vegetative: "शाकीय वाढ (Vegetative)",
      flowering: "फुलोरा अवस्था (Flowering - अत्यंत संवेदनशील)",
      pod_development: "शेंगा भरणे (Pod Development)",
      maturity: "परिपक्वता (Maturity)"
    },
    step4Irrigation: "पायरी ४ — पाण्याची सोय",
    irrigationQuestion: "तुमच्याकडे सिंचनाची / पाण्याची सोय उपलब्ध आहे का?",
    irrigationYes: "🟢 होय (पूर्ण सोय)",
    irrigationPartial: "🟡 अंशतः (मर्यादित पाणी)",
    irrigationNo: "🔴 नाही (केवळ पावसावर अवलंबून)",
    getRiskAssessmentBtn: "माझ्या पिकाची जोखीम तपासा ➔",

    yourSoybeanRisk: "तुमची सोयाबीन पीक जोखीम",
    riskLevels: {
      LOW: "कमी जोखीम (LOW RISK)",
      MODERATE: "मध्यम जोखीम (MODERATE RISK)",
      HIGH: "उच्च जोखीम (HIGH RISK)",
      CRITICAL: "अति-गंभीर जोखीम (CRITICAL RISK)"
    },
    riskProbability: "जोखीम संभाव्यता",
    potentialYieldImpact: "अपेक्षित उत्पादन परिणाम",
    whyThisRisk: "ही जोखीम का आहे?",
    whyThisRiskSubtitle: "हवामान, माती व उपग्रह निरीक्षणावर आधारित मुख्य कारणे",
    rainfallDriver: "पाऊस प्रमाण",
    tempDriver: "तापमान",
    soilDriver: "जमिनीतील ओलावा",
    vegetationDriver: "पिकाची हिरवळ (NDVI)",
    ensoDriver: "एल निनो (ENSO) प्रभाव",
    shapExplanationNotice: "कृत्रिम बुद्धिमत्ता (ML + SHAP) द्वारे सर्वात जास्त प्रभाव टाकणाऱ्या घटकांची वर्गवारी",
    technicalDetailsToggle: "तांत्रिक तपशील दाखवा",

    earlyWarningTitle: "⚠️ पूर्वसूचना इशारा (Early Warning)",
    earlyWarningSubtitle: "पिकावरील हवामान ताण वाढत आहे. वेळेवर खबरदारी घ्या.",
    recommendedActionHeading: "तातडीची शिफारस",

    recommendationsHeading: "मी काय करावे? (कृती योजना)",
    recommendationsSubtitle: "तुमच्या पीक अवस्थेनुसार तज्ज्ञ कृषी सल्ला",
    waterManagement: "💧 पाणी व्यवस्थापन",
    cropManagement: "🌱 पीक व्यवस्थापन",
    fieldManagement: "🌿 शेत व जमीन व्यवस्थापन",
    priorityHigh: "अति महत्त्वाचे",
    priorityMedium: "मध्यम प्राधान्य",
    priorityLow: "सामान्य काळजी",

    whatIfHeading: "जर हवामान बदलले तर? (What-If)",
    whatIfSubheading: "हवामानात बदल झाल्यास तुमच्या पिकाच्या जोखमीवर काय परिणाम होईल ते सिम्युलेट करा",
    rainfallControl: "पावसाचे प्रमाण",
    tempControl: "तापमानातील वाढ",
    soilMoistureControl: "मातीतील ओलावा",
    runSimulationBtn: "सिम्युलेशन चालवा",
    runningSimulation: "मॉडेल गणना करत आहे...",
    currentRisk: "सध्याची जोखीम",
    scenarioRisk: "बदललेली संभाव्य जोखीम",
    riskChange: "जोखमीतील फरक",
    mainReason: "मुख्य कारण",
    currentLabel: "सध्याचे",

    officerDashboardHeading: "महाराष्ट्र कृषी जोखीम डॅशबोर्ड (अधिकारी कक्ष)",
    officerDashboardSub: "जिल्हानिहाय सोयाबीन दुष्काळ व एल निनो जोखीम नकाशा",
    districtMapTitle: "महाराष्ट्र जिल्हा जोखीम नकाशा",
    highRiskDistricts: "अति-जोखमीचे जिल्हे",
    districtName: "जिल्हा",
    riskCol: "जोखीम पातळी",
    cropStageCol: "पीक अवस्था",
    actionCol: "शिफारस केलेली उपाययोजना",
    viewIntervention: "तपशील पहा",
    switchRoleOfficer: "कृषी अधिकारी व्ह्यू",
    switchRoleFarmer: "शेतकरी व्ह्यू",

    historicalReplayHeading: "ऐतिहासिक हवामान पडताळणी (Historical Replay)",
    historicalReplaySub: "भूतकाळातील एल निनो वर्षांचा मॉडेल अंदाज व प्रत्यक्ष वास्तव",
    selectYear: "वर्ष निवडा",
    runHistoricalAnalysis: "ऐतिहासिक विश्लेषण तपासा",
    historicalConditions: "त्या वेळची हवामान परिस्थिती",
    predictedRisk: "मॉडेलने वर्तवलेली जोखीम",
    actualOutcome: "प्रत्यक्ष नोंदवलेला निकाल",
    keyTakeawayTitle: "निष्कर्ष व शिकवण",

    navHome: "मुख्य",
    navMyCrop: "माझे पीक",
    navRisk: "जोखीम",
    navRecommendations: "उपाययोजना",
    navWhatIf: "काय जर? (What-If)",
    navOfficer: "जिल्हा नकाशा",
    navHistorical: "इतिहास",
    navProfile: "प्रोफाइल",

    askKrishiAi: "कृषी AI ला विचारा",
    chatWelcome: "नमस्कार! 🙏 मी कृषी AI सहाय्यक आहे. तुमच्या सोयाबीन पिकाची जोखीम आणि उपाय समजून घेण्यासाठी मी सज्ज आहे.",
    quickQuestionsTitle: "वारंवार विचारले जाणारे प्रश्न:",
    qWhyRisk: "माझ्या पिकाला जोखीम का आहे?",
    qWhatShouldIDo: "सध्या मी काय उपाय करावेत?",
    qWhatIsElNino: "एल निनो (El Niño) म्हणजे काय?",
    qLessRainSoybean: "पाऊस कमी झाला तर सोयाबीनवर काय परिणाम होईल?",
    qExplainSimple: "माझी जोखीम साध्या भाषेत समजावून सांगा.",
    chatPlaceholder: "सोयाबीन किंवा हवामानाबद्दल प्रश्न विचारा...",
    sendBtn: "पाठवा",
    listeningVoice: "ऐकत आहे...",
    speakResponse: "आवाजात ऐका"
  },

  hi: {
    appName: "कृषि अलर्ट (KrishiAlert)",
    tagline: "अल नीनो और सोयाबीन फसल जोखिम पूर्व चेतावनी प्रणाली",
    chooseLanguage: "अपनी भाषा चुनें",
    changeLanguageAnytime: "आप सेटिंग्स से कभी भी भाषा बदल सकते हैं।",
    continueBtn: "आगे बढ़ें",
    loginHeading: "किसान लॉगिन",
    loginSubheading: "अपनी फसल का जोखिम जानने के लिए मोबाइल नंबर दर्ज करें",
    mobileNumber: "मोबाइल नंबर",
    enterMobile: "+91 मोबाइल नंबर",
    otp: "ओटीपी (OTP)",
    enterOtp: "६ अंकों का ओटीपी दर्ज करें",
    getOtpBtn: "ओटीपी भेजें",
    verifyOtpBtn: "सत्यापित करें और आगे बढ़ें",
    demoOtpHint: "डेमो के लिए कोई भी ६ अंकों का नंबर (जैसे 123456) दर्ज करें",
    loginBtn: "लॉगिन करें",
    createAccountBtn: "नया खाता बनाएं",
    logoutBtn: "लॉगआउट",
    demoFarmerTag: "सोयाबीन उत्पादक किसान",

    tellUsAboutFarm: "अपने खेत के बारे में बताएं",
    onboardingSub: "सटीक जोखिम आकलन के लिए केवल ४ आसान सवाल",
    step1Location: "चरण १ — स्थान",
    state: "राज्य",
    district: "जिला",
    selectDistrict: "अपना जिला चुनें",
    talukaOptional: "तहसील (वैकल्पिक)",
    step2Crop: "चरण २ — फसल",
    soybean: "🌱 सोयाबीन",
    comingSoon: "(जल्द: कपास, मक्का, ज्वार)",
    step3CropInfo: "चरण ३ — फसल की स्थिति",
    sowingDate: "बुवाई की तारीख",
    cropStage: "वर्तमान फसल अवस्था",
    stages: {
      germination: "अंकुरण अवस्था (Germination)",
      vegetative: "वानस्पतिक वृद्धि (Vegetative)",
      flowering: "फूल आने की अवस्था (Flowering - अत्यंत संवेदनशील)",
      pod_development: "फलियां बनना (Pod Development)",
      maturity: "परिपक्वता (Maturity)"
    },
    step4Irrigation: "चरण ४ — सिंचाई सुविधा",
    irrigationQuestion: "क्या आपके पास सिंचाई / पानी की सुविधा उपलब्ध है?",
    irrigationYes: "🟢 हाँ (पर्याप्त सिंचाई)",
    irrigationPartial: "🟡 आंशिक (सीमित पानी)",
    irrigationNo: "🔴 नहीं (पूरी तरह बारिश पर निर्भर)",
    getRiskAssessmentBtn: "मेरी फसल का जोखिम जांचें ➔",

    yourSoybeanRisk: "आपकी सोयाबीन फसल का जोखिम",
    riskLevels: {
      LOW: "कम जोखिम (LOW RISK)",
      MODERATE: "मध्यम जोखिम (MODERATE RISK)",
      HIGH: "उच्च जोखिम (HIGH RISK)",
      CRITICAL: "गंभीर जोखिम (CRITICAL RISK)"
    },
    riskProbability: "जोखिम संभावना",
    potentialYieldImpact: "अनुमानित उपज नुकसान",
    whyThisRisk: "यह जोखिम क्यों है?",
    whyThisRiskSubtitle: "मौसम, मिट्टी और उपग्रह आंकड़ों पर आधारित मुख्य कारण",
    rainfallDriver: "बारिश की स्थिति",
    tempDriver: "तापमान",
    soilDriver: "मिट्टी की नमी",
    vegetationDriver: "फसल का हरापन (NDVI)",
    ensoDriver: "अल नीनो प्रभाव",
    shapExplanationNotice: "मशीन लर्निंग (XGBoost + SHAP) द्वारा मुख्य जोखिम कारकों का विश्लेषण",
    technicalDetailsToggle: "तकनीकी विवरण देखें",

    earlyWarningTitle: "⚠️ पूर्व चेतावनी (Early Warning)",
    earlyWarningSubtitle: "फसल पर मौसम संबंधी तनाव बढ़ रहा है। समय पर कदम उठाएं।",
    recommendedActionHeading: "तत्काल अनुशंसित कदम",

    recommendationsHeading: "मुझे क्या करना चाहिए? (सलाह)",
    recommendationsSubtitle: "आपकी फसल अवस्था के अनुसार कृषि विशेषज्ञों की सलाह",
    waterManagement: "💧 जल प्रबंधन",
    cropManagement: "🌱 फसल प्रबंधन",
    fieldManagement: "🌿 खेत और मिट्टी प्रबंधन",
    priorityHigh: "अति आवश्यक",
    priorityMedium: "मध्यम प्राथमिकता",
    priorityLow: "सामान्य देखभाल",

    whatIfHeading: "अगर मौसम बदला तो? (What-If)",
    whatIfSubheading: "देखें कि मौसम में बदलाव आपकी फसल के जोखिम को कैसे प्रभावित करेगा",
    rainfallControl: "बारिश में कमी/बदलाव",
    tempControl: "तापमान में वृद्धि",
    soilMoistureControl: "मिट्टी में नमी",
    runSimulationBtn: "सिमुलेशन चलाएं",
    runningSimulation: "मॉडल गणना कर रहा है...",
    currentRisk: "वर्तमान जोखिम",
    scenarioRisk: "संभावित जोखिम",
    riskChange: "जोखिम में बदलाव",
    mainReason: "मुख्य कारण",
    currentLabel: "वर्तमान",

    officerDashboardHeading: "महाराष्ट्र कृषि जोखिम डैशबोर्ड (अधिकारी)",
    officerDashboardSub: "जिलेवार सोयाबीन सूखा और अल नीनो जोखिम मानचित्र",
    districtMapTitle: "महाराष्ट्र जिला जोखिम मानचित्र",
    highRiskDistricts: "उच्च जोखिम वाले जिले",
    districtName: "जिला",
    riskCol: "जोखिम स्तर",
    cropStageCol: "फसल अवस्था",
    actionCol: "प्रस्तावित कदम",
    viewIntervention: "विवरण देखें",
    switchRoleOfficer: "अधिकारी मोड",
    switchRoleFarmer: "किसान मोड",

    historicalReplayHeading: "ऐतिहासिक मौसम विश्लेषण (Historical Replay)",
    historicalReplaySub: "पिछले अल नीनो वर्षों में मॉडल भविष्यवाणी और वास्तविक परिणाम",
    selectYear: "वर्ष चुनें",
    runHistoricalAnalysis: "ऐतिहासिक विश्लेषण चलाएं",
    historicalConditions: "तत्कालीन मौसम की स्थिति",
    predictedRisk: "मॉडल द्वारा अनुमानित जोखिम",
    actualOutcome: "वास्तविक ऐतिहासिक परिणाम",
    keyTakeawayTitle: "प्रमुख निष्कर्ष",

    navHome: "होम",
    navMyCrop: "मेरी फसल",
    navRisk: "जोखिम",
    navRecommendations: "सलाह",
    navWhatIf: "अगर-मगर (What-If)",
    navOfficer: "जिला नक्शा",
    navHistorical: "इतिहास",
    navProfile: "प्रोफाइल",

    askKrishiAi: "कृषि AI से पूछें",
    chatWelcome: "नमस्ते! 🙏 मैं आपका कृषि AI सहायक हूँ। अपनी सोयाबीन फसल के जोखिम और सलाह के बारे में मुझसे पूछें।",
    quickQuestionsTitle: "अक्सर पूछे जाने वाले प्रश्न:",
    qWhyRisk: "मेरी फसल को जोखिम क्यों है?",
    qWhatShouldIDo: "मुझे अभी क्या उपाय करने चाहिए?",
    qWhatIsElNino: "अल नीनो (El Niño) क्या है?",
    qLessRainSoybean: "कम बारिश से सोयाबीन पर क्या असर पड़ेगा?",
    qExplainSimple: "सरल भाषा में मेरा जोखिम समझाएं।",
    chatPlaceholder: "सोयाबीन या मौसम के बारे में सवाल पूछें...",
    sendBtn: "भेजें",
    listeningVoice: "सुन रहा हूँ...",
    speakResponse: "आवाज़ में सुनें"
  },

  en: {
    appName: "KrishiAlert",
    tagline: "El Niño Agricultural Risk & Early Warning System",
    chooseLanguage: "Choose Your Language",
    changeLanguageAnytime: "You can change your language anytime from Settings.",
    continueBtn: "Continue",
    loginHeading: "Farmer Login",
    loginSubheading: "Enter your mobile number to check your crop risk",
    mobileNumber: "Mobile Number",
    enterMobile: "+91 Mobile Number",
    otp: "OTP",
    enterOtp: "Enter 6-digit OTP",
    getOtpBtn: "Send OTP",
    verifyOtpBtn: "Verify & Continue",
    demoOtpHint: "For demo, use any 6-digit code (e.g. 123456)",
    loginBtn: "Login",
    createAccountBtn: "Create Account",
    logoutBtn: "Logout",
    demoFarmerTag: "Soybean Farmer",

    tellUsAboutFarm: "Tell Us About Your Farm",
    onboardingSub: "4 simple questions for tailored risk predictions",
    step1Location: "Step 1 — Location",
    state: "State",
    district: "District",
    selectDistrict: "Select your district",
    talukaOptional: "Taluka (Optional)",
    step2Crop: "Step 2 — Crop",
    soybean: "🌱 Soybean",
    comingSoon: "(Later: Cotton, Maize, Jowar)",
    step3CropInfo: "Step 3 — Crop Information",
    sowingDate: "Sowing Date",
    cropStage: "Crop Stage",
    stages: {
      germination: "Germination",
      vegetative: "Vegetative",
      flowering: "Flowering (Critically Sensitive)",
      pod_development: "Pod Development",
      maturity: "Maturity"
    },
    step4Irrigation: "Step 4 — Irrigation",
    irrigationQuestion: "Do you have irrigation available?",
    irrigationYes: "🟢 Yes (Full Availability)",
    irrigationPartial: "🟡 Partial (Limited Protective)",
    irrigationNo: "🔴 No (Rainfed Only)",
    getRiskAssessmentBtn: "Get My Risk Assessment ➔",

    yourSoybeanRisk: "Your Soybean Risk",
    riskLevels: {
      LOW: "LOW RISK",
      MODERATE: "MODERATE RISK",
      HIGH: "HIGH RISK",
      CRITICAL: "CRITICAL RISK"
    },
    riskProbability: "Risk Probability",
    potentialYieldImpact: "Potential Yield Impact",
    whyThisRisk: "Why this Risk?",
    whyThisRiskSubtitle: "Key drivers derived from climate, soil, and satellite observations",
    rainfallDriver: "Rainfall",
    tempDriver: "Temperature",
    soilDriver: "Soil Moisture",
    vegetationDriver: "Vegetation Health (NDVI)",
    ensoDriver: "El Niño / ENSO Phase",
    shapExplanationNotice: "Powered by ML + SHAP feature attribution behind the scenes",
    technicalDetailsToggle: "View Technical Drivers",

    earlyWarningTitle: "⚠️ Early Warning",
    earlyWarningSubtitle: "Crop stress risk is increasing. Take preventive action.",
    recommendedActionHeading: "Recommended Action",

    recommendationsHeading: "What Should I Do?",
    recommendationsSubtitle: "Actionable crop advisory tailored to your crop stage",
    waterManagement: "💧 Water Management",
    cropManagement: "🌱 Crop Management",
    fieldManagement: "🌿 Field Management",
    priorityHigh: "HIGH PRIORITY",
    priorityMedium: "MEDIUM",
    priorityLow: "LOW",

    whatIfHeading: "What If?",
    whatIfSubheading: "See how changing climate conditions could affect your crop risk.",
    rainfallControl: "Rainfall",
    tempControl: "Temperature",
    soilMoistureControl: "Soil Moisture",
    runSimulationBtn: "Run Simulation",
    runningSimulation: "Calculating Model Scenario...",
    currentRisk: "Current Risk",
    scenarioRisk: "Scenario Risk",
    riskChange: "Risk Change",
    mainReason: "Main Reason",
    currentLabel: "Current",

    officerDashboardHeading: "Maharashtra Agricultural Risk (Officer View)",
    officerDashboardSub: "District-level soybean drought & El Niño vulnerability matrix",
    districtMapTitle: "Maharashtra District Risk Map",
    highRiskDistricts: "High-Risk Districts",
    districtName: "District",
    riskCol: "Risk Level",
    cropStageCol: "Crop Stage",
    actionCol: "Recommended Intervention",
    viewIntervention: "View Drilldown",
    switchRoleOfficer: "Officer View",
    switchRoleFarmer: "Farmer View",

    historicalReplayHeading: "Historical Climate Replay",
    historicalReplaySub: "Compare ML model projections against historical El Niño ground truth",
    selectYear: "Select Year",
    runHistoricalAnalysis: "Run Historical Analysis",
    historicalConditions: "Historical Climate Conditions",
    predictedRisk: "Predicted Risk",
    actualOutcome: "Actual Historical Outcome",
    keyTakeawayTitle: "Key Scientific Takeaway",

    navHome: "Home",
    navMyCrop: "My Crop",
    navRisk: "Risk",
    navRecommendations: "Advisory",
    navWhatIf: "What-If",
    navOfficer: "District Map",
    navHistorical: "History",
    navProfile: "Profile",

    askKrishiAi: "Ask Krishi AI",
    chatWelcome: "Namaskar! 👋 I'm here to help you understand your crop risk.",
    quickQuestionsTitle: "Quick Questions:",
    qWhyRisk: "Why is my crop at risk?",
    qWhatShouldIDo: "What should I do?",
    qWhatIsElNino: "What is El Niño?",
    qLessRainSoybean: "Will less rainfall affect my soybean?",
    qExplainSimple: "Explain my risk in simple language.",
    chatPlaceholder: "Ask about your soybean crop, rainfall, or advisories...",
    sendBtn: "Send",
    listeningVoice: "Listening...",
    speakResponse: "Read Aloud"
  }
};
