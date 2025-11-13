"use client";
import ProductCard from "@/components/products/ProductCard";
import api from "@/lib/api";
import React, { useEffect, useState } from "react";
import { Loader } from "@/components/shared/Loader";
import { Headline } from "../shared/Headline";
import BtnLink from "../shared/BtnLink";



interface primary_image {
  id: number;
  alt_text?: string;
  image: string;
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

const ProductsHome = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);




  // fatching products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/products/');
        setProducts(response?.data?.results?.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);




  if(isLoading){
    return <Loader/>
  }



  return (
    <div className="my-32">
      <Headline text="Explore by Products" />
      <div className="container mx-auto z-0">
          {/* randering products  */}
          <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 justify-items-center">
            {products?.map((product) =>(
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
      </div>
      <div className="flex justify-center items-center mt-10"><BtnLink text="Explore All products" isIcone={true} link="/products"/></div>
    </div>
  );
};

export default ProductsHome;
