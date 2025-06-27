import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
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
export class ReputationBadgeComponent implements OnInit {
  @Input() level = 1;
  @Input() small = false;
  @Input() showTooltip = true;
  
  badgeInfo: { title: string, imageUrl: string, description: string } = {
    title: '',
    imageUrl: '',
    description: ''
  };
  
  constructor(private userService: UserService) {}
  
  ngOnInit(): void {
    this.badgeInfo = this.userService.getReputationBadgeInfo(this.level);
  }
  
  get emptyStars(): number[] {
    return Array(5 - this.level).fill(0);
  }

  get filledStars(): number[] {
    return Array(this.level).fill(0);
  }
}
