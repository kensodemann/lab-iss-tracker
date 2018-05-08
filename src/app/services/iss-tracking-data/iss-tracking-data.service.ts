import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Astronaut } from '../../models/astronaut';
import { Pass } from '../../models/pass';
import { Position } from '../../models/position';

@Injectable({
  providedIn: 'root'
})
export class IssTrackingDataService {
  private baseUrl = 'http://api.open-notify.org';

  constructor(private http: HttpClient) {}

  location(): Observable<Position> {
    return this.http
      .get(`${this.baseUrl}/iss-now.json`)
      .pipe(
        map(res => ({
          latitude: parseFloat((res as any).iss_position.latitude),
          longitude: parseFloat((res as any).iss_position.longitude)
        }))
      );
  }

  nextPasses(position: Position): Observable<Array<Pass>> {
    return this.http
      .jsonp(
        `${this.baseUrl}/iss-pass.json?lat=${position.latitude}&lon=${
          position.longitude
        }`,
        'callback'
      )
      .pipe(
        map(res => {
          const data = (res as any).response.map(r => ({
            duration: r.duration,
            riseTime: new Date(r.risetime * 1000)
          }));
          return data;
        })
      );
  }

  astronauts(): Observable<Array<Astronaut>> {
    return this.http
      .get(`${this.baseUrl}/astros.json`)
      .pipe(map(res => (res as any).people as Array<Astronaut>));
  }
}
