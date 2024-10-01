import {CommonModule} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';

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
    constructor(public formBuilder: FormBuilder) {}
    ngOnInit(): void {
        this.form = this.formBuilder.group({
            email : [ '', [ Validators.required, Validators.email ] ],
            password : [ '', [ Validators.required ] ]
        });
    }

    onSubmit() {
        console.log(`Submit ${this.form.value}`);
        
        this.isSubmitted = true;
        console.log(this.form.value);
        
    }

    hasDisplayableError(controlName: string): boolean {
        const control = this.form.get(controlName);
        return Boolean(control?.invalid) &&
               (this.isSubmitted || Boolean(control?.touched) ||
                Boolean(control?.dirty));
    }
}
