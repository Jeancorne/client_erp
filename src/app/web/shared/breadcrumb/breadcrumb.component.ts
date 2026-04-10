import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { breadCrumsModel } from "../../../core/models/shared/breadcrums/breadcrumsModel";

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [CommonModule, NzBreadCrumbModule],
    templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {
    @Input() items: breadCrumsModel[] = [];
}
