"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { useRouter } from "next/navigation";
import PDFlist from '../../components/PDFlist';
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument } from 'pdf-lib';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const images = [
  "/Images/Tool1.jpg",
  "/Images/Tool2.jpg"
];

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const brandCards = [
  { img: "/Images/CardImg1.jpg", label: "Orient Hardware" },
  { img: "/Images/CardImg2.jpg", label: "Orient Machinery" },
  { img: "/Images/CardImg3.jpg", label: "Kency" },
  { img: "/Images/CardImg4.jpg", label: "Rex" },
  { img: "/Images/CardImg5.jpg", label: "Red Razor" }
];

export default function ImageSlider() {

  const router = useRouter();

  const BrandClick = () => {
    router.push('/Brand');
  };

  useEffect(() => {
    const swiperInstance = document.querySelector(".swiper")?.swiper;
    if (swiperInstance) {
      swiperInstance.params.navigation.prevEl = ".custom-prev";
      swiperInstance.params.navigation.nextEl = ".custom-next";
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, []);

  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);


   useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowLeft(scrollRef.current.scrollLeft > 0);
        setShowRight(
          scrollRef.current.scrollLeft <
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth
        );
      }
    };

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -220, behavior: "smooth" }); // Adjust based on card width
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
    }
  };

  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      scrollRight();
    } else if (touchEndX - touchStartX > 50) {
      scrollLeft();
    }
  };


  return (
    <div className="w-full h-auto p-6">
      <div className="w-full h-auto flex justify-center items-center">
        <Image
          src="/Images/OrimartLogo.jpg"
          alt="Brand Logo"
          width={140}
          height={0}
          className="w-[120px] md:w-[140px]"
        />
      </div>

      <div className="relative w-full h-[400px] mt-6">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt="slider" className="w-full h-full object-cover" />
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="custom-prev absolute left-5 top-1/2 -translate-y-1/2 bg-[#00B0EF] text-white p-3 rounded-full z-10">
          <FaChevronLeft />
        </button>

        <button className="custom-next absolute right-5 top-1/2 -translate-y-1/2 bg-[#00B0EF] text-white p-3 rounded-full z-10">
          <FaChevronRight />
        </button>
      </div>

      <div className="mt-20 mb-10">
      <p className="text-[24px] sm:text-[30px] w-full text-center font-semibold">
        OUR BRAND
      </p>
      <div className="relative w-full flex justify-center items-center pt-10">
        {/* Left Scroll Button */}
        {showLeft && (
          <button
            className="absolute left-2 w-10 sm:w-12 h-auto flex justify-center items-center z-10"
            onClick={scrollLeft}
          >
            <GoChevronLeft className="text-3xl sm:text-4xl text-gray-600" />
          </button>
        )}

        {/* Scrollable Brand Cards with Snap Scrolling */}
        <div
          ref={scrollRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-[92%] flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
        >
          {brandCards.map((item, index) => (
            <div
              key={index}
              onClick={BrandClick}
              className="min-w-[180px] sm:min-w-[200px] md:min-w-[220px] h-[220px] sm:h-[240px] md:h-[260px] flex flex-col cursor-pointer snap-start"
            >
              <div className="h-[75%] w-full">
                <Image
                  src={item.img}
                  alt="Card Img"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-[25%] w-full flex justify-center items-center bg-[#00B0EF]">
                <span className="text-[12px] sm:text-[14px]">{item.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        {showRight && (
          <button
            className="absolute right-2 w-10 sm:w-12 h-auto flex justify-center items-center z-10"
            onClick={scrollRight}
          >
            <GoChevronRight className="text-3xl sm:text-4xl text-gray-600" />
          </button>
        )}
      </div>
    </div>


    </div>
  );
}
