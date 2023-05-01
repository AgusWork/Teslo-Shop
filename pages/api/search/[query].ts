import type { NextApiRequest, NextApiResponse } from "next";
import { db, SHOP_CONSTANTS } from "@/database";
import { IProduct } from "@/interfaces";
import { Product } from "../../../models";

type Data = | { message: string } | IProduct[] ;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    switch(req.method) {
        case "GET" : 
        return searchProducts(req, res)

        default:
            return res.status(400).json({
                message:"Bad request"
            })
    }
};
const searchProducts = async(req: NextApiRequest, res: NextApiResponse<Data>)  => {

    let { query = ""} = req.query;

    if( query.length === 0){
        return res.status(400).json({
            message:"Debe de escribir algun dato para la busqueda"
        })
    }

    query = query.toString().toLowerCase();

    await db.connect();

    const product = await Product.find({
        $text: { $search: query}
    }).select("title images price inStock slug -_id").lean();


    
    await db.disconnect();



    return res.status(200).json(product)

}

