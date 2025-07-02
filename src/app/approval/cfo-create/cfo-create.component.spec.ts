import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfoCreateComponent } from './cfo-create.component';

describe('CfoCreateComponent', () => {
  let component: CfoCreateComponent;
  let fixture: ComponentFixture<CfoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
