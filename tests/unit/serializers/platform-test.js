import { module, test } from 'qunit';
import { setupTest } from 'tepacheweb/tests/helpers';

module('Unit | Serializer | platform', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let store = this.owner.lookup('service:store');
    let serializer = store.serializerFor('platform');

    assert.ok(serializer);
  });

  test('it serializes records', function (assert) {
    let store = this.owner.lookup('service:store');
    let record = store.createRecord('platform', {});

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
