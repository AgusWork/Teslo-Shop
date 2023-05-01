import { useContext } from "react";
import NextLink from "next/link";

import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";

import { useRouter } from "next/router";
import { CartContext, UIContext } from "@/context";

export const AdminNavbar = () => {
  const { toggleSideMenu } = useContext(UIContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref legacyBehavior>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop</Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Button onClick={toggleSideMenu}>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
