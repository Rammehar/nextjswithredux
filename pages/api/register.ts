import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: any, res: NextApiResponse) {
  const { headers, body } = req;

  try {
    const { data, headers: returnedHeaders } = await axios.post(
      "http://localhost:5001/api/v1/users",
      body,
      {
        headers,
      }
    );
    //  Update headers on requester using headers from Node.js server response
    Object.entries(returnedHeaders).forEach((keyArr) =>
      res.setHeader(keyArr[0], keyArr[1] as string)
    );
    res.send(data);
  } catch ({ response: { status, data } }) {
    res.status(status).json(data);
  }
}
