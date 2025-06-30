import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuheadDetailComponent } from './buhead-detail.component';

describe('BuheadDetailComponent', () => {
  let component: BuheadDetailComponent;
  let fixture: ComponentFixture<BuheadDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuheadDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuheadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
