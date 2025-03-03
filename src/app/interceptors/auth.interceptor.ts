import { HttpRequest, HttpHandlerFn, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  
  // 從本地存儲獲取令牌
  const token = localStorage.getItem('token');
  
  // 如果令牌存在，則將其添加到請求標頭中
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  // 處理請求並捕獲錯誤
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // 如果是401未授權錯誤，則重定向到登錄頁面
      if (error.status === 401) {
        localStorage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}
