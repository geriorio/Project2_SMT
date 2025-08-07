import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TripData {
  odometer: number;
  type: string;
  chk1: boolean;
  chk2: boolean;
  chk3: boolean;
  chk4: boolean;
  chk5: boolean;
  tripNum: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://epictestapp.samator.com/KineticTest2/api/v2/efx/SGI/SMTTruckCheckApp/InsertStagingTable';

  constructor(private http: HttpClient) {}

  sendTripData(data: TripData): Observable<any> {
    const basicAuth = btoa(`${environment.api.basicAuth.username}:${environment.api.basicAuth.password}`);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${basicAuth}`,
      'Company': 'test',
      'X-API-Key': environment.api.apiKey
    });

    console.log('Trip Data Request:', data);
    console.log('Request Headers:', {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${basicAuth}`,
      'Company': 'test',
      'X-API-Key': environment.api.apiKey
    });
    console.log('API URL:', this.apiUrl);

    return this.http.post(this.apiUrl, data, { headers });
  }
}
