import { Point } from './../Dto/point';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { faCircleNotch, faSquare, faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
import { MarkerService } from '../Service/marker.service';
import { MarkerType } from 'src/app/Shared/Dto/marker-type.enum';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { DocumentService } from '../Service/document.service';
import { ActivatedRoute } from '@angular/router';
import { DrawingService } from '../Service/drawing.service';
import { Document } from '../Dto/document';
import { SharedDocumentService } from '../Service/shared-document.service';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css'],
  providers: [MarkerService, DocumentService, DrawingService,SharedDocumentService]
})
export class EditDocumentComponent implements OnInit {
  circle = faCircleNotch
  square = faSquare
  arrow = faArrowLeft
  delete = faTimes

  isMarkerSelected = false
  markerType: MarkerType
  color: string
  document: Document = new Document()
  isShared:boolean

  image: any
  @Input() documentId: string

  @ViewChild('shapeCanvas', { static: false }) shapeCanvas: ElementRef
  @ViewChild('drawingCanvas', { static: false }) drawingCanvas: ElementRef
  @ViewChild('btn', { static: false }) btn: ElementRef
  title = 'DrawingApp'

  constructor(private markerSerivce: MarkerService,
    private notifications: NotificationService,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private drawingService: DrawingService,
    private sharingService:SharedDocumentService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.documentId = params['documentId']
      this.documentService.getDocumentById(this.documentId)
      this.sharingService.getAllUsersForShare(this.documentId)

      this.markerSerivce.onCreateMarkerResponseOk().subscribe(
        response => {
          this.notifications.showSuccess("Great!", "Success")
          var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
          let marker = response.request.marker
          let position = JSON.parse(marker.position)
          this.drawShapeOnCanvas(ctx1, position, marker.markerType, this.color)
        }
      )

      this.markerSerivce.onGetMarkersResponseOk().subscribe(
        response => {
          this.drawMarkers(response)
          var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
          ctx1.strokeStyle = "Black"
        }
      )
    })

    this.documentService.onGetDocumentResponseOk().subscribe(
      result => {
        this.document = result.doc
        this.image = result.image
        var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
        this.buildImage(ctx1, this.shapeCanvas.nativeElement.width, this.shapeCanvas.nativeElement.height);
      }
    )

    this.sharingService.onGetAllUsersResponseOk().subscribe(
      result=>{
        this.isShared = Array.of(...result).filter(obj=>obj.isSharedWith).length>0
      }
    )
  }

  buildImage(ctx1: any, maxWidth: number, maxHeight: number) {
    var shapeCanvas = this.shapeCanvas.nativeElement
    var drawingCanvas = this.drawingCanvas.nativeElement
    let base_image = new Image()
    base_image.src = this.image
    base_image.onload = () => {
      let width = base_image.width
      let height = base_image.height
      if (width <= maxWidth && height <= maxHeight) {
        ctx1.drawImage(base_image, 0, 0)
      } else {
        this.setCanvasBoundaries(shapeCanvas, base_image.width, base_image.height, drawingCanvas);
        ctx1.drawImage(base_image, 0, 0, base_image.width, base_image.height);
      }
      this.markerSerivce.getMarkers(this.documentId)
    }
  }

  setCanvasBoundaries(shapeCanvas: any, newWidth: number, newHeight: number, drawingCanvas: any) {
    shapeCanvas.width = newWidth;
    shapeCanvas.height = newHeight;
    drawingCanvas.width = newWidth;
    drawingCanvas.height = newHeight;
  }

  onCircleClicked(): void {
    this.markerType = MarkerType.Ellipse
  }

  onRectangleClicked(): void {
    this.markerType = MarkerType.Rectangle
  }

  setColor(event: any): void {
    this.color = event.target.value
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
    this.markerSerivce.createMarker(pos, this.documentId, this.markerType, this.color)
  }

  ngAfterViewInit() {
    this.drawingService.initDrawings(this.drawingCanvas)
    this.drawingService.onFinishedFreeDraw().subscribe(
      result => this.drawShape(result)
    )
    // var drawBtn$ = fromEvent(this.btn.nativeElement, 'click')
    // var drawMode = false
    // drawBtn$.subscribe(evt => drawMode = true)
  }

  drawMarkers(response: any) {
    var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
    var markers = response.markers
    Array.of(...markers).map(element => {
      let position = JSON.parse(element.position)
      this.drawShapeOnCanvas(ctx1, position, element.markerType, element.color)
    })
  }

  drawShapeOnCanvas(ctx1: any, position: any, markerType: MarkerType, color: any) {
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