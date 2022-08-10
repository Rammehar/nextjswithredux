import { useRouter } from "next/router";
import * as React from "react";
import { useAppSelector } from "../../../app/hooks";
import LoginPage from "../../../pages/join/login";
import { User } from "../models/user";

interface IProps {
  children: React.ReactNode;
  restricted: boolean;
 }
export const AuthGuard: React.FC<IProps> = ({ children, restricted }) => {
  const router = useRouter();
  const { loading, user } = useAppSelector((state) => state.user);

  if (typeof window !== "undefined" && user === null && restricted)
    router.push("/join/login");

  if (loading === "loading") {
    return <>loading...</>;
  }

  return <>{children}</>;
};
