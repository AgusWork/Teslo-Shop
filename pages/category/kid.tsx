import { ShopLayout } from "@/components/layouts";
import { ProductList } from "@/components/products";
import { FullScreenLoading } from "@/components/ui";
import { useProducts } from "@/hooks";
import {
  Typography,
} from "@mui/material";
import { Inter } from "@next/font/google";
import { NextPage } from "next";

const inter = Inter({ subsets: ["latin"] });



const KidPage: NextPage = () => {


  const { products, isLoading } = useProducts('/products?gender=kid');

  return (
    <>
      <ShopLayout
        title={"Teslo-Shop - Kid"}
        pageDescription={
          "Encuentra los mejores productos aqui en nuestra tienda"
        }
      >
        <Typography variant="h1" component="h1">
          Niños
        </Typography>
        <Typography variant="h2" sx={{ mb: "1" }}>
          Todos los productos para niños
        </Typography>

        {
          isLoading
          ? <FullScreenLoading />
          : <ProductList products={products}/>

        }


        
      </ShopLayout>
    </>
  );
}

export default KidPage;