import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';
import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[appConfirmPassword]',
  providers:  [{
    provide:  NG_VALIDATORS,
    useExisting:  ConfirmPasswordDirective,
    multi:  true
  }]
})
export class ConfirmPasswordDirective implements Validator{
  @Input() appConfirmPassword: string;
  validate(control: AbstractControl): {[Key:string]: any}|null{
    const controlToCompare = control.parent.get(this.appConfirmPassword);
    if(controlToCompare && controlToCompare.value !== control.value){
      return {'notEqual':true};
    }
    return null;
  }
}
