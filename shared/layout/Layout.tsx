import { NextPage } from "next";
import React from "react";
import Footer from "./Footer";
 import MyAppBar from "./MyAppBar";
import Container from "@mui/material/Container";
interface IProps {
  children: React.ReactNode;
}
const Layout: NextPage<IProps> = (props) => {
  return (
    <>
      <MyAppBar />

      <Container component="main" maxWidth="lg">
        {props.children}
        <Footer />
      </Container>
    </>
  );
};

export default Layout;
