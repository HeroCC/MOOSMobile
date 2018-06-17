import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MoosmailProvider} from "../../providers/moosmail/moosmail";
import {MoosClient, MoosMail} from "../../providers/moosmail/MoosClient";

@IonicPage()
@Component({
  selector: 'page-buttons',
  templateUrl: 'buttons.html',
})
export class ButtonsPage {
  buttons: Set<QuickButton> = new Set();

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
              private mm: MoosmailProvider, private storage: Storage) {
  }

  addNewButton() {
    let modal = this.modalCtrl.create(NewButton);
    modal.onDidDismiss(data => {
      this.mm.knownClients.get(data.clientName).subscribe(data.mailName);
      let qb: QuickButton = {
        client: this.mm.knownClients.get(data.clientName),
        mail: this.mm.knownClients.get(data.clientName).receivedMail.get(data.mailName),
        label: data.label,
        readonly: data.readonly,
        inputType: data.inputType,
      };
      this.buttons.add(qb);
      this.saveButtonsList();
    });
    modal.present();
  }

  saveButtonsList() {
    let storedButtons = [];
    this.buttons.forEach((item) => {
      storedButtons.push(QuickButton.getSimplifiedButton(item));
    });
    this.storage.set('quickButtons', storedButtons);
  }

  updateMailFromButton(button: QuickButton, newValue) {
    button.client.sendMessage(button.mail.name, newValue.toString());
  }

  ionViewDidLoad() {
    this.storage.get('quickButtons').then(value => {
      if (value == null) return;
      value.forEach((item) => {
        this.mm.knownClients.get(item.clientName).subscribe(item.mailName);
        this.buttons.add({
          client: this.mm.knownClients.get(item.clientName),
          mail: this.mm.knownClients.get(item.clientName).receivedMail.get(item.mailName),
          label: item.label,
          readonly: item.readonly,
          inputType: item.inputType,
        })
      });
    });
  }
}

class QuickButton { // Named so to avoid interference with normal HTML / Ionic buttons
  client: MoosClient;
  mail: MoosMail;
  label: string;
  readonly: boolean;
  inputType: string;

  static getSimplifiedButton(qb: QuickButton) {
    return {
      clientName: qb.client.name,
      mailName: qb.mail.name,
      label: qb.label,
      readonly: qb.readonly,
      inputType: qb.inputType,
    };
  }
}

@Component({
  templateUrl: 'newButtonModal.html'
})
export class NewButton {
  private newButtonForm: FormGroup;

  constructor(private viewCtrl: ViewController, private formBuilder: FormBuilder, private mm: MoosmailProvider) {
    this.newButtonForm = this.formBuilder.group({
      clientName:   [Validators.required],
      mailName: ['', Validators.required],
      label:    ['', Validators.required],
      readonly: [false, Validators.required],
      inputType:['', Validators.required],
    });
  }

  getMapValuesAsArray(map: Map<any, any>) {
    // Angular webpages can't access static methods from other classes, so use this as a bridge to the real function
    return MoosmailProvider.getMapContentsAsArray(map);
  }

  submitNewToggle(){
    this.viewCtrl.dismiss(this.newButtonForm.value);
  }
}
