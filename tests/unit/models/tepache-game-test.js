import { module, test } from 'qunit';
import { setupTest } from 'tepacheweb/tests/helpers';

module('Unit | Model | tepache game', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let model = store.createRecord('tepache-game', {});
    assert.ok(model);
  });
});
