import { Component } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

declare var PLC4X: any;

interface PLC4XItem {name: string; fieldQuery: string; value?: any; }

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  url = 's7://192.168.167.210/1/1';
  values: Array<PLC4XItem> = [
    { name: 'motor-current', fieldQuery: '%DB444.DBD8:REAL' },
    { name: 'position', fieldQuery: '%DB444.DBD0:REAL' },
    { name: 'rand_val', fieldQuery: '%DB444.DBD4:REAL' }
  ];
  pos: PLC4XItem;
  interval: any;

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
    this.interval = setInterval(() => {
      PLC4X.read(this.values, (res) => {
        this.values = res;
        this.pos = this.values.find(elem => elem.name === 'position');
      }, async (err) => {
        const alert = await this.alertCtrl.create({
          buttons: ['OK'],
          message: err
        });
        alert.present();
      });
    }, 1000);
  }

  ionViewDidLeave() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
