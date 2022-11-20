import Model, { attr } from '@ember-data/model';

export default class TepacheLogModel extends Model {
  @attr('string')
  message;

  @attr('string')
  referenceId;

  /**
   * @deprecated
   */
  @attr('string')
  referenceUrn;

  @attr('timestamp')
  createdAt;

  @attr('boolean')
  deleted;
}
