import { Component, OnInit } from '@angular/core';
import { ForecastService } from '../../services/forecast.service';
import { showUp, showUpStaggered } from '../animations/showUp.animation';

@Component({
  selector: 'app-fore-cast',
  templateUrl: './fore-cast.component.html',
  styleUrls: ['./fore-cast.component.sass'],
  animations: [showUpStaggered]
})
export class ForeCastComponent implements OnInit {

  constructor(public forecastService: ForecastService) { }

  ngOnInit(): void {
  }

}
