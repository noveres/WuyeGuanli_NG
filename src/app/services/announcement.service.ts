import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Announcement } from '../models/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private announcements: Announcement[] = [];

  getAnnouncements(): Observable<Announcement[]> {
    return of(this.announcements);
  }

  addAnnouncement(announcement: Announcement): void {
    this.announcements.push(announcement);
  }

  updateAnnouncement(updatedAnnouncement: Announcement): void {
    const index = this.announcements.findIndex(a => a.id === updatedAnnouncement.id);
    if (index !== -1) {
      this.announcements[index] = updatedAnnouncement;
    }
  }

  deleteAnnouncement(id: number): void {
    this.announcements = this.announcements.filter(a => a.id !== id);
  }
}