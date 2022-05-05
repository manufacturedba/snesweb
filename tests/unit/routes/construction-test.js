import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | construction', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:construction');
    assert.ok(route);
  });
});
