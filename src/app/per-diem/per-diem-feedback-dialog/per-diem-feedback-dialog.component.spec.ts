import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerDiemFeedbackDialogComponent } from './per-diem-feedback-dialog.component';

describe('PerDiemFeedbackDialogComponent', () => {
  let component: PerDiemFeedbackDialogComponent;
  let fixture: ComponentFixture<PerDiemFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerDiemFeedbackDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerDiemFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
