import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { AvatarService } from '../../services/avatar.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  loading = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  currentUser: any;
  avatarUrl: string | null = null;
  selectedFile: File | null = null;
  showDefaultAvatar = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private avatarService: AvatarService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    // 先從 localStorage 設置頭像
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.avatarUrl = this.userService.getAvatarUrl(userId);
    }

    this.loading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          name: user.name
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.snackBar.open('無法獲取用戶資料', '關閉', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  // 檢查新密碼和確認密碼是否一致
  checkPasswords(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { notMatching: true };
  }

  // 更新用戶名稱
  updateProfile() {
    if (this.profileForm.invalid) {
      return;
    }

    this.passwordForm.reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    this.loading = true;
    const name = this.profileForm.get('name')?.value;
    
    if (this.currentUser && this.currentUser.id) {
      this.userService.updateUserName(this.currentUser.id, name).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.snackBar.open('個人資料更新成功', '關閉', { duration: 3000 });
          this.passwordForm.reset();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.snackBar.open('更新個人資料失敗', '關閉', { duration: 3000 });
          this.loading = false;
        }
      });
      
    }
  }

  // 更新密碼
  updatePassword() {
    if (this.passwordForm.invalid) {
      return;
    }

    this.loading = true;
    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    
    if (this.currentUser && this.currentUser.id) {
      this.userService.updatePassword(
        this.currentUser.id,
        currentPassword,
        newPassword
      ).subscribe({
        next: () => {
          this.snackBar.open('密碼更新成功', '關閉', { duration: 3000 });
          
          // 完全重置表單
          this.passwordForm.reset();
          
          // 手動清除所有錯誤
          Object.keys(this.passwordForm.controls).forEach(key => {
            const control = this.passwordForm.get(key);
            control?.setErrors(null);
          });
          
          // 重置密碼顯示狀態
          this.hideCurrentPassword = true;
          this.hideNewPassword = true;
          this.hideConfirmPassword = true;
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating password:', error);
          this.snackBar.open('密碼更新失敗，請確認當前密碼是否正確', '關閉', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }

  // 處理頭像加載錯誤
  handleAvatarError(): void {
    this.showDefaultAvatar = true;
    this.avatarUrl = null;
  }

  // 處理文件選擇
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      
      // 檢查文件類型
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('請選擇圖片文件', '關閉', { duration: 3000 });
        return;
      }
      
      // 檢查文件大小 (限制為 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.snackBar.open('圖片大小不能超過 5MB', '關閉', { duration: 3000 });
        return;
      }
      
      this.selectedFile = file;
      
      // 預覽選擇的圖片
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result as string;
        // 選擇圖片後自動上傳
        this.uploadAvatar();
      };
      reader.onerror = () => {
        this.snackBar.open('讀取圖片失敗', '關閉', { duration: 3000 });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // 上傳頭像
  uploadAvatar() {
    if (!this.selectedFile || !this.currentUser || !this.currentUser.id) {
      return;
    }

    this.loading = true;
    this.userService.uploadAvatar(this.currentUser.id, this.selectedFile).subscribe({
      next: (response) => {
        this.snackBar.open('頭像上傳成功', '關閉', { duration: 3000 });
        
        // 直接使用上傳後返回的URL，而不是重新請求
        if (response && response.avatarUrl) {
          this.avatarUrl = response.avatarUrl;
          this.showDefaultAvatar = false;
          
          // 更新本地存儲
          localStorage.setItem(`avatar_${this.currentUser.id}`, response.avatarUrl);
          
          // 通知其他組件頭像已更新
          this.avatarService.updateAvatar(response.avatarUrl);
        }
        
        this.selectedFile = null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error uploading avatar:', error);
        this.snackBar.open('頭像上傳失敗，請稍後再試', '關閉', { duration: 3000 });
        this.loading = false;
        
        // 如果上傳失敗，恢復為預設頭像
        this.showDefaultAvatar = true;
        this.avatarUrl = null;
      }
    });
  }
}
