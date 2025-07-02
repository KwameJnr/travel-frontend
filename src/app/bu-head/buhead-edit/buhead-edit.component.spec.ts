import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuheadEditComponent } from './buhead-edit.component';

describe('BuheadEditComponent', () => {
  let component: BuheadEditComponent;
  let fixture: ComponentFixture<BuheadEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuheadEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuheadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
