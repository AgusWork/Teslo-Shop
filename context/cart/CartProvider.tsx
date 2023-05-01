import React, { FC, useEffect, useReducer } from "react";
import { ICartProduct, IOrder, IShippingAddress } from "@/interfaces";
import { CartContext, cartReducer } from "./";
import Cookie from "js-cookie";
import { useEffectOnce } from "@/hooks/useEffectOnce";
import Cookies from "js-cookie";
import { tesloApi } from "@/api";
import axios from "axios";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;

  shippingAddress?: IShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

interface Props {
  children?: React.ReactNode | undefined;
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffectOnce(() => {
    try {
      const cookieProducts = Cookie.get("cart")
        ? JSON.parse(Cookie.get("cart")!)
        : [];
      dispatch({
        type: "[Cart] - LoadCart from cookies | storage",
        payload: cookieProducts,
      });
    } catch (error) {
      dispatch({
        type: "[Cart] - LoadCart from cookies | storage",
        payload: [],
      });
    }
  });

  useEffectOnce(() => {
    if (Cookie.get("firstName")) {
      const shippingAddress = {
        firstName: Cookie.get("firstName") || "",
        lastName: Cookie.get("lastName") || "",
        address: Cookie.get("address") || "",
        address2: Cookie.get("address2") || "",
        zip: Cookie.get("zip") || "",
        city: Cookie.get("city") || "",
        country: Cookie.get("country") || "",
        phone: Cookie.get("phone") || "",
      };

      dispatch({
        type: "[Cart] - LoadAddress From Cookies",
        payload: shippingAddress,
      });
    }
  });

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce(
      (prev, current) => current.quantity + prev,
      0
    );
    const subTotal = state.cart.reduce(
      (prev, current) => current.price * current.quantity + prev,
      0
    );
    const taxRate = 0.15;
    const total = subTotal * (taxRate + 1);

    const orderSummary = {
      numberOfItems,
      subTotal,
      tax: subTotal * taxRate,
      total,
    };

    dispatch({ type: "[Cart] - Update order summary", payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    //! Nivel 1
    // dispatch({ type: '[Cart] - Add Product', payload: product });

    //! Nivel 2
    // const productsInCart = state.cart.filter( p => p._id !== product._id && p.size !== product.size );
    // dispatch({ type: '[Cart] - Add Product', payload: [...productsInCart, product] })

    //! Nivel Final
    const productInCart = state.cart.some((p) => p._id === product._id);
    if (!productInCart)
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });

    const productInCartButDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );
    if (!productInCartButDifferentSize)
      return dispatch({
        type: "[Cart] - Update products in cart",
        payload: [...state.cart, product],
      });

    // Acumular
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      // Actualizar la cantidad
      p.quantity += product.quantity;
      return p;
    });

    dispatch({
      type: "[Cart] - Update products in cart",
      payload: updatedProducts,
    });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({
      type: "[Cart] - Change product in Cart Quantity",
      payload: product,
    });
  };

  const deleteCartProduct = (product: ICartProduct) => {
    dispatch({
      type: "[Cart] - Delete product in Cart",
      payload: state.cart.filter(
        (p) => !(p._id === product._id && p.size === product.size)
      ),
    });
  };

  const updatedAddress = (address: IShippingAddress) => {
    Cookie.set("lastName", address.lastName);
    Cookie.set("firstName", address.firstName);
    Cookie.set("address", address.address);
    Cookie.set("address2", address.address2 || "");
    Cookie.set("zip", address.zip);
    Cookie.set("city", address.city);
    Cookie.set("country", address.country);
    Cookie.set("phone", address.phone);

    dispatch({ type: "[Cart] - Update Address", payload: address });
  };

  const createOrder = async (): Promise<{
    hasError: boolean;
    message: string;
  }> => {
    if (!state.shippingAddress) {
      throw new Error("No hay direccion de entrega");
    }

    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };

    try {
      const { data } = await tesloApi.post<IOrder>("/orders", body);

      dispatch({ type: "[Cart] - Order Complete" });

      return {
        hasError: false,
        message: data._id!,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: "Error no controlado, hable con el administrador",
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        //    Methods
        addProductToCart,
        updateCartQuantity,
        deleteCartProduct,
        updatedAddress,

        // Orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
