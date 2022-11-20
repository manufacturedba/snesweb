import Model, { attr } from '@ember-data/model';

export default class TepacheHardwareInputModel extends Model {
  /**
   * @deprecated
   */
  @attr('string')
  gameSessionUrn;

  @attr('string')
  gameSessionId;

  /**
   * @deprecated
   */
  @attr('string')
  playerSessionUrn;

  @attr('string')
  playerSessionId;

  @attr('string')
  button;

  @attr('string')
  type;

  @attr('timestamp')
  createdAt;
}
