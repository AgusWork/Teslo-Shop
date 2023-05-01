import { Grid } from "@mui/material";
import React, { FC } from "react";
import { IProduct } from "../../interfaces/products";
import { ProductCard } from "./ProductCard";

interface Props {
  products: IProduct[];
}

export const ProductList: FC<Props> = ({ products }) => {
  return (
    <Grid container spacing={4} sx={{ marginTop: "10px" }}>
      {products.map((product, idx) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </Grid>
  );
};
