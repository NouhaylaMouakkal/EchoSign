import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAudioComponent } from './input-audio.component';

describe('InputAudioComponent', () => {
  let component: InputAudioComponent;
  let fixture: ComponentFixture<InputAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputAudioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
