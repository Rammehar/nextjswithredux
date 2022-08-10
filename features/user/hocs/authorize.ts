import * as setCookie from "set-cookie-parser";
import * as cookie from "cookie";
import { wrapper } from "../../../app/store";
import axios from "../../../shared/infra/services/axiosInstance";
import { getCurrentUserProfile } from "../redux/userSlice";
import { updateAccessToken, reset } from "../redux/userSlice";

export const authorize = async ({ store, context, callback }: any) => {
  const { accessToken } = store.getState().user;

  if (context.req) {
    axios.defaults.headers.common["cookie"] =
      context.req.headers.cookie || null;

    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    }
    if (context.req.headers.cookie) {
      if (!accessToken) {
        try {
          const response = await axios.post("/api/refreshToken");
          const newAccessToken = response.data.accessToken;
          // console.log("RefreshToken Headers Server", response.headers);
          const responseCookie = setCookie.parse(
            response.headers["set-cookie"]
          )[0];
          axios.defaults.headers.common["cookie"] = cookie.serialize(
            responseCookie.name,
            responseCookie.value
          );
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          context.res.setHeader("set-cookie", response.headers["set-cookie"]);
          console.log("Server Token", newAccessToken);
          store.dispatch(updateAccessToken({ token: newAccessToken }));
        } catch (err) {
          store.dispatch(reset());
        }
      }
    }

    try {
      const cbResponse = await callback(accessToken, store, context.res);
      if (axios.defaults.headers["setCookie"]) {
        context.res.setHeader(
          "set-cookie",
          axios.defaults.headers["setCookie"]
        );

        const accessToken = (
          axios.defaults.headers.common["Authorization"] as string
        ).split(" ")[1];
        store.dispatch(
          updateAccessToken({
            token: accessToken,
          })
        );

        delete axios.defaults.headers["setCookie"];
      }
      return cbResponse;
    } catch (err) {
      store.dispatch(reset());
    }
  }
};

export const user = ({ callback }: any) =>
  wrapper.getServerSideProps((store) => async (context) => {
    return authorize({
      store,
      context,
      callback: async (...props) => {
        if (!context.req.headers.cookie) {
          store.dispatch(reset());
        } else if (!store.getState().user.user) {
          await store.dispatch(getCurrentUserProfile());
        }
        return callback(...props);
      },
    });
  });
