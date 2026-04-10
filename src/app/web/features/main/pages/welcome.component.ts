import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzResultModule,
    NzButtonModule,
    NzCardModule,
    NzStatisticModule,
    NzIconModule,
    NzPageHeaderModule,
    BreadcrumbComponent
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  breadcrumbData: any = [
    { name: 'Dashboard' },
    { name: 'Inicio' }
  ];
}
