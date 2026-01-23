// jsonwebtoken kütüphanesini import eder; JWT oluşturma ve doğrulama işlemlerini sağlar
import jwt, { SignOptions } from "jsonwebtoken";

// Token payload’ında kullanılacak tip tanımını içeren custom type’ı import eder
import {JwtPayload} from "../types";

// JWT imzalama ve doğrulama için kullanılacak gizli anahtarı ortam değişkenlerinden alır
// Eğer ortam değişkeni tanımlı değilse fallback-secret kullanılır (prod için önerilmez)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Token süresini belirler; bu ifade özellikle TypeScript + jsonwebtoken v9 uyumsuzluğunu çözmek için
// SignOptions["expiresIn"] tipine bilinçli olarak daraltılmıştır.
// process.env her zaman `string | undefined` döndüğü için, TypeScript aksi halde
// `jwt.sign` overload’larını eşleştiremez ve tip hatası üretir.
// `?? "7d"` kullanımı, sadece undefined/null durumunda varsayılan değeri atamak içindir.
const JWT_EXPIRES_IN: SignOptions["expiresIn"] = (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) ?? "7d";

// JWT token oluşturma fonksiyonunu dışa aktarır
// Parametre olarak token içine gömülecek payload’ı alır
export const generateToken = (payload: JwtPayload): string =>{

    // jwt.sign metodu ile payload’ı gizli anahtar kullanarak imzalar
    // expiresIn ayarı ile token’ın yaşam süresi belirlenir
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN 
    });
};

// Gönderilen JWT token’ı doğrulayan fonksiyonu dışa aktarır
// Parametre olarak istemciden gelen token string’ini alır
export const verifyToken = (token:string):JwtPayload => {

    try{
        // Token’ı gizli anahtar ile doğrular
        // Token geçerliyse decode edilmiş payload döner
        return jwt.verify(token, JWT_SECRET) as JwtPayload;

    } catch(error){
        // Token geçersiz, süresi dolmuş veya bozulmuşsa hata fırlatır
        // Bu hata genellikle authentication middleware’lerinde yakalanır
        throw new Error('Invalid or expired token');
    }
};
