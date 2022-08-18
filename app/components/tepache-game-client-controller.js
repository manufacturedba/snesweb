import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

const BUTTONS_RESULTING_IN_HIDE = ['y', 'a', 'b', 'x', 'start', 'select'];
const dataAttribute = 'data-tepache-game-client-controller-target';

export default class TepacheGameClientControllerComponent extends Component {
  @service
  nes;

  @action
  async handleButtonClick(event) {
    const target = event.target;
    const button = target.getAttribute(dataAttribute);
    if (BUTTONS_RESULTING_IN_HIDE.includes(button)) {
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
}
