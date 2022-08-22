import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';
import { throttle } from '@ember/runloop';

const BUTTONS_FOR_HIDE_TOGGLE = ['left', 'right', 'up', 'down'];

const dataAttribute = 'data-tepache-game-client-controller-target';

const NOT_SUPPORTED = 'NOT_SUPPORTED';

const buttonMap = {
  0: 'b',
  1: 'a',
  2: 'x',
  3: 'y',
  4: 'l',
  5: 'r',
  6: NOT_SUPPORTED,
  7: NOT_SUPPORTED,
  8: 'select',
  9: 'start',
  10: NOT_SUPPORTED,
  11: NOT_SUPPORTED,
  12: 'up',
  13: 'down',
  14: 'left',
  15: 'right',
  16: NOT_SUPPORTED,
};

const throttleTime = 1000; // ms

export default class TepacheGameClientControllerComponent extends Component {
  @service
  nes;

  @tracked
  socketConnected = true;

  #connectUnsubscribe;

  #disconnectUnsubscribe;

  #errorUnsubscribe;

  #depressButton;

  constructor() {
    super(...arguments);

    this.#connectUnsubscribe = this.nes.onConnect(() => {
      this.socketConnected = true;
    });

    this.#disconnectUnsubscribe = this.nes.onDisconnect(() => {
      this.socketConnected = false;
    });

    this.#errorUnsubscribe = this.nes.onError(() => {
      this.socketConnected = false;
    });
  }

  @cached
  get isLastPressFromPlayer() {
    return (
      this.args.currentPressedButton?.playerSessionUrn ===
      this.args.playerSessionModel?.urn
    );
  }

  @action
  async request(button) {
    if (navigator && navigator.vibrate) {
      navigator?.vibrate(100); // vibrate for 100ms
    }

    return await this.nes.request({
      path: '/api/socket/tepache-session-captures',
      method: 'POST',
      payload: {
        button,
        gameSessionUrn: this.args.gameSessionModel?.urn,
        playerSessionUrn: this.args.playerSessionModel?.urn,
      },
    });
  }

  @action
  /**
   * @param {MouseEvent} event
   */
  async handleMouseDown(event) {
    event.preventDefault();
    event.stopPropagation();

    clearInterval(this.#depressButton);

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

      throttle(this, this.request, button, throttleTime);

      this.#depressButton = setInterval(() => {
        this.request(button);
      }, throttleTime);
    }
  }

  @action
  async handleMouseUp() {
    clearInterval(this.#depressButton);

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

  @action
  listenForController() {
    let lastTime = 0;
    let lastButton;

    let activeGamepadIndex;
    let activeGamepad;

    const update = () => {
      const gamepads = navigator.getGamepads();
      const gameIndex = gamepads.findIndex(
        (gamepad) => gamepad && gamepad.buttons.find((button) => button.pressed)
      );

      activeGamepadIndex = gameIndex !== -1 ? gameIndex : activeGamepadIndex;
      activeGamepad = gamepads[activeGamepadIndex];

      if (activeGamepad && activeGamepad.buttons.length) {
        Object.keys(buttonMap).forEach((key) => {
          const activeGamepadButton = activeGamepad.buttons[key];
          if (buttonMap[key] !== NOT_SUPPORTED) {
            if (activeGamepadButton.pressed) {
              const now = new Date().getTime();

              if (lastButton !== key || now - throttleTime >= lastTime) {
                lastTime = now;
                lastButton = key;

                try {
                  activeGamepad?.vibrationActuator?.playEffect('dual-rumble', {
                    startDelay: 0,
                    duration: 50,
                    weakMagnitude: 1.0,
                    strongMagnitude: 0,
                  });
                } catch (error) {
                  // noop
                }

                throttle(this, this.request, buttonMap[key], throttleTime);
              }
            }
          }
        });
      }

      window.requestAnimationFrame(update);
    };

    window.requestAnimationFrame(update);
  }

  @action
  remove() {
    super.willDestroy(...arguments);

    this.#connectUnsubscribe();
    this.#errorUnsubscribe();
    this.#disconnectUnsubscribe();
  }
}
