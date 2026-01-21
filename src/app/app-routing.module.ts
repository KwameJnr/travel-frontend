import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { LoginGuard } from 'src/app/auth/login/guards/login.guard';
import { authGuard } from 'src/app/auth/login/guards/auth.guard';
// import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/travels', pathMatch: 'full' },

  { path: 'travels', 
    canActivate: [LoginGuard],
    loadChildren: () => import('./travel/travel.module').then(m => m.TravelModule) 
    
  },
  { path: 'buhead', 
    canActivate: [authGuard],
    loadChildren: () => import('src/app/bu-head/bu-head-routing/bu-head.module').then(m => m.BuHeadModule) 
   
  },
  { path: 'perdiem', 
    canActivate: [authGuard],
    loadChildren: () => import('src/app/per-diem/per-diem-routing/per-diem.module').then(m => m.PerDiemModule) 
   
  },
  { path: 'cfo', 
    canActivate: [authGuard],
    loadChildren: () => import('src/app/approval/approval-routing/approval.module').then(m => m.ApprovalModule) 
  
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules, // 🌟 Preload all lazy modules
      scrollPositionRestoration: 'enabled', // optional - restores scroll on navigation
    }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}