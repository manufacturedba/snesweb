import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TepacheGameClientControllerComponent extends Component {
  @service
  nes;

  @action
  handleButtonClick(button) {
    this.nes.sendButton(button);
  }
}
