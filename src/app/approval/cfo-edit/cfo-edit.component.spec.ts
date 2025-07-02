import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfoEditComponent } from './cfo-edit.component';

describe('CfoEditComponent', () => {
  let component: CfoEditComponent;
  let fixture: ComponentFixture<CfoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfoEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
