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
import LoadingPage from "@/app/(commonLayout)/products/loading";
import ProductCard from "@/components/products/ProductCard";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

interface primary_image {
  id:number,
  alt_text?:string,
  image:string
}

interface ProductProps {
  id?: number;
  name?: string;
  short_description?: string;
  category_name?: string;
  category_slug?: string;
  availability?: true;
  code?: string;
  popularity?: 1;
  primary_image?: primary_image;
}


const Products = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1)
  const {categoryId,subCategoryId} = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [selectedFilter, setSelectedFilter] = useState<string | null>(null);





  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/categories/${categoryId}/subcategories/${subCategoryId}/products/`);
        setTotalPages(response?.data?.count);
        setProducts(response.data.results.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId,subCategoryId, page, setIsLoading]);


  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  if(products.length === 0){
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
      <Headline text="Explore Products"/>
      {/*------------- showing option card ----------------- */}
      <div className="overflow-y-auto container mx-auto pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center">
          {/* showing product card when selected any category  */}
          {products?.map((product) => (<ProductCard key={product.id} product={product} />))}
        </div>
        <Pagination totalPages={Math.ceil(totalPages/9)} onPageChange={handlePageChange} />
      </div>
    </motion.div>
  );
};

export default Products;
