import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NzLayoutModule],
  template: `
    <nz-layout class="app-layout">
      <nz-content>
        <router-outlet></router-outlet>
      </nz-content>
    </nz-layout>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
    }
  `]
})
export class App {}
