import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Point } from '../Dto/point';

@Injectable()
export class DrawingService {

  mDown: Boolean
  mouseDown$: any
  poly: Subject<Point>
  switchSubject: Subject<Point>

  constructor() {
    this.poly = new Subject<Point>()
    this.switchSubject = new Subject<Point>()
    this.mDown = false
   }
}
