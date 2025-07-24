import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerdiemListComponent } from './perdiem-list.component';

describe('PerdiemListComponent', () => {
  let component: PerdiemListComponent;
  let fixture: ComponentFixture<PerdiemListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerdiemListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerdiemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
