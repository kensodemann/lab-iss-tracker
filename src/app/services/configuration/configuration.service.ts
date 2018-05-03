import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Position } from '../../models/position';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
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
    private storage: Storage
  ) { }

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

  private async loadData(): Promise<void> {
    await this.platform.ready();
    await this.loadFromAppPreferences();
  }

  private async loadFromAppPreferences(): Promise<void> {
    await this.storage.ready();
    await Promise.all([
      this._address = await this.storage.get(this._addressKey),
      this._position = await this.storage.get(this._positionKey),
      this._refreshRate = await this.storage.get(this._refreshRateKey),
      this._useCurrentLocation = await this.storage.get(this._useCurrentLocationKey),
    ]);
  }

  private async store(key: string, value: any) {
    await this.storage.ready();
    this.storage.set(
      key,
      key === this._positionKey
        ? value && JSON.stringify(value)
        : value && value.toString()
    );
  }
}
