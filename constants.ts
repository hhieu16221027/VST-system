
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

export const AUTH_KEY = 'hand_hygiene_auth_v2';

export const ALLOWED_USERS = [
  { username: 'hhieu.ksnk', password: 'hohieuksnk', fullName: 'Hồ Hiếu', role: 'admin' },
  { username: 'ntbthuy.ksnk', password: 'nguyenthibichthuyksnk', fullName: 'Nguyễn Thị Bích Thuỷ', role: 'observer' },
  { username: 'cpduyen', password: 'camphuongduyenksnk', fullName: 'Cam Phương Duyên', role: 'observer' }
  { username: 'ttbphuong.ksnk', password: 'tranthibichphuongksnk', fullName: 'Trần Thị Bích Phương', role: 'observer' }
  { username: 'pthien.ksnk', password: 'phamthihienksnk', fullName: 'Phạm Thị Hiền', role: 'observer' }
  { username: 'vttam.ksnk', password: 'vothitamksnk', fullName: 'Võ Thị Tâm', role: 'observer' }
];
