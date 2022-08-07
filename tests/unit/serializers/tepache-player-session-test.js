import { module, test } from 'qunit';
import { setupTest } from 'tepacheweb/tests/helpers';

module('Unit | Serializer | tepache player session', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('tepache-player-session');

    assert.ok(serializer);
  });

  test('it serializes records', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('tepache-player-session', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
