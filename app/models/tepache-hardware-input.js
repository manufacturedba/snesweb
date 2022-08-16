import Model, { attr } from '@ember-data/model';

export default class TepacheHardwareInputModel extends Model {
  @attr('string')
  gameSessionUrn;

  @attr('string')
  playerSessionUrn;

  @attr('string')
  button;

  @attr('string')
  type;

  @attr('timestamp')
  createdAt;
}
