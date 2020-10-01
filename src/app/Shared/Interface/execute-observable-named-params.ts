import { Observable } from 'rxjs';
export interface ExecuteObservableNamedParams {
    observable:Observable<any>
    paramDataFunc?: any
    subscriptionFunc?: any
}
