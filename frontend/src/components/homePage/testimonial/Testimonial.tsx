"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar } from "swiper/modules";
import TestimonialCard from "./TestimonialCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

const Testimonial = () => {
  return (
    <div>
      {/* Testimonials Section */}
      <div>
        <h1 className="text-[#07484A] text-4xl text-center font-playFairDisplay font-bold pt-14">
          Testimonials
        </h1>
        <p className="text-[#07484A] text-xl text-center font-roboto mt-4">
          Over 15,000 happy customers.
        </p>
        <div className="w-full mt-12 px-8 md:px-16 lg:px-24 2xl:px-32 flex flex-col items-center justify-center md:flex-row  gap-4">
          <Swiper
            modules={[Navigation, Scrollbar]}
            spaceBetween={1}
            slidesPerView={1}
            navigation={{
              prevEl: ".custom-prev-testi", // the name prevEl can not be changed. it is fixed.
              nextEl: ".custom-next-testi", // the name nextEl can not be changed. it is fixed.
            }}
            // pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            className="mt-8"
          >
            {reviews.map((item) => (
              <SwiperSlide
                key={item.id}
                className="pb-9 !flex !items-center !justify-center"
              >
                <TestimonialCard
                  imageName={item.imageName}
                  review={item.review}
                  name={item.name}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Arrow button for navigation */}
          <div className="w-1/4 flex flex-col justify-end sm:justify-center items-center gap-6">
            <button
              className="custom-prev-testi w-10 h-10 rounded-full flex items-center justify-center bg-[#C6E824] 
                        transition cursor-pointer"
            >
              <FaArrowLeft className="text-[#07484A]" />
            </button>
            <button
              className="custom-next-testi w-10 h-10 rounded-full flex items-center justify-center bg-[#088347] 
                        transition cursor-pointer"
            >
              <FaArrowRight className="text-[#FFFFFF]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;

const reviews = [
  {
    id: 1,
    imageName: "men",
    name: "Leona Paul",
    review: `My experience with Mark is a complete sucess, from customer service, wide range of products, clean store, purchasing 
        experience, the newsletter. Thank you.`,
  },
  {
    id: 2,
    imageName: "men",
    name: "Fahim",
    review: `My experience with Mark is a complete sucess, from customer service, wide range of products, clean store, purchasing 
        experience, the newsletter. Thank you.`,
  },
  {
    id: 3,
    imageName: "men",
    name: "Faisal",
    review: `My experience with Mark is a complete sucess, from customer service, wide range of products, clean store, purchasing 
        experience, the newsletter. Thank you.`,
  },
  {
    id: 4,
    imageName: "men",
    name: "Faria",
    review: `My experience with Mark is a complete sucess, from customer service, wide range of products, clean store, purchasing 
        experience, the newsletter. Thank you.`,
  },
  {
    id: 5,
    imageName: "men",
    name: "Digonto",
    review: `My experience with Mark is a complete sucess, from customer service, wide range of products, clean store, purchasing 
        experience, the newsletter. Thank you.`,
  },
];
