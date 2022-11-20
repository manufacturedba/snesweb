import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { GAME_SESSION_STATE } from 'tepacheweb/constants';
import { action } from '@ember/object';

function createDateTimeLocalString(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

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
      id: this.args.gameSessionModel.id,
      urn: this.args.gameSessionModel.urn,
      state: this.args.gameSessionModel.state,
      name: this.args.gameSessionModel.name,
      description: this.args.gameSessionModel.description,
      logo: this.args.gameSessionModel.logo,
      gameUrn: this.args.gameSessionModel.gameUrn,
      gameId: this.args.gameSessionModel.gameId,
      createdAt: createDateTimeLocalString(createdAt),
      expiresAt: createDateTimeLocalString(expiresAt),
    };
  }

  get gameSessionStateOptions() {
    return Object.values(GAME_SESSION_STATE);
  }

  @action
  async saveGameSession() {
    this.args.gameSessionModel.state = this.intermediateModel.state;
    this.args.gameSessionModel.name = this.intermediateModel.name;
    this.args.gameSessionModel.description = this.intermediateModel.description;
    this.args.gameSessionModel.logo = this.intermediateModel.logo;
    this.args.gameSessionModel.gameUrn = this.intermediateModel.gameUrn;
    this.args.gameSessionModel.createdAt = new Date(
      this.intermediateModel.createdAt
    );
    this.args.gameSessionModel.expiresAt = new Date(
      this.intermediateModel.expiresAt
    );

    await this.args.gameSessionModel.save();
  }
}
