import {Component, OnInit, ViewChild} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastrService } from 'ngx-toastr';
import {Subject} from 'rxjs/Subject';
import {OrderInfo, OrderItem, OrderType} from '../../../data/order.type';
import {FileService} from '../../../services/file.service';
import {OrderService} from '../../../services/order.service';
import {ORDER_STATUS} from '../../../utility/constants';
import * as moment from 'moment';

let _this;

@Component({
  selector: 'app-kanban-view-order',
  templateUrl: './view-order-popup.component.html',
  styleUrls: ['./view-order-popup.component.scss']
})
export class ViewOrderPopupComponent implements OnInit {

  public onClose: Subject<boolean>;
  public order: OrderType;
  public orderInfo: OrderInfo;
  public itemImages = {};
  public confirmStatus: string;
  public confirmButton: string;
  public showCancel: boolean;
  public qrImage;

  public showCancelDialog = {};

  constructor(
    public activeModel: BsModalRef,
    private toasterService: ToastrService,
    private fileService: FileService,
    private orderService: OrderService
  ) {
    _this = this;
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.loadProductImanges();
    this.loadQr();
  }

  dismiss() {
    this.onClose.next(false);
    this.activeModel.hide();
  }

  loadProductImanges() {
    this.orderInfo.items.forEach((item: OrderItem) => {
      if (item.prodImageId) {
        if (!this.itemImages[item.prodId]) {
          this.fileService.downloadImageFromSystemByFileId(item.prodImageId).then((image) => {
            image.prodImageId = item.prodImageId;
            this.itemImages[item.prodId] = image.fileGivenName;
          }).catch((err) => console.log(err));
        }
      }
    });
  }

  loadQr() {
    if (!this.order.qrImageId) return;
    this.fileService.downloadImageFromSystemByFileId(this.order.qrImageId).then((image) => {
      this.qrImage = image.fileName;
    }).catch((err) => console.log(err));
  }

  onDeclined() {
    _this.showCancelDialog = {
      headerColor: '#f0182e',
      show: true,
      header: `Are you sure you want to decline | cancel order # ${_this.order.orderId} ?`,
      confirmButton: 'Yes',
      cancelButton: 'No',
      description: `By confirming this action will cancel the order #${_this.order.orderId} created by customer.`,
      onConfirm: () => {
        _this.orderService.updateOrderStatus(_this.order.orderId, ORDER_STATUS.CANCELED).then(() => {
          _this.toasterService.warning(`Order #${_this.order.orderId} Status Changed to cancel`, 'Order Canceled');
          _this.showCancelDialog.show = false;
          _this.dismiss();
          _this.onClose.next(false);
        }).catch((err) => console.log(err));
      },
      onCancel: () => {
        _this.showCancelDialog.show = false;
      }
    };
  }

  onConfirmed() {
    this.orderService.updateOrderStatus(this.order.orderId, this.confirmStatus).then(() => {
      this.toasterService.show(`Order status changed to ${this.confirmButton}`, 'Order Status Changed');
      this.dismiss();
      this.onClose.next(true);
    }).catch((err) => {
      console.log(err);
    });
  }

  isConfirmationButtonEnabled() {
    let enabled = true;

    if (this.order.status === ORDER_STATUS.ACCP
      && this.order.deliveryDate
      && (this.order.deliveryDate - Date.now() > 2 * 60 * 60 * 1000)) {
      enabled = false;
    }

    return enabled;
  }

  printOrderInfo() {
    const createOriderItemList = () => {
      let rows = '';

      this.orderInfo.items.forEach((item: OrderItem) => {
console.log(item)
        rows +=
        `<tr class="item-row">
		      <td class="item-name"><div class="delete-wpr"><p readonly>${item.productName}</p></div></td>
		      <td class="description"><p readonly>${item.description? item.description : ''}</p></td>
		      <td><p readonly class="cost">${item.unitPrice}</p></td>
		      <td><p readonly class="qty">${item.quantity}</p></td>
		      <td><span class="price">${item.quantity * item.unitPrice}</span></td>
		    </tr>`;
      });
      return rows;
    };

    const getTotalBill = () => {
      let total = 0;

      this.orderInfo.items.forEach((item: OrderItem) => {
        total += (item.unitPrice * item.quantity);
      });

      return total;
    };

    const total = getTotalBill();

    const prettyDate = moment(new Date(this.order.orderDate)).format('YYYY/MMM/DD')

    const printContents = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">

<head>
	<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
	
	<title>Swyftr Invoice for Order #${this.order.orderId}</title>
	
	<style>
				/*
			CSS-Tricks Example
			by Chris Coyier
			http://css-tricks.com
		*/

		* { margin: 0; padding: 0; }
		body { font: 14px/1.4 Georgia, serif; }
		#page-wrap { width: 800px; margin: 0 auto; }

		textarea { border: 0; font: 14px Georgia, Serif; overflow: hidden; resize: none; }
		table { border-collapse: collapse; }
		table td, table th { border: 1px solid black; padding: 5px; }

		#header { height: 15px; width: 100%; margin: 20px 0; background: #222; text-align: center; color: white; font: bold 15px Helvetica, Sans-Serif; text-decoration: uppercase; letter-spacing: 20px; padding: 8px 0px; }

		#address { width: 400px; height: 150px; float: left; }
		#customer { overflow: hidden; }

		#logo { text-align: right; float: right; position: relative; margin-top: 25px; border: 1px solid #fff; max-width: 540px; max-height: 100px; overflow: hidden; }
		#logo:hover, #logo.edit { border: 1px solid #000; margin-top: 0px; max-height: 125px; }
		#logoctr { display: none; }
		#logo:hover #logoctr, #logo.edit #logoctr { display: block; text-align: right; line-height: 25px; background: #eee; padding: 0 5px; }
		#logohelp { text-align: left; display: none; font-style: italic; padding: 10px 5px;}
		#logohelp input { margin-bottom: 5px; }
		.edit #logohelp { display: block; }
		.edit #save-logo, .edit #cancel-logo { display: inline; }
		.edit #image, #save-logo, #cancel-logo, .edit #change-logo, .edit #delete-logo { display: none; }
		#customer-title { font-size: 20px; font-weight: bold; float: left; }

		#meta { margin-top: 1px; width: 300px; float: right; }
		#meta td { text-align: right;  }
		#meta td.meta-head { text-align: left; background: #eee; }
		#meta td textarea { width: 100%; height: 20px; text-align: right; }

		#items { clear: both; width: 100%; margin: 30px 0 0 0; border: 1px solid black; }
		#items th { background: #eee; }
		#items textarea { width: 80px; height: 50px; }
		#items tr.item-row td { border: 0; vertical-align: top; }
		#items td.description { width: 300px; }
		#items td.item-name { width: 175px; }
		#items td.description textarea, #items td.item-name textarea { width: 100%; }
		#items td.total-line { border-right: 0; text-align: right; }
		#items td.total-value { border-left: 0; padding: 10px; }
		#items td.total-value textarea { height: 20px; background: none; }
		#items td.balance { background: #eee; }
		#items td.blank { border: 0; }

		#terms { text-align: center; margin: 20px 0 0 0; }
		#terms h5 { text-transform: uppercase; font: 13px Helvetica, Sans-Serif; letter-spacing: 10px; border-bottom: 1px solid black; padding: 0 0 8px 0; margin: 0 0 8px 0; }
		#terms textarea { width: 100%; text-align: center;}

		textarea:hover, textarea:focus, #items td.total-value textarea:hover, #items td.total-value textarea:focus, .delete:hover { background-color:#EEFF88; }

		.delete-wpr { position: relative; }
		.delete { display: block; color: #000; text-decoration: none; position: absolute; background: #EEEEEE; font-weight: bold; padding: 0px 3px; border: 1px solid; top: -6px; left: -22px; font-family: Verdana; font-size: 12px; }
	</style>

	<style>
		#hiderow,
		.delete {
			display: none;
		}
	</style>

</head>

<body onload="window.print();window.onmouseover = function() { self.close(); } ">

	<div id="page-wrap">

		<p readonly id="header">INVOICE</p>
		
		<div id="identity">
		
            <p readonly id="address">
              Order Id: ${this.order.orderId} <br>
              
              Customer Name: ${this.order.cusName} <br>
              
              Mobile Number: ${(this.orderInfo.customer && this.orderInfo.customer.mobileNo) ? this.orderInfo.customer.mobileNo : ''} <br>
              
              Delivery Address: 
              ${this.order.deliveryAddress}
            </p>

            <div id="logo">
              <!-- swyftr logo -->
            </div>
		
		</div>
		
		<div style="clear:both"></div>
		
		<div id="customer">

            ${this.qrImage ? `<img id="image" width="200"  src="../uploads/${this.qrImage}" />` : ''}
            
            <table id="meta">
                <tr>
                    <td class="meta-head">Invoice #</td>
                    <td><p readonly>${this.order.orderId}</p></td>
                </tr>
                <tr>

                    <td class="meta-head">Date</td>
                    <td><p readonly id="date">${prettyDate}</p></td>
                </tr>
            </table>
		
		</div>
		
		<table id="items">
		
		  <tr>
		      <th>Item</th>
		      <th>Description</th>
		      <th>Unit Cost</th>
		      <th>Quantity</th>
		      <th>Price</th>
		  </tr>
		  
		  		${createOriderItemList()}
		  		
		  <tr id="hiderow">
		    <td colspan="5"><a id="addrow" href="javascript:;" title="Add a row">Add a row</a></td>
		  </tr>
		  
		  <tr>
		      <td colspan="2" class="blank"> </td>
		      <td colspan="2" class="total-line">Total Amount</td>
		      <td class="total-value"><p readonly id="paid">Rs. ${total}</p></td>
		  </tr>
		</table>	
	</div>
</body>
</html>`;

    const popupWin =  window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(printContents);

  }

}
