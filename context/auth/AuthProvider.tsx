import React, { FC, useEffect, useReducer } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import { AuthContext, authReducer } from "./";
import { IUser } from "@/interfaces";
import { tesloApi } from "@/axiosApi";
import Cookies from "js-cookie";
import { useEffectOnce } from "@/hooks/useEffectOnce";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const Auth_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface Props {
  children?: React.ReactNode | undefined;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      dispatch({ type: "[Auth] - Login", payload: data?.user as IUser });
    }
  }, [status, data]);

  // useEffectOnce(() => {
  //   checkToken();
  // });

  const checkToken = async () => {
    try {
      const { data } = await tesloApi.get("/users/validate-token");
      const { token, user } = data;

      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
      return;
    } catch (error) {
      return Cookies.remove("token");
    }
  };

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post("/users/login", { email, password });
      const { token, user } = data;

      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const { data } = await tesloApi.post("/users/register", {
        name,
        email,
        password,
      });
      const { token, user } = data;

      Cookies.set("token", token);
      dispatch({ type: "[Auth] - Login", payload: user });
      return {
        hasError: false,
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
        message: "No se pudo crear el usuario - intente de nuevo",
      };
    }
  };

  const logout = () => {
    Cookies.remove("cart");
    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("address");
    Cookies.remove("address2");
    Cookies.remove("zip");
    Cookies.remove("city");
    Cookies.remove("country");
    Cookies.remove("phone");

    signOut();
    // router.reload();
    // Cookies.remove('token');
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        loginUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
