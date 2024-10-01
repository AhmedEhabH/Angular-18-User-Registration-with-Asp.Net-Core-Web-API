import {Routes} from '@angular/router';

import {LoginComponent} from './user/login/login.component';
import {
    RegistrationComponent
} from './user/registration/registration.component';
import {UserComponent} from './user/user.component';

export const routes: Routes = [ {
    path : 'user',
    component : UserComponent,
    children : [
        {path : 'signup', component : RegistrationComponent},
        {path : 'login', component : LoginComponent}
    ]
} ];
