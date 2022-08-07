import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { run } from '@ember/runloop';

const initialPressedState = {
  a: false,
  b: false,
  x: false,
  y: false,
  start: false,
  select: false,
  left: false,
  right: false,
  up: false,
  down: false,
};
export default class AuthenticatedBaseMagwestLiveController extends Controller {
  gameSessionModel = null;

  constructor() {
    super(...arguments);
  }
}
