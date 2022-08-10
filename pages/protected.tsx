import { GetServerSideProps } from "next";
import React from "react";
import { getCart } from "../features/cart/redux/cartSlice";
import { AuthGuard } from "../features/user/components/AuthGuard";
import { user } from "../features/user/hocs/authorize";
import Layout from "../shared/layout/Layout";

const ProtectedPage = () => {
  return (
    <AuthGuard restricted={true}>
      <Layout>
        <div>ProtectedPage</div>
      </Layout>
    </AuthGuard>
  );
};

export const getServerSideProps: GetServerSideProps = user({
  callback: async (_, store) => {
    // if (!store.getState().user.user) {
    //   return { redirect: { permanent: false, destination: "/join/login" }, props:{} };
    // }
    // await store.dispatch(getCart());
    console.log("Inside Protected Page");
    return { props: {} };
  },
});

export default ProtectedPage;
