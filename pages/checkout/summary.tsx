import React, { useContext, useState } from "react";
import NextLink from "next/link";
import { CartContext } from "@/context";

import {
  Link,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import Cookies from "js-cookie";
import { useRouter } from 'next/router';
import dynamic from "next/dynamic";

const ShopLayout = dynamic(
  () => import("../../components/layouts/ShopLayout"),
  { loading: () => <div>Loading...</div> }
);
const SummaryPage = () => {
  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } =
    useContext(CartContext);
    const [isPosting, setIsPosting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

  useEffectOnce(() => {
    if (!Cookies.get("firstName")) {
      router.push("/checkout/address");
    }
  });

  const onCreateOrder = async() => {
    setIsPosting(true);
    const  { hasError, message} = await createOrder();  // Depende el resultado debe navegar o no 
    if(hasError){
      setIsPosting(false)
      setErrorMessage(message)
      return;
    }
    router.replace(`/order/${message}`)
  };

  if (!shippingAddress) {
    return <></>;
  }
  const {
    firstName,
    lastName,
    city,
    country,
    address,
    address2 = "",
    zip,
    phone,
  } = shippingAddress;
  return (
    <ShopLayout
      title="Resumen de orden"
      pageDescription={"Resumen de la orden"}
    >
      <Typography variant="h1" component="h1">
        Resumen de la orden
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen({numberOfItems}{" "}
                {numberOfItems === 1 ? "Producto" : "Productos"})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
                <NextLink href="/checkout/address" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>
                {firstName} {lastName}
              </Typography>
              <Typography>
                {address}
                {address2 ? `, ${address2}` : ""}
              </Typography>
              <Typography>
                {city} , {zip}
              </Typography>
              <Typography>{country}</Typography>
              <Typography>{phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref legacyBehavior>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />

              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  onClick={onCreateOrder}
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  disabled={isPosting}
                >
                  Confirmar Orden
                </Button>

                <Chip
                  color="error"
                  label={errorMessage}
                  sx={{display: errorMessage ? "flex" : "none", mt: 2}}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
