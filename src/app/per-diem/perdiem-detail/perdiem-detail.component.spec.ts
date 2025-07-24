import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerdiemDetailComponent } from './perdiem-detail.component';

describe('PerdiemDetailComponent', () => {
  let component: PerdiemDetailComponent;
  let fixture: ComponentFixture<PerdiemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerdiemDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerdiemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
