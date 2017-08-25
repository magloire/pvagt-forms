import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RapportServiceProvider {

  data;

  constructor(public http: Http) {
    console.log('Hello RapportServiceProvider Provider');
  }

  createReport(url, options){ 
    // if(this.data){console.log('this data = true');console.log(this.data);
    //   return Promise.resolve(this.data);
    // }

    let _data = new URLSearchParams();
    for(const opt in options){
      _data.append(opt, options[opt]);
    }

    return new Promise(resolve => {
      this.http.post(url,_data)
          .subscribe(data => {
            this.data = data;
            resolve(this.data);
          });
    });
  }

}
