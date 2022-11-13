import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';
import config from 'tepacheweb/config/environment';

export default class PlatformAdapter extends JSONAPIAdapter {
  @service
  session;

  host = config['platform-adapter'].host;
  namespace = 'api';

  get headers() {
    // This gets bugged on first login. Firebase auth will automatically fix
    // token after refresh, but it's not reliable
    return {
      Authorization: `${this.session?.data?.authenticated?.user?.accessToken}`,
    };
  }

  query(store, type, { query }) {
    let processedQuery = {};

    if (query) {
      const filters = query();

      if (filters.sort) {
        processedQuery.sort = filters.sort.reduce((acc, filter) => {
          const reducedDirection = filter.sort.direction === 'desc' ? '-' : '';
          acc += `${reducedDirection}${filter.sort.field},`;
          return acc;
        }, '');
      }

      if (filters.filter) {
        processedQuery.filter = filters.filter.reduce(
          (acc, filter, currentIndex) => {
            if (currentIndex == 0) {
              acc += `(${filter.filter.field}${filter.filter.operator}${filter.filter.value})`;
            } else {
              acc += `,(${filter.filter.field}${filter.filter.operator}${filter.filter.value})`;
            }

            return acc;
          },
          '('
        );

        processedQuery.filter += ')';
      }

      if (filters.limit) {
        processedQuery.limit = filters.limit.reduce((acc, filter) => {
          acc = filter.limit;
          return acc;
        }, '');
      }
    }

    return super.query(store, type, processedQuery);
  }
}
