import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-table-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzDropdownModule,
    NzTableModule
  ],
  templateUrl: './table-filter.component.html',
  styleUrl: './table-filter.component.css'
})
export class TableFilterComponent {
  placeholder = input<string>('Buscar...');
  searchValue = input<string>('');
  searchChange = output<string>();
  visible = false;
  onSearchChange(value: string) {
    this.searchChange.emit(value);
  }
  reset() {
    this.searchChange.emit('');
    this.visible = false;
  }
}
