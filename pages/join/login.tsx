/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import type { NextPage, GetServerSideProps } from "next";
import * as yup from "yup";
import Head from "next/head";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

import { SubmitHandler, useForm } from "react-hook-form";
import Container from "@mui/material/Container";
import { Box, Typography, Grid, Divider, TextField } from "@mui/material";

import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import { purple } from "@mui/material/colors";

import CustomButton from "../../shared/components/CustomButton";
import Layout from "../../shared/layout/Layout";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { wrapper } from "../../app/store";
import {
  getCurrentUserProfile,
  login,
} from "../../features/user/redux/userSlice";
import { AuthGuard } from "../../features/user/components/AuthGuard";

const GoogleButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});
export interface Inputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const resultAction = await dispatch(login(data));
    if (login.fulfilled.match(resultAction)) {
      await dispatch(getCurrentUserProfile());
      router.replace("/");
    } else {
      console.log(`[Error: ${resultAction.payload}]`);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Skillrisers</title>
        <meta name="description" content="Login to skillrisers" />
      </Head>
      <Container component="main" maxWidth="xs">
        <Typography sx={{ marginTop: 5 }} variant="h6">
          Login to your Skillrisers Account!
        </Typography>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  {...register("email")}
                  label="Email"
                  type="text"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("password")}
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                />
              </Grid>
            </Grid>
            <Button variant="outlined" type="submit">
              Login
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps =
//   wrapper.getServerSideProps((store) => async (context) => {
//     const { getUserProfileStatus } = store.getState().user;

//     if (getUserProfileStatus === "succeeded") {
//       return {
//         redirect: {
//           destination: "/",
//           permanent: false,
//         },
//       };
//     }
//     return {
//       props: {},
//     };
//   });
export default LoginPage;
