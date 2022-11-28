import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module(
  'Unit | Controller | authenticated/base/admin/game-session-new',
  function (hooks) {
    setupTest(hooks);

    // TODO: Replace this with your real tests.
    test('it exists', function (assert) {
      let controller = this.owner.lookup(
        'controller:authenticated/base/admin/game-session-new'
      );
      assert.ok(controller);
    });
  }
);
