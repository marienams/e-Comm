import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
   { path: '',
    component: HomeComponent},
    {path: 'cart',
        component: CartComponent
    },
    {path: 'login',
        component: LoginComponent
    }
];
