export function query(...args) {
  const gatheredFilters = {};

  function detectType(filter) {
    return Object.keys(filter)[0];
  }

  for (let i = 0; i < args.length; i++) {
    const type = detectType(args[i]);

    if (gatheredFilters[type]) {
      gatheredFilters[type].push(args[i]);
    } else {
      gatheredFilters[type] = [args[i]];
    }
  }

  return gatheredFilters;
}

export function limit(integer) {
  return {
    limit: integer,
  };
}

export function sort(field, direction) {
  return {
    sort: {
      field,
      direction,
    },
  };
}

export function filter(field, operator, value) {
  return {
    filter: {
      field,
      operator,
      value,
    },
  };
}
