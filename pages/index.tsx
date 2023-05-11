import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import { Typography } from "@mui/material";
import { Inter } from "@next/font/google";
import ShopLayout  from "../components/layouts/ShopLayout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { products, isLoading, isError } = useProducts("products");

  return (
    <>
      <ShopLayout
        title={"Shop Shop"}
        pageDescription={
          "Encuentra los mejores productos aqui en nuestra tienda"
        }
      >
        <Typography variant="h1" component="h1">
          Tienda
        </Typography>
        <Typography variant="h2" sx={{ mb: "1" }}>
          Todos los productos
        </Typography>

        {isLoading ? (
          <FullScreenLoading />
        ) : (
          <ProductList products={products} />
        )}
      </ShopLayout>
    </>
  );
}
