
export interface User {
  username: string;
  fullName: string;
  role: 'admin' | 'observer';
}

export type Department = 
  | "Hồi sức cấp cứu" 
  | "Nội - Nhiễm" 
  | "Ngoại tổng hợp" 
  | "Phụ sản" 
  | "Nhi" 
  | "Răng - Hàm - Mặt" 
  | "Tai - Mũi - Họng" 
  | "Mắt";

export type Profession = "Bác sĩ" | "DD/HS/KTV" | "Hộ lý" | "Khác";

export type Indication = 
  | "Trước tiếp xúc người bệnh"
  | "Trước thủ thuật vô khuẩn/sạch"
  | "Sau khi có nguy cơ phơi nhiễm máu/dịch cơ thể"
  | "Sau tiếp xúc người bệnh"
  | "Sau tiếp xúc môi trường xung quanh người bệnh";

export type Action = 
  | "VST với cồn"
  | "VST với xà phòng và nước"
  | "Không VST"
  | "Mang găng và không VST";

export type Procedure = "Đúng" | "Sai" | null;

export interface Observation {
  id: string;
  staffName?: string;
  profession: Profession;
  indications: Indication[]; // Hỗ trợ nhiều chỉ định
  action: Action;
  procedure: Procedure;
}

export interface MonitoringSession {
  id: string;
  observer: string;
  date: string;
  department: Department;
  observations: Observation[];
  createdAt: string;
}
