import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | base/games', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:base/games');
    assert.ok(route);
  });
});
