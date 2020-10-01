import { ExecuteObservableNamedParams } from './../Interface/execute-observable-named-params';
import { Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

export abstract class ServiceBase {
  responseSubjects: { [responseID: string]: Subject<any> } = {
    'AppResponseError': new Subject<any>()
  }

  constructor(...allResponses: string[]) {
    allResponses.map(response => this.responseSubjects[response] = new Subject<any>())
  }

  baseDataFunc = (data: any, index: number): Array<any> => {
    return [data, this.responseSubjects[data.responseType]]
  }

  baseSubscriptionFunc = ([data, subject]): void => {
    subject.next(data)
  }

  executeObservable({observable, paramDataFunc = this.baseDataFunc,
    subscriptionFunc = this.baseSubscriptionFunc}:ExecuteObservableNamedParams): void {
    observable.pipe(map(paramDataFunc)).subscribe({
      next:subscriptionFunc,
      error:err => console.log(err)
    }
    )
  }

  onAppResponseError(): Observable<any> {
    return this.responseSubjects.AppResponseError
  }
}
