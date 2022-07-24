import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | magwest/live', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:magwest/live');
    assert.ok(route);
  });
});
