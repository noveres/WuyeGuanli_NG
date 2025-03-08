export interface RepairRequest {
  id?: number;
  cost?: number;
  createTime?: string;  // 改為與後端一致的命名
  description: string;
  isRepaired: number;
  photo1?: string;
  photo2?: string;
  processTime?: string;  // 改為與後端一致的命名
  sort: '水電相關' | '設備相關' | '結構相關' | '其他';
  status: string;
  location: string;
}

export type RepairSort = '水電相關' | '設備相關' | '結構相關' | '其他';
export type RepairStatus = '待處理' | '處理中' | '已完成' | '已拒絕';
