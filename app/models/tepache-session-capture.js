import Model, { attr } from '@ember-data/model';

export default class TepacheSessionCaptureModel extends Model {
  @attr('string')
  playerSessionUrn;

  @attr('string')
  button;

  @attr('timestamp')
  createdAt;
}
