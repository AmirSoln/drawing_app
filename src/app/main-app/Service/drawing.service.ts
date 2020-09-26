import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Point } from '../Dto/point';
import { PosInfo } from '../Dto/pos-info';

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

   clearCanvas(canvas:any): void {
    console.log('here' + canvas)
    var ctx2 = canvas.getContext('2d')
    ctx2.clearRect(0, 0, canvas.width, canvas.height)
  }

  getPosFromCenterAndRadius(center: Point, radius: Point) {
    let pos = new PosInfo()
    pos.centerX = center.X
    pos.centerY = center.Y
    pos.radiusX = radius.X
    pos.radiusY = radius.Y
    return pos
  }
}
