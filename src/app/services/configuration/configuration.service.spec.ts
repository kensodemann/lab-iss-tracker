import { TestBed, inject } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { ConfigurationService } from './configuration.service';
import { Position } from '../../models/position';

describe('ConfigurationService', () => {
  let configurationService: ConfigurationService;
  let storageSpy;
  let platformSpy;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', {
      ready: Promise.resolve(),
      get: Promise.resolve(),
      set: Promise.resolve()
    });
    platformSpy = jasmine.createSpyObj('Storage', { ready: Promise.resolve() });
    TestBed.configureTestingModule({
      providers: [
        ConfigurationService,
        { provide: Platform, useValue: platformSpy },
        { provide: Storage, useValue: storageSpy }
      ]
    });
    configurationService = new ConfigurationService(platformSpy, storageSpy);
  });

  it(
    'should be created',
    inject([ConfigurationService], (service: ConfigurationService) => {
      expect(service).toBeTruthy();
    })
  );

  describe('init', () => {
    it('checks for the platform being ready', () => {
      configurationService.init();
      expect(platformSpy.ready).toHaveBeenCalledTimes(1);
      expect(storageSpy.ready).not.toHaveBeenCalled();
      expect(storageSpy.get).not.toHaveBeenCalled();
    });

    it('checks for the storage ready if ', async () => {
      configurationService.init();
      await platformSpy.ready;
      expect(storageSpy.ready).toHaveBeenCalledTimes(1);
      expect(storageSpy.get).not.toHaveBeenCalled();
    });

    it('gets the configuration data once the platform and storage are ready', async () => {
      await configurationService.init();
      expect(storageSpy.get).toHaveBeenCalledTimes(4);
      expect(storageSpy.get).toHaveBeenCalledWith('address');
      expect(storageSpy.get).toHaveBeenCalledWith('position');
      expect(storageSpy.get).toHaveBeenCalledWith('refreshRate');
      expect(storageSpy.get).toHaveBeenCalledWith('useCurrentLocation');
    });
  });

  describe('address', () => {
    let address: string;
    beforeEach(() => {
      storageSpy.get.and.callFake(key => {
        if (key === 'address') {
          return Promise.resolve(address);
        }
        return Promise.resolve();
      });
    });

    describe('get', () => {
      it('gets the value fetched on init', async () => {
        address = '4242 Ford Prefect Lane';
        await configurationService.init();
        expect(configurationService.address).toEqual('4242 Ford Prefect Lane');
      });

      it('does not have a default value', () => {
        expect(configurationService.address).toBeUndefined();
      });
    });

    describe('set', () => {
      it('waits for the storage to be ready', () => {
        expect(storageSpy.ready).not.toHaveBeenCalled();
        configurationService.address = '7373 Sheldon Way';
        expect(storageSpy.ready).toHaveBeenCalledTimes(1);
      });

      it('calls the storage set when ready', async () => {
        configurationService.address = '7373 Sheldon Way';
        await storageSpy.ready;
        expect(storageSpy.set).toHaveBeenCalledTimes(1);
        expect(storageSpy.set).toHaveBeenCalledWith(
          'address',
          '7373 Sheldon Way'
        );
      });
    });
  });

  describe('position', () => {
    let position: string;
    beforeEach(() => {
      storageSpy.get.and.callFake(key => {
        if (key === 'position') {
          return Promise.resolve(position);
        }
        return Promise.resolve();
      });
    });

    describe('get', () => {
      it('gets the value fetched on init', async () => {
        position = JSON.stringify({ latitude: -76.449, longitude: 45.996 });
        await configurationService.init();
        expect(configurationService.position).toEqual({
          latitude: -76.449,
          longitude: 45.996
        });
      });

      it('does not have a default value', () => {
        expect(configurationService.position).toBeUndefined();
      });
    });

    describe('set', () => {
      it('waits for the storage to be ready', () => {
        expect(storageSpy.ready).not.toHaveBeenCalled();
        configurationService.position = {
          latitude: -77.3774,
          longitude: 88.884
        };
        expect(storageSpy.ready).toHaveBeenCalledTimes(1);
      });

      it('calls the storage set when ready', async () => {
        configurationService.position = {
          latitude: -77.3774,
          longitude: 88.884
        };
        await storageSpy.ready;
        expect(storageSpy.set).toHaveBeenCalledTimes(1);
        expect(storageSpy.set).toHaveBeenCalledWith(
          'position',
          '{"latitude":-77.3774,"longitude":88.884}'
        );
      });
    });
  });

  describe('refreshRate', () => {
    let refreshRate: string;
    beforeEach(() => {
      storageSpy.get.and.callFake(key => {
        if (key === 'refreshRate') {
          return Promise.resolve(refreshRate);
        }
        return Promise.resolve();
      });
    });

    describe('get', () => {
      it('gets the value fetched on init', async () => {
        refreshRate = '24';
        await configurationService.init();
        expect(configurationService.refreshRate).toEqual(24);
      });

      it('has a default value of 15', () => {
        expect(configurationService.refreshRate).toEqual(15);
      });
    });

    describe('set', () => {
      it('waits for the storage to be ready', () => {
        expect(storageSpy.ready).not.toHaveBeenCalled();
        configurationService.refreshRate = 42;
        expect(storageSpy.ready).toHaveBeenCalledTimes(1);
      });

      it('calls the storage set when ready', async () => {
        configurationService.refreshRate = 42;
        await storageSpy.ready;
        expect(storageSpy.set).toHaveBeenCalledTimes(1);
        expect(storageSpy.set).toHaveBeenCalledWith('refreshRate', '42');
      });
    });
  });

  describe('useCurrentLocation', () => {
    let flag: string;
    beforeEach(() => {
      storageSpy.get.and.callFake(key => {
        if (key === 'useCurrentLocation') {
          return Promise.resolve(flag);
        }
        return Promise.resolve();
      });
    });

    describe('get', () => {
      it('gets the value fetched on init', async () => {
        flag = 'false';
        await configurationService.init();
        expect(configurationService.useCurrentLocation).toEqual(false);
      });

      it('has a default value of true', () => {
        expect(configurationService.useCurrentLocation).toEqual(true);
      });
    });

    describe('set', () => {
      it('waits for the storage to be ready', () => {
        expect(storageSpy.ready).not.toHaveBeenCalled();
        configurationService.useCurrentLocation = true;
        expect(storageSpy.ready).toHaveBeenCalledTimes(1);
      });

      it('calls the storage set when ready', async () => {
        configurationService.useCurrentLocation = true;
        await storageSpy.ready;
        expect(storageSpy.set).toHaveBeenCalledTimes(1);
        expect(storageSpy.set).toHaveBeenCalledWith(
          'useCurrentLocation',
          'true'
        );
      });
    });
  });
});
