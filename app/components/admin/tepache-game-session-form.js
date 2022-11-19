import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { GAME_SESSION_STATE } from 'tepacheweb/constants';

export default class AdminTepacheGameSessionFormComponent extends Component {
  @tracked
  intermediateModel;

  constructor() {
    super(...arguments);

    const createdAt = this.args.gameSessionModel.createdAt
      ? new Date(this.args.gameSessionModel.createdAt)
      : new Date();

    const expiresAt = this.args.gameSessionModel.expiresAt
      ? new Date(this.args.gameSessionModel.expiresAt)
      : new Date();

    this.intermediateModel = {
      urn: this.args.gameSessionModel.urn,
      state: this.args.gameSessionModel.state,
      name: this.args.gameSessionModel.name,
      description: this.args.gameSessionModel.description,
      logo: this.args.gameSessionModel.logo,
      gameUrn: this.args.gameSessionModel.gameUrn,
      createdAt: new Date(
        createdAt.getTime() - createdAt.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, -1),
      expiresAt: new Date(
        expiresAt.getTime() - expiresAt.getTimezoneOffset() * 60000
      )
        .toISOString()
        .slice(0, -1),
    };
  }

  get gameSessionStateOptions() {
    return Object.values(GAME_SESSION_STATE).map((state) => ({
      label: state.charAt(0).toUpperCase() + state.slice(1).toLowerCase(),
      value: state,
    }));
  }
}
