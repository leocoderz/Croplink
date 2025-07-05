"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Bot,
  User,
  Lightbulb,
  Bug,
  TrendingUp,
  MessageCircle,
  Sparkles,
  Mic,
  MicOff,
  Zap,
  Leaf,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
  suggestions?: string[]
  type?: "advice" | "warning" | "info" | "success"
}

interface ChatBotProps {
  onNotification?: (notification: any) => void
}

export function ChatBot({ onNotification }: ChatBotProps = {}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "🌾 Welcome to CropLink AI Assistant! I'm here to help you with all your farming needs. Ask me about weather, crops, diseases, irrigation, government schemes, or any agricultural topic!",
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["Weather advice", "Crop diseases", "Government schemes", "Irrigation tips"],
      type: "success",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check for speech recognition support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition()

        // Configure recognition settings
        recognitionInstance.continuous = false
        recognitionInstance.interimResults = false
        recognitionInstance.lang = "en-US"
        recognitionInstance.maxAlternatives = 1

        recognitionInstance.onstart = () => {
          console.log("Speech recognition started")
          setIsListening(true)
        }

        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          console.log("Speech recognition result:", transcript)
          setInputMessage(transcript)
          setIsListening(false)
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)

          // Show user-friendly error messages
          switch (event.error) {
            case "no-speech":
              alert("No speech detected. Please try again.")
              break
            case "audio-capture":
              alert("Microphone not accessible. Please check permissions.")
              break
            case "not-allowed":
              alert("Microphone permission denied. Please enable microphone access.")
              break
            case "network":
              alert("Network error. Please check your connection.")
              break
            default:
              alert("Speech recognition failed. Please try again.")
          }
        }

        recognitionInstance.onend = () => {
          console.log("Speech recognition ended")
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      } else {
        console.warn("Speech recognition not supported in this browser")
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
    inputRef.current?.focus()
  }

  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.")
      return
    }

    if (isListening) {
      try {
        recognition.stop()
        setIsListening(false)
      } catch (error) {
        console.error("Error stopping recognition:", error)
        setIsListening(false)
      }
    } else {
      try {
        // Check microphone permissions first
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => {
              recognition.start()
            })
            .catch((error) => {
              console.error("Microphone permission error:", error)
              alert("Please allow microphone access to use voice input.")
            })
        } else {
          recognition.start()
        }
      } catch (error) {
        console.error("Error starting recognition:", error)
        alert("Failed to start voice recognition. Please try again.")
        setIsListening(false)
      }
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Generate contextual response based on user input
    const response = generateResponse(userMessage.text)

    const botMessage: Message = {
      id: Date.now() + 1,
      text: response.text,
      sender: "bot",
      timestamp: new Date(),
      suggestions: response.suggestions,
      type: response.type,
    }

    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)

    // Send notification for important advice
    if (response.isImportant) {
      onNotification?.({
        title: "CropLink AI Advice",
        message: response.text.substring(0, 100) + "...",
        type: response.type || "info",
      })
    }
  }

  const generateResponse = (
    input: string,
  ): {
    text: string
    suggestions?: string[]
    isImportant?: boolean
    type?: "advice" | "warning" | "info" | "success"
  } => {
    const lowerInput = input.toLowerCase()

    // Weather-related queries
    if (lowerInput.includes("weather") || lowerInput.includes("rain") || lowerInput.includes("temperature")) {
      return {
        text: "🌤️ Weather is crucial for farming success! Check our Weather Widget for real-time forecasts. I recommend monitoring daily conditions and setting up alerts for your crops. Sudden weather changes can significantly impact irrigation needs, pest activity, and harvest timing.",
        suggestions: ["Check weather forecast", "Set weather alerts", "Irrigation planning", "Seasonal crop planning"],
        isImportant: true,
        type: "advice",
      }
    }

    // Disease-related queries
    if (
      lowerInput.includes("disease") ||
      lowerInput.includes("pest") ||
      lowerInput.includes("fungus") ||
      lowerInput.includes("infection") ||
      lowerInput.includes("bug")
    ) {
      return {
        text: "🔍 Early disease detection saves crops! Use our Disease Predictor to upload photos of affected plants. Look for signs like yellowing leaves, spots, wilting, or unusual growth. Prevention is always better than cure - maintain proper spacing, drainage, and crop rotation.",
        suggestions: ["Use Disease Predictor", "Upload plant photo", "Prevention tips", "Organic treatments"],
        isImportant: true,
        type: "warning",
      }
    }

    // Crop management queries
    if (
      lowerInput.includes("crop") ||
      lowerInput.includes("plant") ||
      lowerInput.includes("grow") ||
      lowerInput.includes("harvest")
    ) {
      return {
        text: "🌱 Successful crop management requires planning! Consider soil preparation, seed quality, planting density, and growth stages. Monitor regularly for pests, diseases, and nutrient deficiencies. Proper timing for planting and harvesting maximizes yield and quality.",
        suggestions: ["Soil preparation", "Seed selection", "Growth monitoring", "Harvest timing"],
        type: "advice",
      }
    }

    // Fertilizer queries
    if (
      lowerInput.includes("fertilizer") ||
      lowerInput.includes("nutrient") ||
      lowerInput.includes("nitrogen") ||
      lowerInput.includes("phosphorus") ||
      lowerInput.includes("potassium")
    ) {
      return {
        text: "🧪 Smart fertilization boosts productivity! Always start with soil testing to understand nutrient needs. Over-fertilization wastes money and harms the environment. Consider organic options like compost, vermicompost, and green manures for sustainable farming.",
        suggestions: ["Get soil test", "Calculate fertilizer needs", "Organic alternatives", "Application timing"],
        type: "advice",
      }
    }

    // Government schemes queries
    if (
      lowerInput.includes("scheme") ||
      lowerInput.includes("subsidy") ||
      lowerInput.includes("loan") ||
      lowerInput.includes("government") ||
      lowerInput.includes("benefit")
    ) {
      return {
        text: "🏛️ Government support is available! Check our Government Schemes section for subsidies, loans, and insurance programs. Many schemes offer support for equipment, seeds, irrigation systems, and crop insurance. Apply early as many have limited slots.",
        suggestions: ["Browse schemes", "Check eligibility", "Application process", "Required documents"],
        type: "info",
      }
    }

    // Irrigation queries
    if (
      lowerInput.includes("water") ||
      lowerInput.includes("irrigation") ||
      lowerInput.includes("drip") ||
      lowerInput.includes("sprinkler")
    ) {
      return {
        text: "💧 Water management is key to success! Drip irrigation saves 30-50% water compared to flood irrigation. Monitor soil moisture, consider mulching to reduce evaporation, and adjust watering based on crop growth stages and weather conditions.",
        suggestions: [
          "Drip irrigation setup",
          "Soil moisture monitoring",
          "Water conservation",
          "Irrigation scheduling",
        ],
        type: "advice",
      }
    }

    // Market price queries
    if (
      lowerInput.includes("price") ||
      lowerInput.includes("market") ||
      lowerInput.includes("sell") ||
      lowerInput.includes("profit")
    ) {
      return {
        text: "💰 Market timing affects profits! Monitor local and regional prices, consider direct selling to consumers or farmer markets. Quality produce commands premium prices. Plan your harvest timing based on market demand and seasonal price trends.",
        suggestions: ["Check market rates", "Quality improvement", "Direct selling", "Value addition"],
        type: "success",
      }
    }

    // Technology queries
    if (
      lowerInput.includes("technology") ||
      lowerInput.includes("app") ||
      lowerInput.includes("digital") ||
      lowerInput.includes("smart")
    ) {
      return {
        text: "📱 CropLink brings technology to your farm! Use our integrated features - weather monitoring, disease detection, data analysis, and scheme information. Smart farming increases efficiency and reduces costs while improving yields.",
        suggestions: ["Explore app features", "Data analysis", "Smart farming tips", "Technology adoption"],
        type: "info",
      }
    }

    // General farming advice
    if (lowerInput.includes("farming") || lowerInput.includes("agriculture") || lowerInput.includes("farm")) {
      return {
        text: "🚜 Modern farming combines tradition with innovation! Focus on soil health, sustainable practices, and continuous learning. Use CropLink's tools for better decision-making. Remember: healthy soil = healthy crops = healthy profits!",
        suggestions: ["Sustainable practices", "Soil health", "Crop rotation", "Integrated farming"],
        type: "advice",
      }
    }

    // Default response for other queries
    return {
      text: "🤖 I'm your CropLink AI assistant! I can help with weather planning, crop management, disease identification, irrigation advice, fertilizer recommendations, government schemes, market insights, and much more. What would you like to know?",
      suggestions: [
        "Weather advice",
        "Crop diseases",
        "Government schemes",
        "Irrigation tips",
        "Market prices",
        "Fertilizer guide",
      ],
      type: "info",
    }
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "advice":
        return <Lightbulb className="h-3 w-3 text-amber-500" />
      case "warning":
        return <Bug className="h-3 w-3 text-red-500" />
      case "success":
        return <TrendingUp className="h-3 w-3 text-emerald-500" />
      default:
        return <MessageCircle className="h-3 w-3 text-blue-500" />
    }
  }

  const getMessageBadgeColor = (type?: string) => {
    switch (type) {
      case "advice":
        return "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-300 dark:border-amber-700/50"
      case "warning":
        return "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-300 dark:border-red-700/50"
      case "success":
        return "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-300 dark:border-emerald-700/50"
      default:
        return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200 dark:from-blue-900/30 dark:to-cyan-900/30 dark:text-blue-300 dark:border-blue-700/50"
    }
  }

  return (
    <div className="flex flex-col h-full w-full max-w-full overflow-hidden">
      {/* Mobile-optimized header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-emerald-500/95 via-green-500/95 to-teal-500/95 text-white p-4 pt-safe">
        <div className="flex items-center gap-3">
          <div className="relative p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Bot className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">CropLink AI Assistant</h1>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Powered by Agricultural Intelligence
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Leaf className="h-4 w-4 animate-pulse" />
            <Sparkles className="h-4 w-4 animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-emerald-50/40 via-blue-50/30 to-green-50/40 dark:from-emerald-950/20 dark:via-blue-950/15 dark:to-green-950/20">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 max-w-[90%] animate-in slide-in-from-bottom-2 duration-500",
                  message.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition-all duration-300",
                    message.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                      : "bg-gradient-to-br from-emerald-500 to-green-600 text-white",
                  )}
                >
                  {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={cn(
                    "rounded-2xl px-3 py-2 shadow-md backdrop-blur-sm transition-all duration-300 max-w-full",
                    message.sender === "user"
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                      : "bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 rounded-bl-md",
                  )}
                >
                  {message.sender === "bot" && message.type && (
                    <div className="flex items-center gap-2 mb-2">
                      {getMessageIcon(message.type)}
                      <Badge className={cn("text-xs font-medium border", getMessageBadgeColor(message.type))}>
                        {message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                      </Badge>
                    </div>
                  )}

                  <p
                    className={cn(
                      "text-sm leading-relaxed break-words",
                      message.sender === "user" ? "text-white" : "text-gray-800 dark:text-gray-200",
                    )}
                  >
                    {message.text}
                  </p>

                  {message.suggestions && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs h-7 px-2 bg-gradient-to-r from-emerald-50/80 to-green-50/80 hover:from-emerald-100/80 hover:to-green-100/80 border-emerald-200/60 text-emerald-700 dark:from-emerald-900/20 dark:to-green-900/20 dark:hover:from-emerald-900/30 dark:hover:to-green-900/30 dark:border-emerald-800/50 dark:text-emerald-400 backdrop-blur-sm transition-all duration-200"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div
                    className={cn(
                      "text-xs mt-2 opacity-70 flex items-center gap-1",
                      message.sender === "user" ? "text-white/80" : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    <div className="w-1 h-1 rounded-full bg-current"></div>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isListening && (
              <div className="flex gap-2 max-w-[90%] mr-auto animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Mic className="h-4 w-4 animate-pulse" />
                </div>
                <div className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl rounded-bl-md px-3 py-2 shadow-md backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Listening...</span>
                  </div>
                </div>
              </div>
            )}

            {isTyping && (
              <div className="flex gap-2 max-w-[90%] mr-auto animate-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-white/90 dark:bg-gray-800/90 border border-gray-200/60 dark:border-gray-700/60 rounded-2xl rounded-bl-md px-3 py-2 shadow-md backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>

      {/* Mobile-optimized input area */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200/60 dark:border-gray-700/60 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl pb-safe">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything about farming..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isTyping || isListening}
              className="pr-10 border-gray-200/60 focus:border-emerald-400/60 dark:border-gray-600/60 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-sm rounded-xl h-11 text-sm transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Sparkles className="h-4 w-4 text-gray-400 animate-pulse" />
            </div>
          </div>
          <Button
            onClick={toggleListening}
            disabled={isTyping}
            variant="outline"
            className={cn(
              "px-3 h-11 rounded-xl border-gray-200/60 dark:border-gray-600/60 backdrop-blur-sm transition-all duration-200",
              isListening
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-500/60 shadow-md"
                : "bg-white/90 hover:bg-gray-50/90 dark:bg-gray-800/90 dark:hover:bg-gray-700/90",
            )}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping || isListening}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-4 h-11 rounded-xl backdrop-blur-sm shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center mt-2 gap-2">
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            CropLink AI • Powered by agricultural expertise
          </p>
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        </div>
      </div>
    </div>
  )
}
