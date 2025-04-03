import { useState } from "react";
import { Mail, Globe, Contact, Hash, MessageCircle } from "lucide-react";

const tabs = [
  { name: "Email", icon: Mail },
  { name: "Links", icon: Globe },
  { name: "Save Contact", icon: Contact },
  { name: "Social", icon: Hash },
  { name: "WhatsApp", icon: MessageCircle },
];

export default function TabNavigation() {
  const [activeTab, setActiveTab] = useState("Save Contact");

  return (
    <div >
    <div  className="fixed bottom-0 left-0 right-0 justify-between space-x-8   shadow-lg max-w-[935px]   backdrop-blur-md bg-white/50 mx-auto z-50 pb-9">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`flex flex-col items-center text-gray-500 ${
            activeTab === tab.name ? "text-yellow-600" : ""
          }`}
        >
          <div
            className={`p-3 rounded-full ${
              activeTab === tab.name ? "bg-yellow-500 text-white" : ""
            }`}
          >
            <tab.icon size={24} />
          </div>
          <span className="mt-1">{tab.name}</span>
          {activeTab === tab.name && (
            <div className="w-10 h-1 bg-yellow-500 mt-1 rounded-full"></div>
          )}
        </button>
      ))}
    </div>
    </div>
  );
}
export {TabNavigation} ; 