import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';
import { defer } from 'rsvp';

module('Integration | Component | oven-player', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(2);

    this.options = {
      title: 'OvenPlayer Title',
    };

    const deferred = defer();
    this.onReady = sinon.stub().callsFake(() => deferred.resolve());

    await render(hbs`<OvenPlayer 
      @options={{this.options}}
      @onReady={{this.onReady}}
    />`);

    await deferred.promise;

    assert.true(this.onReady.calledOnce, 'onReady is called');
    assert
      .dom(this.element.querySelector('.op-thumbnail-header'))
      .containsText('OvenPlayer Title', 'Title is shown on player');
  });
});
