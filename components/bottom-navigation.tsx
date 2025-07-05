"use client"

import { MessageCircle, Cloud, Leaf, BarChart3, Building2, Home } from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: Home,
    },
    {
      id: "chatbot",
      label: "AI Chat",
      icon: MessageCircle,
    },
    {
      id: "weather",
      label: "Weather",
      icon: Cloud,
    },
    {
      id: "disease",
      label: "Health",
      icon: Leaf,
    },
    {
      id: "analysis",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "schemes",
      label: "Schemes",
      icon: Building2,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map((tab) => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-[60px] min-h-[60px] ${
                isActive
                  ? "bg-green-500 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-green-600 hover:bg-green-50"
              }`}
              style={{
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
              }}
            >
              <IconComponent className={`h-5 w-5 mb-1 ${isActive ? "text-white" : ""}`} />
              <span className={`text-xs font-medium ${isActive ? "text-white" : ""}`}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
