"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "../ui/button";
import { Navigation, Scrollbar } from "swiper/modules";
import BestSellersCard from "./BestSellersCard";
import Link from "next/link";
import { motion } from "framer-motion";
import BtnLink from "../shared/BtnLink";

const bestSellers: BestSellerItem[] = [
  {
    id: 1,
    imageName: "1",
    title: "Armchair",
    description: "Light single chair",
    price: "$145",
  },
  {
    id: 2,
    imageName: "2",
    title: "Premium Sofa",
    description: "Comfortable seating",
    price: "$245",
  },
  {
    id: 3,
    imageName: "3",
    title: "Minimal Sofa",
    description: "Modern design",
    price: "$345",
  },
  {
    id: 4,
    imageName: "4",
    title: "Dining Chair",
    description: "Elegant chair",
    price: "$125",
  },
  {
    id: 5,
    imageName: "3",
    title: "Office Chair",
    description: "Ergonomic design",
    price: "$199",
  },
  // ... rest of items
];

// types.ts
export interface BestSellerItem {
  id: number;
  imageName: string;
  title: string;
  description: string;
  price: string;
}

const Carousel: React.FC = () => {
  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.3,
        type: "keyframes",
        stiffness: 60,
        duration: 2,
      }}
      className="mt-18"
    >
      <h1 className="text-center text-[#07484A] text-5xl font-playFairDisplay font-semibold">
        Best Sellers
      </h1>

      <div className="w-full mt-12 px-8 md:px-16 lg:px-24">
        <Swiper
          modules={[Navigation, Scrollbar]}
          spaceBetween={10}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
            1536: { slidesPerView: 4 },
            1920: { slidesPerView: 5 },
          }}
          navigation={{
            prevEl: ".custom-prev",
            nextEl: ".custom-next",
          }}
          scrollbar={{ draggable: true }}
        >
          {bestSellers.map((item) => (
            <SwiperSlide
              key={item.id}
              className="pb-9 !flex !items-center !justify-center"
            >
              <BestSellersCard
                imageName={item.imageName}
                title={item.title}
                description={item.description}
                price={item.price}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex justify-end items-center gap-6 mt-6">
          <button className="custom-prev w-10 h-10 rounded-full flex items-center justify-center bg-[#E0EFF6]">
            <FaArrowLeft className="text-[#07484A]" />
          </button>
          <button className="custom-next w-10 h-10 rounded-full flex items-center justify-center bg-[#F9D9DA]">
            <FaArrowRight className="text-[#07484A]" />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <BtnLink text="Explore All Products" isIcone={true} link="/products"/>
        </div>
      </div>
    </motion.div>
  );
};

export default Carousel;
