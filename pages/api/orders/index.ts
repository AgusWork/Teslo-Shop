import { IOrder } from "@/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "@/database";
import { Order, Product } from "@/models";
import { createContext } from 'react';

type Data = {
  message: string;
  
}| IOrder;

export default function orderCreate(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);

    default:
      return res.status(400).json({ message: "Bad Requqest" });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;

  // Varificar que este puesto un usuario
  const session: any = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json({ message: "Debe estar autenticado para hacer esto" });
  }

 

  const productsIds = orderItems.map((product) => product._id);
  await db.connect();

  const dbProducts = await Product.find({ _id: { $in: productsIds } });
  
  if (!dbProducts) {
    return res
    .status(401)
    .json({ message: "DBproducts no devuelve nada" });
  }
  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find(
        (prod) => prod.id === current._id
      )!.price;
      if (!currentPrice) {
        throw new Error("Verifique el carrito de nuevo, producto no existe");
      }
      return current.price * current.quantity + prev;
    }, 0);

    const backendTotal = subTotal * 1.15;

    if ( total !== backendTotal ) {
        throw new Error('El total no cuadra con el monto');
    }

    // Todo bien hasta este punto
    const userId = session.user._id;
    const newOrder = new Order({ ...req.body, isPaid: false, user: userId });

    newOrder.total = Math.round(newOrder.total * 100) / 100;
    await newOrder.save();
    await db.disconnect();
    
    return res.status(201).json( newOrder );


    
} catch (error:any) {
    await db.disconnect();
    console.log(error);
    res.status(400).json({
        message: error.message || 'Revise logs del servidor'
    })
}


  return res.status(201).json(session);
};
