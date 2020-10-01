import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { buffer, switchMap, takeUntil } from 'rxjs/operators';
import { Point } from '../Dto/point';
import { PosInfo } from '../Dto/pos-info';

@Injectable()
export class DrawingService {
  finishedFreeDraw: Subject<any> = new Subject<any>()

  isDrawing:boolean
  mouseDown$: any
  poly: Subject<Point>

  constructor() {
    this.poly = new Subject<Point>()
  }

  changeDrawMode(isDrawing: boolean) {
    this.isDrawing = isDrawing
  }

  onFinishedFreeDraw(): Observable<any> {
    return this.finishedFreeDraw
  }

  clearCanvas(canvas: any): void {
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

  freeDraw(evt: any, canvas: any): void {
    var ctx2 = canvas.getContext('2d')
    var rect = canvas.getBoundingClientRect()
    var xcanvas = evt.clientX - rect.left
    var ycanvas = evt.clientY - rect.top

    ctx2.beginPath()
    ctx2.moveTo(xcanvas - evt.movementX, ycanvas - evt.movementY)
    ctx2.lineTo(xcanvas, ycanvas)
    ctx2.stroke()
    this.poly.next(new Point(xcanvas - evt.movementX, ycanvas - evt.movementY))
  }

  initDrawings(drawingCanvas: any,): void {
    var mouseUp$ = fromEvent(drawingCanvas.nativeElement, 'mouseup')
    var mousedown$ = fromEvent(drawingCanvas.nativeElement, 'mousedown')
    var draw$ = mousedown$.pipe(
      // restart counter on every click
      switchMap(event =>
        fromEvent(drawingCanvas.nativeElement, 'mousemove').pipe(
          takeUntil(mouseUp$)
        ))
    )

    draw$.subscribe(evt => {
      if(this.isDrawing){
        this.freeDraw(evt, drawingCanvas.nativeElement)
      }
    })

    this.poly.pipe(
      buffer(mouseUp$),
    ).subscribe(shapePoly => {
      this.clearCanvas(drawingCanvas.nativeElement)
      this.finishedFreeDraw.next(shapePoly)
    })
  }
}
