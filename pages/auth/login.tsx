import React, { useContext, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  getSession,
  signIn,
} from "next-auth/react";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/context";
import { validations } from "@/utils";
import { useRouter } from "next/router";
import { BuiltInProviderType } from "next-auth/providers";
import { Box, Button, Divider, Grid, Link, TextField, Typography } from "@mui/material";
import dynamic from 'next/dynamic';

type FormData = {
  email: string;
  password: string;
};

  const AuthLayout = dynamic(
    () => import('../../components/layouts/AuthLayout'),
    { loading: () => <div>Loading...</div> }
  );

const LoginPage = () => {
  const router = useRouter();
  const { loginUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);
  
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });
  }, []);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);
    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title={"Ingresar"}>
      <form onSubmit={handleSubmit(onLoginUser)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesión
              </Typography>
              {/* <Chip
                label="No reconocemos ese usuario / contraseña"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              /> */}
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "Este campo es requerido",
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("password", {
                  required: "Este campo es requerido",
                  minLength: { value: 6, message: "Minimo 6 caracteres" },
                })}
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
                type="submit"
              >
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={
                  router.query.p
                    ? `/auth/register?p=${router.query.p?.toString()}`
                    : "/auth/register"
                }
                passHref
                legacyBehavior
              >
                <Link underline="always">¿No tienes cuenta?</Link>
              </NextLink>
            </Grid>
            {
              <Grid
                item
                xs={12}
                display="flex"
                flexDirection="column"
                justifyContent="end"
              >
                <Divider sx={{ width: "100%", mb: 2 }} />
                {providers && (
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent="end"
                    flexDirection="column"
                  >
                    <Divider sx={{ width: "100%", marginBottom: 2 }} />
                    {Object.values(providers).map(({ id, name }) => {
                      if (id === "credentials") return null;

                      return (
                        <Button
                          key={id}
                          variant="outlined"
                          fullWidth
                          color="primary"
                          sx={{ marginBottom: 1 }}
                          onClick={() => signIn(id)}
                        >
                          {name}
                        </Button>
                      );
                    })}
                  </Grid>
                )}
              </Grid>
            }
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};
export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });
  // callbackUrl => query que manda el middleware

  const { callbackUrl = "/" } = query;

  if (session) {
    return {
      redirect: {
        destination: callbackUrl.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default LoginPage;