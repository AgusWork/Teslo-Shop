import { useContext, useState } from "react";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { ShopLayout } from "@/components/layouts";
import { ItemCounter, SizeSelector, SlideShow } from "@/components/ui";
import { ICartProduct, IProduct, ISize } from "@/interfaces";
import { Button, Chip, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { dbProducts } from "@/database";
import { useRouter } from "next/router";
import { CartContext } from "../../context/cart/CartContext";

interface Props {
  product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {
  const { addProductToCart } = useContext(CartContext);

  const router = useRouter();
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    inStock: product.inStock,
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const addOrRemoveQuantity = ( quantity: number) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      quantity,
    }));
  };

  const selectedSize = (size: ISize) => {
    setTempCartProduct((currentProduct) => ({
      ...currentProduct,
      size,
    }));
  };

  const onAddProduct = () => {
    if (!tempCartProduct.size) {
      return;
    }
    addProductToCart(tempCartProduct);
    // llamar la accion de context para agregar al carrito
    router.push("/cart");
  };

  return (
    <ShopLayout title={"ASD"} pageDescription={"ASD"}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <SlideShow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography
              variant="h1"
              component="h2"
            >{`$${product.price}`}</Typography>{" "}
          </Box>
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle2">Cantidad</Typography>
            <ItemCounter
              updatedQuantity={addOrRemoveQuantity}
              currentValue={tempCartProduct.quantity}
              maxValue={product.inStock}
            />
            <SizeSelector
              sizes={product.sizes}
              selectedSize={tempCartProduct.size}
              onSelectedSize={selectedSize}
            />
          </Box>

          {product.inStock > 0 ? (
            <Button color="secondary" className="circular-btn" onClick={() => onAddProduct()}>
              {tempCartProduct.size
                ? "Agregar al carrito"
                : "Seleccione una talla"}
            </Button>
          ) : (
            <Chip label="Nohay disponibles" color="error" variant="outlined" />
          )}

          {/* <Chip label="No hay disponible" color="error" variant="outlined" /> */}

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Descripcion</Typography>
            <Typography variant="body2">{product.description}</Typography>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { slug = "" } = params as { slug: string };

//   const product = await dbProducts.getProductsBySlug(slug);
// * NO USAR ESTO SSR
//   if (!product) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {
//       product,
//     },
//   };
// };

// getStaticPaths....
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const productSlugs = await dbProducts.getAllProductSlugs();

  return {
    paths: productSlugs.map(({ slug }) => ({
      params: {
        slug,
      },
    })),
    fallback: "blocking",
  };
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug = "" } = params as { slug: string };
  const product = await dbProducts.getProductBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default ProductPage;
