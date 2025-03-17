import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // pass the token to get cart endpoint
  const localToken = localStorage.getItem('token') ?? '';
  if(!localToken){
    console.log("No token")
  }
  
  req = req.clone({
    setHeaders:{
      Authorization: `Bearer ${localToken}` 
    },
  })
  return next(req)
  
};
