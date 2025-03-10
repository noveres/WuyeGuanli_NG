import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../../../services/http-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { FloatButtonsComponent } from '../../../components/float-buttons/float-buttons.component';

interface ParsedOtherItem {
  code: string;
  status: string;
  comment: string;
  original: string;
  selected?: boolean;
  prefix?: string; // 新增前綴屬性
  isModified?: boolean; // 新增修改狀態標記
}

interface ParsedData {
  address: string;
  otherItems: ParsedOtherItem[];
  originalIndex?: number; // 用於追蹤過濾後的項目對應到原始數據的索引
  isModified?: boolean; // 新增整體修改狀態標記
}

@Component({
  selector: 'app-feedialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    FloatButtonsComponent,
  ],
  templateUrl: './feedialog.component.html',
  styleUrls: ['./feedialog.component.scss']
})
export class FeedialogComponent implements OnInit {
  response: any[] = [];
  parsedOtherData: ParsedData[] = [];
  filteredData: ParsedData[] = [];
  statusOptions = ['是', '否'];
  masterSelected: boolean = false;
  searchTerm: string = '';

  // 追蹤是否有修改
  hasModifications: boolean = false;

  // 定義前綴選項
  prefixOptions = [
    { value: '', display: '正常' },
    { value: 'hide', display: '隱藏' },
    { value: 'nodisplay', display: '全隱藏' }
  ];

  constructor(
    private httpService: HttpServiceService
  ) { }

  ngOnInit(): void {
    this.fetchFeeData();
  }

  fetchFeeData(): void {
    this.httpService.GetApi('http://localhost:8585/fee/getall')
      .subscribe({
        next: (response: any) => {
          if (response && Array.isArray(response)) {
            this.response = response;

            // 解析每個項目的 "other" 欄位並拆分成組件
            this.parsedOtherData = this.response.map((item, index) => {
              const otherItems = JSON.parse(item.other).map((other: string) => this.parseOtherItem(other));
              return {
                address: item.address,
                otherItems: otherItems,
                originalIndex: index,
                isModified: false
              };
            });

            this.filteredData = [...this.parsedOtherData];
            this.hasModifications = false;
          }
        },
        error: (error) => {
          console.error('獲取資料失敗:', error);
        }
      });
  }

  // 解析每個 other 項目字串為對應的組件
  parseOtherItem(itemStr: string): ParsedOtherItem {
    // 檢查是否包含前綴
    let prefix = '';
    let baseCode = '';

    // 檢測可能的前綴
    if (itemStr.startsWith('hide')) {
      prefix = 'hide';
      baseCode = itemStr.replace(/^hide(\d+).*/, '$1');
    } else if (itemStr.startsWith('nodisplay')) {
      prefix = 'nodisplay';
      baseCode = itemStr.replace(/^nodisplay(\d+).*/, '$1');
    } else {
      // 無前綴的情況
      const codeMatch = itemStr.match(/^(\d+)/);
      baseCode = codeMatch ? codeMatch[1] : '';
    }

    const statusMatch = itemStr.includes('是') ? '是' : itemStr.includes('否') ? '否' : '';

    // 提取備註
    let comment = '';
    const combinedPrefix = prefix + baseCode;

    if (statusMatch) {
      // 移除項目代碼、前綴和狀態，留下備註部分
      comment = itemStr.replace(combinedPrefix + statusMatch, '');
    }

    return {
      code: baseCode,
      status: statusMatch,
      comment,
      original: itemStr,
      selected: false,
      prefix,
      isModified: false
    };
  }

  // 獲取過濾數據對應的原始數據索引
  getOriginalIndex(item: ParsedData): number {
    return item.originalIndex !== undefined ? item.originalIndex : 0;
  }

  // 獲取過濾數據對應的原始數據
  getOriginalItem(item: ParsedData): any {
    const index = this.getOriginalIndex(item);
    return this.response[index];
  }

  // 當輸入欄位變更時，更新原始資料
  updateItem(addressIndex: number, otherIndex: number): void {
    const item = this.parsedOtherData[addressIndex].otherItems[otherIndex];

    // 標記為已修改
    item.isModified = true;
    this.parsedOtherData[addressIndex].isModified = true;
    this.hasModifications = true;

    // 組合完整的項目代碼（前綴+基礎代碼）
    const fullCode = (item.prefix || '') + item.code;

    // 重建完整的項目字串
    item.original = `${fullCode}${item.status}${item.comment}`;

    // 更新原始回應資料
    const otherArray = this.parsedOtherData[addressIndex].otherItems.map(item => item.original);
    this.response[addressIndex].other = JSON.stringify(otherArray);
  }

  // 變更項目的前綴
  changePrefix(addressIndex: number, otherIndex: number, prefix: string): void {
    const item = this.parsedOtherData[addressIndex].otherItems[otherIndex];
    item.prefix = prefix;
    this.updateItem(addressIndex, otherIndex);
  }

  // 批次變更所選項目的前綴
  batchChangePrefix(prefix: string): void {
    this.parsedOtherData.forEach((addressData, addressIndex) => {
      addressData.otherItems.forEach((item, otherIndex) => {
        if (item.selected) {
          item.prefix = prefix;
          this.updateItem(addressIndex, otherIndex);
        }
      });
    });
  }

  // 格式化項目代碼顯示（加入前綴）
  getDisplayCode(item: ParsedOtherItem): string {
    return (item.prefix || '') + item.code;
  }

  // 追蹤函數
  trackByAddressIndex(index: number): number {
    return index;
  }

  trackByOtherItemIndex(index: number): number {
    return index;
  }

  // 全選/取消全選 (單一地址)
  toggleAllSelection(addressIndex: number): void {
    const items = this.parsedOtherData[addressIndex].otherItems;
    const allSelected = !this.isAllSelected(addressIndex);

    items.forEach(item => {
      item.selected = allSelected;
    });
  }

  // 檢查是否全部已選取 (單一地址)
  isAllSelected(addressIndex: number): boolean {
    const items = this.parsedOtherData[addressIndex].otherItems;
    return items.length > 0 && items.every(item => item.selected);
  }

  // 一鍵修改所選項目的狀態 (單一地址)
  batchUpdateStatus(addressIndex: number, newStatus: string): void {
    const items = this.parsedOtherData[addressIndex].otherItems;

    items.forEach((item, index) => {
      if (item.selected) {
        item.status = newStatus;
        this.updateItem(addressIndex, index);
      }
    });
  }

  // 根據項目代碼全選 (單一地址)
  selectAllByCode(addressIndex: number, code: string): void {
    if (!code) return;
    const items = this.parsedOtherData[addressIndex].otherItems;
    items.forEach(item => {
      if (item.code === code) {
        item.selected = true;
      }
    });
  }

  // 根據地址全選 (單一地址)
  selectAllByAddress(address: string): void {
    if (!address) return;
    this.parsedOtherData.forEach((item, index) => {
      if (item.address.includes(address)) {
        item.otherItems.forEach(otherItem => {
          otherItem.selected = true;
        });
      }
    });
  }

  // 全部地址的全選/取消全選
  toggleAllForAllAddresses(): void {
    this.masterSelected = !this.masterSelected;
    this.parsedOtherData.forEach(addressData => {
      addressData.otherItems.forEach(item => {
        item.selected = this.masterSelected;
      });
    });
  }

  // 根據項目代碼為所有地址全選
  selectAllByCodeForAllAddresses(code: string): void {
    if (!code) return;
    this.parsedOtherData.forEach((addressData, addressIndex) => {
      this.selectAllByCode(addressIndex, code);
    });
    this.updateMasterSelectedState();
  }

  // 根據門牌為所有項目全選
  selectAllByAddressForAllAddresses(address: string): void {
    if (!address) return;
    this.selectAllByAddress(address);
    this.updateMasterSelectedState();
  }

  // 一鍵修改所有已選項目的狀態
  batchUpdateStatusForAllSelected(newStatus: string): void {
    this.parsedOtherData.forEach((addressData, addressIndex) => {
      addressData.otherItems.forEach((item, otherIndex) => {
        if (item.selected) {
          item.status = newStatus;
          this.updateItem(addressIndex, otherIndex);
        }
      });
    });
  }

  // 更新主全選狀態
  updateMasterSelectedState(): void {
    let allSelected = true;
    for (const addressData of this.parsedOtherData) {
      for (const item of addressData.otherItems) {
        if (!item.selected) {
          allSelected = false;
          break;
        }
      }
      if (!allSelected) break;
    }
    this.masterSelected = allSelected;
  }

  // 執行搜尋
  performSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.parsedOtherData];
      return;
    }

    const searchTerm = this.searchTerm.toLowerCase().trim();

    // 搜尋結果暫存
    const resultData: ParsedData[] = [];

    this.parsedOtherData.forEach((addressData, addressIndex) => {
      // 檢查門牌是否匹配
      const addressMatch = addressData.address.toLowerCase().includes(searchTerm);

      // 過濾項目代碼符合的項目
      const matchedItems = addressData.otherItems.filter(item => {
        // 包含前綴的完整代碼和基礎代碼都進行搜尋
        const fullCode = (item.prefix || '') + item.code;
        // 新增：也搜尋狀態
        const statusMatch = item.status.toLowerCase().includes(searchTerm);

        return fullCode.toLowerCase().includes(searchTerm) ||
          item.code.toLowerCase().includes(searchTerm) ||
          item.comment.toLowerCase().includes(searchTerm) ||
          statusMatch; // 新增狀態搜尋
      });

      // 如果門牌匹配或有任何項目匹配，則保留這個地址組
      if (addressMatch || matchedItems.length > 0) {
        if (addressMatch) {
          // 如果門牌匹配，保留所有項目
          resultData.push({
            address: addressData.address,
            otherItems: [...addressData.otherItems],
            originalIndex: addressIndex,
            isModified: addressData.isModified
          });
        } else {
          // 如果僅項目匹配，只保留匹配的項目
          resultData.push({
            address: addressData.address,
            otherItems: matchedItems,
            originalIndex: addressIndex,
            isModified: addressData.isModified
          });
        }
      }
    });

    this.filteredData = resultData;
  }

  // 新增：取消所有選取
  unselectAllForAllAddresses(): void {
    this.parsedOtherData.forEach(addressData => {
      addressData.otherItems.forEach(item => {
        item.selected = false;
      });
    });
    this.masterSelected = false;

    // 同時更新過濾後的數據
    this.filteredData.forEach(addressData => {
      addressData.otherItems.forEach(item => {
        item.selected = false;
      });
    });
  }

  addNewItemCard(code: string): void {
    // 如果代碼為空，不執行
    if (!code.trim()) {
      return;
    }

    // 檢查代碼是否已經存在
    let codeExists = false;
    this.parsedOtherData.forEach(addressData => {
      addressData.otherItems.forEach(item => {
        if (item.code === code.trim()) {
          codeExists = true;
        }
      });
    });

    // 如果代碼已經存在，顯示提示信息
    if (codeExists) {
      alert('代碼重複，請使用其他代碼');
      return;
    }

    // 為每個地址組添加新項目卡片
    this.parsedOtherData.forEach((addressData, addressIndex) => {
      // 創建新的項目
      const newItem: ParsedOtherItem = {
        code: code.trim(),
        status: '否', // 預設狀態為「否」
        comment: '',  // 預設備註為空
        original: code.trim() + '否', // 構建原始字符串
        selected: false,
        prefix: '',    // 預設無前綴
        isModified: true // 標記為已修改
      };

      // 清空搜尋條件，確保新卡片顯示
      this.searchTerm = '';
      this.filteredData = [...this.parsedOtherData];

      // 將新項目添加到列表的最前面
      addressData.otherItems.unshift(newItem);
      addressData.isModified = true;
      this.hasModifications = true;

      // 更新原始回應資料
      const otherArray = this.parsedOtherData[addressIndex].otherItems.map(item => item.original);
      this.response[addressIndex].other = JSON.stringify(otherArray);
    });

    // 顯示加入成功的提示
    alert('加入成功!! \n\n請注意，代碼"儲存"後不可刪除，只能隱藏。\n若有錯誤，請刷新頁面，並重新加入');

    // 更新過濾後的資料以顯示新卡片
    this.performSearch();
  }

  // 獲取已修改的數據
  getModifiedData(): any[] {
    return this.response.filter((_, index) => {
      return this.parsedOtherData[index].isModified;
    });
  }

  // 送出資料到 API
  submitData(): void {
    // 檢查是否有修改
    if (!this.hasModifications) {
      alert('沒有任何修改，無需儲存！');
      return;
    }

    // 確認是否要儲存
    const confirmSubmit = confirm('確定要儲存所有修改嗎？\n\n修改不可刪除只可隱藏!!\n可按「取消」再次確認~');

    if (!confirmSubmit) {
      return; // 用戶取消儲存
    }

    // 只獲取已修改的項目
    const modifiedData = this.getModifiedData();

    // 如果沒有修改項目，提示並返回
    if (modifiedData.length === 0) {
      alert('沒有任何修改，無需儲存！');
      return;
    }

    // 確保資料格式正確
    const dataToSubmit = modifiedData.map(item => {
      return {
        address: item.address,
        other: item.other
        // 避免加入 API 不需要的欄位
      };
    });

    console.log('準備提交的資料:', dataToSubmit);

    // 呼叫 API
    this.httpService.PostApi('http://localhost:8585/fee/add', dataToSubmit)
      .subscribe({
        next: (response: any) => {
          console.log('資料儲存成功:', response);

          // 重設修改狀態
          this.parsedOtherData.forEach(data => {
            data.isModified = false;
            data.otherItems.forEach(item => {
              item.isModified = false;
            });
          });
          this.hasModifications = false;

          // 成功訊息
          alert('資料儲存成功!');
        },
        error: (error: any) => {
          console.error('資料儲存失敗:', error);

          // 顯示更詳細的錯誤訊息
          let errorMsg = '未知錯誤';
          if (error.error && error.error.message) {
            errorMsg = error.error.message;
          } else if (error.message) {
            errorMsg = error.message;
          }

          alert('資料儲存失敗: ' + errorMsg);
        }
      });
  }
}