export interface ChecklistItem {
  id: number;
  name: string;
  category: string;
  condition: 'B' | 'TB' | 'N' | null; // B = Baik, TB = Tidak Baik, N = Not Available/Tidak Dijumpai
}

export interface ChecklistForm {
  documentNumber: string;
  dateTime: string;
  driverName: string;
  vehicleLocation: string;
  departureKm: number;
  exitTime: string;
  cargoType: string;
  roadPermitNumber: string;
  items: ChecklistItem[];
  lainLainText: string; // Field khusus untuk input text "Lain-lain"
  notes: string;
  inspectedBy: string;
  driverSignature: string;
  driverSignatureName: string;
  inspectorSignature: string;
  distributionSignature: string;
  distributionSignatureName: string;
  disposalFromDistribution: {
    suitableRoad: boolean;
    canTravel: boolean;
    repairNotes: string;
    estimatedRepairDate: string;
    notSuitableRoad: boolean;
    repairCanContinue: boolean;
    repairContinueDate: string;
  };
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // I. APD PERSONAL
  { id: 1, name: 'Helm Safety', category: 'APD Personal', condition: null },
  { id: 2, name: 'Pelindung Mata (Face Shield) / Kacamata', category: 'APD Personal', condition: null },
  { id: 3, name: 'Tutup Telinga (Ear Plug)', category: 'APD Personal', condition: null },
  { id: 4, name: 'Sarung Tangan', category: 'APD Personal', condition: null },
  { id: 5, name: 'Sepatu Safety', category: 'APD Personal', condition: null },
  { id: 6, name: 'Seragam Kerja', category: 'APD Personal', condition: null },
  { id: 7, name: 'Jas Hujan', category: 'APD Personal', condition: null },

  // II. DOKUMEN KENDARAAN
  { id: 8, name: 'SIM', category: 'Dokumen Kendaraan', condition: null },
  { id: 9, name: 'STNK', category: 'Dokumen Kendaraan', condition: null },
  { id: 10, name: 'Buku KIR / KEUR', category: 'Dokumen Kendaraan', condition: null },
  { id: 11, name: 'Surat Ijin Pengangkutan B3', category: 'Dokumen Kendaraan', condition: null },
  { id: 12, name: 'Sertifikat Tanki (Bejana Tekan)', category: 'Dokumen Kendaraan', condition: null },
  { id: 13, name: 'Map / Dokumen SOP Kendaraan', category: 'Dokumen Kendaraan', condition: null },

  // III. PERLENGKAPAN KENDARAAN
  { id: 14, name: 'Obat P3K', category: 'Perlengkapan Kendaraan', condition: null },
  { id: 15, name: 'Plat No. Depan + Belakang', category: 'Perlengkapan Kendaraan', condition: null },
  { id: 16, name: 'Ban Cadangan', category: 'Perlengkapan Kendaraan', condition: null },
  { id: 17, name: 'APAR', category: 'Perlengkapan Kendaraan', condition: null },
  { id: 18, name: 'Dongkrak + Tangkai Dongkrak', category: 'Perlengkapan Kendaraan', condition: null },
  { id: 19, name: 'Kunci Roda', category: 'Perlengkapan Kendaraan', condition: null },
  { id: 20, name: 'Segitiga Pengaman', category: 'Perlengkapan Kendaraan', condition: null },
  { id: 21, name: 'Ganjal Ban (2 buah)', category: 'Perlengkapan Kendaraan', condition: null },
  { id: 22, name: 'Perkakas', category: 'Perlengkapan Kendaraan', condition: null },
  { id: 23, name: 'Lampu Senter', category: 'Perlengkapan Kendaraan', condition: null },

  // IV. FISIK MOBIL DAN TANKI
  { id: 24, name: 'Air radiator', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 25, name: 'Oli Mesin', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 26, name: 'Minyak Rem', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 27, name: 'Minyak Kopling', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 28, name: 'Air Pembersih Kaca', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 29, name: 'Bahan Bakar', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 30, name: 'Fungsi Gas, Rem, Kopling, Wiper', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 31, name: 'Indikator Temperatur Mesin', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 32, name: 'Indikator Rem, RPM, Accu', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 33, name: 'Lampu (Dasboard, Plafon, Baca)', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 34, name: 'Lampu (Jauh, Dekat, Kota, Mundur)', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 35, name: 'Lampu (Rem, Kabut, Kuning, Sein)', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 36, name: 'Klakson', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 37, name: 'Sabuk Pengaman', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 38, name: 'Rem Tangan', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 39, name: 'Kaca (Jendela + Dpn + Blkg)', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 40, name: 'Kaca Spion (Dalam + Kiri + Kanan)', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 41, name: 'Ban (Fisik, Tekanan & Baut Roda)', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 42, name: 'Valve Tanki (Lorry)', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 43, name: 'Pressure Indikator (Tank)', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 44, name: 'Level Indikator (Tank)', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 45, name: 'Crane / Tailgate / Hidrolik', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 46, name: 'Speedometer', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 47, name: 'Koneksi GPS (jika ada)', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 48, name: 'Segel / Blok Off', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 49, name: 'Kebersihan & Kondisi Kabin', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 50, name: 'Body Kendaraan', category: 'Fisik Mobil dan Tanki', condition: null },
  { id: 51, name: 'Lain-lain', category: 'Fisik Mobil dan Tanki', condition: null }
];
