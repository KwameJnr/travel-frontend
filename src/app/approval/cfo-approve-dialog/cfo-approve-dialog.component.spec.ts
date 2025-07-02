import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfoApproveDialogComponent } from './cfo-approve-dialog.component';

describe('CfoApproveDialogComponent', () => {
  let component: CfoApproveDialogComponent;
  let fixture: ComponentFixture<CfoApproveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfoApproveDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfoApproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
