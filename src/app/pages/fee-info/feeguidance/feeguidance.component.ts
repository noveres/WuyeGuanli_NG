import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-feeguidance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feeguidance.component.html',
  styleUrl: './feeguidance.component.scss'
})
export class FeeguidanceComponent implements AfterViewInit {
  constructor() {}

  ngAfterViewInit(): void {
    // 使用原生JavaScript操作手風琴功能
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
      button.addEventListener('click', () => {
        // 取得目標元素
        const targetId = (button as HTMLElement).getAttribute('data-bs-target');
        if (!targetId) return;
        
        const targetElement = document.querySelector(targetId) as HTMLElement;
        if (!targetElement) return;
        
        // 切換目標元素的顯示狀態
        const isCollapsed = targetElement.classList.contains('show');
        
        // 如果正在展開，則關閉
        if (isCollapsed) {
          targetElement.classList.remove('show');
          button.classList.add('collapsed');
          (button as HTMLElement).setAttribute('aria-expanded', 'false');
        } else {
          // 如果已關閉，則展開
          targetElement.classList.add('show');
          button.classList.remove('collapsed');
          (button as HTMLElement).setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
}