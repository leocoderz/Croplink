"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "hi" | "ta" | "ml" | "te" | "kn"

interface LanguageContextType {
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Translation data
const translations = {
  en: {
    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.retry": "Retry",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.previous": "Previous",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.refresh": "Refresh",

    // App Title
    "app.title": "CropLink - Your Agricultural Companion",
    "app.description": "Your one-stop solution for agricultural needs",

    // Navigation
    "nav.home": "Home",
    "nav.chat": "Chat",
    "nav.weather": "Weather",
    "nav.disease": "Disease",
    "nav.analytics": "Analytics",

    // Home Page
    "home.greeting": "Good Morning!",
    "home.greetingAfternoon": "Good Afternoon!",
    "home.greetingEvening": "Good Evening!",
    "home.subtitle": "Ready to grow your farm today?",
    "home.search.placeholder": "Search for crops, diseases, weather...",
    "home.features.title": "Explore Features",
    "home.activity.title": "Recent Activity",
    "home.stats.temperature": "Perfect for planting",
    "home.stats.health": "Crop health score",

    // Features
    "features.ai.title": "AI Assistant",
    "features.ai.description": "Get instant answers to your farming questions",
    "features.ai.badge": "AI Powered",
    "features.weather.title": "Weather Forecast",
    "features.weather.description": "Real-time weather updates for your location",
    "features.weather.badge": "Live Data",
    "features.disease.title": "Disease Detection",
    "features.disease.description": "Identify and treat crop diseases early",
    "features.disease.badge": "Smart Detection",
    "features.schemes.title": "Gov. Schemes",
    "features.schemes.description": "Discover beneficial government programs",
    "features.schemes.badge": "Updated",
    "features.analytics.title": "Farm Analytics",
    "features.analytics.description": "Data-driven insights for better yields",
    "features.analytics.badge": "Insights",

    // Chatbot
    "chat.title": "AI Farm Assistant",
    "chat.subtitle": "Ask me anything about farming!",
    "chat.placeholder": "Ask about crops, diseases, weather...",
    "chat.voice.not.supported": "Voice input not supported in this browser",
    "chat.listening": "Listening... Speak now",
    "chat.error": "Failed to send message. Please try again.",
    "chat.tips.title": "💡 Tips",
    "chat.tips.specific": "• Be specific about your crops and location",
    "chat.tips.symptoms": "• Ask about symptoms, weather, or farming techniques",
    "chat.tips.voice": "• Use voice input for hands-free operation",

    // Quick Questions
    "quick.tomatoes": "What's the best time to plant tomatoes?",
    "quick.blight": "How to treat leaf blight?",
    "quick.fertilizer": "Organic fertilizer recommendations",
    "quick.pest": "Pest control for wheat crops",
    "quick.harvest": "When to harvest corn?",
    "quick.soil": "Soil preparation tips",

    // Weather
    "weather.title": "Weather Forecast",
    "weather.location": "Your Farm Location",
    "weather.alerts": "Weather Alerts",
    "weather.conditions": "Current Conditions",
    "weather.forecast": "5-Day Forecast",
    "weather.recommendations": "Farming Recommendations",
    "weather.humidity": "Humidity",
    "weather.wind": "Wind",
    "weather.visibility": "Visibility",
    "weather.pressure": "Pressure",
    "weather.uv": "UV Index",

    // Disease Detection
    "disease.title": "Disease Detection",
    "disease.subtitle": "Upload a photo to identify crop diseases",
    "disease.upload.title": "Upload Plant Image",
    "disease.upload.subtitle": "Take a clear photo of the affected plant part",
    "disease.take.photo": "Take Photo",
    "disease.upload.gallery": "Upload from Gallery",
    "disease.analyze": "Analyze Disease",
    "disease.analyzing": "Analyzing...",
    "disease.detected": "Disease Detected",
    "disease.treatment": "Treatment Steps",
    "disease.prevention": "Prevention Tips",
    "disease.common": "Common Diseases",
    "disease.tips.title": "📸 Photography Tips",

    // Analytics
    "analytics.title": "Farm Analytics",
    "analytics.subtitle": "Data-driven insights for your farm",
    "analytics.crop.yield": "Crop Yield",
    "analytics.water.usage": "Water Usage",
    "analytics.revenue": "Revenue",
    "analytics.efficiency": "Farm Efficiency",
    "analytics.performance": "Crop Performance",
    "analytics.insights": "AI Insights & Recommendations",

    // Government Schemes
    "schemes.title": "Government Schemes",
    "schemes.subtitle": "Discover beneficial programs for farmers",
    "schemes.apply": "Apply Now",
    "schemes.learn.more": "Learn More",
    "schemes.your.applications": "Your Applications",
    "schemes.need.help": "Need Help?",
    "schemes.contact.support": "Contact our support team for assistance with applications",

    // Language Selector
    "language.select": "Select Language",
    "language.english": "English",
    "language.hindi": "हिंदी",
    "language.tamil": "தமிழ்",
    "language.malayalam": "മലയാളം",
    "language.telugu": "తెలుగు",
    "language.kannada": "ಕನ್ನಡ",

    // Additional translations
    welcome: "Welcome",
    home: "Home",
    weather: "Weather",
    chat: "Chat",
    analysis: "Analysis",
    schemes: "Schemes",
    "good-morning": "Good Morning",
    "good-afternoon": "Good Afternoon",
    "good-evening": "Good Evening",
    "ai-assistant": "AI Assistant",
    "weather-forecast": "Weather Forecast",
    "disease-detection": "Disease Detection",
    "farm-analytics": "Farm Analytics",
    "government-schemes": "Government Schemes",
    "quick-actions": "Quick Actions",
    "farm-status": "Farm Status",
    "all-features": "All Features",
    "recent-activity": "Recent Activity",
    "no-notifications": "No notifications",
    "sign-in": "Sign In",
    "sign-up": "Sign Up",
    email: "Email",
    password: "Password",
    name: "Name",
    phone: "Phone",
  },

  hi: {
    // Common
    "common.loading": "लोड हो रहा है...",
    "common.error": "त्रुटि",
    "common.retry": "पुनः प्रयास करें",
    "common.cancel": "रद्द करें",
    "common.save": "सहेजें",
    "common.delete": "हटाएं",
    "common.edit": "संपादित करें",
    "common.close": "बंद करें",
    "common.back": "वापस",
    "common.next": "अगला",
    "common.previous": "पिछला",
    "common.search": "खोजें",
    "common.filter": "फ़िल्टर",
    "common.sort": "क्रमबद्ध करें",
    "common.refresh": "ताज़ा करें",

    // App Title
    "app.title": "CropLink - आपका कृषि साथी",
    "app.description": "आपकी कृषि आवश्यकताओं का एक-स्टॉप समाधान",

    // Navigation
    "nav.home": "होम",
    "nav.chat": "चैट",
    "nav.weather": "मौसम",
    "nav.disease": "रोग",
    "nav.analytics": "विश्लेषण",

    // Home Page
    "home.greeting": "सुप्रभात!",
    "home.greetingAfternoon": "शुभ दोपहर!",
    "home.greetingEvening": "शुभ संध्या!",
    "home.subtitle": "आज अपने खेत को बढ़ाने के लिए तैयार हैं?",
    "home.search.placeholder": "फसलों, रोगों, मौसम के लिए खोजें...",
    "home.features.title": "सुविधाओं का अन्वेषण करें",
    "home.activity.title": "हाल की गतिविधि",
    "home.stats.temperature": "रोपण के लिए उत्तम",
    "home.stats.health": "फसल स्वास्थ्य स्कोर",

    // Features
    "features.ai.title": "AI सहायक",
    "features.ai.description": "अपने कृषि प्रश्नों के तुरंत उत्तर पाएं",
    "features.ai.badge": "AI संचालित",
    "features.weather.title": "मौसम पूर्वानुमान",
    "features.weather.description": "आपके स्थान के लिए वास्तविक समय मौसम अपडेट",
    "features.weather.badge": "लाइव डेटा",
    "features.disease.title": "रोग पहचान",
    "features.disease.description": "फसल रोगों की जल्दी पहचान और उपचार",
    "features.disease.badge": "स्मार्ट पहचान",
    "features.schemes.title": "सरकारी योजनाएं",
    "features.schemes.description": "लाभकारी सरकारी कार्यक्रमों की खोज करें",
    "features.schemes.badge": "अपडेटेड",
    "features.analytics.title": "खेत विश्लेषण",
    "features.analytics.description": "बेहतर उत्पादन के लिए डेटा-संचालित अंतर्दृष्टि",
    "features.analytics.badge": "अंतर्दृष्टि",

    // Chatbot
    "chat.title": "AI कृषि सहायक",
    "chat.subtitle": "कृषि के बारे में कुछ भी पूछें!",
    "chat.placeholder": "फसलों, रोगों, मौसम के बारे में पूछें...",
    "chat.voice.not.supported": "इस ब्राउज़र में वॉयस इनपुट समर्थित नहीं है",
    "chat.listening": "सुन रहा है... अब बोलें",
    "chat.error": "संदेश भेजने में विफल। कृपया पुनः प्रयास करें।",
    "chat.tips.title": "💡 सुझाव",
    "chat.tips.specific": "• अपनी फसलों और स्थान के बारे में विशिष्ट रहें",
    "chat.tips.symptoms": "• लक्षणों, मौसम या कृषि तकनीकों के बारे में पूछें",
    "chat.tips.voice": "• हैंड्स-फ्री ऑपरेशन के लिए वॉयस इनपुट का उपयोग करें",

    // Quick Questions
    "quick.tomatoes": "टमाटर लगाने का सबसे अच्छा समय कब है?",
    "quick.blight": "पत्ती झुलसा का इलाज कैसे करें?",
    "quick.fertilizer": "जैविक उर्वरक की सिफारिशें",
    "quick.pest": "गेहूं की फसलों के लिए कीट नियंत्रण",
    "quick.harvest": "मक्का की कटाई कब करें?",
    "quick.soil": "मिट्टी तैयार करने के सुझाव",

    // Weather
    "weather.title": "मौसम पूर्वानुमान",
    "weather.location": "आपका खेत स्थान",
    "weather.alerts": "मौसम चेतावनी",
    "weather.conditions": "वर्तमान स्थितियां",
    "weather.forecast": "5-दिन का पूर्वानुमान",
    "weather.recommendations": "कृषि सिफारिशें",
    "weather.humidity": "आर्द्रता",
    "weather.wind": "हवा",
    "weather.visibility": "दृश्यता",
    "weather.pressure": "दबाव",
    "weather.uv": "UV सूचकांक",

    // Disease Detection
    "disease.title": "रोग पहचान",
    "disease.subtitle": "फसल रोगों की पहचान के लिए एक फोटो अपलोड करें",
    "disease.upload.title": "पौधे की छवि अपलोड करें",
    "disease.upload.subtitle": "प्रभावित पौधे के हिस्से की स्पष्ट तस्वीर लें",
    "disease.take.photo": "फोटो लें",
    "disease.upload.gallery": "गैलरी से अपलोड करें",
    "disease.analyze": "रोग का विश्लेषण करें",
    "disease.analyzing": "विश्लेषण कर रहा है...",
    "disease.detected": "रोग का पता चला",
    "disease.treatment": "उपचार के चरण",
    "disease.prevention": "रोकथाम के सुझाव",
    "disease.common": "सामान्य रोग",
    "disease.tips.title": "📸 फोटोग्राफी सुझाव",

    // Analytics
    "analytics.title": "खेत विश्लेषण",
    "analytics.subtitle": "आपके खेत के लिए डेटा-संचालित अंतर्दृष्टि",
    "analytics.crop.yield": "फसल उत्पादन",
    "analytics.water.usage": "पानी का उपयोग",
    "analytics.revenue": "आय",
    "analytics.efficiency": "खेत दक्षता",
    "analytics.performance": "फसल प्रदर्शन",
    "analytics.insights": "AI अंतर्दृष्टि और सिफारिशें",

    // Government Schemes
    "schemes.title": "सरकारी योजनाएं",
    "schemes.subtitle": "किसानों के लिए लाभकारी कार्यक्रमों की खोज करें",
    "schemes.apply": "अभी आवेदन करें",
    "schemes.learn.more": "और जानें",
    "schemes.your.applications": "आपके आवेदन",
    "schemes.need.help": "सहायता चाहिए?",
    "schemes.contact.support": "आवेदनों में सहायता के लिए हमारी सहायता टीम से संपर्क करें",

    // Language Selector
    "language.select": "भाषा चुनें",
    "language.english": "English",
    "language.hindi": "हिंदी",
    "language.tamil": "தமிழ்",
    "language.malayalam": "മലയാളം",
    "language.telugu": "తెలుగు",
    "language.kannada": "ಕನ್ನಡ",

    // Additional translations
    welcome: "ಸ്വാഗതം",
    home: "മുകുളി",
    weather: "വായുവാതം",
    chat: "ചാറ്റ്",
    analysis: "വിേഷണം",
    schemes: "യോജനകൾ",
    "good-morning": "Good Morning",
    "good-afternoon": "Good Afternoon",
    "good-evening": "Good Evening",
    "ai-assistant": "AI Assistant",
    "weather-forecast": "Weather Forecast",
    "disease-detection": "Disease Detection",
    "farm-analytics": "Farm Analytics",
    "government-schemes": "Government Schemes",
    "quick-actions": "Quick Actions",
    "farm-status": "Farm Status",
    "all-features": "All Features",
    "recent-activity": "Recent Activity",
    "no-notifications": "No notifications",
    "sign-in": "Sign In",
    "sign-up": "Sign Up",
    email: "Email",
    password: "Password",
    name: "Name",
    phone: "Phone",
  },

  ta: {
    // Common
    "common.loading": "ஏற்றுகிறது...",
    "common.error": "பிழை",
    "common.retry": "மீண்டும் முயற்சிக்கவும்",
    "common.cancel": "ரத்து செய்",
    "common.save": "சேமி",
    "common.delete": "நீக்கு",
    "common.edit": "திருத்து",
    "common.close": "மூடு",
    "common.back": "பின்",
    "common.next": "அடுத்து",
    "common.previous": "முந்தைய",
    "common.search": "தேடு",
    "common.filter": "வடிகட்டு",
    "common.sort": "வரிசைப்படுத்து",
    "common.refresh": "புதுப்பி",

    // App Title
    "app.title": "CropLink - உங்கள் விவசாய துணை",
    "app.description": "உங்கள் விவசாய தேவைகளுக்கான ஒரே இடத்தில் தீர்வு",

    // Navigation
    "nav.home": "முகப்பு",
    "nav.chat": "அரட்டை",
    "nav.weather": "வானிலை",
    "nav.disease": "நோய்",
    "nav.analytics": "பகுப்பாய்வு",

    // Home Page
    "home.greeting": "காலை வணக்கம்!",
    "home.greetingAfternoon": "மதிய வணக்கம்!",
    "home.greetingEvening": "மாலை வணக்கம்!",
    "home.subtitle": "இன்று உங்கள் பண்ணையை வளர்க்க தயாரா?",
    "home.search.placeholder": "பயிர்கள், நோய்கள், வானிலைக்காக தேடுங்கள்...",
    "home.features.title": "அம்சங்களை ஆராயுங்கள்",
    "home.activity.title": "சமீபத்திய செயல்பாடு",
    "home.stats.temperature": "நடவுக்கு சரியான நேரம்",
    "home.stats.health": "பயிர் ஆரோக்கிய மதிப்பெண்",

    // Features
    "features.ai.title": "AI உதவியாளர்",
    "features.ai.description": "உங்கள் விவசாய கேள்விகளுக்கு உடனடி பதில்கள் பெறுங்கள்",
    "features.ai.badge": "AI இயக்கப்படும்",
    "features.weather.title": "வானிலை முன்னறிவிப்பு",
    "features.weather.description": "உங்கள் இடத்திற்கான நேரடி வானிலை புதுப்பிப்புகள்",
    "features.weather.badge": "நேரடி தரவு",
    "features.disease.title": "நோய் கண்டறிதல்",
    "features.disease.description": "பயிர் நோய்களை ஆரம்பத்திலேயே கண்டறிந்து சிகிச்சை அளியுங்கள்",
    "features.disease.badge": "ஸ்மார்ட் கண்டறிதல்",
    "features.schemes.title": "அரசு திட்டங்கள்",
    "features.schemes.description": "பயனுள்ள அரசு திட்டங்களை கண்டறியுங்கள்",
    "features.schemes.badge": "புதுப்பிக்கப்பட்டது",
    "features.analytics.title": "பண்ணை பகுப்பாய்வு",
    "features.analytics.description": "சிறந்த விளைச்சலுக்கான தரவு-உந்துதல் நுண்ணறிவுகள்",
    "features.analytics.badge": "நுண்ணறிவுகள்",

    // Chatbot
    "chat.title": "AI விவசாய உதவியாளர்",
    "chat.subtitle": "விவசாயத்தைப் பற்றி எதையும் கேளுங்கள்!",
    "chat.placeholder": "பயிர்கள், நோய்கள், வானிலை பற்றி கேளுங்கள்...",
    "chat.voice.not.supported": "இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை",
    "chat.listening": "கேட்கிறது... இப்போது பேசுங்கள்",
    "chat.error": "செய்தி அனுப்ப முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    "chat.tips.title": "💡 குறிப்புகள்",
    "chat.tips.specific": "• உங்கள் பயிர்கள் மற்றும் இடம் பற்றி குறிப்பிட்டு சொல்லுங்கள்",
    "chat.tips.symptoms": "• அறிகுறிகள், வானிலை அல்லது விவசாய நுட்பங்களைப் பற்றி கேளுங்கள்",
    "chat.tips.voice": "• கைகள் இல்லாத செயல்பாட்டிற்கு குரல் உள்ளீட்டைப் பயன்படுத்துங்கள்",

    // Quick Questions
    "quick.tomatoes": "தக்காளி நடவு செய்ய சிறந்த நேரம் எது?",
    "quick.blight": "இலை கருகல் நோய்க்கு எப்படி சிகிச்சை அளிப்பது?",
    "quick.fertilizer": "இயற்கை உரம் பரிந்துரைகள்",
    "quick.pest": "கோதுமை பயிர்களுக்கான பூச்சி கட்டுப்பாடு",
    "quick.harvest": "சோளம் எப்போது அறுவடை செய்வது?",
    "quick.soil": "மண் தயாரிப்பு குறிப்புகள்",

    // Weather
    "weather.title": "வானிலை முன்னறிவிப்பு",
    "weather.location": "உங்கள் பண்ணை இடம்",
    "weather.alerts": "வானிலை எச்சரிக்கைகள்",
    "weather.conditions": "தற்போதைய நிலைமைகள்",
    "weather.forecast": "5-நாள் முன்னறிவிப்பு",
    "weather.recommendations": "விவசாய பரிந்துரைகள்",
    "weather.humidity": "ஈரப்பதம்",
    "weather.wind": "காற்று",
    "weather.visibility": "தெரிவுநிலை",
    "weather.pressure": "அழுத்தம்",
    "weather.uv": "UV குறியீடு",

    // Disease Detection
    "disease.title": "நோய் கண்டறிதல்",
    "disease.subtitle": "பயிர் நோய்களை கண்டறிய ஒரு புகைப்படத்தை பதிவேற்றவும்",
    "disease.upload.title": "தாவர படத்தை பதிவேற்றவும்",
    "disease.upload.subtitle": "பாதிக்கப்பட்ட தாவர பகுதியின் தெளிவான புகைப்படம் எடுக்கவும்",
    "disease.take.photo": "புகைப்படம் எடு",
    "disease.upload.gallery": "கேலரியில் இருந்து பதிவேற்று",
    "disease.analyze": "நோய் பகுப்பாய்வு",
    "disease.analyzing": "பகுப்பாய்வு செய்கிறது...",
    "disease.detected": "நோய் கண்டறியப்பட்டது",
    "disease.treatment": "சிகிச்சை படிகள்",
    "disease.prevention": "தடுப்பு குறிப்புகள்",
    "disease.common": "பொதுவான நோய்கள்",
    "disease.tips.title": "📸 புகைப்பட குறிப்புகள்",

    // Analytics
    "analytics.title": "பண்ணை பகுப்பாய்வு",
    "analytics.subtitle": "உங்கள் பண்ணைக்கான தரவு-உந்துதல் நுண்ணறிவுகள்",
    "analytics.crop.yield": "பயிர் விளைச்சல்",
    "analytics.water.usage": "நீர் பயன்பாடு",
    "analytics.revenue": "வருமானம்",
    "analytics.efficiency": "பண்ணை திறன்",
    "analytics.performance": "பயிர் செயல்திறன்",
    "analytics.insights": "AI நுண்ணறிவுகள் மற்றும் பரிந்துரைகள்",

    // Government Schemes
    "schemes.title": "அரசு திட்டங்கள்",
    "schemes.subtitle": "விவசாயிகளுக்கான பயனுள்ள திட்டங்களை கண்டறியுங்கள்",
    "schemes.apply": "இப்போது விண்ணப்பிக்கவும்",
    "schemes.learn.more": "மேலும் அறிய",
    "schemes.your.applications": "உங்கள் விண்ணப்பங்கள்",
    "schemes.need.help": "உதவி தேவையா?",
    "schemes.contact.support": "விண்ணப்பங்களில் உதவிக்காக எங்கள் ஆதரவு குழுவை தொடர்பு கொள்ளுங்கள்",

    // Language Selector
    "language.select": "மொழியைத் தேர்ந்தெடுக்கவும்",
    "language.english": "English",
    "language.hindi": "हिंदी",
    "language.tamil": "தமிழ்",
    "language.malayalam": "മലയാളം",
    "language.telugu": "తెలుగు",
    "language.kannada": "ಕನ್ನಡ",

    // Additional translations
    welcome: "வரుంది",
    home: "ಮుఖ్య",
    weather: "వాతావరణం",
    chat: "చాట్",
    analysis: "విేషణం",
    schemes: "యోజనలు",
    "good-morning": "Good Morning",
    "good-afternoon": "Good Afternoon",
    "good-evening": "Good Evening",
    "ai-assistant": "AI Assistant",
    "weather-forecast": "Weather Forecast",
    "disease-detection": "Disease Detection",
    "farm-analytics": "Farm Analytics",
    "government-schemes": "Government Schemes",
    "quick-actions": "Quick Actions",
    "farm-status": "Farm Status",
    "all-features": "All Features",
    "recent-activity": "Recent Activity",
    "no-notifications": "No notifications",
    "sign-in": "Sign In",
    "sign-up": "Sign Up",
    email: "Email",
    password: "Password",
    name: "Name",
    phone: "Phone",
  },

  ml: {
    // Common
    "common.loading": "ലോഡ് ചെയ്യുന്നു...",
    "common.error": "പിശക്",
    "common.retry": "വീണ്ടും ശ്രമിക്കുക",
    "common.cancel": "റദ്ദാക്കുക",
    "common.save": "സേവ് ചെയ്യുക",
    "common.delete": "ഇല്ലാതാക്കുക",
    "common.edit": "എഡിറ്റ് ചെയ്യുക",
    "common.close": "അടയ്ക്കുക",
    "common.back": "തിരികെ",
    "common.next": "അടുത്തത്",
    "common.previous": "മുമ്പത്തെ",
    "common.search": "തിരയുക",
    "common.filter": "ഫിൽട്ടർ",
    "common.sort": "ക്രമീകരിക്കുക",
    "common.refresh": "പുതുക്കുക",

    // App Title
    "app.title": "CropLink - നിങ്ങളുടെ കാർഷിക സഹായി",
    "app.description": "നിങ്ങളുടെ കാർഷിക ആവശ്യങ്ങൾക്കുള്ള ഒറ്റ സ്റ്റോപ്പ് പരിഹാരം",

    // Navigation
    "nav.home": "ഹോം",
    "nav.chat": "ചാറ്റ്",
    "nav.weather": "കാലാവസ്ഥ",
    "nav.disease": "രോഗം",
    "nav.analytics": "വിശകലനം",

    // Home Page
    "home.greeting": "സുപ്രഭാതം!",
    "home.greetingAfternoon": "ശുഭ ഉച്ച!",
    "home.greetingEvening": "ശുഭ സന്ധ്യ!",
    "home.subtitle": "ഇന്ന് നിങ്ങളുടെ കൃഷി വളർത്താൻ തയ്യാറാണോ?",
    "home.search.placeholder": "വിളകൾ, രോഗങ്ങൾ, കാലാവസ്ഥ എന്നിവയ്ക്കായി തിരയുക...",
    "home.features.title": "ഫീച്ചറുകൾ പര്യവേക്ഷണം ചെയ്യുക",
    "home.activity.title": "സമീപകാല പ്രവർത്തനം",
    "home.stats.temperature": "നടീലിനു അനുയോജ്യം",
    "home.stats.health": "വിള ആരോഗ്യ സ്കോർ",

    // Features
    "features.ai.title": "AI സഹായി",
    "features.ai.description": "നിങ്ങളുടെ കാർഷിക ചോദ്യങ്ങൾക്ക് തൽക്ഷണ ഉത്തരങ്ങൾ നേടുക",
    "features.ai.badge": "AI പവർഡ്",
    "features.weather.title": "കാലാവസ്ഥാ പ്രവചനം",
    "features.weather.description": "നിങ്ങളുടെ സ്ഥലത്തിനുള്ള തത്സമയ കാലാവസ്ഥാ അപ്ഡേറ്റുകൾ",
    "features.weather.badge": "ലൈവ് ഡാറ്റ",
    "features.disease.title": "രോഗ കണ്ടെത്തൽ",
    "features.disease.description": "വിള രോഗങ്ങൾ നേരത്തെ തിരിച്ചറിഞ്ഞ് ചികിത്സിക്കുക",
    "features.disease.badge": "സ്മാർട്ട് കണ്ടെത്തൽ",
    "features.schemes.title": "സർക്കാർ പദ്ധതികൾ",
    "features.schemes.description": "പ്രയോജനകരമായ സർക്കാർ പ്രോഗ്രാമുകൾ കണ്ടെത്തുക",
    "features.schemes.badge": "അപ്ഡേറ്റ് ചെയ്തത്",
    "features.analytics.title": "ഫാം അനലിറ്റിക്സ്",
    "features.analytics.description": "മികച്ച വിളവിനുള്ള ഡാറ്റാ-ഡ്രിവൻ ഇൻസൈറ്റുകൾ",
    "features.analytics.badge": "ഇൻസൈറ്റുകൾ",

    // Chatbot
    "chat.title": "AI കാർഷിക സഹായി",
    "chat.subtitle": "കാർഷികതയെക്കുറിച്ച് എന്തും ചോദിക്കുക!",
    "chat.placeholder": "വിളകൾ, രോഗങ്ങൾ, കാലാവസ്ഥ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക...",
    "chat.voice.not.supported": "ഈ ബ്രൗസറിൽ വോയ്സ് ഇൻപുട്ട് പിന്തുണയ്ക്കുന്നില്ല",
    "chat.listening": "കേൾക്കുന്നു... ഇപ്പോൾ സംസാരിക്കുക",
    "chat.error": "സന്ദേശം അയയ്ക്കുന്നതിൽ പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    "chat.tips.title": "💡 നുറുങ്ങുകൾ",
    "chat.tips.specific": "• നിങ്ങളുടെ വിളകളെയും സ്ഥലത്തെയും കുറിച്ച് വ്യക്തമായി പറയുക",
    "chat.tips.symptoms": "• ലക്ഷണങ്ങൾ, കാലാവസ്ഥ അല്ലെങ്കിൽ കാർഷിക സാങ്കേതികതകളെക്കുറിച്ച് ചോദിക്കുക",
    "chat.tips.voice": "• ഹാൻഡ്സ്-ഫ്രീ ഓപ്പറേഷനുള്ള വോയ്സ് ഇൻപുട്ട് ഉപയോഗിക്കുക",

    // Quick Questions
    "quick.tomatoes": "തക്കാളി നടാനുള്ള ഏറ്റവും നല്ല സമയം എപ്പോഴാണ്?",
    "quick.blight": "ഇല കരിയൽ രോഗത്തിന് എങ്ങനെ ചികിത്സ നൽകാം?",
    "quick.fertilizer": "ജൈവ വളം ശുപാർശകൾ",
    "quick.pest": "ഗോതമ്പ് വിളകൾക്കുള്ള കീട നിയന്ത്രണം",
    "quick.harvest": "ചോളം എപ്പോൾ വിളവെടുക്കണം?",
    "quick.soil": "മണ്ണ് തയ്യാറാക്കൽ നുറുങ്ങുകൾ",

    // Weather
    "weather.title": "കാലാവസ്ഥാ പ്രവചനം",
    "weather.location": "നിങ്ങളുടെ ഫാം ലൊക്കേഷൻ",
    "weather.alerts": "കാലാവസ്ഥാ മുന്നറിയിപ്പുകൾ",
    "weather.conditions": "നിലവിലെ അവസ്ഥകൾ",
    "weather.forecast": "5-ദിവസത്തെ പ്രവചനം",
    "weather.recommendations": "കാർഷിക ശുപാർശകൾ",
    "weather.humidity": "ആർദ്രത",
    "weather.wind": "കാറ്റ്",
    "weather.visibility": "ദൃശ്യത",
    "weather.pressure": "മർദ്ദം",
    "weather.uv": "UV സൂചിക",

    // Disease Detection
    "disease.title": "രോഗ കണ്ടെത്തൽ",
    "disease.subtitle": "വിള രോഗങ്ങൾ തിരിച്ചറിയാൻ ഒരു ഫോട്ടോ അപ്ലോഡ് ചെയ്യുക",
    "disease.upload.title": "ചെടിയുടെ ചിത്രം അപ്ലോഡ് ചെയ്യുക",
    "disease.upload.subtitle": "ബാധിച്ച ചെടിയുടെ ഭാഗത്തിന്റെ വ്യക്തമായ ഫോട്ടോ എടുക്കുക",
    "disease.take.photo": "ഫോട്ടോ എടുക്കുക",
    "disease.upload.gallery": "ഗാലറിയിൽ നിന്ന് അപ്ലോഡ് ചെയ്യുക",
    "disease.analyze": "രോഗ വിശകലനം",
    "disease.analyzing": "വിശകലനം ചെയ്യുന്നു...",
    "disease.detected": "രോഗം കണ്ടെത്തി",
    "disease.treatment": "ചികിത്സാ ഘട്ടങ്ങൾ",
    "disease.prevention": "പ്രതിരോധ നുറുങ്ങുകൾ",
    "disease.common": "സാധാരണ രോഗങ്ങൾ",
    "disease.tips.title": "📸 ഫോട്ടോഗ്രാഫി നുറുങ്ങുകൾ",

    // Analytics
    "analytics.title": "ഫാം അനലിറ്റിക്സ്",
    "analytics.subtitle": "നിങ്ങളുടെ ഫാമിനുള്ള ഡാറ്റാ-ഡ്രിവൻ ഇൻസൈറ്റുകൾ",
    "analytics.crop.yield": "വിള വിളവ്",
    "analytics.water.usage": "ജല ഉപയോഗം",
    "analytics.revenue": "വരുമാനം",
    "analytics.efficiency": "ഫാം കാര്യക്ഷമത",
    "analytics.performance": "വിള പ്രകടനം",
    "analytics.insights": "AI ഇൻസൈറ്റുകളും ശുപാർശകളും",

    // Government Schemes
    "schemes.title": "സർക്കാർ പദ്ധതികൾ",
    "schemes.subtitle": "കർഷകർക്കുള്ള പ്രയോജനകരമായ പ്രോഗ്രാമുകൾ കണ്ടെത്തുക",
    "schemes.apply": "ഇപ്പോൾ അപേക്ഷിക്കുക",
    "schemes.learn.more": "കൂടുതൽ അറിയുക",
    "schemes.your.applications": "നിങ്ങളുടെ അപേക്ഷകൾ",
    "schemes.need.help": "സഹായം വേണോ?",
    "schemes.contact.support": "അപേക്ഷകളിൽ സഹായത്തിനായി ഞങ്ങളുടെ സപ്പോർട്ട് ടീമിനെ ബന്ധപ്പെടുക",

    // Language Selector
    "language.select": "ഭാഷ തിരഞ്ഞെടുക്കുക",
    "language.english": "English",
    "language.hindi": "हिंदी",
    "language.tamil": "தமிழ்",
    "language.malayalam": "മലയാളം",
    "language.telugu": "తెలుగు",
    "language.kannada": "ಕന್ನಡ",

    // Additional translations
    welcome: "സ്വാഗതം",
    home: "ഹോം",
    weather: "കാലാവസ്ഥ",
    chat: "ചാറ്റ്",
    analysis: "വിശകലനം",
    schemes: "പദ്ധതികൾ",
    "good-morning": "Good Morning",
    "good-afternoon": "Good Afternoon",
    "good-evening": "Good Evening",
    "ai-assistant": "AI Assistant",
    "weather-forecast": "Weather Forecast",
    "disease-detection": "Disease Detection",
    "farm-analytics": "Farm Analytics",
    "government-schemes": "Government Schemes",
    "quick-actions": "Quick Actions",
    "farm-status": "Farm Status",
    "all-features": "All Features",
    "recent-activity": "Recent Activity",
    "no-notifications": "No notifications",
    "sign-in": "Sign In",
    "sign-up": "Sign Up",
    email: "Email",
    password: "Password",
    name: "Name",
    phone: "Phone",
  },

  te: {
    // Common
    "common.loading": "లోడ్ అవుతోంది...",
    "common.error": "లోపం",
    "common.retry": "మళ్లీ ప్రయత్నించండి",
    "common.cancel": "రద్దు చేయండి",
    "common.save": "సేవ్ చేయండి",
    "common.delete": "తొలగించండి",
    "common.edit": "సవరించండి",
    "common.close": "మూసివేయండి",
    "common.back": "వెనుకకు",
    "common.next": "తదుపరి",
    "common.previous": "మునుపటి",
    "common.search": "వెతకండి",
    "common.filter": "ఫిల్టర్",
    "common.sort": "క్రమబద్ధీకరించండి",
    "common.refresh": "రిఫ్రెష్ చేయండి",

    // App Title
    "app.title": "CropLink - మీ వ్యవసాయ సహాయకుడు",
    "app.description": "మీ వ్యవసాయ అవసరాలకు వన్-స్టాప్ పరిష్కారం",

    // Navigation
    "nav.home": "హోమ్",
    "nav.chat": "చాట్",
    "nav.weather": "వాతావరణం",
    "nav.disease": "వ్యాధి",
    "nav.analytics": "విశ్లేషణ",

    // Home Page
    "home.greeting": "శుభోదయం!",
    "home.greetingAfternoon": "శుభ మధ్యాహ్నం!",
    "home.greetingEvening": "శుభ సాయంత్రం!",
    "home.subtitle": "ఈరోజు మీ వ్యవసాయాన్ని పెంచడానికి సిద్ధంగా ఉన్నారా?",
    "home.search.placeholder": "పంటలు, వ్యాధులు, వాతావరణం కోసం వెతకండి...",
    "home.features.title": "ఫీచర్లను అన్వేషించండి",
    "home.activity.title": "ఇటీవలి కార్యకలాపం",
    "home.stats.temperature": "నాటడానికి అనువైనది",
    "home.stats.health": "పంట ఆరోగ్య స్కోర్",

    // Features
    "features.ai.title": "AI సహాయకుడు",
    "features.ai.description": "మీ వ్యవసాయ ప్రశ్నలకు తక్షణ సమాధానాలు పొందండి",
    "features.ai.badge": "AI పవర్డ్",
    "features.weather.title": "వాతావరణ అంచనా",
    "features.weather.description": "మీ ప్రాంతానికి రియల్-టైమ్ వాతావరణ అప్డేట్లు",
    "features.weather.badge": "లైవ్ డేటా",
    "features.disease.title": "వ్యాధి గుర్తింపు",
    "features.disease.description": "పంట వ్యాధులను ముందుగానే గుర్తించి చికిత్స చేయండి",
    "features.disease.badge": "స్మార్ట్ గుర్తింపు",
    "features.schemes.title": "ప్రభుత్వ పథకాలు",
    "features.schemes.description": "ప్రయోజనకరమైన ప్రభుత్వ కార్యక్రమాలను కనుగొనండి",
    "features.schemes.badge": "అప్డేట్ చేయబడింది",
    "features.analytics.title": "వ్యవసాయ విశ్లేషణ",
    "features.analytics.description": "మెరుగైన దిగుబడి కోసం డేటా-ఆధారిత అంతర్దృష్టులు",
    "features.analytics.badge": "అంతర్దృష్టులు",

    // Chatbot
    "chat.title": "AI వ్యవసాయ సహాయకుడు",
    "chat.subtitle": "వ్యవసాయం గురించి ఏదైనా అడగండి!",
    "chat.placeholder": "పంటలు, వ్యాధులు, వాతావరణం గురించి అడగండి...",
    "chat.voice.not.supported": "ఈ బ్రౌజర్లో వాయిస్ ఇన్పుట్ మద్దతు లేదు",
    "chat.listening": "వింటోంది... ఇప్పుడు మాట్లాడండి",
    "chat.error": "సందేశం పంపడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    "chat.tips.title": "💡 చిట్కాలు",
    "chat.tips.specific": "• మీ పంటలు మరియు ప్రాంతం గురించి నిర్దితంగా చెప్పండి",
    "chat.tips.symptoms": "• లక్షణాలు, వాతావరణం లేదా వ్యవసాయ పద్ధతుల గురించి అడగండి",
    "chat.tips.voice": "• హ్యాండ్స్-ఫ్రీ ఆపరేషన్ కోసం వాయిస్ ఇన్పుట్ ఉపయోగించండి",

    // Quick Questions
    "quick.tomatoes": "టమాటాలు నాటడానికి ఉత్తమ సమయం ఎప్పుడు?",
    "quick.blight": "ఆకు కాలిపోవడానికి ఎలా చికిత్స చేయాలి?",
    "quick.fertilizer": "సేంద్రీయ ఎరువుల సిఫార్సులు",
    "quick.pest": "గోధుమ పంటలకు కీటక నియంత్రణ",
    "quick.harvest": "మొక్కజొన్న ఎప్పుడు కోయాలి?",
    "quick.soil": "మట్టి తయారీ చిట్కాలు",

    // Weather
    "weather.title": "వాతావరణ అంచనా",
    "weather.location": "మీ వ్యవసాయ ప్రాంతం",
    "weather.alerts": "వాతావరణ హెచ్చరికలు",
    "weather.conditions": "ప్రస్తుత పరిస్థితులు",
    "weather.forecast": "5-రోజుల అంచనా",
    "weather.recommendations": "వ్యవసాయ సిఫార్సులు",
    "weather.humidity": "తేమ",
    "weather.wind": "గాలి",
    "weather.visibility": "దృశ్యత",
    "weather.pressure": "ఒత్తిడి",
    "weather.uv": "UV సూచిక",

    // Disease Detection
    "disease.title": "వ్యాధి గుర్తింపు",
    "disease.subtitle": "పంట వ్యాధులను గుర్తించడానికి ఫోటో అప్లోడ్ చేయండి",
    "disease.upload.title": "మొక్క చిత్రాన్ని అప్లోడ్ చేయండి",
    "disease.upload.subtitle": "ప్రభావి మొక్క భాഗం యొక్క స్పష్టమైన ఫోటో తీయండి",
    "disease.take.photo": "ఫోటో తీయండి",
    "disease.upload.gallery": "గ్యాలరీ నుండి అప్లోడ్ చేయండి",
    "disease.analyze": "వ్యాధి విశ్లేషణ",
    "disease.analyzing": "విశ్లేషిస్తోంది...",
    "disease.detected": "వ్యాధి గుర్తించబడింది",
    "disease.treatment": "చికిత్స దశలు",
    "disease.prevention": "నివారణ చిట్కాలు",
    "disease.common": "సాధారణ వ్యాధులు",
    "disease.tips.title": "📸 ఫోటోగ్రాఫీ చిట్కాలు",

    // Analytics
    "analytics.title": "వ్యవసాయ విశ్లేషణ",
    "analytics.subtitle": "మీ వ్యవసాయానికి డేటా-ఆధారిత అంతర్దృష్టులు",
    "analytics.crop.yield": "పంట దిగుబడి",
    "analytics.water.usage": "నీటి వినియోగం",
    "analytics.revenue": "ఆదాయం",
    "analytics.efficiency": "వ్యవసాయ సామర్థ్యం",
    "analytics.performance": "పంట పనితీరు",
    "analytics.insights": "AI అంతర్దృష్టులు మరియు సిఫార్సులు",

    // Government Schemes
    "schemes.title": "ప్రభుత్వ పథకాలు",
    "schemes.subtitle": "రైతులకు ప్రయోజనకరమైన కార్యక్రమాలను కనుగొనండి",
    "schemes.apply": "ఇప్పుడే దరఖాస్తు చేయండి",
    "schemes.learn.more": "మరింత తెలుసుకోండి",
    "schemes.your.applications": "మీ దరఖాస్తులు",
    "schemes.need.help": "సహాయం కావాలా?",
    "schemes.contact.support": "దరఖాస్తులలో సహాయం కోసం మా సపోర్ట్ టీమ్ను సంపర్కిసి",

    // Language Selector
    "language.select": "భాషను ఎంచుకోండి",
    "language.english": "English",
    "language.hindi": "हिंदी",
    "language.tamil": "தமிழ்",
    "language.malayalam": "മലയാളം",
    "language.telugu": "తెలుగు",
    "language.kannada": "ಕನ್ನಡ",

    // Additional translations
    welcome: "స్వాగతం",
    home: "హోమ్",
    weather: "వాతావరణం",
    chat: "చాట్",
    analysis: "విశ్లేషణ",
    schemes: "పథకాలు",
    "good-morning": "Good Morning",
    "good-afternoon": "Good Afternoon",
    "good-evening": "Good Evening",
    "ai-assistant": "AI Assistant",
    "weather-forecast": "Weather Forecast",
    "disease-detection": "Disease Detection",
    "farm-analytics": "Farm Analytics",
    "government-schemes": "Government Schemes",
    "quick-actions": "Quick Actions",
    "farm-status": "Farm Status",
    "all-features": "All Features",
    "recent-activity": "Recent Activity",
    "no-notifications": "No notifications",
    "sign-in": "Sign In",
    "sign-up": "Sign Up",
    email: "Email",
    password: "Password",
    name: "Name",
    phone: "Phone",
  },

  kn: {
    // Common
    "common.loading": "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    "common.error": "ದೋಷ",
    "common.retry": "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    "common.cancel": "ರದ್ದುಗೊಳಿಸಿ",
    "common.save": "ಉಳಿಸಿ",
    "common.delete": "ಅಳಿಸಿ",
    "common.edit": "ಸಂಪಾದಿಸಿ",
    "common.close": "ಮುಚ್ಚಿ",
    "common.back": "ಹಿಂದೆ",
    "common.next": "ಮುಂದೆ",
    "common.previous": "ಹಿಂದಿನ",
    "common.search": "ಹುಡುಕಿ",
    "common.filter": "ಫಿಲ್ಟರ್",
    "common.sort": "ವಿಂಗಡಿಸಿ",
    "common.refresh": "ರಿಫ್ರೆಶ್ ಮಾಡಿ",

    // App Title
    "app.title": "CropLink - ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ",
    "app.description": "ನಿಮ್ಮ ಕೃಷಿ ಅಗತ್ಯಗಳಿಗೆ ಒಂದೇ ಸ್ಥಳದ ಪರಿಹಾರ",

    // Navigation
    "nav.home": "ಮುಖ್ಯ",
    "nav.chat": "ಚಾಟ್",
    "nav.weather": "ಹವಾಮಾನ",
    "nav.disease": "ರೋಗ",
    "nav.analytics": "ವಿಶ್ಲೇಷಣೆ",

    // Home Page
    "home.greeting": "ಶುಭೋದಯ!",
    "home.greetingAfternoon": "ಶುಭ ಮಧ್ಯಾಹ್ನ!",
    "home.greetingEvening": "ಶುಭ ಸಂಜೆ!",
    "home.subtitle": "ಇಂದು ನಿಮ್ಮ ಕೃಷಿಯನ್ನು ಬೆಳೆಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    "home.search.placeholder": "ಬೆಳೆಗಳು, ರೋಗಗಳು, ಹವಾಮಾನಕ್ಕಾಗಿ ಹುಡುಕಿ...",
    "home.features.title": "ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    "home.activity.title": "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
    "home.stats.temperature": "ನೆಡುವಿಕೆಗೆ ಸೂಕ್ತ",
    "home.stats.health": "ಬೆಳೆ ಆರೋಗ್ಯ ಸ್ಕೋರ್",

    // Features
    "features.ai.title": "AI ಸಹಾಯಕ",
    "features.ai.description": "ನಿಮ್ಮ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳಿಗೆ ತ್ವరಿತ ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ",
    "features.ai.badge": "AI ಚಾಲಿತ",
    "features.weather.title": "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    "features.weather.description": "ನಿಮ್ಮ ಸ್ಥಳಕ್ಕೆ ನೈಜ-ಸಮ ಹವಾಮಾನ ಅಪ್‌ಡೇಟ್‌ಗಳು",
    "features.weather.badge": "ಲೈವ್ ಡೇಟಾ",
    "features.disease.title": "ರೋಗ ಪತ್ತೆ",
    "features.disease.description": "ಬೆಳೆ ರೋಗಗಳನ್ನು ಮುಂಚಿತವಾಗಿ ಗುರುತಿಸಿ ಚಿಕಿತ್సೆ ನೀಡಿ",
    "features.disease.badge": "ಸ್ಮಾರ್ಟ್ ಪತ್ತೆ",
    "features.schemes.title": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    "features.schemes.description": "ಪ್ರಯೋಜನಕಾರಿ ಸರ್ಕಾರಿ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ",
    "features.schemes.badge": "ಅಪ್‌ಡೇಟ್ ಮಾಡಲಾಗಿದೆ",
    "features.analytics.title": "ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ",
    "features.analytics.description": "ಉತ್ತಮ ಇಳುವರಿಗಾಗಿ ಡೇಟಾ-ಚಾಲಿತ ಒಳನೋಟಗಳು",
    "features.analytics.badge": "ಒಳನೋಟಗಳು",

    // Chatbot
    "chat.title": "AI ಕೃಷಿ ಸಹಾಯಕ",
    "chat.subtitle": "ಕೃಷಿಯ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ!",
    "chat.placeholder": "ಬೆಳೆಗಳು, ರೋಗಗಳು, ಹವಾಮಾನದ ಬಗ್ಗೆ ಕೇಳಿ...",
    "chat.voice.not.supported": "ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ",
    "chat.listening": "ಕೇಳುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ",
    "chat.error": "ಸಂದೇಶ ಕಳುಹಿಸುವಲ್ಲಿ ವಿಫಲವಾಗಿದೆ. ದಯವಾಯಿ ಮళ್లీ ప್ರಯತ್నಿಸಿ.",
    "chat.tips.title": "💡 ಸಲಹೆಗಳು",
    "chat.tips.specific": "• ನಿಮ್ಮ ಬೆಳೆಗಳು ಮತ್ತು ಸ್ಥಳದ ಬಗ್ಗೆ ನಿರ್ದಿತವಾಗಿ ಹೇಳಿ",
    "chat.tips.symptoms": "• ಲಕ್ಷಣಗಳು, ಹವಾಮಾನ ಅಥವಾ ಕೃಷಿ ತಂತ್ರಗಳ ಬಗ್ಗೆ ಕೇಳಿ",
    "chat.tips.voice": "• ಹ్ಯಾಂಡ್స್-ಫ್ರೀ ಆപರೇಷನ್‌ಗಾಗಿ ಧ್ವನಿ ಇನ್‌ಪುಟ್ ಬಳಸಿ",

    // Quick Questions
    "quick.tomatoes": "ಟೊಮೇಟೊ ನೆಡಲು ಉತ್ತಮ సమయ ಯಾವಾಗ?",
    "quick.blight": "ಎಲೆ ಕಾಯಿಲೆಗೆ ಹೇಗೆ ಚಿಕಿತ್సೆ ನೀಡಬೇಕು?",
    "quick.fertilizer": "ಸಾವಯವ ಗೊಬ್ಬರ ಶಿಫಾರಸುಗಳು",
    "quick.pest": "ಗೋಧಿ ಬೆಳೆಗಳಿಗೆ ಕೀಟ ನಿಯಂತ್ರಣ",
    "quick.harvest": "ಜೋಳವನ್ನು ಯಾವಾಗ ಕೊಯ್ಯಬೇಕು?",
    "quick.soil": "ಮಣ್ಣಿನ ತಯಾರಿಕೆ ಸಲಹೆಗಳು",

    // Weather
    "weather.title": "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    "weather.location": "ನಿಮ್ಮ ಕೃಷಿ ಸ್ಥಳ",
    "weather.alerts": "ಹವಾಮಾನ ಎಚ್ಚరಿಕೆಗಳು",
    "weather.conditions": "ಪ్రస్తుత ಪరిస్ಥಿತಿಗಳು",
    "weather.forecast": "5-ದಿನಗಳ ಮುನ್ಸೂಚನೆ",
    "weather.recommendations": "ಕೃಷಿ ಶಿಫಾರಸುಗಳು",
    "weather.humidity": "ತೇವಾಂಶ",
    "weather.wind": "ಗಾಳಿ",
    "weather.visibility": "ದೃಶ್ಯತೆ",
    "weather.pressure": "ಒತ್ತಡ",
    "weather.uv": "UV ಸೂಚ್ಯಂಕ",

    // Disease Detection
    "disease.title": "ರೋಗ ಪತ್ತೆ",
    "disease.subtitle": "ಬೆಳೆ ರೋಗಗಳನ್ನು ಗುರುತಿಸಲು ಫೋಟೋ ಅప್‌లೋಡ್ ಮಾಡಿ",
    "disease.upload.title": "ಸಸ್ಯದ ಚಿತ್ರವನ್ನು ಅప್‌లೋಡ್ ಮಾಡಿ",
    "disease.upload.subtitle": "ಪೀಡಿತ ಸಸ್ಯದ ಭಾಗದ ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    "disease.take.photo": "ಫೋಟೋ ತೆಗೆಯಿರಿ",
    "disease.upload.gallery": "ಗ್ಯಾಲರಿಯಿಂದ ಅప್‌ಲೋಡ್ ಮಾಡಿ",
    "disease.analyze": "ರೋಗ ವಿಶ್ಲೇಷಣೆ",
    "disease.analyzing": "ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...",
    "disease.detected": "ರೋಗ ಪತ್ತೆಯಾಗಿದೆ",
    "disease.treatment": "ಚಿಕಿತ್సೆಯ ಹಂತಗಳು",
    "disease.prevention": "ತಡೆಗಟ್ಟುವ ಸಲಹೆಗಳು",
    "disease.common": "ಸಾಮಾನ್ಯ ರೋಗಗಳು",
    "disease.tips.title": "📸 ಛಾಯಾಗ್ರಹಣ ಸಲಹೆಗಳು",

    // Analytics
    "analytics.title": "ಕೃಷಿ ವಿಶ್ಲೇಷಣೆ",
    "analytics.subtitle": "ನಿಮ್ಮ ಕೃಷಿಗೆ ಡೇಟಾ-ಚಾಲಿತ ಒಳನೋಟಗಳು",
    "analytics.crop.yield": "ಬೆಳೆ ಇಳುವರಿ",
    "analytics.water.usage": "ನೀರಿನ ಬಳಕೆ",
    "analytics.revenue": "ಆದಾಯ",
    "analytics.efficiency": "ಕೃಷಿ ದಕ್ಷತೆ",
    "analytics.performance": "ಬೆಳೆ ಕಾರ್ಯಕ್ಷಮತೆ",
    "analytics.insights": "AI ಒಳನೋಟಗಳು ಮತ್ತು ಶಿಫಾರ್సುಗಳು",

    // Government Schemes
    "schemes.title": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    "schemes.subtitle": "ರೈತರಿಗೆ ಪ್ರಯೋಜನಕಾರಿ ಕಾర್యಕ್ರమಗಳನ್ನು ಕಂಡುಹಿಡಿಯಿರಿ",
    "schemes.apply": "ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    "schemes.learn.more": "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    "schemes.your.applications": "ನಿಮ್ಮ ಅರ್ಜಿಗಳು",
    "schemes.need.help": "ಸಹಾಯ ಬೇಕೇ?",
    "schemes.contact.support": "ಅರ್ಜಿಗಳಲ್ಲಿ ಸಹಾಯಕ್ಕಾಗಿ ನಮ್ಮ ಬೆಂಬಲ ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಿ",

    // Language Selector
    "language.select": "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "language.english": "English",
    "language.hindi": "हिंदी",
    "language.tamil": "தமிழ்",
    "language.malayalam": "മലയാളം",
    "language.telugu": "తెలుగు",
    "language.kannada": "ಕನ್ನಡ",

    // Additional translations
    welcome: "ಸ್ವಾಗತ",
    home: "ಮುಖ್ಯ",
    weather: "ಹವಾಮಾನ",
    chat: "ಚಾಟ್",
    analysis: "ವಿಶ್ಲೇಷಣೆ",
    schemes: "ಯೋಜನೆಗಳು",
    "good-morning": "Good Morning",
    "good-afternoon": "Good Afternoon",
    "good-evening": "Good Evening",
    "ai-assistant": "AI Assistant",
    "weather-forecast": "Weather Forecast",
    "disease-detection": "Disease Detection",
    "farm-analytics": "Farm Analytics",
    "government-schemes": "Government Schemes",
    "quick-actions": "Quick Actions",
    "farm-status": "Farm Status",
    "all-features": "All Features",
    "recent-activity": "Recent Activity",
    "no-notifications": "No notifications",
    "sign-in": "Sign In",
    "sign-up": "Sign Up",
    email: "Email",
    password: "Password",
    name: "Name",
    phone: "Phone",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("croplink-language")
    if (
      savedLanguage &&
      (savedLanguage === "en" ||
        savedLanguage === "hi" ||
        savedLanguage === "ta" ||
        savedLanguage === "ml" ||
        savedLanguage === "te" ||
        savedLanguage === "kn")
    ) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("croplink-language", lang)
  }

  const t = (key: string): string => {
    const currentTranslations = translations[language as keyof typeof translations] || translations.en
    return currentTranslations[key as keyof typeof currentTranslations] || key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
