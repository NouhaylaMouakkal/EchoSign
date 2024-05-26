import { TestBed } from '@angular/core/testing';

import { SpeechrecognitionService } from './speechrecognition.service';

describe('SpeechrecognitionService', () => {
  let service: SpeechrecognitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechrecognitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
