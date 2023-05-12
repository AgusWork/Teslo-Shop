import { Chip, Link } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import NextLink from 'next/link';

const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "fullname", headerName: "Nombre Completo", width: 300 },
  
    {
      field: "paid",
      headerName: "Pagada",
      description: "Muestra información si está pagada la orden o no",
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        return params.row.paid ? (
          <Chip color="success" label="Pagada" variant="outlined" />
        ) : (
          <Chip color="error" label="No pagada" variant="outlined" />
        );
      },
    },
    {
      field: "orden",
      headerName: "Ver orden",
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <NextLink href={`/order/${params.row.orderId}`} passHref legacyBehavior>
            <Link underline="always">Ver orden</Link>
          </NextLink>
        );
      },
    },
    {
      field: "totalOrder",
      headerName: "Total de la Orden",
      width: 200,
    },
  ];

  export default columns;