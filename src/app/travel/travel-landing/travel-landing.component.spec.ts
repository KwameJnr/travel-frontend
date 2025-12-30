import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelLandingComponent } from './travel-landing.component';

describe('TravelLandingComponent', () => {
  let component: TravelLandingComponent;
  let fixture: ComponentFixture<TravelLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
