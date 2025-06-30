import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuheadFeedbackDialogComponent } from './buhead-feedback-dialog.component';

describe('BuheadFeedbackDialogComponent', () => {
  let component: BuheadFeedbackDialogComponent;
  let fixture: ComponentFixture<BuheadFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuheadFeedbackDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuheadFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
