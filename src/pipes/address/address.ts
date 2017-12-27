import { Pipe, PipeTransform } from '@angular/core';

import { Address } from '../../models/address';

@Pipe({
  name: 'address'
})
export class AddressPipe implements PipeTransform {
  transform(value: Address, format: string): string {
    if (!value) {
      return '';
    }

    switch (format) {
      case 'line1':
        return `${value.streetNumber}${
          value.streetNumber && value.street ? ' ' : ''
        }${value.street}`;

      case 'line2':
        let rtn = value.city;
        if (value.area) {
          rtn += rtn && ', '
          rtn += value.area;
        }
        if (value.postalCode) {
          rtn += rtn && ' '
          rtn += value.postalCode;
        }
        return rtn;

      default:
        return '';
    }
  }
}
