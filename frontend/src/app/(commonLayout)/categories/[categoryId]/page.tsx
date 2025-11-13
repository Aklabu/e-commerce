"use client";
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Headline } from "@/components/shared/Headline";
import BtnLink from "@/components/shared/BtnLink";
import { useParams } from "next/navigation";
import Pagination from "@/components/shared/Pagination";
import { EmptyData } from "@/components/shared/EmptyData";
import LoadingPage from "../../products/loading";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

interface SubCategory {
  id: number;
  name: string;
  image: string;
}

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {categoryId} = useParams();



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/categories/${categoryId}/subcategories?page=${page}`);
        setTotalPages(response?.data?.count);
        setSubCategories(response.data.results.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
      finally{
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, page]);


  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  if(subCategories.length === 0){
      return  <EmptyData/>
    }

  if(isLoading){
    return (<div className="flex justify-center items-center h-screen">
      <LoadingPage/>
    </div>);
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
      className="lg:px-14 mt-32"
    >
      {/*------------------ head line-------------   */}
      <Headline text="Explore by Sub category"/>
      {/*------------- showing option card ----------------- */}
      <div className="overflow-y-auto container mx-auto pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-10 ">
          {/* showing product card when selected any category  */}
          {subCategories?.map((subCategory) => (<div
              key={subCategory?.id}
              className="group relative w-[400px] h-[300px] rounded-lg cursor-pointer overflow-hidden border border-[#088347]"
            >
              {/* Image */}
              <Image
                src={subCategory?.image}
                alt={subCategory?.name}
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                quality={100}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-5 items-center justify-center">
                <p className={`text-white text-6xl text-center ${playfair.className}}`}>
                  {subCategory?.name}
                </p>
                <BtnLink text="Explore" link={`/categories/${categoryId}/${subCategory?.id}`} />
              </div>
            </div>
          ))}
        </div>
        <Pagination totalPages={Math.ceil(totalPages/9)} onPageChange={handlePageChange} />
      </div>
    </motion.div>
  );
};

export default SubCategories;
