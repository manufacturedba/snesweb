import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class IdentifiedUserService extends Service {
  @service
  session;

  @service
  store;

  @tracked
  _roleResolved = false;

  @tracked
  _role = null;

  /**
   * User at least has some entry in admin roles
   */
  get isAdmin() {
    return this._role !== null;
  }

  get isOwner() {
    return this._role & 1;
  }

  get isModerator() {
    return this._role & 2;
  }

  get isViewer() {
    return this._role & 4;
  }

  get canLogin() {
    return !this.user;
  }

  get user() {
    const userImpl = this.session?.data?.authenticated?.user;

    return userImpl || null;
  }

  get isAnonymous() {
    return this.user?.isAnonymous;
  }

  get identified() {
    return this.user && !this.user?.isAnonymous;
  }

  get uid() {
    return this.user?.uid;
  }

  fetchRole(uid) {
    if (this._roleResolved) {
      return;
    }

    return this.store
      .findRecord('tepache-admin', uid, {
        adapterOptions: {
          isRealtime: true,
        },
      })
      .then((admin) => {
        this._roleResolved = true;
        this._role = admin.role;
      })
      .catch((err) => {
        console.warn('No admin role found for user', err);
        this._roleResolved = false;
      });
  }
}
