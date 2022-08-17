import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TepacheGameClientControllerComponent extends Component {
  @service
  nes;

  @action
  async handleButtonClick(button) {
    return await this.nes.request({
      path: '/api/socket/tepache-session-captures',
      method: 'POST',
      payload: {
        button,
        gameSessionUrn: this.args.gameSessionModel.urn,
      },
    });
  }
}
