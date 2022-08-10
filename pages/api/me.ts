import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: any, res: NextApiResponse) {
 
  const { headers } = req;
  try {
    const { data } = await axios.get("http://localhost:5001/api/v1/users/me", {
      headers,
    });
    res.send(data);
  } catch ({ response: { status, data } }) {
    res.status(status).json(data);
  }
}
