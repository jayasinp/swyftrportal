import {Component, Input, OnInit} from '@angular/core';
import {RiderType} from '../../../../data/user.type';
import {PartnerType} from '../../../../data/partner.type';

@Component({
  selector: 'app-rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: ['./rider-list.component.scss']
})
export class RiderListComponent implements OnInit {

  @Input('riders') riders: Array<RiderType>;
  @Input('partner') partner: PartnerType;

  constructor (

  ) {}

  ngOnInit() {

  }
}
