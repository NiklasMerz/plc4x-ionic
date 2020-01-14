import { Component } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

declare var PLC4X: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  url = 's7://192.168.167.210/1/1';
  values: Array<{name: string, fieldQuery: string, value?: any}> = [
    { name: 'item1', fieldQuery: '%DB555.DBD0:DINT' }, { name: 'item2', fieldQuery: '%DB555.DBD0:DINT' }
  ];

  constructor(private toastCtrl: ToastController, private alertCtrl: AlertController) {}


  connect() {
    PLC4X.connect(this.url, async (res) => {
      const toast = await this.toastCtrl.create({
        duration: 3000,
        message: res
      });
      toast.present();
    }, async (res) => {
      const alert = await this.alertCtrl.create({
        buttons: ['OK'],
        message: res
      });
      alert.present();
    });
  }

  read() {
    PLC4X.read(this.values, (res) => this.values = res, async (err) => {
      const alert = await this.alertCtrl.create({
        buttons: ['OK'],
        message: err
      });
      alert.present();
    });
  }

}
