import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: any, res: NextApiResponse) {
  const { headers } = req;
  try {
    const { data, headers: returnedHeaders } = await axios.post(
      "http://localhost:5001/api/v1/users/token/refresh",
      null,
      {
        headers,
      }
    );
     //  Update headers on requester using headers from Node.js server response
    Object.keys(returnedHeaders).forEach((key) =>
      res.setHeader(key, returnedHeaders[key])
    );
    res.status(200).json(data);
  } catch (err) {
    // throw new Error(error);
    res.status(err.response.status).json(err.response.data);
    // res.send(error);
  }
}
