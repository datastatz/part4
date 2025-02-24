const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper'); // Import our helper

test('dummy returns one', () => {
  const blogs = []; // Empty array (input doesn't matter)

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1); // Expected output should be 1
});

describe('total likes', () => {
    const listWithOneBlog = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    ];
  
    const multipleBlogs = [
      {
        _id: '1',
        title: 'First Blog',
        author: 'Author 1',
        url: 'http://example.com/1',
        likes: 10,
        __v: 0
      },
      {
        _id: '2',
        title: 'Second Blog',
        author: 'Author 2',
        url: 'http://example.com/2',
        likes: 20,
        __v: 0
      },
      {
        _id: '3',
        title: 'Third Blog',
        author: 'Author 3',
        url: 'http://example.com/3',
        likes: 30,
        __v: 0
      }
    ];
  
    test('when list has only one blog, equals the likes of that blog', () => {
      const result = listHelper.totalLikes(listWithOneBlog);
      assert.strictEqual(result, 5);
    });
  
    test('when list has multiple blogs, returns sum of likes', () => {
      const result = listHelper.totalLikes(multipleBlogs);
      assert.strictEqual(result, 60); // 10 + 20 + 30
    });
  
    test('when list is empty, returns 0', () => {
      const result = listHelper.totalLikes([]);
      assert.strictEqual(result, 0);
    });
  });