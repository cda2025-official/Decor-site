"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Image, MessageSquare, Package2 } from "lucide-react";
import GallerySection from "./GallerySection";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./Firebase"; // Make sure the path is correct

const tabs = [
  { name: "brochures", icon: FileText },
  { name: "products", icon: Package2 },
  { name: "gallery", icon: Image },
  { name: "enquire", icon: MessageSquare },
];

const Navigation = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addInfo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add the form data to Firestore
      const enquiryData = {
        ...formData,
        createdAt: new Date().toISOString(),
        type: "enquiry"
      };

      // Using the same 'visitors' collection as vcard-modal
      await addDoc(collection(db, "visitors"), enquiryData);
      
      console.log("Enquiry submitted:", enquiryData);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({ name: "", email: "", phone: "", addInfo: "" });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error("Error saving enquiry data:", error);
      alert("There was an error submitting your enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div data-aos="fade-up" className="max-w-[935px] w-full sm:w-screen mx-auto lg:px-8 bg-[white]" >
        <div className="flex justify-center items-center py-5">
          <div className="flex bg-white flex-wrap rounded-full overflow-hidden w-full max-w-[500px] sm:max-w-[935px] mx-4 sm:mx-8 lg:mx-auto" style={{boxShadow:"0px 3px 40px #D3D3D3"}}>
            {tabs.map((tab) => {
              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`${
                    activeTab === tab.name
                      ? "bg-[#2A777C] text-white"
                      : "bg-white text-[#212529] hover:bg-[#e2e6ea]"
                  } flex-1 min-w-[80px] sm:min-w-[150px] py-3 px-4 font-medium transition-colors text-center capitalize text-[13.5px]`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {activeTab === "enquire" ? (
        <div className="bg-white flex items-center justify-center py-10 max-w-[935px] w-full sm:w-screen sm:px-5 mx-auto shadow-2xl">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-[30rem]">
            <h3 className="text-2xl font-syncopate text-gray-800 mb-2">Get in Touch</h3>
            <p className="text-gray-600 mb-6 text-sm">Please share the following information.</p>
            
            {submitSuccess && (
              <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Enquiry submitted successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200 outline-none"
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200 outline-none"
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200 outline-none"
                  required
                  placeholder="Your contact number"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-gray-700 text-sm font-medium">Additional Info</label>
                <textarea
                  name="addInfo"
                  value={formData.addInfo}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all duration-200 outline-none resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`bg-[#2A777C] hover:bg-[#2A888C] text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-md w-full md:w-auto ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT INQUIRY"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <GallerySection activeTab={activeTab} />
      )}
    </>
  );
};

export default Navigation;