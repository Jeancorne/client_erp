import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

import { AuthService } from '../../../../../core/services/auth.service';
import { NavigationService } from '../../../../../core/services/navigation.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzEmptyModule
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  private authService = inject(AuthService);
  private navService = inject(NavigationService);

  currentUser = this.authService.currentUser;

  // Consumimos directamente los favoritos del usuario
  pinnedItems = this.navService.pinnedItems;
}
