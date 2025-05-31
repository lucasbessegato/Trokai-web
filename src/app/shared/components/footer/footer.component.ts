import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    SharedModule
  ]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  email: string = 'contato@trokai.com';
}
