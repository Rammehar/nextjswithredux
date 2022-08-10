import axios from "axios";
import { get } from "lodash";

import createAuthRefreshInterceptor from "axios-auth-refresh";
import * as cookie from "cookie";
import * as setCookie from "set-cookie-parser";

// Create axios instance.
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// // Create axios interceptor
// function didAccessTokenExpire(response: any): boolean {
//   return get(response, "data.message") === "Token signature expired.";
// }

// async function regenerateAccessTokenFromRefreshToken() {
//   const response = await axios({
//     withCredentials: true,
//     method: "POST",
//     url: `/api/refreshToken`,
//   });

//   return response;
// }

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     try {
//       if (didAccessTokenExpire(error.response)) {
//         const response = await regenerateAccessTokenFromRefreshToken();
//         console.log("Refresh Header Interceptor", response.data);

//         if (axiosInstance.defaults.headers["setCookie"]) {
//           delete axiosInstance.defaults.headers["setCookie"];
//         }
//         const { accessToken } = response.data;
//         const bearer = `Bearer ${accessToken}`;

//         axiosInstance.defaults.headers.common["Authorization"] = bearer;

//         const responseCookie = setCookie.parse(
//           response.headers["set-cookie"]
//         )[0];
//         axiosInstance.defaults.headers["setCookie"] =
//           response.headers["set-cookie"];
//         axiosInstance.defaults.headers.common["cookie"] = cookie.serialize(
//           responseCookie.name,
//           responseCookie.value
//         );
//         error.config.headers.common["Authorization"] = bearer;
//         return axiosInstance.request(error.config);
//       }
//     } catch (err) {
//       // need to logout user
//     }
//     return Promise.reject({ ...error });
//   }
// );

// // createAuthRefreshInterceptor(axiosInstance, (failedRequest) =>
// //   axiosInstance.post("/api/refreshToken").then((response) => {
// //     console.log("Interceptor Run");
// //     console.log("Interceptor Headers", response.headers);

// //     if (axiosInstance.defaults.headers["setCookie"]) {
// //       delete axiosInstance.defaults.headers["setCookie"];
// //     }
// //     const { accessToken } = response.data;
// //     const bearer = `Bearer ${accessToken}`;
// //     axiosInstance.defaults.headers.common["Authorization"] = bearer;
// //     const responseCookie = setCookie.parse(response.headers["set-cookie"])[0];
// //     axiosInstance.defaults.headers["setCookie"] =
// //       response.headers["set-cookie"];

// //     axiosInstance.defaults.headers.common["cookie"] = cookie.serialize(
// //       responseCookie.name,
// //       responseCookie.value
// //     );
// //     failedRequest.response.config.headers.common["Authorization"] = bearer;
// //     return Promise.resolve();
// //   })
// // );

export default axiosInstance;
