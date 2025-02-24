const { test } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper'); // Import our helper

test('dummy returns one', () => {
  const blogs = []; // Empty array (input doesn't matter)

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1); // Expected output should be 1
});
