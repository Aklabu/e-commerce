"use client";
import React from "react";
import { Card } from "antd";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

interface primary_image {
  id: number;
  alt_text?: string;
  image: string;
}

interface ProductProps {
  id?: number;
  title?: string;
  short_description?: string;
  category_name?: string;
  category_slug?: string;
  availability?: true;
  popularity?: 1;
  primary_image?: primary_image;
}

interface ProductCardProps {
  product: ProductProps;
  selectedFilter?: string | null;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selectedFilter = null,
}) => {
  return (
    <Link href={`/products/${product.id}`} className="cursor-pointer mx-auto rounded-lg shadow-xl  hover:scale-105  transition-all duration-300">
      <Card className="z-0" data-filter={selectedFilter ?? ""}>
        <Image
          src={product?.primary_image?.image || "/placeholder.jpg"}
          width={300}
          height={500}
          alt={product.title || "Product image"}
          className="h-[350px] w-[250px] object-contain"
        />
        <h1 className="text-xl font-bold mt-2 text-center">{product.title}</h1>
        {/* other user info */}
      </Card>
    </Link>
  );
};

export default ProductCard;
