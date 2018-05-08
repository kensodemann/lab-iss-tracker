import { AddressPipe } from './address.pipe';

import { Address } from '../../models/address';
import { tick } from '@angular/core/src/render3';

describe('AddressPipe', () => {
  let testAddress: Address;
  let pipe: AddressPipe;

  beforeEach(() => {
    pipe = new AddressPipe();
    testAddress = {
      streetNumber: '211',
      street: 'Polkadot Court',
      city: 'Yeahderhay',
      area: 'ND',
      postalCode: '77835'
    };
  });

  it('exists', () => {
    expect(pipe).toBeTruthy();
  });

  describe('line 1', () => {
    it('formats street number and name', () => {
      expect(pipe.transform(testAddress, 'line1')).toEqual('211 Polkadot Court');
    });

    it('handles no street number', () => {
      delete testAddress.streetNumber;
      expect(pipe.transform(testAddress, 'line1')).toEqual('Polkadot Court');
    });

    it('handles no street name', () => {
      delete testAddress.street;
      expect(pipe.transform(testAddress, 'line1')).toEqual('211');
    });

    it('handles no street number or name', () => {
      delete testAddress.street;
      delete testAddress.streetNumber;
      expect(pipe.transform(testAddress, 'line1')).toEqual('');
    });

    it('handles no address object', () => {
      expect(pipe.transform(undefined, 'line1')).toEqual('');
    });
  });

  describe('line 2', () => {
    it('formats the full data', () => {
      expect(pipe.transform(testAddress, 'line2')).toEqual('Yeahderhay, ND 77835');
    });

    it('handles no city', () => {
      delete testAddress.city;
      expect(pipe.transform(testAddress, 'line2')).toEqual('ND 77835');
    });

    it('handles no area', () => {
      delete testAddress.area;
      expect(pipe.transform(testAddress, 'line2')).toEqual('Yeahderhay 77835');
    });

    it('handles no postal code', () => {
      delete testAddress.postalCode;
      expect(pipe.transform(testAddress, 'line2')).toEqual('Yeahderhay, ND');
    });

    it('handles just city', () => {
      delete testAddress.area;
      delete testAddress.postalCode;
      expect(pipe.transform(testAddress, 'line2')).toEqual('Yeahderhay');
    });

    it('handles just area', () => {
      delete testAddress.city;
      delete testAddress.postalCode;
      expect(pipe.transform(testAddress, 'line2')).toEqual('ND');
    });

    it('handles just postal code', () => {
      delete testAddress.city;
      delete testAddress.area;
      expect(pipe.transform(testAddress, 'line2')).toEqual('77835');
    });

    it('handles no city, area, or postal code', () => {
      delete testAddress.city;
      delete testAddress.area;
      delete testAddress.postalCode;
      expect(pipe.transform(testAddress, 'line2')).toEqual('');
    });

    it('handles no address object', () => {
      expect(pipe.transform(undefined, 'line2')).toEqual('');
    });
  });

  it('returns an empty string if there is no format', () => {
      expect(pipe.transform(testAddress, '')).toEqual('');
  });

  it('returns an empty string if the format is unknown', () => {
      expect(pipe.transform(testAddress, 'line42')).toEqual('');
  });
});
