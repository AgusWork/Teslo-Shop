import React, { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layouts";
import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material";
import { SummaryTile } from "@/components/admin";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import useSWR from "swr";
import { DashboardSummaryResponse } from "@/interfaces";

const DashboardPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>(
    "/api/admin/dashboard",
    {
      refreshInterval: 30 * 1000, //30 seg
    }
  );
  const [refreshIn, setRefreshIn] = useState(30)

  
  useEffect(() => {
    const interval = setInterval(()=>{
      console.log('Tick');
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1: 30 );
    }, 1000 );
  
    return () => clearInterval(interval)
  }, []);
  
  if (!error && !data) {
    return (
      <Box sx={{height:"100vh"}} display="flex" alignItems="center" justifyContent="center" className="fadeIn">
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    console.log(error);
    return <Typography>Error al cargar la informacion</Typography>;
  }
  const {
    lowInventory,
    notPaidOrders,
    numberOfClients,
    numberOfOrders,
    numberOfProducts,
    paidOrders,
    productsWithNoInventory,
  } = data!;
  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Estadisticas Generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subTitle="Ordenes totales"
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={paidOrders}
          subTitle="Ordenes pagadas"
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={notPaidOrders}
          subTitle="Ordenes pendientes"
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfClients}
          subTitle="Clientes"
          icon={<GroupOutlined color="primary" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={numberOfProducts}
          subTitle="Productos"
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />

        <SummaryTile
          title={productsWithNoInventory}
          subTitle="Sin existencias"
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />

        <SummaryTile
          title={lowInventory}
          subTitle="Bajo inventario"
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
        />

        <SummaryTile
          title={refreshIn}
          subTitle="Actualización en:"
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
