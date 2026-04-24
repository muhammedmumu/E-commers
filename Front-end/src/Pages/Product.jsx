import React, { useContext } from "react";
import {ShopContext} from '../Context/ShopContext';
import { useParams } from "react-router-dom";
import Breadcrums from "../Components/Breadcrums/Breadcrums";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DescriptionBox from '../Components/DescriptionBox/DescriptionBox';
import RelatedProduct from "../Components/RlaatedProduct/RelatedProduct";

const Product = () => {
    const { allProducts } = useContext(ShopContext);
    const {productId} = useParams();
    const product = allProducts.find((e)=> e.id===Number(productId));

    if (!product) {
        return <div>Product not found.</div>;
    }

    return (
        <div>
            <Breadcrums product={product}/>
            <ProductDisplay product={product}/>
            <DescriptionBox/>
            <RelatedProduct/>

        </div>
    )

}
export default Product 
