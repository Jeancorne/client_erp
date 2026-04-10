import { Component } from "@angular/core";
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [NzResultModule],
    templateUrl: './notFound.component.html',
    styles: [`
        :host {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
    `]
})
export class NotFoundComponent {
}
