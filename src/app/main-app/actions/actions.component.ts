import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { CommService } from 'src/app/Shared/Service/comm.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {
  image:any
  
  constructor(private client:CommService) { }

  ngOnInit(): void {
    // let docId = "3d550612-8056-4163-8c11-1deab798cef5"

    // this.client.getDocumentById(docId).pipe(
    //   map(data=>[data,data.image])
    // ).subscribe(
    //   ([result,image])=>{
    //     console.log(result)
    //     this.image = 'data:image/png;base64,' + image;
    //   }
    // )

  }

}
