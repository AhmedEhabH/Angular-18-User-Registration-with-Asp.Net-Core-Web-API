import {Routes} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './user/login/login.component';
import {
    RegistrationComponent
} from './user/registration/registration.component';
import {UserComponent} from './user/user.component';

export const routes: Routes = [
    {
        path : '',
        component : UserComponent,
        children : [
            {path : 'signup', component : RegistrationComponent},
            {path : 'signin', component : LoginComponent}
        ]
    },
    {path : 'dashboard', component : DashboardComponent}
];
