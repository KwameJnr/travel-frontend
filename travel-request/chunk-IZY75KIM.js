import {
  MatMenu,
  MatMenuItem,
  MatMenuModule,
  MatMenuTrigger
} from "./chunk-BA4SP5DG.js";
import {
  CommonModule,
  Component,
  MatButton,
  MatButtonModule,
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardModule,
  MatCardTitle,
  MatIcon,
  MatIconModule,
  MatToolbar,
  MatToolbarModule,
  Router,
  RouterLink,
  RouterModule,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵproperty,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext
} from "./chunk-VP6RSS6Q.js";
import "./chunk-TXDUYLVM.js";

// src/app/auth/login/unauthorized/unauthorized.component.ts
var UnauthorizedComponent = class _UnauthorizedComponent {
  router;
  constructor(router) {
    this.router = router;
  }
  goHome() {
    this.router.navigate(["/travel"]);
  }
  static \u0275fac = function UnauthorizedComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UnauthorizedComponent)(\u0275\u0275directiveInject(Router));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UnauthorizedComponent, selectors: [["app-unauthorized"]], decls: 33, vars: 3, consts: [["adminMenu", "matMenu"], ["color", "primary", 1, "top-toolbar"], [1, "logo"], [1, "spacer"], ["mat-menu-item", "", 3, "routerLink"], ["mat-button", "", 3, "matMenuTriggerFor"], ["mat-button", "", 3, "routerLink"], ["mat-button", "", "routerLink", "/travel/buhead/list"], ["mat-button", "", "routerLink", "/travel/cfo/list"], ["mat-button", "", "routerLink", "/travel/cfo/dashboard"], [1, "unauthorized-container"], [1, "unauthorized-card"], ["color", "warn", 1, "warning-icon"], [1, "message"], ["mat-raised-button", "", "color", "primary", 3, "click"]], template: function UnauthorizedComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "mat-toolbar", 1)(1, "span", 2);
      \u0275\u0275text(2, "Travel Request Manager");
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "span", 3);
      \u0275\u0275elementStart(4, "mat-menu", null, 0)(6, "button", 4);
      \u0275\u0275text(7, "Travel Requests");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(8, "button", 5);
      \u0275\u0275text(9, "Manage");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(10, "button", 6);
      \u0275\u0275text(11, "Create Travel");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "button", 7);
      \u0275\u0275text(13, "BU Head Approvals");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "button", 8);
      \u0275\u0275text(15, "CFO Approvals");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "button", 9);
      \u0275\u0275text(17, "CFO Dashboard");
      \u0275\u0275elementEnd();
      \u0275\u0275element(18, "span", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(19, "div", 10)(20, "mat-card", 11)(21, "mat-card-title")(22, "mat-icon", 12);
      \u0275\u0275text(23, "lock");
      \u0275\u0275elementEnd();
      \u0275\u0275text(24, " Access Denied ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(25, "mat-card-content")(26, "p", 13);
      \u0275\u0275text(27, " Sorry, you do not have permission to access this page. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(28, "mat-card-actions")(29, "button", 14);
      \u0275\u0275listener("click", function UnauthorizedComponent_Template_button_click_29_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.goHome());
      });
      \u0275\u0275elementStart(30, "mat-icon");
      \u0275\u0275text(31, "arrow_back");
      \u0275\u0275elementEnd();
      \u0275\u0275text(32, " Go back to Dashboard ");
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      const adminMenu_r2 = \u0275\u0275reference(5);
      \u0275\u0275advance(6);
      \u0275\u0275property("routerLink", "/travel/list");
      \u0275\u0275advance(2);
      \u0275\u0275property("matMenuTriggerFor", adminMenu_r2);
      \u0275\u0275advance(2);
      \u0275\u0275property("routerLink", "/travel/create");
    }
  }, dependencies: [CommonModule, MatButtonModule, MatButton, MatCardModule, MatCard, MatCardActions, MatCardContent, MatCardTitle, MatToolbarModule, MatToolbar, MatIconModule, MatIcon, MatMenuModule, MatMenu, MatMenuItem, MatMenuTrigger, RouterModule, RouterLink], styles: ["\n\n.unauthorized-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 70vh;\n  padding: 24px;\n  background-color: #f9fafa;\n  animation: _ngcontent-%COMP%_fadeIn 0.8s ease-in;\n}\n.unauthorized-card[_ngcontent-%COMP%] {\n  max-width: 400px;\n  width: 100%;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  text-align: center;\n  padding: 16px;\n}\n.warning-icon[_ngcontent-%COMP%] {\n  font-size: 48px;\n  color: #f44336;\n}\n.message[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: #555;\n  margin-top: 12px;\n}\nmat-card-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #333;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\nmat-card-actions[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\nbutton[_ngcontent-%COMP%] {\n  border-radius: 24px;\n  font-weight: 600;\n  text-transform: none;\n  padding: 10px 24px;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(16px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.top-toolbar[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 0;\n  z-index: 1000;\n  background-color: #048a73;\n  color: white;\n}\n.logo[_ngcontent-%COMP%] {\n  font-weight: bold;\n  font-size: 1.3rem;\n}\n.spacer[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\nbutton[_ngcontent-%COMP%], \n.mat-button[_ngcontent-%COMP%], \n.mat-icon-button[_ngcontent-%COMP%] {\n  color: black;\n}\n/*# sourceMappingURL=unauthorized.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UnauthorizedComponent, [{
    type: Component,
    args: [{ selector: "app-unauthorized", standalone: true, imports: [
      CommonModule,
      MatButtonModule,
      MatCardModule,
      MatToolbarModule,
      MatIconModule,
      MatMenuModule,
      RouterModule
    ], template: `<!-- Add Navbar -->
<mat-toolbar color="primary" class="top-toolbar">
    <span class="logo">Travel Request Manager</span>
  
    <span class="spacer"></span>
  
    <mat-menu #adminMenu="matMenu">
      <button mat-menu-item [routerLink]="'/travel/list'">Travel Requests</button>
      <!-- <button mat-menu-item [routerLink]="'/travel/buhead/create'">Create BU Head</button> -->
    </mat-menu>
  
    <button mat-button [matMenuTriggerFor]="adminMenu">Manage</button>
    <button mat-button [routerLink]="'/travel/create'">Create Travel</button>
    <button mat-button routerLink="/travel/buhead/list">BU Head Approvals</button>
    <button mat-button routerLink="/travel/cfo/list">CFO Approvals</button>
    <button mat-button routerLink="/travel/cfo/dashboard">CFO Dashboard</button>
  
    <span class="spacer"></span>
  
    <!-- <mat-menu #userMenu="matMenu">
      <button mat-menu-item disabled>Logged in as: <strong>employee&#64;example.com</strong></button>
      <button mat-menu-item (click)="logout()">Logout</button>
    </mat-menu> -->
  
    <!-- <button mat-icon-button [matMenuTriggerFor]="userMenu">
      <mat-icon>account_circle</mat-icon>
    </button> -->
  </mat-toolbar>
  
 <!-- Unauthorized Content -->
<div class="unauthorized-container">
    <mat-card class="unauthorized-card">
      <mat-card-title>
        <mat-icon class="warning-icon" color="warn">lock</mat-icon>
        Access Denied
      </mat-card-title>
      <mat-card-content>
        <p class="message">
          Sorry, you do not have permission to access this page.
        </p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="goHome()">
          <mat-icon>arrow_back</mat-icon>
          Go back to Dashboard
        </button>
      </mat-card-actions>
    </mat-card>
  </div>
  
  
`, styles: ["/* src/app/auth/login/unauthorized/unauthorized.component.scss */\n.unauthorized-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 70vh;\n  padding: 24px;\n  background-color: #f9fafa;\n  animation: fadeIn 0.8s ease-in;\n}\n.unauthorized-card {\n  max-width: 400px;\n  width: 100%;\n  border-radius: 12px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  text-align: center;\n  padding: 16px;\n}\n.warning-icon {\n  font-size: 48px;\n  color: #f44336;\n}\n.message {\n  font-size: 1rem;\n  color: #555;\n  margin-top: 12px;\n}\nmat-card-title {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: #333;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\nmat-card-actions {\n  margin-top: 16px;\n}\nbutton {\n  border-radius: 24px;\n  font-weight: 600;\n  text-transform: none;\n  padding: 10px 24px;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(16px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.top-toolbar {\n  position: sticky;\n  top: 0;\n  z-index: 1000;\n  background-color: #048a73;\n  color: white;\n}\n.logo {\n  font-weight: bold;\n  font-size: 1.3rem;\n}\n.spacer {\n  flex: 1 1 auto;\n}\nbutton,\n.mat-button,\n.mat-icon-button {\n  color: black;\n}\n/*# sourceMappingURL=unauthorized.component.css.map */\n"] }]
  }], () => [{ type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UnauthorizedComponent, { className: "UnauthorizedComponent", filePath: "src/app/auth/login/unauthorized/unauthorized.component.ts", lineNumber: 20 });
})();
export {
  UnauthorizedComponent
};
//# sourceMappingURL=chunk-IZY75KIM.js.map
