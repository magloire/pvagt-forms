import {FormControl} from '@angular/forms';

export class AgeValidator {

    static isValid(control: FormControl): any{
        if(isNaN(control.value)){
            console.log('age not a number');
            return {"not a number" : true};
        }

        if(control.value % 1 !== 0){
            console.log('age not a whole number');
            return {"not a whole number" : true};
        }

        if(control.value < 18){
            console.log(control.value);
            return {"too young" : true};
        }

        if(control.value > 120){
            console.log('age not realistic');
            return {
                "not realistic" : true
            };
        }

        return null;
    } 
}