import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

const BUTTONS_FOR_HIDE_TOGGLE = ['left', 'right', 'up', 'down'];

const dataAttribute = 'data-tepache-game-client-controller-target';

export default class TepacheGameClientControllerComponent extends Component {
  @service
  nes;

  @action
  /**
   * @param {MouseEvent} event
   */
  async handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target;
    const button = target.getAttribute(dataAttribute);

    if (button) {
      if (BUTTONS_FOR_HIDE_TOGGLE.includes(button)) {
        document
          .querySelector(
            `[data-tepache-game-client-controller-destination-base]`
          )
          .classList.add('invisible');

        document
          .querySelector(
            `[data-tepache-game-client-controller-destination="${button}"]`
          )
          .classList.add('visible');
      }

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

  @action
  async handleMouseUp() {
    document
      .querySelector(`[data-tepache-game-client-controller-destination-base]`)
      .classList.remove('invisible');

    BUTTONS_FOR_HIDE_TOGGLE.forEach((buttonToRemove) => {
      document
        .querySelector(
          `[data-tepache-game-client-controller-destination="${buttonToRemove}"]`
        )
        .classList.remove('visible');
    });
  }
}
