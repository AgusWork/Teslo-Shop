import { IProduct } from "@/interfaces";
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import React, { FC, useMemo, useState } from "react";

interface Props {
  product: IProduct;
}
export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoad, setIsImageLoad] = useState(false);

  const productImage = useMemo(() => {
    return isHovered
      ?  product.images[1] 
      :  product.images[0] ;

}, [isHovered, product.images])

  return (
    <Grid
      item
      xs={6}
      sm={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ WebkitFilter: product.inStock === 0 ? "grayscale(100%)" : "" }}
    >
      <Card>
        <NextLink
          passHref
          legacyBehavior
          href={`/products/${product.slug}`}
          prefetch={false}
        >
          <Link>
            <CardActionArea>
              {product.inStock === 0 && (
                <Chip
                  color="primary"
                  label="No hay disponible"
                  sx={{
                    position: "absolute",
                    zIndex: 99,
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
              <CardMedia
                component="img"
                image={productImage}
                alt={product.title}
                className="fadeIn"
                onLoad={() => setIsImageLoad(true)}
                sx={{ filter: product.inStock === 0 ? "blur(4px)" : "" }}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>
      <Box
        sx={{ mt: 1, display: isImageLoad ? "block" : "none" }}
        className="fadeIn"
      >
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>{` $${product.price}`}</Typography>
      </Box>
    </Grid>
  );
};
