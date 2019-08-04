describe('smerge', () => {
  const smerge = require('../src/smerge.js');
  it('deep merges source into target', () => {
    expect(
      smerge({
        a: 1
      }, {
        a: 2
      })
    ).toEqual({
      a: 2
    });
  });
  it('deep merges source into target', () => {
    expect(
      smerge({
        a: 1,
        b: {b1: 'a', b2: 'bx'}
      }, {
        a: 2,
        b: {b2: 'by', b3: 'bz'}
      })
    ).toEqual({
      a: 2,
      b: {b1: 'a', b2: 'by', b3: 'bz'}
    });
  });
  it('deep merges source into target dates', () => {
    var date = new Date();
    expect(
      smerge({a: ''}, {a: date})
    ).toEqual({a: date});
  });
  it('it nulls things', () => {
    expect(
      smerge({
        a: 1,
        b: {b1: 'a', b2: 'bx'}
      }, {
        a: 2,
        b: null
      })
    ).toEqual({
      a: 2,
      b: null
    });
  });
  it('it nulls things nested', () => {
    expect(
      smerge({
        a: 1,
        b: {b1: 'a', b2: 'b'}
      }, {
        a: 2,
        b: {b1: 'a', b2: null}
      })
    ).toEqual({
      a: 2,
      b: {b1: 'a', b2: null}
    });
  });
  it('it sets nulls', () => {
    expect(
      smerge({
        a: 1,
        b: {b1: 'a', b2: null}
      }, {
        a: 2,
        b: {b1: 'a', b2: {b3: 'a'}}
      })
    ).toEqual({
      a: 2,
      b: {b1: 'a', b2: {b3: 'a'}}
    });
  });
  it('can replace a value', () => {
    expect(
      smerge({
        a: 1,
        b: {b1: 'a'}
      }, {
        a: 2,
        b: ['$set', {b2: 'a'}]
      })
    ).toEqual({
      a: 2,
      b: {b2: 'a'}
    });
  });
  it('can append to array', () => {
    expect(
      smerge({
        a: ['a']
      }, {
        a: ['$push', 'b']
      })
    ).toEqual({
      a: ['a', 'b']
    });
  });
  it('can append to array', () => {
    expect(
      smerge({
        a: ['a']
      }, {
        a: ['$concat', ['b', 'c']]
      })
    ).toEqual({
      a: ['a', 'b', 'c']
    });
  });
  it('can prepend to array', () => {
    expect(
      smerge({
        a: ['a']
      }, {
        a: ['$unshift', 'b']
      })
    ).toEqual({
      a: ['b', 'a']
    });
  });
  it('can execute arbitrary update', () => {
    expect(
      smerge({
        a: ['a']
      }, {
        a: ['$function', function (a) {
          return {z: a};
        }]
      })
    ).toEqual({
      a: {z: ['a']}
    });
  });
  it('replaces arrays by default', () => {
    expect(
      smerge({
        a: ['1']
      }, {
        a: ['2']
      })
    ).toEqual({
      a: ['2']
    });
    expect(
      smerge({
        a: ['1']
      }, {
        a: ['2']
      }, true)
    ).toEqual({
      a: ['1', '2']
    });
  });
  it('replaces the entire value if enclosed in array', () => {
    expect(smerge({a: 'foo'}, [{b: 'bar'}])).toEqual({
      b: 'bar'
    });
  });
  it('empties the value if an empty array is supplied', () => {
    expect(smerge({a: 'foo'}, [])).toEqual({});
  });
  it('deep merges by path', () => {
    expect(smerge({
      a: {
        a1: {
          a2: 'a'
        }
      }
    }, ['a.a1', {
      a3: 'b'
    }])).toEqual({
      a: {
        a1: {
          a2: 'a',
          a3: 'b'
        }
      }
    });
  });
  it('replaces by path', () => {
    expect(smerge({
      a: {
        a1: {
          a2: 'a'
        }
      }
    }, ['a.a1', [{
      a3: 'b'
    }]])).toEqual({
      a: {
        a1: {
          a3: 'b'
        }
      }
    });
  });
  it('does not merge if source argument is undefined', () => {
    expect(smerge({a: 'a'}, [][0])).toEqual({a: 'a'});
  });
  it('does not replace by path if source argument is undefined', () => {
    expect(smerge({a: 'a'}, ['a', [][0]])).toEqual({a: 'a'});
  });
});
