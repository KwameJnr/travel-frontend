import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuHeadRequestListComponent } from './bu-head-request-list.component';

describe('BuHeadRequestListComponent', () => {
  let component: BuHeadRequestListComponent;
  let fixture: ComponentFixture<BuHeadRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuHeadRequestListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuHeadRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
