import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuheadApproveDialogComponent } from './buhead-approve-dialog.component';

describe('BuheadApproveDialogComponent', () => {
  let component: BuheadApproveDialogComponent;
  let fixture: ComponentFixture<BuheadApproveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuheadApproveDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuheadApproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
