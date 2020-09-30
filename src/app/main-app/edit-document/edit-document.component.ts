import { Point } from './../Dto/point';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MarkerService } from '../Service/marker.service';
import { MarkerType } from 'src/app/Shared/Dto/marker-type.enum';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { DocumentService } from '../Service/document.service';
import { ActivatedRoute } from '@angular/router';
import { DrawingService } from '../Service/drawing.service';
import { Document } from '../Dto/document';
import { SharedDocumentService } from '../Service/shared-document.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css'],
  providers: [MarkerService, DocumentService, DrawingService, SharedDocumentService]
})
export class EditDocumentComponent implements OnInit {
  isMarkerSelected = false
  markerType: MarkerType
  color: string
  document: Document = new Document()
  isShared: boolean
  isLoading:boolean

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
    private sharingService: SharedDocumentService,
    private location: Location) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.isLoading = true
      this.documentId = params['documentId']
      this.documentService.getDocumentById(this.documentId)
      this.initObservers();
    })
  }

  private initObservers() {
    this.markerSerivce.onCreateMarkerResponseOk().subscribe(
      response => {
        this.notifications.showSuccess("Great!", "Success")
        var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
        let marker = response.request.marker
        let position = JSON.parse(marker.position)
        this.drawShapeOnCanvas(ctx1, position, marker.markerType, this.color)
      }
    );

    this.markerSerivce.onGetMarkersResponseOk().subscribe(
      response => {
        this.drawMarkers(response)
        var ctx1 = this.shapeCanvas.nativeElement.getContext('2d')
        ctx1.strokeStyle = "Black"
        this.sharingService.getAllUsersForShare(this.documentId)
      }
    );

    this.documentService.onGetDocumentResponseOk().subscribe(
      result => {
        this.document = result.doc;
        this.image = 'data:image/png;base64,' +result.image;
        this.buildImage(this.shapeCanvas.nativeElement.getContext('2d'));
      }
    );

    this.sharingService.onGetAllUsersResponseOk().subscribe(
      result => {
        this.isShared = Array.of(...result).filter(obj => obj.isSharedWith).length > 0
        this.isLoading = false
      }
    );

    this.documentService.onAppResponseError().subscribe(
      result=>{
        this.notifications.showError('An error has occured. try again later',"Error")
        this.isLoading=false
      }
    )

    this.documentService.onGetDocumentResponseInvalidId().subscribe(
      result=>{
        this.notifications.showError('The file requested doesn\'t exists','Error')
        this.location.back()
      }
    )
  }

  buildImage(ctx1: any) {
    var shapeCanvas = this.shapeCanvas.nativeElement
    var drawingCanvas = this.drawingCanvas.nativeElement
    let base_image = new Image()
    base_image.src = this.image
    base_image.onload = () => {
      this.setCanvasBoundaries(shapeCanvas, base_image.width, base_image.height, drawingCanvas);
      ctx1.drawImage(base_image, 0, 0, base_image.width, base_image.height);
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
    this.configureLineParams(ctx1, color);
    if (markerType == MarkerType.Ellipse) {
      ctx1.ellipse(position.centerX, position.centerY, position.radiusX, position.radiusY, 0, 0, 2 * Math.PI)
    } else {
      let topLeftX = position.centerX - position.radiusX
      let topLeftY = position.centerY - position.radiusY
      ctx1.rect(topLeftX, topLeftY, position.radiusX * 2, position.radiusY * 2)
    }
    ctx1.stroke()
  }

  private configureLineParams(ctx1: any, color: any, width: number = 2) {
    ctx1.lineWidth = width;
    ctx1.strokeStyle = color;
  }
}