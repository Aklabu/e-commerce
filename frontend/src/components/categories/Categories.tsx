"use client";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Headline } from "../shared/Headline";
import BtnLink from "../shared/BtnLink";
import Pagination from "../shared/Pagination";
import { usePathname } from "next/navigation";
import { Loader } from "../shared/Loader";
import { EmptyData } from "../shared/EmptyData";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

interface Category {
  id: number;
  name: string;
  image: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathName = usePathname();
  

  useEffect(() => {
    const fatchingProduct = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/categories?page=${page}`);
        setTotalPages(response?.data?.count);
        setCategories(response?.data?.results?.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }finally{
        setIsLoading(false);
      }
    };
    fatchingProduct();
  }, [page]);

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  if(categories.length === 0){
    return  <EmptyData/>
  }


  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.3,
        type: "keyframes",
        stiffness: 60,
        duration: 2,
      }}
      className="lg:px-14"
    >
      {/*------------------ head line-------------   */}
      <Headline text="Explore by Category" />
      {/*------------- showing option card ----------------- */}
      <div className="container mx-auto pt-10">
        {isLoading ? <Loader/> : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center ">
          {/* showing product card when selected any category  */}
          {categories?.map((category) => (
            <div
              key={category?.id}
              className="group relative w-[400px] h-[300px] rounded-lg cursor-pointer overflow-hidden border border-[#088347]"
            >
              {/* Image */}
              <Image
                src={category?.image}
                alt={category?.name}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={100}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-5 items-center justify-center">
                <p className={`text-white text-6xl text-center ${playfair.className}}`}>
                  {category?.name}
                </p>
                <BtnLink text="Explore" link={`/categories/${category?.id}`} />
              </div>
            </div>
          ))}
        </div>}
        {/* Pagination */}
        {pathName === "/categories" ?<Pagination totalPages={Math.ceil(totalPages/9)} onPageChange={handlePageChange} /> : <div className="flex justify-center items-center mt-10"><BtnLink text="Explore All Categories" isIcone={true} link="/categories"/></div>}
      </div>
    </motion.div>
  );
};

export default Categories;
