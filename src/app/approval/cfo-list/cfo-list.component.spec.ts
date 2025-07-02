import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfoListComponent } from './cfo-list.component';

describe('CfoListComponent', () => {
  let component: CfoListComponent;
  let fixture: ComponentFixture<CfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
