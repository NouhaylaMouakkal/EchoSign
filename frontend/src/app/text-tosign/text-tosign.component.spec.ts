import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextTosignComponent } from './text-tosign.component';

describe('TextTosignComponent', () => {
  let component: TextTosignComponent;
  let fixture: ComponentFixture<TextTosignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextTosignComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextTosignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
