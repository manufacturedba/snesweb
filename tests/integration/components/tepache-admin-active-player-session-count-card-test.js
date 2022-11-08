import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | tepache-admin-active-player-session-count-card',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<TepacheAdminActivePlayerSessionCountCard />`);

      assert.dom(this.element).hasText('');

      // Template block usage:
      await render(hbs`
      <TepacheAdminActivePlayerSessionCountCard>
        template block text
      </TepacheAdminActivePlayerSessionCountCard>
    `);

      assert.dom(this.element).hasText('template block text');
    });
  }
);
