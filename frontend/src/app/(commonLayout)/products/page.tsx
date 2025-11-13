"use client";
import ProductCard from "@/components/products/ProductCard";
import api from "@/lib/api";
import React, { useEffect, useState, useMemo } from "react";
import { Playfair_Display } from "next/font/google";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BsFilterLeft } from "react-icons/bs";
import { EmptyData } from "@/components/shared/EmptyData";
import { Loader } from "@/components/shared/Loader";

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

const ProductsPage = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategory, setSubCategory] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  // memoized sorted products based on selectedFilter (A2Z or Z2A)
  const sortedProducts = useMemo(() => {
    if (!products) return products;
    const copy = [...products];
    if (selectedFilter === "A2Z") {
      return copy.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }
    if (selectedFilter === "Z2A") {
      return copy.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }
    return copy;
  }, [products, selectedFilter]);


  // fatching products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        
        // Join multiple values with commas instead of creating multiple parameters
        if (selectedBrands.length) params.append('brand', selectedBrands.join(','));
        if (selectedCategories.length) params.append('category', selectedCategories.join(','));
        if (selectedSubCategories.length) params.append('subcategory', selectedSubCategories.join(','));
        
        const queryString = params.toString() ? `/products/?${params.toString()}` : '/products/';
        const response = await api.get(queryString);
        setProducts(response?.data?.results?.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [selectedBrands, selectedCategories, selectedSubCategories]);

  // faching brands
  useEffect(() => {
    const fatchingBrands = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/brands`);
        setBrands(response?.data?.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fatchingBrands();
  }, []);

  // faching categories
  useEffect(() => {
    const fatchingCategories = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/products/categories`);
        setCategories(response?.data?.results?.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fatchingCategories();
  }, []);

  // faching sub-categories
  useEffect(() => {
    const fatchingCategories = async () => {
      try {
        setIsLoading(true);
        // Only fetch subcategories for the last selected category
        const lastSelectedCategory = selectedCategories[selectedCategories.length - 1];
        if (lastSelectedCategory) {
          const response = await api.get(
            `/products/categories/${lastSelectedCategory}/subcategories`
          );
          console.log("checking subcategories...", response);
          setSubCategory(response?.data?.results?.data);
        } else {
          setSubCategory([]);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fatchingCategories();
  }, [selectedCategories]);


  if(isLoading){
    return <Loader/>
  }


  if(sortedProducts?.length === 0){
    return <EmptyData/>
  }


  return (
    <div className="my-32">
      <h1
        className={`text-center font-bold text-2xl my-8 ${playfair.className}`}
      >
        All Products
      </h1>
      <div className="flex gap-5 justify-center z-0">
        <div className="w-60 flex flex-col gap-5 mt-18">
          {/* randering brands  */}
          <Accordion type="single" collapsible className="w-full  rounded-lg">
            <AccordionItem value="item-3">
              <AccordionTrigger className="bg-gray-300 px-4">
                Brand
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance px-4 py-2 border rounded-md mt-2">
                {brands?.map((brand, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedBrands(prev => 
                        prev.includes(brand) 
                          ? prev.filter(b => b !== brand)
                          : [...prev, brand]
                      );
                    }}
                    className="flex items-center gap-3"
                  >
                    <Checkbox id={brand} checked={selectedBrands.includes(brand)} />
                    <Label htmlFor={brand}>{brand}</Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* randering categories  */}
          <Accordion type="single" collapsible className="w-full  rounded-lg">
            <AccordionItem value="item-1">
              <AccordionTrigger className="bg-gray-300 px-4">
                Categories
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance px-4 py-2 border rounded-md mt-2">
                {categories?.map((category) => (
                  <div
                    key={category.id}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategories(prev => 
                        prev.includes(category.id)
                          ? prev.filter(id => id !== category.id)
                          : [...prev, category.id]
                      );
                    }}
                    className="flex items-center gap-3"
                  >
                    <Checkbox id={category.name} checked={selectedCategories.includes(category.id)} />
                    <Label htmlFor={category.name}>{category.name}</Label>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {/* randering subcategories  */}
          {subCategory.length > 0 && (
            <Accordion type="single" collapsible className="w-full  rounded-lg">
              <AccordionItem value="item-2">
                <AccordionTrigger className="bg-gray-300 px-4">
                  Sub Categories
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 text-balance px-4 py-2 border rounded-md mt-2">
                  {subCategory?.map((monoSubCategory) => (
                    <div
                      key={monoSubCategory?.id}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedSubCategories(prev => 
                          prev.includes(monoSubCategory.id)
                            ? prev.filter(id => id !== monoSubCategory.id)
                            : [...prev, monoSubCategory.id]
                        );
                      }}
                      className="flex items-center gap-3"
                    >
                      <Checkbox id={monoSubCategory.name} checked={selectedSubCategories.includes(monoSubCategory.id)} />
                      <Label htmlFor={monoSubCategory.name}>
                        {monoSubCategory.name}
                      </Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
        <div>
          <div className="my-4 flex justify-between items-center">
            <div></div>
              <div className="flex items-center gap-2 border-2 rounded bg-[#ECEFF1] p-2">
              <BsFilterLeft className="text-xl" />
              <select
                name="filters"
                id="filters"
                value={selectedFilter ?? ""}
                onChange={(e) => setSelectedFilter(e.target.value || null)}
                className="bg-[#ECEFF1] outline-none w-28"
              >
                <option disabled value="">
                  Filters
                </option>
                <option value="A2Z">A to Z</option>
                <option value="Z2A">Z to A</option>
              </select>
            </div>
          </div>
          {/* randering products  */}
          <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center gap-6">
            {sortedProducts?.map((product) =>(
              <ProductCard key={product.id} product={product} selectedFilter={selectedFilter} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
