import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerdiemEditComponent } from './perdiem-edit.component';

describe('PerdiemEditComponent', () => {
  let component: PerdiemEditComponent;
  let fixture: ComponentFixture<PerdiemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerdiemEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerdiemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
