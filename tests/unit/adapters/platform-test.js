import { module, test } from 'qunit';
import { setupTest } from 'tepacheweb/tests/helpers';

module('Unit | Adapter | platform', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let adapter = this.owner.lookup('adapter:platform');
    assert.ok(adapter);
  });
});
