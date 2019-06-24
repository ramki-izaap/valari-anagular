import { TestBed, inject } from '@angular/core/testing';

import { ShippingChargeService } from './shipping-charge.service'

describe('ShippingChargeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShippingChargeService]
    });
  });

  it('should be created', inject([ShippingChargeService], (service: ShippingChargeService) => {
    expect(service).toBeTruthy();
  }));
});
