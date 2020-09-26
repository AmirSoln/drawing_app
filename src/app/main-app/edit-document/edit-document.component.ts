import { Point } from './../Dto/point';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { faCircleNotch, faSquare, faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Subject, fromEvent } from 'rxjs';
import { buffer, switchMap, takeUntil } from 'rxjs/operators';
import { MarkerService } from '../Service/marker.service';
import { PosInfo } from '../Dto/pos-info';
import { MarkerType } from 'src/app/Shared/Dto/marker-type.enum';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { DocumentService } from '../Service/document.service';
import { ActivatedRoute } from '@angular/router';
import { DrawingService } from '../Service/drawing.service';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css'],
  providers: [MarkerService, DocumentService, DrawingService]
})
export class EditDocumentComponent implements OnInit {
  circle = faCircleNotch
  square = faSquare
  arrow = faArrowLeft
  delete = faTimes

  isMarkerSelected = false
  markerType: MarkerType
  color:string

  image: any
  @Input() documentId: string

  @ViewChild('shapeCanvas', { static: false }) shapeCanvas: ElementRef
  @ViewChild('drawingCanvas', { static: false }) drawingCanvas: ElementRef
  @ViewChild('btn', { static: false }) btn: ElementRef
  title = 'DrawingApp'
  mDown: Boolean
  mouseDown$: any
  poly: Subject<Point>
  switchSubject: Subject<Point>

  constructor(private markerSerivce: MarkerService,
    private notifications: NotificationService,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private drawingService: DrawingService) {
    this.poly = new Subject<Point>()
    this.switchSubject = new Subject<Point>()
    this.mDown = false
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.documentId = params['documentId']
      this.documentService.getDocumentById(this.documentId)

      this.markerSerivce.onCreateMarkerResponseOk().subscribe(
        response => {
          this.notifications.showSuccess("Great!", "Success")
          var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
          let marker = response.request.marker
          let position = JSON.parse(marker.position)
          this.drawShapeOnCanvas(ctx1, position, marker.markerType,this.color)
        }
      )

      this.markerSerivce.onGetMarkersResponseOk().subscribe(
        response => {
          this.drawMarkers(response)
        }
      )
    })

    this.documentService.onGetDocumentResponseOk().subscribe(
      result => {
        this.image = result
        var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
        let base_image = new Image()
        base_image.src = this.image
        base_image.onload = () => {
          ctx1.drawImage(base_image, 0, 0)
          this.markerSerivce.getMarkers(this.documentId)
        }
      }
    )
  }

  onCircleClicked(): void {
    this.markerType = MarkerType.Ellipse
  }

  onRectangleClicked(): void {
    this.markerType = MarkerType.Rectangle
  }

  setColor(event):void {
    console.log('value', event.target.value);
    this.color = event.target.value
  }

  freeDraw(evt): void {
    var canvas = this.drawingCanvas.nativeElement
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

  drawShape(shapePoly: Array<Point>) {
    if (shapePoly.length == 0)
      return
    var center = new Point(0, 0)
    center = shapePoly.reduce((acc, pt) => acc.add(pt))
    center = center.div(shapePoly.length)
    var radius = new Point(0, 0)
    radius = shapePoly.reduce((acc, pt) => acc.add(new Point(Math.abs(pt.X - center.X), Math.abs(pt.Y - center.Y))))
    radius = radius.div(shapePoly.length)

    let pos = this.drawingService.getPosFromCenterAndRadius(center, radius)
    this.markerSerivce.createMarker(pos, this.documentId, this.markerType,this.color)
  }

  ngAfterViewInit() {
    var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
    this.shapeCanvas.nativeElement.height = 1200
    this.drawingCanvas.nativeElement.height = 1200

    var ctx2 = this.drawingCanvas.nativeElement.getContext('2d')
    ctx1.canvas.width = window.innerWidth
    ctx1.canvas.height = window.innerHeight
    ctx2.canvas.width = window.innerWidth
    ctx2.canvas.height = window.innerHeight
    var drawBtn$ = fromEvent(this.btn.nativeElement, 'click')
    var drawMode = false
    drawBtn$.subscribe(evt => drawMode = true)
    var mouseUp$ = fromEvent(this.drawingCanvas.nativeElement, 'mouseup')
    var mousedown$ = fromEvent(this.drawingCanvas.nativeElement, 'mousedown')
    var draw$ = mousedown$.pipe(
      // restart counter on every click
      switchMap(event =>
        fromEvent(this.drawingCanvas.nativeElement, 'mousemove').pipe(
          takeUntil(mouseUp$)
        ))
    )

    draw$.subscribe(evt => this.freeDraw(evt))
    function getDrawMode(value): boolean {
      return drawMode
    }

    this.poly.pipe(
      buffer(mouseUp$),
    ).subscribe(shapePoly => {
      this.drawingService.clearCanvas(this.drawingCanvas.nativeElement)
      this.drawShape(shapePoly)
    })
  }

  /**
   * draws the markers on the document
   * @param response the response from the server containing the makers data
   */
  private drawMarkers(response: any) {
    var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
    var markers = response.markers
    Array.of(...markers).map(element => {
      let position = JSON.parse(element.position)
      this.drawShapeOnCanvas(ctx1, position, element.markerType,element.color)
    })
  }

  private drawShapeOnCanvas(ctx1: any, position: any, markerType: MarkerType,color:any) {
    ctx1.beginPath()
    ctx1.lineWidth = 2
    ctx1.strokeStyle = color
    if (markerType == MarkerType.Ellipse) {
      ctx1.ellipse(position.centerX, position.centerY, position.radiusX, position.radiusY, 0, 0, 2 * Math.PI)
    } else {
      let topLeftX = position.centerX - position.radiusX
      let topLeftY = position.centerY - position.radiusY
      ctx1.rect(topLeftX, topLeftY, position.radiusX * 2, position.radiusY * 2)
    }
    ctx1.stroke()
  }
}
