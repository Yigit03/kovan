// Express framework’ünü ve Request/Response tiplerini import eder
import express, { Request, Response } from 'express';

// Cross-Origin Resource Sharing (CORS) desteği için gerekli middleware’i import eder
import cors from 'cors';

// Ortam değişkenlerini .env dosyasından yüklemek için dotenv kütüphanesini import eder
import dotenv from 'dotenv';

// Authentication ile ilgili route tanımlarını içeren modülü import eder
import authRoutes from './routes/authRoutes';

// .env dosyasındaki ortam değişkenlerini process.env içerisine yükler
dotenv.config();

// Yeni bir Express uygulama instance’ı oluşturur
const app = express();

// Sunucunun dinleyeceği port bilgisini ortam değişkenlerinden alır
// Eğer tanımlı değilse varsayılan olarak 3000 kullanılır
const PORT = process.env.PORT || 3000;

// Global middleware tanımları başlangıcı

// Tüm origin’lerden gelen HTTP isteklerine izin verir
// API’nin frontend uygulamalar tarafından erişilebilir olmasını sağlar
app.use(cors());

// Gelen request body’lerini JSON formatında parse eder
// req.body üzerinden erişilebilir hale getirir
app.use(express.json());

// Route tanımları başlangıcı

// /api/auth ile başlayan tüm istekleri authRoutes modülüne yönlendirir
// Login, register vb. authentication endpoint’leri burada toplanır
app.use('/api/auth', authRoutes);

// Health check endpoint tanımı
// Uygulamanın ayakta olup olmadığını kontrol etmek için kullanılır
app.get('/health', (req: Request, res: Response) => {

  // HTTP 200 (OK) status kodu ile JSON response döner
  res.status(200).json({

    // API’nin genel durumunu belirtir
    status: 'success',

    // API’nin çalıştığını ifade eden bilgilendirici mesaj
    message: 'Kovan API is running! 🐝',

    // Endpoint çağrıldığı andaki server timestamp’ini ISO formatında döner
    timestamp: new Date().toISOString(),

    // Uygulamanın hangi ortamda çalıştığını belirtir (development, production vb.)
    environment: process.env.NODE_ENV
  });
});

// 404 (Not Found) handler middleware’i
// Tanımlı olmayan tüm route’lar için çalışır
app.use((req: Request, res: Response) => {

  // HTTP 404 status kodu ile hata response’u döner
  res.status(404).json({

    // Hata durumunu belirten status alanı
    status: 'error',

    // İstek yapılan route’un bulunamadığını ifade eden mesaj
    message: 'Route not found'
  });
});

// HTTP sunucusunu belirtilen port üzerinde başlatır
app.listen(PORT, () => {

  // Sunucunun başarıyla ayağa kalktığını loglar
  console.log(`🚀 Server is running on http://localhost:${PORT}`);

  // Aktif çalışma ortamını loglar
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);

  // Health check endpoint’inin adresini loglar
  console.log(`✅ Health check: http://localhost:${PORT}/health`);

  // Authentication login endpoint’inin adresini loglar
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth/login`);
});
