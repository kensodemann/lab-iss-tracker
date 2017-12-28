import { AppPreferences } from '@ionic-native/app-preferences';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Position } from '../../models/position';

@Injectable()
export class ConfigurationProvider {
  private _address: string;
  private _position: Position;
  private _refreshRate: number;
  private _useCurrentLocation: boolean;
  private _promise: Promise<void>;

  private _addressKey = 'address';
  private _positionKey = 'position';
  private _refreshRateKey = 'refreshRate';
  private _useCurrentLocationKey = 'useCurrentLocation';

  constructor(
    private platform: Platform,
    private preferences: AppPreferences
  ) {}

  init(): Promise<void> {
    if (!this._promise) {
      this._promise = this.loadData();
    }
    return this._promise;
  }

  set address(value: string) {
    this._address = value;
    this.store(this._addressKey, value);
  }

  get address(): string {
    return this._address;
  }

  set position(value: Position) {
    this._position = value;
    this.store(this._positionKey, value);
  }

  get position(): Position {
    return this._position;
  }

  set refreshRate(value: number) {
    this._refreshRate = value;
    this.store(this._refreshRateKey, value);
  }

  get refreshRate(): number {
    return this._refreshRate || 15;
  }

  set useCurrentLocation(value: boolean) {
    this._useCurrentLocation = value;
    this.store(this._useCurrentLocationKey, value);
  }

  get useCurrentLocation(): boolean {
    return this._useCurrentLocation === false ? false : true;
  }

  private isNative(): boolean {
    return this.platform.is('cordova');
  }

  private async loadData(): Promise<void> {
    await this.platform.ready();
    if (this.isNative()) {
      await this.loadFromAppPreferences();
    } else {
      this.loadFromLocalStorage();
    }
  }

  private loadFromAppPreferences(): Promise<void> {
    return Promise.all([
      this.preferences
        .fetch(undefined, this._addressKey)
        .then(x => (this._address = x)),
      this.preferences
        .fetch(undefined, this._positionKey)
        .then(x => (this._position = x)),
      this.preferences
        .fetch(undefined, this._refreshRateKey)
        .then(x => (this._refreshRate = x)),
      this.preferences
        .fetch(undefined, this._useCurrentLocationKey)
        .then(x => (this._useCurrentLocation = x))
    ]).then(() => null);
  }

  private loadFromLocalStorage(): void {
    const posStr = localStorage.getItem(this._positionKey);
    this._address = localStorage.getItem(this._addressKey);
    if (posStr) {
      this._position = JSON.parse(posStr);
    }
    this._refreshRate =
      parseInt(localStorage.getItem(this._refreshRateKey)) || 15;
    this._useCurrentLocation =
      localStorage.getItem(this._useCurrentLocationKey) === 'false'
        ? false
        : true;
  }

  private async store(key: string, value: any) {
    await this.platform.ready();
    if (this.isNative()) {
      await this.preferences.store(undefined, this._positionKey, value);
    } else {
      localStorage.setItem(
        key,
        key === this._positionKey
          ? value && JSON.stringify(value)
          : value && value.toString()
      );
    }
  }
}
