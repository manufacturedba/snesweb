import Model, { attr } from '@ember-data/model';

export default class TepachePlayerSessionModel extends Model {
  @attr('string')
  urn;

  @attr('string')
  name;

  @attr('string')
  gameSessionUrn;

  @attr('string')
  uid;

  /**
   * @type {String[]}
   */
  @attr('string')
  state;

  @attr('timestamp')
  createdAt;

  @attr('timestamp')
  lastActivityAt;
}
