import ProductDetails from '@/components/products/ProductDetails';
import { RealtedProduct } from '@/components/products/RealtedProduct';
import React from 'react';


type Props = { params: { categoryId: number,subCategoryId: number,id: number } };

export default async function Details({ params }: Props) {
    const { categoryId,subCategoryId,id } = await params;

    return (
        <div>
            <ProductDetails id={id} />
            <RealtedProduct categoryId={categoryId} subCategoryId={subCategoryId} />
        </div>
    );
}