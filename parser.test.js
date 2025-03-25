const { Tokenizer, Parser } = require('./parser');

describe('JSON Parser Unit Tests', () => {
  // Empty object and invalid JSON
  test('parse empty object {}', () => {
    const parser = new Parser('{}');
    expect(parser.parse()).toEqual({});
  });

  test('rejects invalid JSON', () => {
    const parser = new Parser('{');
    expect(() => parser.parse()).toThrow();
  });

  // String key-value pairs
  test('parses simple string key-value {"key": "value"}', () => {
    const parser = new Parser('{ "key": "value" }');
    expect(parser.parse()).toEqual({ key: 'value' });
  });

  test('rejects unquoted key {key: "value"}', () => {
    const parser = new Parser('{key: "value"}');
    expect(() => parser.parse()).toThrow(/Invalid token: \"key\". Keys must be quoted strings./);
  })

  // Mixed types
  test('parses mixed types', () => {
    const input = '{"key1": true, "key2": false, "key3": null, "key4": "value", "key5": 101}';
    const parser = new Parser(input);
    expect(parser.parse()).toEqual({
      key1: true,
      key2: false,
      key3: null,
      key4: 'value',
      key5: 101
    });
  });

  // Nested objects and arrays
  test('parses nested object and array', () => {
    const input = '{"key": "value", "key-n": 101, "key-o": {}, "key-l": []}';
    const parser = new  Parser(input);
    expect(parser.parse()).toEqual({
      key: 'value',
      'key-n': 101,
      'key-o': {},
      'key-l': []
    });
  });

  // aditional edge cases
  test('rejects unclosed string {"key": "unclosed}', () => {
    const parser = new Parser('{"key": "unclosed}');
    expect(() => parser.parse()).toThrow(/Unclosed string/);
  });

  test('handles whitespace {"key":  "value"}', () => {
    const parser = new Parser('{"key":  "value"}');
    expect(parser.parse()).toEqual({ key: 'value' });
  });
})