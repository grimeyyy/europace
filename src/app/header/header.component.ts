import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
