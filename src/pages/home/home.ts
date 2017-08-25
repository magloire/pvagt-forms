import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { NavController, AlertController } from 'ionic-angular';
import { AgeValidator } from '../../validators/age';
import { UsernameValidator } from '../../validators/username';
import {RapportServiceProvider} from '../../providers/rapport-service/rapport-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('reportSlider') reportSlider: any;

  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;
  slideThreeForm: FormGroup;
  slideFourForm: FormGroup;

  submitAttempt: boolean = false;
  // static alertCtrl: AlertController;

  constructor(public navCtrl: NavController, 
              public formBuilder: FormBuilder, 
              private rapService: RapportServiceProvider,
              public alertCtrl: AlertController) {

    this.slideOneForm = formBuilder.group({
      navn: ['', Validators.required],
      afgifter: [0, Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
      mood: [0, Validators.required],
      annulleringer: [0, Validators.compose([Validators.required,Validators.pattern('[0-9]*')])],
      notat: ['']
    });

    this.slideTwoForm = formBuilder.group({
      place_Lyngby_midt: [false,],
      place_Lyngby_vest: [false,],
      place_Virum: [false,],
      place_Taarbaek: [false,],
      place_Dtu: [false,],
      place_Andet: ['',]
    });

    this.slideThreeForm = formBuilder.group({
      skole_Hummel: [false,],
      skole_Fuglsang: [false,],
      skole_Virum: [false,],
      skole_Taarbaek: [false,],
      skole_Tronegaard: [false,],
      skole_Kongevejen: [false,],
      skole_Engelsborg: [false,],
      skole_Lundtofte: [false,]
      
    });

    this.slideFourForm = formBuilder.group({
      vejr: ['',],
      temperatur: [0,]
    });
  }

  prev(){
    this.reportSlider.slidePrev();
  }

  next(){
    this.reportSlider.slideNext();
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

   showAlert(){
    // console.log('I was called!!');
    let toast = this.alertCtrl.create({
      title: 'Tak for din indberetning',
      subTitle: 'Din rapport er blevet registreret!',
      buttons: ['Ok']
    });

    toast.present();
  }

  save(){
   // console.log('inside save!');
    this.submitAttempt = true;

    if(!this.slideOneForm.valid){
     // console.log('slide 1 invalid');
      this.reportSlider.slideTo(0);
    }else if(!this.slideTwoForm.valid){
          //  console.log('slide 2 invalid');

      this.reportSlider.slideTo(1);
    }else if(!this.slideThreeForm.valid){
           // console.log('slide 3 invalid');

      this.reportSlider.slideTo(2);
    }else if(!this.slideFourForm.valid){
           // console.log('slide 4 invalid');

      this.reportSlider.slideTo(3);
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
        if(place !== 'place_Andet' && slide2[place]){
         // console.log(place);
          temp.push(place.substr(6).split('_').join(" "));
        }
      }
      if(slide2['place_Andet']){
       // console.log(slide2['place_Andet']);
        slide2['place_Andet'].split(',').map((x) => {return x.trim()}).forEach(element => {
          temp.push(element);
        });
      }
    //  options['placeAndet'] = slide2['place_Andet'];
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
      
     // console.log(options);
      if(!options['notat'] ||options['notat'] == ''){options['notat'] = '-';}
      if(!options['afgifter'] || options['afgifter'] == ''){options['afgifter'] = 0;}
      if(!options['annulleringer'] || options['annulleringer'] == ''){options['annulleringer'] = 0;}
      if(!options['temperatur'] || options['temperatur'] == ''){options['temperatur'] = 0;}


      // let opts = this.serialize(options);
     // let opts = JSON.stringify(options);
      
     // console.log(opts);

      this.rapService.createReport('http://kommunekort.ltk.dk/spatialmap?page=create_pvagt_rapport',options)
        .then(ret => {
          this.submitAttempt = false;
         // console.log("data was submitted : ",this.submitAttempt);
         // console.log(ret);
          this.showAlert();
          this.slideOneForm.reset();
          this.slideTwoForm.reset();
          this.slideThreeForm.reset();
          this.slideFourForm.reset();
          this.reportSlider.slideTo(0);
        });
    }
  }

}
