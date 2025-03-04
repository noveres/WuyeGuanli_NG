export type AnnouncementType = '社區活動' | '維修通知' | '其他';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: Date;
  type: AnnouncementType;
  imageUrl?: string;
}
