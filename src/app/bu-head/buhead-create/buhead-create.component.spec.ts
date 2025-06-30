import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuheadCreateComponent } from './buhead-create.component';

describe('BuheadCreateComponent', () => {
  let component: BuheadCreateComponent;
  let fixture: ComponentFixture<BuheadCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuheadCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuheadCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
