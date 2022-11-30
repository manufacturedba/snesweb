import Component from '@glimmer/component';
import { localCopy } from 'tracked-toolbox';
import { action } from '@ember/object';

export default class TepacheGameSessionCalendarComponent extends Component {
  @localCopy('args.gameSessionModel.createdAt') center;

  get range() {
    return {
      start: this.args.gameSessionModel.createdAt,
      end: this.args.gameSessionModel.expiresAt,
    };
  }

  @action
  onCenterChange({ date }) {
    this.center = date;
  }
}
