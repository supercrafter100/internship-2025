import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(private readonly http: HttpClient) {}
  private apiUrl = environment.apiUrl;

  public getReading<T>(id: string, start: Date, end: Date) {
    return fetch(
      this.apiUrl + '/' + id + '/' + start.getTime() + end.getTime()
    ).then((res) => res.json());
  }
}
