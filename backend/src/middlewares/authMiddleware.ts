import {Request, Response, NextFunction} from "express";
import {verifyToken} from "../utils/jwt";
import { JwtPayload } from "../types";

//Request'e user eklemek için Typescript extend
declare global {
    namespace Express{
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try{
        //1.header den token al
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                status: 'error',
                message:'No token provided. Please login first.'
            });
            return;
        }
        // 2. "Bearer " kısmını çıkar
        const token = authHeader.split(' ')[1];

        // 3. Token'ı doğrula
        const decoded = verifyToken(token);

        // 4. Request'e user bilgisini ekle (controller'da kullanılacak)
        req.user = decoded;


        // 5. Bir sonraki middleware/controller'a geç
        next();
    }catch (error) {
        res.status(401).json({
            status: 'error',
            message:'Invalid or expired token. Please login again.'
        });
    }
};