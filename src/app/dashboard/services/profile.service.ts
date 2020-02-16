import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private url = '';
constructor(private http: HttpClient) { 
  this.url = environment.url;
}


createUserProfile(profile: any) {
  return this.http.post<{message: string, data: any}>(`${this.url}api/user/createprofile`, profile).pipe(map(data => data))
}

getProfile(userId) {
  return this.http.get(`${this.url}api/user/${userId}`).pipe(map(data => data));
}

}
