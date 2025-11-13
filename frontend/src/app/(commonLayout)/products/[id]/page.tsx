
import ProductDetails from '@/components/products/ProductDetails';
import React from 'react';


type Props = { params: { id: number } };

export default async function Details({ params }: Props) {
    const { id } = await params;

    return (
        <div>
            <ProductDetails id={id} />
        </div>
    );
}