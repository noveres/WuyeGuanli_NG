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

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
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
    this.loading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          name: user.name
        });
        
        // 設置頭像URL
        if (user.id) {
          this.avatarUrl = this.userService.getAvatarUrl(user.id);
        }
        
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

    this.loading = true;
    const name = this.profileForm.get('name')?.value;
    
    if (this.currentUser && this.currentUser.id) {
      this.userService.updateUserName(this.currentUser.id, name).subscribe({
        next: () => {
          this.snackBar.open('個人資料更新成功', '關閉', { duration: 3000 });
          // 更新本地存儲的用戶名稱
          const user = this.authService.getCurrentUser();
          if (user) {
            user.name = name;
            this.authService.saveUserToLocalStorage(user);
          }
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
          this.passwordForm.reset();
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

  // 處理文件選擇
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      // 預覽選擇的圖片
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result as string;
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
        // 更新頭像URL（添加時間戳避免緩存）
        this.avatarUrl = this.userService.getAvatarUrl(this.currentUser.id);
        this.selectedFile = null;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error uploading avatar:', error);
        this.snackBar.open('頭像上傳失敗', '關閉', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
