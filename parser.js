class Tokenizer {
  constructor(input) {
    this.input = input;
    this.index = 0;
  }

  // Get the next token
  nextToken() {
    this.skipWhitespace();

    if (this.index >= this.input.length) return null;

    const char = this.input[this.index];

    // Handle structural characters
    if (char === '{') return this.consume('{');
    if (char === '}') return this.consume('}');
    if (char === '[') return this.consume('[');
    if (char === ']') return this.consume(']');
    if (char === ':') return this.consume(':');
    if (char === ',') return this.consume(',');

    // Handle strings
    if (char === '"') return this.parseString();

    // Handle numbers
    if (this.isDigit(char) || char === '-') return this.parseNumber();

    // Handle keywords (true, false, null)
    if (this.isLetter(char)) return this.parseKeyword();

    throw new Error(`Unexpected character: ${char} at position ${this.index}`);
  }

  // Skip whitespace
  skipWhitespace() {
    while (this.index < this.input.length && /\s/.test(this.input[this.index])) {
      this.index++;
    }
  }

  // Consume a single character token
  consume(char) {
    this.index++;
    return char;
  }

  // Parse a string (e.g., "hello")
  parseString() {
    let result = '';
    this.index++; // Skip opening quote
    while (this.index < this.input.length && this.input[this.index] !== '"') {
      if (this.input[this.index] === '\\') {
        // Skip backslash
        this.index++; 
        result += this.input[this.index];
      } else {
        result += this.input[this.index];
      }
      this.index++;
    }
    // Skip closing quote
    this.index++; 
    return result;
  }

  // Parse a number (e.g., 123, -45.67)
  parseNumber() {
    let result = '';
    while (this.index < this.input.length && (this.isDigit(this.input[this.index]) || this.input[this.index] === '.' || this.input[this.index] === '-')) {
      result += this.input[this.index];
      this.index++;
    }
    return parseFloat(result);
  }

  // Parse keywords (true, false, null)
  parseKeyword() {
    let result = '';
    while (this.index < this.input.length && this.isLetter(this.input[this.index])) {
      result += this.input[this.index];
      this.index++;
    }
    if (result === 'true') return true;
    if (result === 'false') return false;
    if (result === 'null') return null;
    throw new Error(`Unknown keyword: ${result}`);
  }

  isDigit(char) {
    return /[0-9]/.test(char);
  }

  isLetter(char) {
    return /[a-zA-Z]/.test(char);
  }
};

const tokenizer = new Tokenizer('{"name": "Alice"}');
console.log(tokenizer.nextToken()); // '{'
console.log(tokenizer.nextToken()); // 'name'
console.log(tokenizer.nextToken()); // ':'
console.log(tokenizer.nextToken()); // 'Alice'
console.log(tokenizer.nextToken()); // '}'


class Parser {
  constructor(input) {
    this.tokenizer = new Tokenizer(input);
    this.currentToken = this.tokenizer.nextToken();
  }

  // consume the current token and move to the next
  consume(expected) {
    if(this.currentToken !== expected) {
      throw new Error (`Expected ${expected}, got ${this.currentToken}`);
    }
    this.currentToken = this.tokenizer.nextToken();
  };


  // Parse the enitre JSON
  parse() {
    const result = this.parseValue();
    if(this.currentToken !== null) {
      throw new Error(`Unexpected tokens after end`);
    }
    return result;
  }

  // Parse any JSON Value
  parseValue() {
    if(this.currentToken === '{') return this.parseObject();
    if(this.currentToken === '[') return this.parseArray();
    if(typeof this.currentToken === 'string') {
      const value = this.currentToken;
      this.currentToken = this.tokenizer.nextToken();
      return value;
    }
    if(typeof this.currentToken === 'number' || typeof this.currentToken === 'boolean' ||
      typeof this.currentToken === null) {
        const value = this.currentToken;
        this.currentToken = this.tokenizer.nextToken();
        return value;
      }
      throw new Error(`Unexpected token: ${this.currentToken}`);
  };


  // Parse an Object
  parseObject() {
    const result = {};
    this.consume('{');

    while(this.currentToken !== '}') {
      const key = this.currentToken;
      if(typeof key !== 'string') throw new Error ('Object key must be a string');
      this.consume(key);
      this.consume(':');
      const value = this.parseValue();
      result[key] = value;
      if(this.currentToken === ',') this.consume(',');
    } 
    this.consume('}');
    return result;
  }
}