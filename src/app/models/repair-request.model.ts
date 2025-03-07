export interface RepairRequest {
  id?: number;
  cost?: number;
  create_time?: string;  // 改為 string 類型
  description: string;
  isRepaired: number;
  photo1?: string;
  photo2?: string;
  process_time?: string;  // 改為 string 類型
  sort: string;
  status: string;
  location: string;
}

export type RepairSort = '水電相關' | '設備相關' | '結構相關' | '其他';
export type RepairStatus = '待處理' | '處理中' | '已完成' | '已拒絕';
