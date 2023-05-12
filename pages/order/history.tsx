import React, { useMemo } from "react";
import { GetServerSideProps, NextPage } from "next";
import { Typography, Grid, Chip, Link, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getSession } from "next-auth/react";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";
import dynamic from "next/dynamic";
import columns from "@/components/columns/orderHistoryColumns";

const ShopLayout = dynamic(
  () => import("../../components/layouts/ShopLayout"),
  { loading: () => <CircularProgress /> }
);

interface DataGridProps {
  rows: {
    id: number;
    paid: boolean;
    fullname: string;
    orderId: string | undefined;
    totalOrder: string;
  }[];
}

interface Props {
  orders: IOrder[];
}

const MemoizedDataGrid = React.memo(function MyMemoizedDataGrid({ rows }: DataGridProps) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
    />
  );
});

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = useMemo(
    () =>
      orders.map((order, idx) => ({
        id: idx + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id,
        totalOrder: `$${order.total.toFixed(2)}`,
      })),
    [orders]
  );
  return (
    <React.Suspense fallback={<CircularProgress />}>
      <ShopLayout
        title={"Historial de ordenes"}
        pageDescription={"Historial de ordenes del cliente"}
      >
        <Typography variant="h1" component="h1">
          Historial de ordenes
        </Typography>

        <Grid container className="fadeIn">
          <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
            <MemoizedDataGrid rows={rows} />
          </Grid>
        </Grid>
      </ShopLayout>
    </React.Suspense>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // const session: any = await getSession({ req });

  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: `/auth/login?p=/order/history`,
  //       permanent: false,
  //     },
  //   };
  // }

  const orders: IOrder[] = [];

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;