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
export class ForecastService {
  public weatherSubject: Subject<any> = new Subject<any>();
  public weather$: Observable<any>;

  endpoint: string = 'https://api.openweathermap.org/data/2.5/forecast';

  constructor(private http: HttpClient, private geolocationService:GeolocationService) {
    this.weather$ = this.weatherSubject.asObservable().pipe(
      map(this.structureData));
    this.geolocationService.coords$.subscribe((coords)=>{
      this.get(coords);
    })
  }
  
  structureData(data:any){

    let minMaxPerDay ={};
    data.list.forEach(weatherObject => {
      let date = new Date(weatherObject.dt * 10000);
      let hours = date.getHours();
      let month = date.getMonth();
      let day = date.getDay();
      let key = `${month}-${day}`;
      let tempPerDay: Weather = minMaxPerDay[key] || {
        minMaxTemp:{}
      };
      if(!tempPerDay.cod || hours == 16){
        let source = weatherObject.weather[0];
        tempPerDay = {...tempPerDay, ...source};
        tempPerDay.cod = source.id;
        tempPerDay.name = data.city.name;
      }
      if (!tempPerDay.minMaxTemp.min || (weatherObject.main.temp_min < tempPerDay.minMaxTemp.min )){
        tempPerDay.minMaxTemp.min = weatherObject.main.temp_min
      }
      if (!tempPerDay.minMaxTemp.max || (weatherObject.main.temp_max > tempPerDay.minMaxTemp.max)){
        tempPerDay.minMaxTemp.max = weatherObject.main.temp_max
      }
      minMaxPerDay[key] = tempPerDay;
    });
    return Object.values(minMaxPerDay);
  }
  get(coords: Coords) {
    let args: string = `?lat=${coords.lat}&lon=${coords.lon}&appid=${environment.key}&units=metric`;
    let url = this.endpoint + args;
    // if (isDevMode()) {
    //   url = 'assets/forecast.json';
    // }
    return this.http.get(url).subscribe(this.weatherSubject);
  }
}
