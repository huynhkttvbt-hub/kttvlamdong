
import React from 'react';

export const HOURLY_COLUMNS = [
  "00h", "01h", "02h", "03h", "04h", "05h", "06h", "07h", 
  "08h", "09h", "10h", "11h", "12h", "13h", "14h", "15h", 
  "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h"
];

export const EXTRA_COLUMNS = [
  "D1", "TgD1", "D2", "TgD2", "D3", "TgD3", 
  "C1", "TgC1", "C2", "TgC2", "C3", "TgC3",
  "Htb", "Hmax", "TgMax", "Hmin", "TgMin", 
  "R1", "R7", "R13", "R19", "R24"
];

export const APP_LOGO = (
  <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
    <path d="M8 3c0 4 8 4 8 8s-8 4-8 8" stroke="currentColor" strokeOpacity="0.5" />
  </svg>
);

export const STATIONS = [
  "TV Tà Pao",
  "Đại Ninh",
  "Liên Khương",
  "Bảo Lộc",
  "Đà Lạt",
  "Cát Tiên"
];

export const PROVINCE_GROUPS = [
  "Lâm Đồng",
  "Đắk Lắk",
  "Gia Lai",
  "Kon Tum"
];
