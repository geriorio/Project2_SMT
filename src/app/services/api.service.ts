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

export interface TripInfo {
  driver: string;
  codriver: string;
  truckPlate: string;
  routeID: string;
  plant: string;
  ETADate: string;
  truckDesc: string;
}

export interface GetTripDataRequest {
  tripNum: string;
}

export interface GetTripDataResponse {
  success: boolean;
  data: TripInfo;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private sendTripDataUrl = 'https://epictestapp.samator.com/KineticTest2/api/v2/efx/SGI/SMTTruckCheckApp/InsertStagingTable';
  private getTripDataUrl = `${environment.api.baseUrl}${environment.api.endpoints.getTripData}`;

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
    console.log('API URL:', this.sendTripDataUrl);

    return this.http.post(this.sendTripDataUrl, data, { headers });
  }

  /**
   * Get trip data by trip number
   */
  getTripData(tripNum: string): Observable<TripInfo> {
    const basicAuth = btoa(`${environment.api.basicAuth.username}:${environment.api.basicAuth.password}`);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${basicAuth}`,
      'X-API-Key': environment.api.apiKey
    });

    const requestBody: GetTripDataRequest = {
      tripNum: tripNum
    };

    console.log('Get Trip Data Request:', requestBody);
    console.log('Request Headers:', {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${basicAuth}`,
      'X-API-Key': environment.api.apiKey
    });
    console.log('API URL:', this.getTripDataUrl);

    return this.http.post<TripInfo>(this.getTripDataUrl, requestBody, { headers });
  }
}
