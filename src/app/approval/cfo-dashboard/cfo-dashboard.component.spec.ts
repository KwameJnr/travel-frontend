import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfoDashboardComponent } from './cfo-dashboard.component';

describe('CfoDashboardComponent', () => {
  let component: CfoDashboardComponent;
  let fixture: ComponentFixture<CfoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfoDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
