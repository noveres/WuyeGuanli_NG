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

interface AddressData {
  address: string;
  other: string;
  id?: string;
  items?: NewItem[];
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
  existingAddressesData: AddressData[] = [];

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

  // 目前操作的資料 ID
  currentDataId: string | null = null;

  // 是否處於編輯模式
  isEditMode: boolean = false;

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
            this.existingAddressesData = response;
            // 只提取門牌地址
            this.existingAddresses = response.map((item: any) => item.address);
          }
        },
        error: (error) => {
          console.error('獲取門牌資料失敗:', error);
          alert('無法獲取現有門牌資料，請重試或開啟伺服器');
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
      const duplicateAddress = this.existingAddressesData.find(
        item => item.address.toLowerCase() === this.newAddress.toLowerCase()
      );

      if (duplicateAddress) {
        this.addressCheckResult = 'duplicate';

        // 顯示確認對話框
        const confirmEdit = confirm(`門牌「${this.newAddress}」已存在，是否要查看並編輯此門牌的項目資料？`);

        if (confirmEdit) {
          // 獲取該門牌的詳細資料
          this.loadAddressDetails(duplicateAddress);
        } else {
          // 用戶選擇取消，重置輸入欄位
          this.newAddress = '';
          this.addressCheckResult = 'none';
        }
      } else {
        this.addressCheckResult = 'available';
        this.isEditMode = false;
        this.currentDataId = null;
        this.previewItems = [];
      }
    }, 500); // 短暫延遲模擬檢查過程
  }

  // 載入特定門牌的詳細資料
  loadAddressDetails(addressData: AddressData): void {
    // 設定當前編輯的資料 ID
    this.currentDataId = addressData.id ?? null;
    this.isEditMode = true;

    // 解析 other 字段中的項目資料
    let otherItems: string[] = [];
    try {
      otherItems = JSON.parse(addressData.other || '[]');
    } catch (e) {
      console.error('解析項目資料失敗:', e);
      otherItems = [];
    }

    // 將項目字串轉換為對象
    this.previewItems = this.parseOtherItemsToObjects(otherItems);

    // 設置狀態，允許編輯
    this.addressCheckResult = 'available';
  }

  // 將 other 字段中的項目字串轉換為對象
  parseOtherItemsToObjects(otherItems: string[]): NewItem[] {
    return otherItems.map(itemStr => {
      // 這裡需要根據實際的項目字串格式進行解析
      // 假設格式為 "前綴代碼狀態備註"，需要自行調整正則表達式
      const codeMatch = itemStr.match(/^([^\d]*)(\d+)(是|否)(.*)$/);

      if (codeMatch) {
        return {
          prefix: codeMatch[1] || '',
          code: codeMatch[2] || '',
          status: codeMatch[3] || '否',
          comment: codeMatch[4] || ''
        };
      }

      // 預設返回
      return {
        code: itemStr,
        status: '否',
        comment: '',
        prefix: ''
      };
    });
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
    this.previewItems.unshift({ ...this.newItem });

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
    this.isEditMode = false;
    this.currentDataId = null;
  }

  // 提交數據到API
  submitData(): void {
    if (!this.canSubmit()) {
      return;
    }

    // 確認是否要送出
    const actionText = this.isEditMode ? '更新' : '新增';
    const confirmSubmit = confirm(`確定要${actionText}門牌「${this.newAddress}」及其所有項目卡片嗎？`);
    if (!confirmSubmit) {
      return;
    }

    // 將項目轉換為API格式
    const otherItems = this.previewItems.map(item => {
      // 組合項目字串：前綴 + 代碼 + 狀態 + 備註
      return `${item.prefix || ''}${item.code}${item.status}${item.comment || ''}`;
    });

    // 構建提交數據
    const dataToSubmit: any = {
      address: this.newAddress,
      other: JSON.stringify(otherItems)
    };

    // 如果是編輯模式，添加 ID
    if (this.isEditMode && this.currentDataId) {
      dataToSubmit.id = this.currentDataId;
    }

    console.log('準備提交的資料:', dataToSubmit);

    // 選擇 API 端點
    const apiUrl = this.isEditMode
      ? `http://localhost:8585/fee/add`
      : `http://localhost:8585/fee/add`;

    // 呼叫 API
    this.httpService.PostApi(apiUrl, [dataToSubmit])
      .subscribe({
        next: (response: any) => {
          console.log(`${actionText}成功:`, response);
          alert(`門牌及項目${actionText}成功！`);

          // 成功後重置表單
          this.resetForm();

          // 重新載入現有門牌列表
          this.loadExistingAddresses();
        },
        error: (error) => {
          console.error(`${actionText}失敗:`, error);

          // 顯示更詳細的錯誤訊息
          let errorMsg = '未知錯誤';
          if (error.error && error.error.message) {
            errorMsg = error.error.message;
          } else if (error.message) {
            errorMsg = error.message;
          }

          alert(`${actionText}失敗: ` + errorMsg);
        }
      });
  }
}
