import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../../services/http-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

interface NewItem {
  code: string;
  status: string;
  comment: string;
  prefix?: string;
}

@Component({
  selector: 'app-addnew',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './addnew.component.html',
  styleUrls: ['./addnew.component.scss']
})
export class AddnewComponent implements OnInit {
  // 現有門牌地址列表
  existingAddresses: string[] = [];
  
  // 新門牌資訊
  newAddress: string = '';
  addressCheckResult: 'none' | 'loading' | 'available' | 'duplicate' | 'empty' = 'none';
  
  // 新項目資訊
  newItem: NewItem = {
    code: '',
    status: '否',
    comment: '',
    prefix: ''
  };
  
  // 預覽項目列表
  previewItems: NewItem[] = [];

  constructor(
    private httpService: HttpServiceService
  ) { }

  ngOnInit(): void {
    this.loadExistingAddresses();
  }

  // 載入現有的門牌地址
  loadExistingAddresses(): void {
    this.httpService.GetApi('http://localhost:8585/fee/getall')
      .subscribe({
        next: (response: any) => {
          if (response && Array.isArray(response)) {
            // 只提取門牌地址
            this.existingAddresses = response.map((item: any) => item.address);
          }
        },
        error: (error) => {
          console.error('獲取門牌資料失敗:', error);
          alert('無法獲取現有門牌資料，請重試或聯繫管理員');
        }
      });
  }

  // 檢查門牌是否可用（不重複）
  checkAddressAvailability(): void {
    if (!this.newAddress.trim()) {
      this.addressCheckResult = 'empty';
      return;
    }

    this.addressCheckResult = 'loading';
    
    // 檢查是否存在於已有地址中
    setTimeout(() => {
      const isDuplicate = this.existingAddresses.some(
        address => address.toLowerCase() === this.newAddress.toLowerCase()
      );
      
      this.addressCheckResult = isDuplicate ? 'duplicate' : 'available';
    }, 500); // 短暫延遲模擬檢查過程
  }

  // 新增項目卡片到預覽區
  addItemCard(): void {
    if (!this.newItem.code) {
      alert('請輸入項目代碼');
      return;
    }

    // 檢查項目代碼是否已存在
    const isDuplicate = this.previewItems.some(item => item.code === this.newItem.code);
    if (isDuplicate) {
      alert('此項目代碼已存在，請使用其他代碼');
      return;
    }

    // 複製項目並加入到預覽列表的最前方
    this.previewItems.unshift({...this.newItem});

    // 重置項目輸入欄位（保持狀態為上次選擇）
    this.newItem = {
      code: '',
      status: this.newItem.status,
      comment: '',
      prefix: ''
    };
  }

  // 從預覽區移除項目卡片
  removeItemCard(index: number): void {
    this.previewItems.splice(index, 1);
  }

  // 檢查是否可以提交
  canSubmit(): boolean {
    return this.addressCheckResult === 'available' && this.newAddress.trim() !== '' && this.previewItems.length > 0;
  }

  // 重置整個表單
  resetForm(): void {
    this.newAddress = '';
    this.addressCheckResult = 'none';
    this.newItem = {
      code: '',
      status: '否',
      comment: '',
      prefix: ''
    };
    this.previewItems = [];
  }

  // 提交數據到API
  submitData(): void {
    if (!this.canSubmit()) {
      return;
    }

    // 確認是否要送出
    const confirmSubmit = confirm(`確定要新增門牌「${this.newAddress}」及其所有項目卡片嗎？`);
    if (!confirmSubmit) {
      return;
    }

    // 將項目轉換為API格式
    const otherItems = this.previewItems.map(item => {
      // 組合項目字串：前綴 + 代碼 + 狀態 + 備註
      return `${item.prefix || ''}${item.code}${item.status}${item.comment || ''}`;
    });

    // 構建提交數據
    const dataToSubmit = {
      address: this.newAddress,
      other: JSON.stringify(otherItems)
    };

    console.log('準備提交的資料:', dataToSubmit);

    // 呼叫API
    this.httpService.PostApi('http://localhost:8585/fee/add', [dataToSubmit])
      .subscribe({
        next: (response: any) => {
          console.log('新增成功:', response);
          alert('門牌及項目新增成功！');
          
          // 新增成功後重置表單
          this.resetForm();
          
          // 重新載入現有門牌列表
          this.loadExistingAddresses();
        },
        error: (error) => {
          console.error('新增失敗:', error);
          
          // 顯示更詳細的錯誤訊息
          let errorMsg = '未知錯誤';
          if (error.error && error.error.message) {
            errorMsg = error.error.message;
          } else if (error.message) {
            errorMsg = error.message;
          }
          
          alert('新增失敗: ' + errorMsg);
        }
      });
  }
}