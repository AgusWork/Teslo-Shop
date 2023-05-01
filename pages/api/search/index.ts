import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string
}

export default function BadSearch(req: NextApiRequest, res: NextApiResponse<Data>) {
    res.status(400).json({ message: "Debe especificar el mensaje de busqueda" })
}