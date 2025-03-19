import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-float-buttons',
  templateUrl: './float-buttons.component.html',
  styleUrls: ['./float-buttons.component.scss']
})
export class FloatButtonsComponent implements OnInit {
  showTopButton = false;  // 用來顯示置頂按鈕
  scrollThreshold = 300;  // 滾動距離達到300px後顯示置頂按鈕
  private mainContentEl: HTMLElement | null = null;

  constructor(
    private location: Location,  // 用於返回上一頁功能
    private elementRef: ElementRef  // 用於更精確地獲取元素
  ) {}

  ngOnInit() {
    // 在組件初始化後尋找主內容元素
    setTimeout(() => {
      this.mainContentEl = document.querySelector('.main-content');
      // 如果找不到 .main-content，則使用 document 作為備選
      if (!this.mainContentEl) {
        console.warn('找不到 .main-content 元素，將監聽整個文檔的滾動事件');
      }
      
      // 初始檢查滾動位置
      this.checkScrollPosition();
      
      // 為特定容器添加滾動監聽 (如果存在)
      if (this.mainContentEl) {
        this.mainContentEl.addEventListener('scroll', this.checkScrollPosition.bind(this));
      }
    }, 500);
  }

  // 檢查滾動位置 (同時支援 window 和 .main-content)
  checkScrollPosition() {
    let scrollPosition = 0;
    
    if (this.mainContentEl) {
      scrollPosition = this.mainContentEl.scrollTop;
    } else {
      scrollPosition = window.scrollY || document.documentElement.scrollTop;
    }
    
    this.showTopButton = scrollPosition > this.scrollThreshold;
  }

  // 監聽窗口的滾動事件 (保留原有功能，同時更新檢查邏輯)
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (!this.mainContentEl) {
      // 如果沒有找到主內容元素，則使用 window 滾動
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      this.showTopButton = scrollPosition > this.scrollThreshold;
    }
  }

  // 滾動到頁面頂部
  scrollToTop() {
    if (this.mainContentEl) {
      this.mainContentEl.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // 備選方案：滾動整個頁面
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  // 滾動到頁面底部
  scrollToBottom() {
    if (this.mainContentEl) {
      this.mainContentEl.scrollTo({
        top: this.mainContentEl.scrollHeight,
        behavior: 'smooth'
      });
    } else {
      // 備選方案：滾動整個頁面
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  // 返回上一頁功能
  goBack() {
    this.location.back();
  }

  // 組件銷毀時移除事件監聽器
  ngOnDestroy() {
    if (this.mainContentEl) {
      this.mainContentEl.removeEventListener('scroll', this.checkScrollPosition);
    }
  }
}