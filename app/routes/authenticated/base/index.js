import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class BaseIndexRoute extends Route {
  @service
  store;

  model() {}
}
