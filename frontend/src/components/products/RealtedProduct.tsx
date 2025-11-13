
"use client"

import api from "@/lib/api";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import BtnLink from "../shared/BtnLink";
import { Playfair } from "next/font/google";

const playfair = Playfair({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});


interface primary_image {
  id: number;
  alt_text?: string;
  image: string;
}

interface RelatedProducts {
  id: number;
  name: string;
  brand: string;
  availability: string;
  code: string;
  primary_image: primary_image;
}

interface RealtedProductProps {
  categoryId: number;
  subCategoryId: number;
}

export const RealtedProduct: React.FC<RealtedProductProps> = ({ categoryId, subCategoryId }) => {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProducts[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(
          `/products/categories/${categoryId}/subcategories/${subCategoryId}/products/`
        );
        setRelatedProducts(response.data.results.data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, subCategoryId]);

  return (
    <section className="container mx-auto overflow-x-auto">
      <h1 className="text-3xl my-10">Related Products</h1>
      <div className="flex gap-5">
        {relatedProducts?.map((product) => (
          <div
            key={product?.id}
            className="group relative w-[400px] h-[300px] rounded-lg cursor-pointer overflow-hidden border border-[#088347]"
          >
            {/* Image */}
            <Image
              src={product?.primary_image?.image}
              alt={product?.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              quality={100}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-5 items-center justify-center">
              <p
                className={`text-white text-xl text-center ${playfair.className}`}
              >
                {product?.name}
              </p>
              <BtnLink
                text="Explore"
                link={`/products/${product?.id}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
