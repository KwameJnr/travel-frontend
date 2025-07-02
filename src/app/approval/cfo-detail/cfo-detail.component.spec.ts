import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfoDetailComponent } from './cfo-detail.component';

describe('CfoDetailComponent', () => {
  let component: CfoDetailComponent;
  let fixture: ComponentFixture<CfoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfoDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
