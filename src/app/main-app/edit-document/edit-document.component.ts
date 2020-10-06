import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Point } from './../Dto/point';
import { Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { MarkerService } from '../Service/marker.service';
import { MarkerType } from 'src/app/Shared/Dto/marker-type.enum';
import { NotificationService } from 'src/app/Shared/Service/notification.service';
import { DocumentService } from '../Service/document.service';
import { ActivatedRoute } from '@angular/router';
import { DrawingService } from '../Service/drawing.service';
import { Document } from '../Dto/document';
import { SharedDocumentService } from '../Service/shared-document.service';
import { Location } from '@angular/common';
import { Marker } from '../Dto/marker';
import { LoginService } from 'src/app/authentication/Service/login.service';
import { UserInfo } from 'src/app/Shared/Dto/user-info';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css'],
  providers: [MarkerService, DocumentService, DrawingService, SharedDocumentService]
})
export class EditDocumentComponent implements OnInit {
  markerType: MarkerType
  color: string
  document: Document = new Document()
  isShared: boolean
  isLoading: boolean
  markers: Array<Marker>
  sharedWithUsers:Array<UserInfo>
  headElements: Array<string> = ['Preview', 'Marker Id', 'Color', 'Actions']
  websocket1: WebSocket


  image: any
  @Input() documentId: string

  @ViewChild('shapeCanvas', { static: false }) shapeCanvas: ElementRef
  @ViewChild('drawingCanvas', { static: false }) drawingCanvas: ElementRef
  @ViewChild('freeDrawingCanvas', { static: false }) freeDrawingCanvas: ElementRef
  title = 'DrawingApp'

  constructor(private markerSerivce: MarkerService,
    private notifications: NotificationService,
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private drawingService: DrawingService,
    private sharingService: SharedDocumentService,
    private location: Location,
    private loginService: LoginService,
    private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sharedWithUsers = new Array()
      this.isLoading = true
      this.documentId = params['documentId']
      this.documentService.getDocumentById(this.documentId)
      this.initObservers();
    })
  }

  ConnectSocket(userId: string) {
    this.websocket1 = new WebSocket("wss://localhost:5001/ws?userId=" + userId + "&docId="+this.documentId)

    var self = this
    this.websocket1.onopen = function (evt) {
      console.log("socket open" + JSON.stringify(evt))
    }
    self.websocket1.onmessage = (evt => {
      console.log(evt)
      let obj = JSON.parse(evt.data)
      if(obj.DtoType == "Connected"){
        let user = obj.Data as UserInfo
        this.sharedWithUsers.push(user)
      }else if(obj.DtoType == "Disconnected"){
        let user = obj.Data as UserInfo
        this.sharedWithUsers = this.sharedWithUsers.filter(us=>us.email != user.email)
      }else{
        let users = obj.Data.Users
        users.map(us=>this.sharedWithUsers.push(us as UserInfo))
      }
      return false
    }
    )
    self.websocket1.onerror = (evt => { console.log('error ', evt) })
    self.websocket1.onclose = ((evt) => {
      console.log("close socket");
      console.log(evt)
    }
    )
  }

  ngOnDestroy(): void {
    console.log("OnDestroy")
    this.websocket1.close()
  }

  private initObservers() {
    this.markerSerivce.onCreateMarkerResponseOk().subscribe(
      response => {
        this.notifications.showSuccess("Great!", "Success")
        var ctx1 = this.drawingCanvas.nativeElement.getContext('2d')
        let marker = response.request.marker
        let position = JSON.parse(marker.position)
        this.drawShapeOnCanvas(ctx1, position, marker.markerType, this.color)
        this.addMarkerToArray(marker)
      }
    );

    this.markerSerivce.onGetMarkersResponseOk().subscribe(
      response => {
        var markers = response.markers
        this.markers = markers
        this.drawMarkers(markers)
        var ctx1 = this.drawingCanvas.nativeElement.getContext('2d')
        ctx1.strokeStyle = "Black"
        this.sharingService.getAllUsersForShare(this.documentId)
      }
    );

    this.documentService.onGetDocumentResponseOk().subscribe(
      result => {
        this.document = result.doc;
        this.image = 'data:image/png;base64,' + result.image;
        this.buildImage(this.shapeCanvas.nativeElement.getContext('2d'));
      }
    );

    this.sharingService.onGetAllUsersResponseOk().subscribe(
      result => {
        this.isShared = Array.of(...result).filter(obj => obj.isSharedWith).length > 0
        this.ConnectSocket(this.loginService.getLoggedInUser())
        this.isLoading = false
      }
    );

    this.documentService.onAppResponseError().subscribe(
      result => {
        this.notifications.showError('An error has occured. try again later', "Error")
        this.isLoading = false
      }
    )

    this.documentService.onGetDocumentResponseInvalidId().subscribe(
      result => {
        this.notifications.showError('The file requested doesn\'t exists', 'Error')
        this.location.back()
      }
    )

    this.markerSerivce.onDeleteMarkerResponseOk().subscribe(
      result => {
        this.notifications.showSuccess("Great!", "Success")
        this.markers = this.markers.filter(marker => marker.markerId != result.request.markerId)
        this.drawingService.clearCanvas(this.drawingCanvas.nativeElement)
        this.drawMarkers(this.markers)
      }
    )
  }

  addMarkerToArray(marker: any) {
    var tmpMarker = new Marker(marker.docId, marker.position, marker.ownerUser, marker.markerType, marker.color, marker.markerId)
    console.log(tmpMarker)
    console.log(marker)
    this.markers.push(tmpMarker)
  }

  changeDrawMode(isDrawing: boolean) {
    this.drawingService.changeDrawMode(isDrawing)
  }

  buildImage(ctx1: any) {
    let base_image = new Image()
    base_image.src = this.image
    base_image.onload = () => {
      this.setCanvasBoundaries(
        [this.shapeCanvas.nativeElement, this.drawingCanvas.nativeElement, this.freeDrawingCanvas.nativeElement]
        , base_image.width, base_image.height);
      ctx1.drawImage(base_image, 0, 0, base_image.width, base_image.height);
      this.markerSerivce.getMarkers(this.documentId)
    }
  }

  setCanvasBoundaries(canvases: Array<any>, newWidth: number, newHeight: number) {
    canvases.map(canvas => {
      canvas.width = newWidth
      canvas.height = newHeight
    })
  }

  onCircleClicked(): void {
    this.markerType = MarkerType.Ellipse
    this.changeDrawMode(true)
  }

  onRectangleClicked(): void {
    this.markerType = MarkerType.Rectangle
    this.changeDrawMode(true)
  }

  setColor(event: any): void {
    this.color = event.target.value
    this.changeDrawMode(false)
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
    this.drawingService.initDrawings(this.freeDrawingCanvas)
    this.drawingService.onFinishedFreeDraw().subscribe(
      result => this.drawShape(result)
    )
    // this.test()

  }

  drawMarkers(markers: any, fill: boolean = false) {
    var ctx1 = this.drawingCanvas.nativeElement.getContext('2d')
    Array.of(...markers).map(element => {
      let position = JSON.parse(element.position)
      this.drawShapeOnCanvas(ctx1, position, element.markerType, element.color, fill)
    })
  }

  drawShapeOnCanvas(ctx1: any, position: any, markerType: MarkerType, color: any, isFilled: boolean = false): void {
    ctx1.beginPath()
    this.configureLineParams(ctx1, color);
    if (markerType == MarkerType.Ellipse) {
      ctx1.ellipse(position.centerX, position.centerY, position.radiusX, position.radiusY, 0, 0, 2 * Math.PI)
    } else {
      let topLeftX = position.centerX - position.radiusX
      let topLeftY = position.centerY - position.radiusY
      ctx1.rect(topLeftX, topLeftY, position.radiusX * 2, position.radiusY * 2)
    }
    if (!isFilled) {
      ctx1.stroke()
    } else {
      ctx1.fill()
    }
  }

  private configureLineParams(ctx1: any, color: any, width: number = 2): void {
    let tempColor = color
    if (color == null) {
      tempColor = 'black'
    }
    ctx1.lineWidth = width
    ctx1.strokeStyle = tempColor
    ctx1.fillStyle = tempColor
  }

  showPreview(markerId: string): void {
    this.drawingService.clearCanvas(this.drawingCanvas.nativeElement)
    this.drawMarkers(this.markers)
    var ctx1 = this.drawingCanvas.nativeElement.getContext('2d')
    var marker = this.markers.find(obj => obj.markerId == markerId)
    let position = JSON.parse(marker.position)
    this.drawShapeOnCanvas(ctx1, position, marker.markerType, marker.color == null ? 'black' : marker.color, true)
  }

  scroll(el: HTMLElement): void {
    el.scrollIntoView({ behavior: "smooth", block: 'center' });
    this.changeDrawMode(false)
  }

  deleteMarker(markerId: string): void {
    this.markerSerivce.deleteMarker(markerId)
  }

  // test(): void {
  //   var ctx1 = this.drawingCanvas.nativeElement.getContext('2d')
  //   var mouseUp$ = fromEvent(this.freeDrawingCanvas.nativeElement, 'click')
  //   mouseUp$.subscribe(event => {
  //     let tempEvent = event as MouseEvent
  //     var markersInClick = this.markers.filter(marker => {
  //       let pos = JSON.parse(marker.position)
  //       const rectangle = new Path2D();
  //       rectangle.rect(pos.centerX - pos.radiusX, pos.centerY - pos.radiusY, pos.radiusX * 2, pos.radiusY * 2)
  //       return ctx1.isPointInPath(rectangle, tempEvent.offsetX, tempEvent.offsetY)
  //     })
  //     console.log(markersInClick)
  //     let settings: NgbModalOptions={
  //       size: 'sm',
  //     }
  //     const modalRef = this.modalService.open(MarkerChangesComponent,settings)
  //     modalRef.componentInstance.markers = markersInClick
  //     markersInClick.map(marker => {
  //       let pos = JSON.parse(marker.position)
  //       const rectangle = new Path2D();
  //       rectangle.rect(pos.centerX - pos.radiusX, pos.centerY - pos.radiusY, pos.radiusX * 2, pos.radiusY * 2)
  //       ctx1.fill(rectangle)
  //     })
  //   })
  // }

  // send() {
  //   if (this.websocket1.readyState === WebSocket.OPEN) {
  //     let obj = {
  //       blat: '1'
  //     }
  //     this.websocket1.send(JSON.stringify(obj))
  //   }
  // }
}