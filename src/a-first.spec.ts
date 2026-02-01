/**
 * First test file (alphabetically) - This file runs first and passes.
 * After this file runs, TestBed is left in an instantiated state.
 */
import { Injectable, InjectionToken } from '@angular/core';
import { TestBed } from '@angular/core/testing';

const TOKEN_A = new InjectionToken<string>('TOKEN_A');

@Injectable()
class ServiceA {
  getValue() {
    return 'Service A';
  }
}

describe('First Test File', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceA,
        { provide: TOKEN_A, useValue: 'Value A' },
      ],
    });
  });

  it('should inject ServiceA', () => {
    const service = TestBed.inject(ServiceA);
    expect(service.getValue()).toBe('Service A');
  });

  it('should inject TOKEN_A', () => {
    const value = TestBed.inject(TOKEN_A);
    expect(value).toBe('Value A');
  });
});
