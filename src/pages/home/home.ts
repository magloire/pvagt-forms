import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AgeValidator } from '../../validators/age';
import { UsernameValidator } from '../../validators/username';
import {RapportServiceProvider} from '../../providers/rapport-service/rapport-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('signupSlider') signupSlider: any;

  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;
  slideThreeForm: FormGroup;
  slideFourForm: FormGroup;

  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, private rapService: RapportServiceProvider) {

    this.slideOneForm = formBuilder.group({
      navn: ['Magloire', Validators.required],
      afgifter: [5000, Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
      mood: [3, Validators.required],
      annulleringer: [500, Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
      notat: ['hello']
    });

    this.slideTwoForm = formBuilder.group({
      place_Lyngby_midt: [true,],
      place_Lyngby_vest: [true,],
      place_Virum: [true,],
      place_Taarbaek: [false,],
      place_Dtu: [false,],
      place_Andet: ['',]
    });

    this.slideThreeForm = formBuilder.group({
      skole_Hummel: [true,],
      skole_Fuglsang: [true,],
      skole_Virum: [false,],
      skole_Taarbaek: [true,],
      skole_Tronegaard: [true,],
      skole_Kongevejen: [false,],
      skole_Engelsborg: [false,],
      skole_Lundtofte: [false,]
      
    });

    this.slideFourForm = formBuilder.group({
      vejr: ['sol',],
      temperatur: [10,]
    });
  }

  prev(){
    this.signupSlider.slidePrev();
  }

  next(){
    this.signupSlider.slideNext();
  }

  serialize(obj){
    let str = [];
    for(const p in obj){
      if(obj.hasOwnProperty(p)){
        str.push(encodeURIComponent(p)+"="+ encodeURIComponent(obj[p]));
      }
    }
    return str.join("&");
  }

  save(){
    console.log('inside save!');
    this.submitAttempt = true;

    if(!this.slideOneForm.valid){
      console.log('slide 1 invalid');
      this.signupSlider.slideTo(0);
    }else if(!this.slideTwoForm.valid){
            console.log('slide 2 invalid');

      this.signupSlider.slideTo(1);
    }else if(!this.slideThreeForm.valid){
            console.log('slide 3 invalid');

      this.signupSlider.slideTo(2);
    }else if(!this.slideFourForm.valid){
            console.log('slide 4 invalid');

      this.signupSlider.slideTo(3);
    }
    else{
      let options = {};
      let slide1 = this.slideOneForm.value;
      let slide2 = this.slideTwoForm.value;
      let slide3 = this.slideThreeForm.value;
      let slide4 = this.slideFourForm.value;
      let temp = [];

      for(const val in slide1){
        options[val] = slide1[val];
      }
      
      for(const place in slide2){
        if(place !== 'placeAndet' && slide2[place]){
          temp.push(place.substr(6).split('_').join(" "));
        }
      }
      options['placeAndet'] = slide2['placeAndet'];
      options['steder'] = temp.join(';');
      temp = [];

      for(const skole in slide3){
        if(slide3[skole]){
           temp.push(skole.substr(6).split('_').join(" "));
        }
        options['skoler'] = temp.join(';'); 
      }
      
      for(const val in slide4){
        options[val] = slide4[val];
      }
      
      console.log(options);


      // let opts = this.serialize(options);
      let opts = JSON.stringify(options);
      
      console.log(opts);

      this.rapService.createReport('/spatialmap?page=create_pvagt_rapport',options)
        .then(ret => {
          console.log(ret);
        });
    }
  }

}
