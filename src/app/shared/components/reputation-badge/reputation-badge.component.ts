import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-reputation-badge',
  templateUrl: './reputation-badge.component.html',
  styleUrls: ['./reputation-badge.component.scss'],
  standalone: true,
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
}
