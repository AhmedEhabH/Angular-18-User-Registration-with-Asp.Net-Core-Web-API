import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidatorFn,
    Validators
} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';

import {AuthService} from '../../shared/auth.service';
import {FirstKeyPipe} from '../../shared/pipes/first-key.pipe';

@Component({
    selector : 'app-registration',
    standalone : true,
    imports : [ ReactiveFormsModule, CommonModule, FirstKeyPipe ],
    templateUrl : './registration.component.html',
    styles : ``

})
export class RegistrationComponent implements OnInit {
    isSubmitted: boolean = false;
    form: any;
    passwordMatchValidator: ValidatorFn =
        (control: AbstractControl) => {
            const password = control.get('password');
            const confirmPassword = control.get('confirmPassword');

            if (password && confirmPassword &&
                password.value != confirmPassword.value) {
                confirmPassword?.setErrors({passwordMismatch : true})
            } else {
                confirmPassword?.setErrors(null)
            }
            return null;
        }

    constructor(public formBuilder: FormBuilder, private service: AuthService,
                private toastr: ToastrService) {}
    ngOnInit():
        void{this.form = this.formBuilder.group(
                 {
                     fullName : [
                         '',
                         [ Validators.required ],
                     ],
                     email: [ '', [ Validators.required, Validators.email ] ],
                     password:
                         [
                             '',
                             [
                                 Validators.required, Validators.minLength(6),
                                 Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/)
                             ]
                         ],
                     confirmPassword: [ '' ],
                 },
                 {validators : this.passwordMatchValidator})}

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.valid) {
            this.service.createUser(this.form.value).subscribe({
                next : (res: any) => {
                    if (res?.succeeded) {
                        this.form.reset();
                        this.isSubmitted = false;
                        this.toastr.success('New User created!',
                                            'Registration successful');
                    }
                },
                error : (err: any) => {
                    if (err?.error?.errors) {
                        err.error.errors.forEach((x: any) => {
                            switch (x.code) {
                            case 'DuplicateUserName':
                                break;
                            case 'DuplicateEmail':
                                this.toastr.error('Email already exists!',
                                                  'Registration failed');
                                break;
                            default:
                                this.toastr.error('Contact the developer',
                                                  'Registration failed');
                                console.log(x);
                                break;
                            }
                        })
                    } else {
                        console.error(err);
                    }
                }
            });
        }
    }
    hasDisplayableError(controlName: string): boolean {
        const control = this.form.get(controlName);
        return Boolean(control?.invalid) &&
               (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty));
    }
}
