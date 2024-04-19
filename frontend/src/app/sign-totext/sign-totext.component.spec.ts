import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignTotextComponent } from './sign-totext.component';

describe('SignTotextComponent', () => {
  let component: SignTotextComponent;
  let fixture: ComponentFixture<SignTotextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignTotextComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SignTotextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
