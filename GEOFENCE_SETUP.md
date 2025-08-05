# Geofence Setup Guide - Truck Management System

## Overview
Sistem geofence telah diimplementasikan untuk memastikan bahwa user hanya dapat login dari lokasi yang diizinkan. Sistem ini menggunakan HTML5 Geolocation API untuk mendapatkan lokasi pengguna dan memvalidasinya terhadap daftar lokasi yang telah ditentukan.

## Fitur Geofence

### 1. Login dengan Validasi Lokasi
- Pengguna harus berada dalam radius yang ditentukan dari lokasi yang diizinkan
- Sistem akan mengecek koordinat GPS pengguna saat login
- Login akan ditolak jika pengguna berada di luar area yang diizinkan

### 2. Guard Protection
- Semua route protected dengan `geofenceGuard`
- User akan di-redirect ke login jika lokasi tidak valid
- Automatic logout jika validasi lokasi gagal

### 3. Real-time Location Validation
- Widget user info menampilkan lokasi login saat ini
- Tombol "Validate Location" untuk mengecek ulang lokasi
- Auto-logout jika validasi lokasi gagal

## Konfigurasi Lokasi

### File: `src/app/services/geolocation.service.ts`

Lokasi yang diizinkan dikonfigurasi dalam array `allowedLocations`:

```typescript
private allowedLocations: GeofenceLocation[] = [
  {
    name: 'Kantor Pusat',
    latitude: -6.2088, // Koordinat Jakarta
    longitude: 106.8456,
    radius: 100 // 100 meter radius
  },
  {
    name: 'Depot 1',
    latitude: -6.3701, // Koordinat Depok
    longitude: 106.8329,
    radius: 150 // 150 meter radius
  },
  {
    name: 'Depot 2',
    latitude: -6.1944, // Koordinat Tangerang
    longitude: 106.6840,
    radius: 200 // 200 meter radius
  }
];
```

### Cara Menambah Lokasi Baru
1. Dapatkan koordinat GPS lokasi (gunakan Google Maps)
2. Tentukan radius area yang diizinkan (dalam meter)
3. Tambahkan ke array `allowedLocations`

```typescript
{
  name: 'Depot Baru',
  latitude: -6.xxxx,
  longitude: 106.xxxx,
  radius: 100
}
```

## User Credentials

### Demo Accounts:
- **Driver**: `driver1` / `pass123`
- **Supervisor**: `supervisor` / `admin123`
- **Admin**: `admin` / `admin`

## Cara Menggunakan

### 1. Login
1. Buka aplikasi di browser
2. Klik salah satu tombol demo credentials atau input manual
3. Klik "Login with Location Check"
4. Browser akan meminta permission untuk mengakses lokasi
5. Allow location access
6. Sistem akan memvalidasi lokasi dan kredensial
7. Login berhasil jika berada dalam area yang diizinkan

### 2. Cek Lokasi Tanpa Login
- Klik "📍 Check My Location" untuk melihat lokasi saat ini
- Menampilkan koordinat dan jarak ke lokasi terdekat yang diizinkan

### 3. Validasi Ulang Lokasi
- Setelah login, gunakan widget User Info
- Klik "🔄 Validate Location" untuk cek ulang lokasi
- Auto-logout jika lokasi tidak valid

## Troubleshooting

### 1. Location Access Denied
**Problem**: Browser tidak dapat mengakses lokasi
**Solution**:
- Pastikan HTTPS digunakan (required for geolocation)
- Enable location permission di browser settings
- Refresh page dan allow location access

### 2. GPS Tidak Akurat
**Problem**: Lokasi tidak akurat atau tidak stabil
**Solution**:
- Pastikan GPS device aktif
- Gunakan di area outdoor untuk signal GPS yang baik
- Increase radius allowedLocation jika perlu

### 3. Login Gagal Meski di Lokasi yang Benar
**Problem**: Login ditolak padahal berada di lokasi yang benar
**Solution**:
- Cek accuracy GPS (biasanya 5-20 meter)
- Sesuaikan radius lokasi dengan accuracy GPS
- Cek koordinat lokasi di Google Maps

## Browser Compatibility

### Supported Browsers:
- ✅ Chrome 50+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 12+

### Requirements:
- HTTPS connection (required for geolocation)
- Location permission enabled
- GPS/Location services active on device

## Security Considerations

### 1. HTTPS Only
- Geolocation API hanya bekerja dengan HTTPS
- Tidak akan berfungsi di HTTP (kecuali localhost)

### 2. User Permission
- User harus explicitly allow location access
- Cannot force location access

### 3. Privacy
- Lokasi user disimpan sementara di localStorage
- Tidak dikirim ke server external
- Cleared saat logout

## Development Setup

### 1. Local Testing
```bash
# Run dengan HTTPS untuk testing geolocation
ng serve --ssl
```

### 2. Production Deployment
- Pastikan domain menggunakan HTTPS
- Configure SSL certificate
- Test geolocation functionality

## API Reference

### GeolocationService Methods:
- `getCurrentLocation()`: Get user's current position
- `validateLocationForLogin()`: Validate location for login
- `isWithinAllowedArea()`: Check if location is within geofence
- `getAllowedLocations()`: Get list of allowed locations

### AuthService Methods:
- `login()`: Login with geofence validation
- `revalidateLocation()`: Re-check location for logged in user
- `logout()`: Logout and clear session

## Future Improvements

### 1. Server-side Validation
- Move location validation to backend
- Store location logs for audit

### 2. Dynamic Location Management
- Admin interface untuk manage allowed locations
- Real-time location tracking

### 3. Advanced Features
- Multiple location types (office, warehouse, etc.)
- Time-based location restrictions
- Location-based role permissions

## Contact & Support

Untuk pertanyaan atau issue terkait geofence system, silakan contact development team.
