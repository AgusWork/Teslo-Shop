import React from 'react'
import useSWR from 'swr';
import { AdminLayout, AuthLayout } from '@/components/layouts'
import { IOrder, IUser } from '@/interfaces';
import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Box, Chip, CircularProgress, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';


const columns :GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre Completo', width: 300 },
    { field: 'total', headerName: 'Monto total', width: 300 },
    {
        field: 'isPaid',
        headerName: 'Pagada',
        renderCell: ({ row }: GridRenderCellParams) => {
            return row.isPaid
                ? ( <Chip variant='outlined' label="Pagada" color="success" /> )
                : ( <Chip variant='outlined' label="Pendiente" color="error" /> )
        }
    },
    { field: 'inStock', headerName: 'Nº Productos', align: 'center', width: 150 },
    {
        field: 'check',
        headerName: 'Ver orden',
        renderCell: ({ row }: GridRenderCellParams) => {
            return (
                <a href={ `/admin/orders/${ row.id }` } target="_blank" rel="noreferrer" >
                    Ver orden
                </a>
            )
        }
    },
    { field: 'createdAt', headerName: 'Creada en', width: 300 },

];
const OrdersPage = () => {

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

    if ( !data && !error ) return (<Box
        sx={{ height: "100vh" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        className="fadeIn"
      >
        <CircularProgress />
      </Box>);
    
    const rows = data!.map( order => ({
        id    : order._id,
        email : (order.user as IUser).email,
        name  : (order.user as IUser).name,
        total : `$ ${Math.round(order.total * 100) / 100}`,
        isPaid: order.isPaid,
        inStock: order.numberOfItems,
        createdAt: order.createdAt,
    }));
  return (
    <AdminLayout
    title={"Ordenes"}
    subTitle='Mantenimiento de ordenes'
    icon={<ConfirmationNumberOutlined />}
    >
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
  )
}

export default OrdersPage
