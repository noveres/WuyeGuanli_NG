import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { CarfeeService } from '../../../services/carfee.service';

@Component({
  selector: 'app-carfeechart',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './carfeechart.component.html',
  styleUrl: './carfeechart.component.scss'
})
export class CarfeechartComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart') private pieChartRef!: ElementRef;
  @ViewChild('barChart') private barChartRef!: ElementRef;
  @ViewChild('relationChart') private relationChartRef!: ElementRef;

  private pieChart: Chart | undefined;
  private barChart: Chart | undefined;
  private relationChart: Chart | undefined;

  private chartData: any[] = [];

  constructor(private carfeeService: CarfeeService) { }

  ngOnInit(): void {
    this.loadChartData();
  }

  ngAfterViewInit(): void {
    // 圖表將在數據載入後初始化
  }

  loadChartData(): void {
    this.carfeeService.getAllFees().subscribe({
      next: (data) => {
        this.chartData = data;
        this.initializeCharts();
      },
      error: (error) => {
        console.error('載入圖表資料失敗', error);
      }
    });
  }

  initializeCharts(): void {
    // 確保 DOM 元素存在且數據已載入
    if (this.pieChartRef && this.barChartRef && this.relationChartRef && this.chartData.length > 0) {
      this.initializePieChart();
      this.initializeBarChart();
      this.initializeRelationChart();
    } else {
      // 若 DOM 元素尚未準備好，等待下一個渲染週期
      setTimeout(() => this.initializeCharts(), 100);
    }
  }

  initializePieChart(): void {
    // 處理圓餅圖數據
    const paidCount = this.chartData.filter(item => item.paid).length;
    const unpaidCount = this.chartData.length - paidCount;

    const ctx = this.pieChartRef.nativeElement.getContext('2d');

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['已繳清', '未繳清'],
        datasets: [{
          data: [paidCount, unpaidCount],
          backgroundColor: ['#43a882', '#ff7f7f']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // 允許自訂高度
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: '停車費繳納狀態分布'
          }
        }
      }
    });
  }

  initializeBarChart(): void {
    // 處理條形圖數據
    const totalFee = this.chartData.reduce((sum, item) => sum + item.parkingFee, 0);
    const paidFee = this.chartData.reduce((sum, item) => {
      return sum + (item.paid ? item.parkingFee : 0);
    }, 0);

    // 計算已繳比率
    const paidRatio = totalFee > 0 ? (paidFee / totalFee * 100).toFixed(1) : '0';

    const ctx = this.barChartRef.nativeElement.getContext('2d');

    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['停車費'],
        datasets: [
          { data: [totalFee], label: '應繳總額', backgroundColor: '#3eccf7' },
          { data: [paidFee], label: `已繳總額 (${paidRatio}%)`, backgroundColor: '#e09ffc' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '金額 (元)'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: '應繳與已繳金額對比'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw as number;
                const datasetLabel = context.dataset.label || '';
                return `${datasetLabel}: ${value} 元`;
              }
            }
          }
        }
      }
    });
  }

  initializeRelationChart(): void {
    // 取前10000個車位資料
    const top10Data = this.chartData.slice(0, 10000);

    // 使用 owner 欄位作為用戶資訊
    const ctx = this.relationChartRef.nativeElement.getContext('2d');

    if (this.relationChart) {
      this.relationChart.destroy();
    }

    // 使用水平長條圖顯示停車位與擁有者的關係
    this.relationChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: top10Data.map(item => item.parking),
        datasets: [{
          label: '應繳金額',
          data: top10Data.map(item => item.parkingFee),
          backgroundColor: top10Data.map(item =>
            item.paid ? 'rgba(124, 236, 127, 0.7)' : 'rgba(255, 172, 121, 0.7)'
          ),
          borderColor: top10Data.map(item =>
            item.paid ? 'rgb(76, 175, 80)' : 'rgb(244, 67, 54)'
          ),
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // 水平長條圖
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: '應繳金額 (元)'
            }
          },
          y: {
            title: {
              display: true,
              text: '停車位'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: '停車位付款狀態分析'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const index = context.dataIndex;
                const item = top10Data[index];
                const userInfo = item.owner || '未設定用戶';
                const status = item.paid ? '已繳費' : '未繳費';
                return [
                  `金額: ${item.parkingFee} 元`,
                  `用戶: ${userInfo}`,
                  `狀態: ${status}`
                ];
              }
            }
          }
        }
      }
    });
  }
}