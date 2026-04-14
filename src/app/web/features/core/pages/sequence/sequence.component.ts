import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { SequenceService } from '../../../../../core/services/core/sequence.service';
import { Sequence } from '../../../../../core/models/core/sequence/sequence.model';
import { SequenceFormComponent } from '../../components/sequence-form/sequence-form.component';

@Component({
  selector: 'app-sequence',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzTooltipModule,
    NzDividerModule,
    NzModalModule,
    BreadcrumbComponent
  ],
  templateUrl: './sequence.component.html'
})
export class SequenceComponent implements OnInit {
  private sequenceService = inject(SequenceService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  breadcrumbItems = [{ name: 'Configuración' }, { name: 'Numeración y Secuencias' }];
  
  sequences = signal<Sequence[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadSequences();
  }

  async loadSequences() {
    this.isLoading.set(true);
    try {
      const data = await this.sequenceService.getAll();
      this.sequences.set(data);
    } catch (error) {
      this.message.error('Error al cargar secuencias');
    } finally {
      this.isLoading.set(false);
    }
  }

  openSequenceModal(sequence?: Sequence) {
    const modalRef = this.modal.create({
      nzTitle: sequence ? 'Editar Secuencia' : 'Nueva Secuencia',
      nzContent: SequenceFormComponent,
      nzData: { sequenceData: sequence },
      nzFooter: null,
      nzWidth: 850,
      nzCentered: true,
      nzBodyStyle: { padding: '0' },
      nzMaskClosable: false
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) this.loadSequences();
    });
  }

  deleteSequence(sequence: Sequence) {
    this.modal.confirm({
      nzTitle: '¿Eliminar secuencia?',
      nzContent: `Se eliminará la secuencia <b>${sequence.name}</b> (${sequence.documentCode}).<br/>Esta acción puede afectar la generación de nuevos documentos.`,
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.sequenceService.delete(sequence.id);
          this.message.success('Secuencia eliminada correctamente');
          this.loadSequences();
        } catch (error) {
          this.message.error('Error al eliminar la secuencia');
        }
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'DRAFT': 'Borrador',
      'ACTIVE': 'Activo',
      'DEPLETED': 'Agotado',
      'EXPIRED': 'Expirado',
      'CLOSED': 'Cerrado'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'DRAFT': return 'processing';
      case 'DEPLETED': return 'warning';
      case 'EXPIRED': return 'error';
      case 'CLOSED': return 'default';
      default: return 'default';
    }
  }
}
