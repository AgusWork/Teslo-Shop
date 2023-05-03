import React, { useState } from "react";
import NextLink from "next/link";
import {
  AddOutlined,
  CategoryOutlined,
  ClearOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CardMedia,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  Link,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import useSWR from "swr";
import { AdminLayout } from "../../components/layouts";
import { IProduct } from "../../interfaces";

const ProductsPage = () => {
  const { data, error } = useSWR<IProduct[]>("/api/admin/products");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  if (!data && !error) return <></>;

  const columns: GridColDef[] = [
    {
      field: "img",
      headerName: "Foto",
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <a href={`/product/${row.slug}`} target="_blank" rel="noreferrer">
            <CardMedia
              component="img"
              alt={row.title}
              className="fadeIn"
              image={row.img}
            />
          </a>
        );
      },
    },
    {
      field: "title",
      headerName: "Title",
      width: 250,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <NextLink href={`/admin/products/${row.slug}`} passHref>
            <Link underline="always">{row.title}</Link>
          </NextLink>
        );
      },
    },
    { field: "gender", headerName: "Género" },
    { field: "type", headerName: "Tipo" },
    { field: "inStock", headerName: "Inventario" },
    { field: "price", headerName: "Precio" },
    { field: "sizes", headerName: "Tallas", width: 250 },
  ];
  const rows =
    searchTerm == ""
      ? data!.map((product) => ({
          id: product._id,
          img: product.images[0],
          title: product.title,
          gender: product.gender,
          type: product.type,
          inStock: product.inStock,
          price: product.price,
          sizes: product.sizes.join(", "),
          slug: product.slug,
        }))
      : data!
          .filter((product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((products) => ({
            id: products._id,
            img: products.images[0],
            title: products.title,
            gender: products.gender,
            type: products.type,
            inStock: products.inStock,
            price: products.price,
            sizes: products.sizes.join(", "),
            slug: products.slug,
          }));

  return (
    <AdminLayout
      title={`Productos (${data?.length})`}
      subTitle={"Mantenimiento de productos"}
      icon={<CategoryOutlined />}
    >
      <Box
        sx={{ mb: 2, height: "35px" }}
        display="flex"
        justifyContent={"space-between"}
      >
        <Box display="flex" justifyContent="start">
          {isSearchVisible ? (
            <Input
              sx={{ display: { xs: "none", sm: "flex" } }}
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={() => null}
              type="text"
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setIsSearchVisible(false)}
                    aria-label="toggle password visibility"
                  >
                    <ClearOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          ) : (
            <IconButton
              sx={{ display: { xs: "none", sm: "flex" } }}
              onClick={() => setIsSearchVisible(true)}
            >
              <SearchOutlined />
            </IconButton>
          )}
        </Box>
        <Box display="flex" justifyContent="end">
          <Button
            startIcon={<AddOutlined />}
            color="secondary"
            href="/admin/products/new"
          >
            Crear producto
          </Button>
        </Box>
      </Box>

      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
