// User tip tanımını içeren types dosyasını import eder
import {User} from "./types";

// Şifre hashleme ve karşılaştırma işlemleri için bcryptjs kütüphanesini import eder
import bcrypt from "bcryptjs";

// Mock kullanıcı verilerini tanımlayan dizi
// Gerçek bir veritabanı yerine test ve geliştirme amaçlı kullanılır
// Önemli: Şifreler plaintext değil, hashlenmiş şekilde saklanır
export const mockUsers: User[] = [
    {
    // Kullanıcının benzersiz kimliği
    id:'1',

    // Kullanıcının sisteme girişte kullanacağı e-posta adresi
    email: 'admin@kovan.com',

    // Kullanıcının şifresinin bcrypt algoritması ile hashlenmiş hali
    // İkinci parametre (10), salt round sayısını ifade eder
    password: bcrypt.hashSync('admin123', 10), //Hash: admin123

    // Kullanıcının sistemde görünen tam adı
    fullName:"Admin User",

    // Kullanıcının yetki seviyesini belirten rol bilgisi
    role: 'admin',

    // Kullanıcının sistemde oluşturulduğu tarih
    createdAt: new Date('2026-01-01')
    },
    {
    // Kullanıcının benzersiz kimliği
    id: '2',

    // Kullanıcının sisteme girişte kullanacağı e-posta adresi
    email: 'user@kovan.com',

    // Kullanıcının şifresinin bcrypt algoritması ile hashlenmiş hali
    // Hash işlemi senkron olarak gerçekleştirilir
    password: bcrypt.hashSync('user123', 10), // Hash: user123

    // Kullanıcının sistemde görünen tam adı
    fullName: 'Regular User',

    // Kullanıcının yetki seviyesini belirten rol bilgisi
    role: 'user',

    // Kullanıcının sistemde oluşturulduğu tarih
    createdAt: new Date('2024-01-15')
  }
];

// E-posta adresine göre kullanıcıyı bulan yardımcı fonksiyonu dışa aktarır
// Parametre olarak aranacak e-posta adresini alır
export const findUserByEmail = (email:string):User | undefined => {

    // mockUsers dizisi içinde e-posta adresi eşleşen ilk kullanıcıyı döndürür
    // Kullanıcı bulunamazsa undefined döner
    return mockUsers.find(user => user.email === email);
}
