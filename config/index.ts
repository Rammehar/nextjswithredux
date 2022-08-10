const isProduction = process.env.NODE_ENV === "production";

const devApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_DEV_BASE_URL,
};

const prodApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_PROD_BASE_URL,
};

const apiConfig = isProduction ? prodApiConfig : devApiConfig;

export { apiConfig };
