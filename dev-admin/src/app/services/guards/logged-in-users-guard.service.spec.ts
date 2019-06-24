import { TestBed, inject } from '@angular/core/testing';

import { LoggedInUsersGuardService } from './logged-in-users-guard.service';

describe('LoggedInUsersGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedInUsersGuardService]
    });
  });

  it('should be created', inject([LoggedInUsersGuardService], (service: LoggedInUsersGuardService) => {
    expect(service).toBeTruthy();
  }));
});
