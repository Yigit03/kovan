// Express framework’ünden Request ve Response tiplerini import eder
import { Request, Response } from 'express';

// Şifre hash karşılaştırması yapmak için bcryptjs kütüphanesini import eder
import bcrypt from 'bcryptjs';

// E-posta adresine göre kullanıcıyı bulan yardımcı fonksiyonu import eder
import { findUserByEmail } from '../data';

// JWT token üretiminden sorumlu utility fonksiyonunu import eder
import { generateToken } from '../utils/jwt';

// Login request body ve authentication response yapısını tanımlayan tipleri import eder
import { LoginRequest, AuthResponse } from '../types';

// Login işlemini yöneten controller fonksiyonunu dışa aktarır
export const login = async (req: Request, res: Response): Promise<void> => {
  try {

    // Request body içerisinden email ve password alanlarını LoginRequest tipine cast ederek alır
    const { email, password } = req.body as LoginRequest;

    // 1. Validasyon: Email ve password alanlarının gönderilip gönderilmediğini kontrol eder
    if (!email || !password) {

      // Eksik veri varsa HTTP 400 (Bad Request) döner
      res.status(400).json({

        // Hata durumunu belirten status alanı
        status: 'error',

        // İstemciye gönderilen açıklayıcı hata mesajı
        message: 'Email and password are required'
      } as AuthResponse);

      // Fonksiyonun devam etmesini engeller
      return;
    }

    // 2. Kullanıcıyı e-posta adresine göre mock data üzerinden arar
    const user = findUserByEmail(email);

    // Kullanıcı bulunamazsa authentication hatası döner
    if (!user) {

      // HTTP 401 (Unauthorized) status kodu ile response döner
      res.status(401).json({

        // Hata durumunu belirten status alanı
        status: 'error',

        // Güvenlik amacıyla spesifik hata vermeden genel mesaj döner
        message: 'Invalid email or password'
      } as AuthResponse);

      // Fonksiyonun çalışmasını sonlandırır
      return;
    }

    // 3. Gönderilen şifre ile veritabanında saklanan hash’li şifreyi karşılaştırır
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Şifreler eşleşmiyorsa authentication hatası döner
    if (!isPasswordValid) {

      // HTTP 401 (Unauthorized) status kodu ile response döner
      res.status(401).json({

        // Hata durumunu belirten status alanı
        status: 'error',

        // Güvenlik nedeniyle yine aynı genel hata mesajı kullanılır
        message: 'Invalid email or password'
      } as AuthResponse);

      // Fonksiyonun devam etmesini engeller
      return;
    }

    // 4. Kullanıcı bilgilerini içeren JWT token oluşturur
    const token = generateToken({

      // Token payload’ında kullanıcı kimliği yer alır
      userId: user.id,

      // Token payload’ında kullanıcının e-posta adresi yer alır
      email: user.email,

      // Token payload’ında kullanıcının rol bilgisi yer alır
      role: user.role
    });

    // 5. Başarılı giriş durumunda response oluşturur
    // Güvenlik nedeniyle şifre bilgisi asla response’a eklenmez
    res.status(200).json({

      // Başarılı işlem durumunu belirtir
      status: 'success',

      // İstemciye gönderilen bilgilendirici mesaj
      message: 'Login successful',

      // Response data alanı
      data: {

        // İstemciye döndürülen kullanıcı bilgileri
        user: {

          // Kullanıcının benzersiz kimliği
          id: user.id,

          // Kullanıcının e-posta adresi
          email: user.email,

          // Kullanıcının tam adı
          fullName: user.fullName,

          // Kullanıcının sistemdeki rolü
          role: user.role,

          // Kullanıcının hesap oluşturulma tarihi
          createdAt: user.createdAt

          // password YOK! (güvenlik)
        },

        // Authentication sonrası kullanılacak JWT token
        token
      }
    } as AuthResponse);

  } catch (error) {

    // Login işlemi sırasında oluşabilecek beklenmeyen hataları loglar
    console.error('Login error:', error);

    // HTTP 500 (Internal Server Error) status kodu ile response döner
    res.status(500).json({

      // Hata durumunu belirten status alanı
      status: 'error',

      // Genel sunucu hatası mesajı
      message: 'Internal server error'
    } as AuthResponse);
  }
};
