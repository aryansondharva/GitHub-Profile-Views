const USERNAME_REGEX = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

export class Username {
  constructor(username) {
    if (typeof username !== 'string') {
      throw new TypeError('Username must be a string');
    }

    if (username.length < 1) {
      throw new RangeError('Username must contain at least 1 character');
    }

    if (username.length > 39) {
      throw new RangeError('Username must contain at most 39 characters');
    }

    if (!USERNAME_REGEX.test(username)) {
      throw new TypeError(
        'Username may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen.'
      );
    }

    this.username = username.toLowerCase();
  }

  toString() {
    return this.username;
  }
}
