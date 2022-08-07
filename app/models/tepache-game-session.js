import Model, { attr } from '@ember-data/model';

export default class TepacheGameSessionModel extends Model {
  @attr('string')
  name;

  @attr('string')
  description;

  @attr('string')
  logo;

  @attr('string')
  urn;

  /**
   * @type {String[]}
   */
  @attr('string')
  gameUrn;

  /**
   * @type {Boolean}
   */
  @attr('string')
  state;

  @attr
  stateHistory;

  @attr('string')
  playMode;

  @attr('timestamp')
  expiresAt;
}
