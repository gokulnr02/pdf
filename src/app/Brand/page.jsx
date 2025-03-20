"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LuMoveUpLeft } from "react-icons/lu";
import { BsTools } from "react-icons/bs";
import { GrTools } from "react-icons/gr";
import { FiTool } from "react-icons/fi";


export default function ImageSlider() {

    const [activeTab, setActiveTab] = useState("Category");
    const router = useRouter();

    const BackClick = () => {
        router.push('/');
    };

    const handleSelectPdf = (query) => {
        router.push(`/pdf/?${query}`);
    };

    return (
        <div className="w-full h-auto p-6 bg-[#f1f1f1]">
            <div className="w-full h-[85px] flex justify-center items-start">
                <div className="w-[45%] h-auto flex justify-start items-start">
                    <div title="Back" onClick={BackClick}
                        className="bg-[#00B0EF] text-white p-3 rounded-full w-[40px] h-[40px] flex justify-center items-center cursor-pointer">
                        <LuMoveUpLeft style={{ fontSize: "20px" }} />
                    </div>
                </div>
                <div className="w-[55%] h-auto flex justify-start items-center">
                    <Image
                        src="/Images/OrimartLogo.jpg"
                        alt="Brand Logo"
                        width={140}
                        height={0}
                        className="w-[120px] md:w-[140px]"
                    />
                </div>
            </div>

            <div className="relative w-full h-[400px] mt-6">
                <Image
                    src="/Images/BrandSale.jpg"
                    alt="Brand Logo"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="w-full mt-10">
                <div className="w-full flex justify-center items-center gap-10">
                    {["Category", "Branding"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative text-xl font-semibold tracking-wide pb-2 transition duration-300 ${activeTab === tab
                                ? "text-blue-500 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-blue-500"
                                : "text-gray-600"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
  {activeTab === "Category" ? (
    <div className="w-full h-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 py-6">
    {/* Banding Tool */}
    <div
      className="w-[90%] sm:w-auto flex justify-center items-center rounded-3xl px-4 sm:px-6 py-3 sm:py-4 gap-3 sm:gap-4 bg-white cursor-pointer hover:shadow-md transition"
      onClick={() => handleSelectPdf("BANDING TOOL")}
    >
      <BsTools className="text-[22px]" />
      <span className="text-base sm:text-lg font-semibold tracking-wide">BANDING TOOL</span>
    </div>
  
    {/* High Power */}
    <div
      className="w-[90%] sm:w-auto flex justify-center items-center rounded-3xl px-4 sm:px-6 py-3 sm:py-4 gap-3 sm:gap-4 bg-white cursor-pointer hover:shadow-md transition"
      onClick={() => handleSelectPdf("Small Body")}
    >
      <GrTools className="text-[24px]" />
      <span className="text-base sm:text-lg font-semibold tracking-wide">High Power</span>
    </div>
  
    {/* AutoMobile Tools */}
    <div className="w-[90%] sm:w-auto flex justify-center items-center rounded-3xl px-4 sm:px-6 py-3 sm:py-4 gap-3 sm:gap-4 bg-white">
      <FiTool className="text-[24px]" />
      <span className="text-base sm:text-lg font-semibold tracking-wide">AutoMobile Tools</span>
    </div>
  </div>
  ) : (
    <div className="w-full h-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-12 py-6">
      {/* Branding Images */}
      <Image
        src="/Images/Branding/Branding1.jpg"
        alt="Brand Logo"
        width={180}
        height={120}
       className="w-[90%] sm:w-[180px] h-auto object-cover rounded-lg shadow-md"
      />
      <Image
        src="/Images/Branding/Branding2.jpg"
        alt="Brand Logo"
        width={150}
        height={100}
        className="w-[90%] sm:w-[180px] h-auto object-cover rounded-lg shadow-md"
      />
      <Image
        src="/Images/Branding/Branding3.jpg"
        alt="Brand Logo"
        width={180}
        height={120}
       className="w-[90%] sm:w-[180px] h-auto object-cover rounded-lg shadow-md"
      />
    </div>
  )}
</div>

            </div>


        </div>
    );
}
