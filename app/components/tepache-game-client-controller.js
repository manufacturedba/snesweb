import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
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

// https://gamesx.com/controldata/snesdat.htm
const BUTTON_TIMING_PRIORITY = [
  'b',
  'y',
  'select',
  'start',
  'up',
  'down',
  'left',
  'right',
  'a',
  'x',
  'l',
  'r',
];

const throttleTime = 200; // ms

export default class TepacheGameClientControllerComponent extends Component {
  @service
  nes;

  @tracked
  socketConnected = true;

  #connectUnsubscribe;

  #disconnectUnsubscribe;

  #errorUnsubscribe;

  #depressButton = {};

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
        gameSessionId: this.args.gameSessionModel?.id,
        playerSessionId: this.args.playerSessionModel?.id,
      },
    });
  }

  /**
   * @param {MouseEvent} event
   */
  @action
  async handleMouseDown(event) {
    event.stopPropagation();

    const target = event.target;
    const button = target.getAttribute(dataAttribute);

    clearInterval(this.#depressButton[button]);
    this.#depressButton[button] = null;

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

      this.#depressButton[button] = setInterval(() => {
        for (let i = 0; i < BUTTON_TIMING_PRIORITY.length; i++) {
          if (BUTTON_TIMING_PRIORITY[i] === button) {
            return this.request(button);
          } else if (this.#depressButton[BUTTON_TIMING_PRIORITY[i]]) {
            // a higher priority button is being held down so exit
            return;
          }
        }
      }, throttleTime);
    }
  }

  @action
  async handleMouseUp(event) {
    event.stopPropagation();

    const target = event.target;
    const button = target.getAttribute(dataAttribute);

    if (!button) {
      console.warn(
        'Button cannot be determined so purging all depressed buttons'
      );

      BUTTON_TIMING_PRIORITY.forEach((button) => {
        clearInterval(this.#depressButton[button]);
        this.#depressButton[button] = null;
      });
    } else {
      clearInterval(this.#depressButton[button]);
      this.#depressButton[button] = null;
    }

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
