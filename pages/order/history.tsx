import { NextPage } from "next";
import { Typography, Grid} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getSession } from "next-auth/react";
import { dbOrders } from "@/database";
import { IOrder } from "@/interfaces";
import dynamic from 'next/dynamic';

import  columns  from '../../components/columns/orderHistoryColumns';

const ShopLayout = dynamic(
  () => import('../../components/layouts/ShopLayout'),
  { loading: () => <div>Loading...</div> }
);

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, idx) => ({
      id: idx + 1,
      paid: order.isPaid,
      fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
      orderId: order._id,
      totalOrder: `$ ${Math.round(order.total * 100) / 100}`,
    }))
  ;
  return (
    <ShopLayout
      title={"Historial de ordenes"}
      pageDescription={"Historial de ordenes del cliente"}
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>

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
    </ShopLayout>
  );
};

// You should use getStaticProps when:
// - The data required to render the page is available at build time
// - The data is unlikely to change frequently
// - The page must be pre-rendered (for example, for SEO purposes)

export const getStaticProps = async ({ req }: any) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/order/history`,
        permanent: false,
      },
    };
  }

  const orders = await dbOrders.getOrdersByUser(session.user._id);

  return {
    props: {
      orders
    },
  };
};

export default HistoryPage;