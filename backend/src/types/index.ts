// User entity’sinin TypeScript tip tanımını başlatır
// Bu yapı genellikle veritabanı modeliyle birebir eşleşir
export interface User {

    // Kullanıcının benzersiz kimliği (UUID veya string id)
    id: string;

    // Kullanıcının sisteme girişte kullandığı e-posta adresi
    email:string;

    // Kullanıcının hashlenmiş şifresi (plaintext asla saklanmaz)
    password:string;

    // Kullanıcının sistemde görünen adı ve soyadı
    fullName:string;

    // Kullanıcının yetki seviyesini belirten rol bilgisi
    // Sadece admin veya user olabilir (union type)
    role: 'admin' | 'user';

    // Kullanıcı kaydının oluşturulduğu tarih
    createdAt: Date;
}

// Login endpoint’ine gönderilen request body yapısını tanımlar
export interface LoginRequest {

    // Kullanıcının benzersiz kimliği
    // Not: Login request’lerinde genellikle zorunlu değildir
    userId: string;

    // Kullanıcının sisteme giriş için gönderdiği e-posta adresi
    email:string;
    password: string;
}

// JWT token içerisine gömülecek payload yapısını tanımlar
export interface JwtPayload {

    // Token sahibinin kullanıcı kimliği
    userId:string;

    // Token sahibinin e-posta adresi
    email:string;

    // Token sahibinin rol bilgisi (authorization için kullanılır)
    role:string;
}

// Authentication endpoint’lerinden dönen API response tiplerini tanımlar
export interface AuthResponse {

    // Response’un durumunu belirtir
    // success veya error değerlerinden birini alır
    status:'success' | 'error';

    // İstemciye döndürülen açıklayıcı mesaj
    message: string;

    // Başarılı işlemlerde dönen opsiyonel data alanı
    data?:{

        // Kullanıcı bilgileri
        // Omit<User, 'password'> ile şifre alanı response’tan çıkarılır
        user: Omit<User, 'password'>; // şifreyi döndürme

        // Authentication sonrası kullanılacak JWT token
        token: string;
    };
}
