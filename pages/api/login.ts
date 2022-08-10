/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: any, res: NextApiResponse) => {
 
  const { headers, body } = req;

  try {
    const { data, headers: returnedHeaders } = await axios.post(
      "http://localhost:5001/api/v1/users/login",
      body,
      { headers }
    );
    //  Update headers on requester using headers from Node.js server response
    Object.entries(returnedHeaders).forEach((keyArr) =>
      res.setHeader(keyArr[0], keyArr[1] as string)
    );
    res.send(data);
  } catch (err) {
    res.status(err.response.status).json(err.response.data);
  }
};
