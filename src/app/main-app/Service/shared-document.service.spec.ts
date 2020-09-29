import { TestBed } from '@angular/core/testing';

import { SharedDocumentService } from './shared-document.service';

describe('SharedDocumentService', () => {
  let service: SharedDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
