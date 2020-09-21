export class Point {
    constructor(public X:number,public Y:number){}
  add(pt:Point):Point{
      return new Point(this.X+pt.X,this.Y+pt.Y)
  }
  div(denom:number){
    return new Point(this.X/denom,this.Y/denom)
  }
  distanceFrom(pt:Point){
    return Math.sqrt(Math.pow(pt.X-this.X,2)+Math.pow(pt.Y-this.Y,2))
  }
}
