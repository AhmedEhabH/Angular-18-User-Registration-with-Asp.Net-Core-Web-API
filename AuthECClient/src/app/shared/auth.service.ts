import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn : 'root'})
export class AuthService {

    baseURL: string = 'http://localhost:5229/api';

    constructor(private http: HttpClient) {}

    createUser(formData: any) {
        return this.http.post(`${this.baseURL}/signup`, formData)
    }
}
