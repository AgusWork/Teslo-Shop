import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";
import { Inter } from "@next/font/google";
import { NextPage } from "next";

const inter = Inter({ subsets: ["latin"] });

const MenPage: NextPage = () => {
  const { products, isLoading, isError } = useProducts("products?gender=men");

  return (
    <>
      <ShopLayout
        title={"Teslo-Shop - Men"}
        pageDescription={
          "Encuentra los mejores productos aqui en nuestra tienda"
        }
      >
        <Typography variant="h1" component="h1">
          Hombres
        </Typography>
        <Typography variant="h2" sx={{ mb: "1" }}>
          Todos los productos hombres
        </Typography>

        {isLoading ? (
          <FullScreenLoading />
        ) : (
          <ProductList products={products} />
        )}
      </ShopLayout>
    </>
  );
};

export default MenPage;
