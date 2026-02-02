
import { Department, Profession, Indication, Action } from './types';

export const DEPARTMENTS: Department[] = [
  "Hồi sức cấp cứu",
  "Nội - Nhiễm",
  "Ngoại tổng hợp",
  "Phụ sản",
  "Nhi",
  "Răng - Hàm - Mặt",
  "Tai - Mũi - Họng",
  "Mắt"
];

export const PROFESSIONS: Profession[] = ["Bác sĩ", "DD/HS/KTV", "Hộ lý", "Khác"];

export const INDICATIONS: Indication[] = [
  "Trước tiếp xúc người bệnh",
  "Trước thủ thuật vô khuẩn/sạch",
  "Sau khi có nguy cơ phơi nhiễm máu/dịch cơ thể",
  "Sau tiếp xúc người bệnh",
  "Sau tiếp xúc môi trường xung quanh người bệnh"
];

export const ACTIONS: Action[] = [
  "VST với cồn",
  "VST với xà phòng và nước",
  "Không VST",
  "Mang găng và không VST"
];

export const NON_HYGIENE_ACTIONS: Action[] = ["Không VST", "Mang găng và không VST"];
