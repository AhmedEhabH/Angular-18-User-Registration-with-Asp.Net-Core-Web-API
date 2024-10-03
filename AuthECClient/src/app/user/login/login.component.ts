import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector : 'app-login',
    standalone : true,
    imports : [ CommonModule, ReactiveFormsModule, RouterLink ],
    templateUrl : './login.component.html',
    styles : ``
})
export class LoginComponent implements OnInit {
    form: any;
    isSubmitted: boolean = false;
    constructor(public formBuilder: FormBuilder, private service:AuthService, private router:Router, private toastr:ToastrService) {}
    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email : [ '', [ Validators.required, Validators.email ] ],
            password : [ '', [ Validators.required ] ]
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if(this.form.valid){
            this.service.signin(this.form.value).subscribe({
                next: (res:any) => {
                    localStorage.setItem('token', res.token);
                    this.router.navigateByUrl('/dashboard');
                    // this.toastr.success(res, 'Login successful');
                },
                error: (error) => {
                    console.error(error);
                    if (error.status == 400) {
                        this.toastr.error("Incorrect email or password", "Login failed");
                    }
                    else{
                        console.error(`error during login: :(\n`);
                    }
                }
            })
        }
        
    }

    hasDisplayableError(controlName: string): boolean {
        const control = this.form.get(controlName);
        return Boolean(control?.invalid) &&
               (this.isSubmitted || Boolean(control?.touched) ||
                Boolean(control?.dirty));
    }
}
