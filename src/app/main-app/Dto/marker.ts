import { MarkerType } from './../../Shared/Dto/marker-type.enum';
export class Marker {
    constructor(public docId:string,
        public position:string,
        public ownerUser:string,
        public markerType:MarkerType,
        public color:string,
        public markerId:string = ""){}
}