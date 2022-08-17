import Component from '@glimmer/component';
import Two from 'two.js';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TepacheGameClientControllerComponent extends Component {
  @service
  nes;

  @action
  loadSVG(element) {
    const two = new Two({
      type: Two.Types.svg,
      fitted: true,
    }).appendTo(element.querySelector('[data-svg-mount]'));

    two.load('/controller/controller-base-plain.svg', (svg) => {
      svg.center();
      svg.scale = 1;

      two.add(svg);
      two.update();
    });
  }

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

  willDestroy() {
    super.willDestroy(...arguments);
    // this.two.unbind('update');
    // this.two.pause();
    // this.element.removeChild(this.two.renderer.domElement);
  }
}
