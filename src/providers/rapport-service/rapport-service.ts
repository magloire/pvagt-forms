import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RapportServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class RapportServiceProvider {

  data;

  constructor(public http: Http) {
    console.log('Hello RapportServiceProvider Provider');
  }

  createReport(url, options){
    if(this.data){
      return Promise.resolve(this.data);
    }

    let _data = new URLSearchParams();
    for(const opt in options){
      _data.append(opt, options[opt]);
    }

    return new Promise(resolve => {
    //  let headers = new Headers({'Content-Type':'application/json'});
     // let opts = new RequestOptions({headers : headers});
      this.http.post(url,_data)
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          });
    });
  }

}
