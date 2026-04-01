// name_generator.js — Donjon Markov chain name generator
// written and released to the public domain by drow <drow@bin.sh>
// http://creativecommons.org/publicdomain/zero/1.0/

const name_set = {};
const chain_cache = {};

function generate_name(type) {
  let chain;
  if (chain = markov_chain(type)) {
    return markov_name(chain);
  }
  return '';
}

function name_list(type, n_of) {
  const list = [];
  for (let i = 0; i < n_of; i++) {
    list.push(generate_name(type));
  }
  return list;
}

function markov_chain(type) {
  let chain;
  if (chain = chain_cache[type]) {
    return chain;
  } else {
    let list;
    if ((list = name_set[type]) && list.length) {
      let chain;
      if (chain = construct_chain(list)) {
        chain_cache[type] = chain;
        return chain;
      }
    }
  }
  return false;
}

function construct_chain(list) {
  let chain = {};
  for (let i = 0; i < list.length; i++) {
    const names = list[i].split(/\s+/);
    chain = incr_chain(chain, 'parts', names.length);
    for (let j = 0; j < names.length; j++) {
      const name = names[j];
      chain = incr_chain(chain, 'name_len', name.length);
      let c = name.substr(0, 1);
      chain = incr_chain(chain, 'initial', c);
      let string = name.substr(1);
      let last_c = c;
      while (string.length > 0) {
        c = string.substr(0, 1);
        chain = incr_chain(chain, last_c, c);
        string = string.substr(1);
        last_c = c;
      }
    }
  }
  return scale_chain(chain);
}

function incr_chain(chain, key, token) {
  if (chain[key]) {
    if (chain[key][token]) { chain[key][token]++; }
    else { chain[key][token] = 1; }
  } else {
    chain[key] = {};
    chain[key][token] = 1;
  }
  return chain;
}

function scale_chain(chain) {
  const table_len = {};
  Object.keys(chain).forEach(key => {
    table_len[key] = 0;
    Object.keys(chain[key]).forEach(token => {
      const count = chain[key][token];
      const weighted = Math.floor(Math.pow(count, 1.3));
      chain[key][token] = weighted;
      table_len[key] += weighted;
    });
  });
  chain['table_len'] = table_len;
  return chain;
}

function markov_name(chain) {
  const parts = select_link(chain, 'parts');
  const names = [];
  for (let i = 0; i < parts; i++) {
    const name_len = select_link(chain, 'name_len');
    let c = select_link(chain, 'initial');
    let name = c;
    let last_c = c;
    while (name.length < name_len) {
      c = select_link(chain, last_c);
      if (!c) break;
      name += c;
      last_c = c;
    }
    names.push(name);
  }
  return names.join(' ');
}

function select_link(chain, key) {
  const len = chain['table_len'][key];
  if (!len) return false;
  let idx = Math.floor(Math.random() * len);
  const tokens = Object.keys(chain[key]);
  let acc = 0;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    acc += chain[key][token];
    if (acc > idx) return token;
  }
  return false;
}