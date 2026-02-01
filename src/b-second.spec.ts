/**
 * Second test file (alphabetically) - This file runs second and FAILS.
 *
 * Expected behavior: TestBed should be reset between test files.
 * Actual behavior: TestBed.configureTestingModule throws:
 *   "Cannot configure the test module when the test module has already been instantiated.
 *    Make sure you are not using `inject` before `TestBed.configureTestingModule`."
 *
 * The first test passes because it's the first in this file, but subsequent
 * tests in this file fail because TestBed state leaks from the first file.
 */
import { Injectable, InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

const TOKEN_B = new InjectionToken<string>('TOKEN_B');

@Injectable()
class ServiceB {
  getValue() {
    return 'Service B';
  }
}

describe('Second Test File', () => {
  beforeEach(() => {
    // This configureTestingModule call fails on 2nd+ test because
    // TestBed was instantiated by the previous file and not reset
    TestBed.configureTestingModule({
      providers: [
        ServiceB,
        { provide: TOKEN_B, useValue: 'Value B' },
      ],
    });
  });

  it('should inject ServiceB', () => {
    const service = TestBed.inject(ServiceB);
    expect(service.getValue()).toBe('Service B');
  });

  it('should inject TOKEN_B', () => {
    // This test fails with the error mentioned above
    const value = TestBed.inject(TOKEN_B);
    expect(value).toBe('Value B');
  });
});
