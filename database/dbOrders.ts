import { isValidObjectId } from 'mongoose';
import { IOrder } from '../interfaces/order';
import { Order } from '@/models';
import { db } from '.';

const connectDB = async () => {
  if (db.isConnected()) {
    return;
  }

  await db.connect();
};

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  if (!isValidObjectId(id)) {
    return null;
  }

  await connectDB();

  const orderPromise = Order.findById(id).lean();
  const [order] = await Promise.all([orderPromise]);

  if (!order) {
    return null;
  }

  return order;
};

export const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
  if (!isValidObjectId(userId)) {
    return [];
  }

  await connectDB();

  const ordersPromise = Order.find({ user: userId }).lean();
  const [orders] = await Promise.all([ordersPromise]);

  return orders;
};
