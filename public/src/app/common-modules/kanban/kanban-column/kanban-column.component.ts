import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {OrderType} from '../../../data/order.type';
import {OrderService} from '../../../services/order.service';

@Component({
  selector: 'kanban-column',
  templateUrl: './kanban-column.component.html',
  styleUrls: ['./kanban-column.component.scss']
})
export class KanbanColumnComponent implements OnInit{

  @Input('heading') heading: string;
  @Input('confirmButton') confirmButton: string;
  @Input('confirmStatus') confirmStatus: string;
  @Input('normalPriorityOrders') normalPriorityOrders: Array<OrderType>;
  @Input('highPriorityOrders') highPriorityOrders: Array<OrderType>;
  @Input('cancelEnable') cancelEnable: boolean;
  @Output('onChangeChildOrder') onChangeChildOrder: EventEmitter<number> = new EventEmitter();

  constructor(
    private orderService: OrderService
  ) {}

  ngOnInit() {
  }

  onChildChanged (orderId: number) {
    this.onChangeChildOrder.emit(orderId);
  }

}
