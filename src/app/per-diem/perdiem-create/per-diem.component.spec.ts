import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerDiemComponent } from './per-diem.component';

describe('PerDiemComponent', () => {
  let component: PerDiemComponent;
  let fixture: ComponentFixture<PerDiemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerDiemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerDiemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
