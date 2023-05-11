import type { NextApiRequest, NextApiResponse } from 'next'
import bcryptjs from 'bcryptjs';
import { db } from '@/database'
import { User } from '@/models'
import { jwt } from '@/utils';
import Redis from 'ioredis';

const redis = new Redis(); // crea una nueva instancia de Redis

type Data = 
| { message: string }
| {
    token: string;
    user: {
        email: string;
        name: string;
        role: string;
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return loginUser(req, res)

        default:
            res.status(400).json({
                message: 'El POST no ha podido ser efectuado, bad request'
            })
    }
}

const loginUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { email = '', password = ''  } = req.body;

    // busca la información del usuario en la caché de Redis
    const cachedUser = await redis.get(`user:${email}`);

    if (cachedUser) {
      const user = JSON.parse(cachedUser);
      const { role, name, _id } = user;

      const token = jwt.signToken(_id, email);

      return res.status(200).json({
        token, //jwt
        user: {
          email,
          role,
          name,
        },
      });
    }

    // si no se encuentra en la caché, busca la información del usuario en la base de datos
    await db.connect();
    const user = await User.findOne({ email });
    await db.disconnect();

    if ( !user ) {
        return res.status(400).json({ message: 'Correo o contraseña no válidos - EMAIL' })
    }
    
    if ( !bcryptjs.compareSync( password, user.password! ) ) {
        return res.status(400).json({ message: 'Correo o contraseña no válidos - Password' })
    }

    const { role, name, _id } = user;

    // agrega la información del usuario a la caché de Redis
    await redis.set(`user:${email}`, JSON.stringify(user));

    const token = jwt.signToken( _id, email );

    return res.status(200).json({
        token, //jwt
        user: {
            email, role, name
        }
    })


}