import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfoApproveListComponent } from './cfo-approve-list.component';

describe('CfoApproveListComponent', () => {
  let component: CfoApproveListComponent;
  let fixture: ComponentFixture<CfoApproveListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfoApproveListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfoApproveListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
