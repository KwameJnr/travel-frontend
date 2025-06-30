import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmissionResultDialogComponent } from './submission-result-dialog.component';

describe('SubmissionResultDialogComponent', () => {
  let component: SubmissionResultDialogComponent;
  let fixture: ComponentFixture<SubmissionResultDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmissionResultDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmissionResultDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
