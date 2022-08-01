import Component from '@glimmer/component';
import Two from 'two.js';
import { action } from '@ember/object';

export default class TepacheGameClientControllerComponent extends Component {
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

  willDestroy() {
    super.willDestroy(...arguments);
    // this.two.unbind('update');
    // this.two.pause();
    // this.element.removeChild(this.two.renderer.domElement);
  }
}
