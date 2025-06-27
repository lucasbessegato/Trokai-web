import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/app/core/models/user.model';

@Pipe({
  name: 'userImage',
  standalone: true
})
export class UserImagePipe implements PipeTransform {
  transform(user: User): string {
    if (Boolean(user.avatar)) {
      return user.avatar;
    }
    return '../../../assets/images/blank-user.png';
  }
}
