import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfoFeedbackDialogComponent } from './cfo-feedback-dialog.component';

describe('CfoFeedbackDialogComponent', () => {
  let component: CfoFeedbackDialogComponent;
  let fixture: ComponentFixture<CfoFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfoFeedbackDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfoFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
