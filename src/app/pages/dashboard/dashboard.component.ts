import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { AnnouncementService } from '../../services/announcement.service';
import { UserService } from '../../services/user.service';
import { RepairService } from '../../services/repair.service';
import { ApiService } from '../../services/Api';
import { CarfeeService } from '../../services/carfee.service';
import { HttpServiceService } from '../../services/http-service.service';
import { Announcement, AnnouncementType } from '../../models/announcement.model';
import { RepairRequest } from '../../models/repair-request.model';

interface DashboardAnnouncement {
  id: number;
  date: string;
  sort: string;
  header: string;
  content: string;
  imgUrl: string | null;
}

interface DashboardStats {
  totalVisitors: number;
  currentVisitors: number;
  leftVisitors: number;
  totalParkingSpaces: number;
  paidParkingSpaces: number;
  parkingPaymentRate: number;
  totalRepairs: number;
  completedRepairs: number;
  repairCompletionRate: number;
  totalIncome: number;
  totalExpenditure: number;
  incomeExpenditureRatio: number;
  visitorRate: number;
  totalRentals: number;
  returnedRentals: number;
  rentalReturnRate: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName = '系統管理員';
  userRole = '系統管理員';
  announcements: DashboardAnnouncement[] = [];
  repairRequests: RepairRequest[] = [];
  repairCount = 0;
  stats: DashboardStats = {
    totalVisitors: 0,
    currentVisitors: 0,
    leftVisitors: 0,
    totalParkingSpaces: 0,
    paidParkingSpaces: 0,
    parkingPaymentRate: 0,
    totalRepairs: 0,
    completedRepairs: 0,
    repairCompletionRate: 0,
    totalIncome: 0,
    totalExpenditure: 0,
    incomeExpenditureRatio: 0,
    visitorRate: 0,
    totalRentals: 0,
    returnedRentals: 0,
    rentalReturnRate: 0
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private repairService: RepairService,
    private announcementService: AnnouncementService,
    private apiService: ApiService,
    private carfeeService: CarfeeService,
    private httpService: HttpServiceService
  ) {}

  ngOnInit() {
    this.loadAnnouncements();
    this.updateUserInfo();
    this.loadRepairRequests();
    this.loadVisitorStats();
    this.loadParkingStats();
    this.loadFinancialStats();
    this.loadRentalStats();
  }

  private updateUserInfo(): void {
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');

    if (userName && userName.trim() !== '') {
      this.userName = userName;
    }

    if (userRole && userRole.trim() !== '') {
      if (userRole === 'admin') {
        this.userRole = '系統管理員';
      } else if (userRole === 'staff') {
        this.userRole = '工作人員';
      } else {
        this.userRole = userRole;
      }
    }
  }

  loadParkingStats() {
    this.carfeeService.getAllFees().subscribe({
      next: (data: any[]) => {
        this.stats.totalParkingSpaces = data.length;
        this.stats.paidParkingSpaces = data.filter(item => item.paid).length;
        this.stats.parkingPaymentRate = this.stats.totalParkingSpaces > 0 
          ? (this.stats.paidParkingSpaces / this.stats.totalParkingSpaces) * 100 
          : 0;
      },
      error: (error) => {
        console.error('獲取停車費統計失敗:', error);
      }
    });
  }

  loadVisitorStats() {
    this.apiService.getApi("http://localhost:8585/api/visitors/getAll").subscribe({
      next: (res: any) => {
        if (res && res.visitorRecords) {
          this.stats.totalVisitors = res.visitorRecords.length;
          this.stats.currentVisitors = res.visitorRecords.filter((v: any) => 
            v.visitorTime === v.outTime).length;
          this.stats.leftVisitors = this.stats.totalVisitors - this.stats.currentVisitors;
          // 計算在場訪客比率
          this.stats.visitorRate = this.stats.totalVisitors > 0 
            ? (this.stats.currentVisitors / this.stats.totalVisitors) * 100 
            : 0;
        }
      },
      error: (error) => {
        console.error('獲取訪客統計失敗:', error);
      }
    });
  }

  loadFinancialStats() {
    const searchValue = {
      name: "",
      sDate: "",
      eDate: ""
    };
    
    this.httpService.PostApi('http://localhost:8585/Financial/search', searchValue).subscribe({
      next: (res: any) => {
        if (res && res.financials) {
          this.stats.totalIncome = res.financials.reduce((sum: number, item: any) => 
            sum + (item.income || 0), 0);
          this.stats.totalExpenditure = res.financials.reduce((sum: number, item: any) => 
            sum + (item.expenditure || 0), 0);
          
          // 計算收支比
          this.stats.incomeExpenditureRatio = this.stats.totalExpenditure > 0 
            ? (this.stats.totalIncome / this.stats.totalExpenditure) * 100 
            : 0;
        }
      },
      error: (error) => {
        console.error('獲取財務統計失敗:', error);
      }
    });
  }

  loadAnnouncements() {
    this.announcementService.getAnnouncements().subscribe({
      next: (announcements: Announcement[]) => {
        this.announcements = announcements
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
          .map(announcement => ({
            id: announcement.id,
            date: announcement.date.toString(),
            sort: announcement.type,
            header: announcement.title,
            content: announcement.content,
            imgUrl: announcement.imageUrl || null
          }));
      },
      error: (error) => {
        console.error('獲取公告失敗:', error);
      }
    });
  }

  loadRepairRequests() {
    this.repairService.getAllRepairRequests().subscribe({
      next: (repairs: RepairRequest[]) => {
        this.repairRequests = repairs;
        this.repairCount = repairs.length;
        this.stats.totalRepairs = repairs.length;
        this.stats.completedRepairs = repairs.filter(repair => repair.status === '已完成').length;
        this.stats.repairCompletionRate = this.stats.totalRepairs > 0 
          ? (this.stats.completedRepairs / this.stats.totalRepairs) * 100 
          : 0;
      },
      error: (error) => {
        console.error('獲取維修請求失敗:', error);
      }
    });
  }

  loadRentalStats() {
    this.httpService.GetApi<any[]>('http://localhost:8585/rental/whorentalallinfo').subscribe({
      next: (data) => {
        if (data) {
          this.stats.totalRentals = data.length;
          this.stats.returnedRentals = data.filter(item => item.returnYorN).length;
          this.stats.rentalReturnRate = this.stats.totalRentals > 0 
            ? (this.stats.returnedRentals / this.stats.totalRentals) * 100 
            : 0;
        }
      },
      error: (error) => {
        console.error('獲取租賃統計失敗:', error);
      }
    });
  }

  getRepairCountByType(type: string): number {
    return this.repairRequests.filter(repair => repair.sort === type).length;
  }

  getRepairCountByStatus(status: string): number {
    return this.repairRequests.filter(repair => repair.status === status).length;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
