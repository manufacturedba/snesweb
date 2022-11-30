import Component from '@glimmer/component';

export default class TepacheGameSessionCalendarComponent extends Component {
  get range() {
    return {
      start: this.args.gameSessionModel.createdAt,
      end: this.args.gameSessionModel.expiresAt,
    };
  }
}
