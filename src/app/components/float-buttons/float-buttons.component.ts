import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-float-buttons',
  templateUrl: './float-buttons.component.html',
  styleUrls: ['./float-buttons.component.scss']
})
export class FloatButtonsComponent {
  showTopButton = false;  // 用來顯示置頂按鈕
  scrollThreshold = 300;  // 滾動距離達到300px後顯示置頂按鈕

  // 監聽窗口的滾動事件
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const scrollPosition = window.scrollY;  // 當前滾動位置
    this.showTopButton = scrollPosition > this.scrollThreshold;  // 滾動超過300px顯示置頂按鈕
  }

  // 滾動到頁面頂部
  scrollToTop() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  // 滾動到頁面底部
  scrollToBottom() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTo({
        top: mainContent.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
}
