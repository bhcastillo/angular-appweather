import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Coords } from '../interfaces/coords.interface';
import { map } from 'rxjs/operators';
import { Weather } from '../interfaces/weather.interface';
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root',
})
export class CurrentWeatherService {
  public weatherSubject: Subject<any> = new Subject<any>();
  public weather$: Observable<any>;

  endpoint: string = 'https://api.openweathermap.org/data/2.5/weather';
  constructor(private http: HttpClient, private geolocationService:GeolocationService) {
    this.weather$ = this.weatherSubject.asObservable().pipe(

      map((data:any) => {
        let mainweather = data.weather[0];
        let weather: Weather = {
          name:data.name,
          cod:data.cod,
          temp:data.main.temp,
          ...mainweather

        }
        return weather
    }));

    this.geolocationService.coords$.subscribe((coords)=>{
      this.get(coords);
    })
  }
  get(coords: Coords) {
    let args: string = `?lat=${coords.lat}&lon=${coords.lon}&appid=${environment.key}&units=metric`;
    let url = this.endpoint + args;
    // if (isDevMode()) {
    //   url = 'assets/weather.json';
    // }
    return this.http.get(url).subscribe(this.weatherSubject);
  }
}
