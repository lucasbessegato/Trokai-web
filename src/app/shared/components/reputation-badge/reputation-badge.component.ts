import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-reputation-badge',
  templateUrl: './reputation-badge.component.html',
  styleUrls: ['./reputation-badge.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
  ]
})
export class ReputationBadgeComponent {
  @Input() level = 1;
  @Input() small = false;
  @Input() showTooltip = true;
  @Input() mode: 'input' | 'view' = 'view';

  @Output() rateUser: EventEmitter<number> = new EventEmitter<number>();

  hovered: number = 0;
  selected: number = 0;

  onRate(rating: number): void {
    this.hovered = rating;
    this.selected = rating;
    this.rateUser.emit(rating);
  }
    
  get emptyStars(): number[] {
    return Array(5 - this.level).fill(0);
  }

  get filledStars(): number[] {
    return Array(this.level).fill(0);
  }
}
