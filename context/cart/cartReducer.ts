import { ICartProduct, IShippingAddress } from "@/interfaces";
import { CartState } from "./";

type CartActionType =
  | {
      type: "[Cart] - LoadCart from cookies | storage";
      payload: ICartProduct[];
    }
  | { type: "[Cart] - Update products in cart"; payload: ICartProduct[] }
  | { type: "[Cart] - Change product in Cart Quantity"; payload: ICartProduct }
  | { type: "[Cart] - Delete product in Cart"; payload: ICartProduct[] }
  | { type: "[Cart] - LoadAddress From Cookies"; payload: IShippingAddress }
  | { type: "[Cart] - Update Address"; payload: IShippingAddress }
  | { type: "[Cart] - Update order summary"; 
      payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
      };
    } |
    {type: "[Cart] - Order Complete"}

export const cartReducer = (
  state: CartState,
  action: CartActionType
): CartState => {
  switch (action.type) {
    case "[Cart] - LoadCart from cookies | storage":
      return {
        ...state,
        isLoaded: true,
        cart: [...action.payload],
      };
    case "[Cart] - Update products in cart":
      return {
        ...state,
        cart: [...action.payload],
      };
    case "[Cart] - Change product in Cart Quantity":
      return {
        ...state,
        cart: state.cart.map((product) => {
          if (product._id !== action.payload._id) return product;
          if (product.size !== action.payload.size) return product;

          return action.payload;
        }),
      };
    case "[Cart] - Delete product in Cart":
      return {
        ...state,
        cart: [...action.payload],
      };
    case "[Cart] - Update Address":
    case "[Cart] - LoadAddress From Cookies":
      return {
        ...state,
        shippingAddress: action.payload
      };
      case "[Cart] - Update order summary":
        return {
          ...state,
          ...action.payload,
        };
      case "[Cart] - Order Complete":
        return {
          ...state,
          cart: [],
          numberOfItems:0,
          subTotal: 0,
          tax: 0,
          total: 0
        }
    default:
      return state;
  }
};
