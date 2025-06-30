import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuheadDashboardComponent } from './buhead-dashboard.component';

describe('BuheadDashboardComponent', () => {
  let component: BuheadDashboardComponent;
  let fixture: ComponentFixture<BuheadDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuheadDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuheadDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
