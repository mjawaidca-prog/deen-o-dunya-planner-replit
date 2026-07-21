// Lightweight assert shim for React Native / Metro bundler.
// expo-notifications → @ide/backoff imports Node's `assert` stdlib which
// doesn't exist in the RN runtime. This shim satisfies that import.
function assert(value, message) {
  if (!value) {
    throw new Error(message || 'Assertion failed');
  }
}
assert.ok = assert;
assert.equal = (a, b, msg) => { if (a != b) throw new Error(msg || `${a} == ${b}`); };
assert.strictEqual = (a, b, msg) => { if (a !== b) throw new Error(msg || `${a} === ${b}`); };
assert.notEqual = (a, b, msg) => { if (a == b) throw new Error(msg || `${a} != ${b}`); };
assert.notStrictEqual = (a, b, msg) => { if (a === b) throw new Error(msg || `${a} !== ${b}`); };
assert.deepEqual = assert.ok;
assert.deepStrictEqual = assert.ok;
assert.throws = (fn) => { try { fn(); } catch { return; } throw new Error('Expected to throw'); };
assert.doesNotThrow = (fn) => { fn(); };
assert.ifError = (err) => { if (err) throw err; };
assert.fail = (msg) => { throw new Error(msg || 'assert.fail'); };
module.exports = assert;
