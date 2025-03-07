export type AnnouncementType = '水電相關' | '住戶相關' | '維修相關' | '其他';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: Date;
  type: AnnouncementType;
  imageUrl?: string;
}
