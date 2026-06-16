export class AppRequest {
  constructor({
    userAgent,
    username,
    badgeLabel,
    badgeColor,
    badgeStyle,
    baseCount,
    isCountAbbreviated
  }) {
    this.userAgentValue = userAgent;
    this.usernameValue = username;
    this.badgeLabelValue = badgeLabel;
    this.badgeColorValue = badgeColor;
    this.badgeStyleValue = badgeStyle;
    this.baseCountValue = baseCount;
    this.countAbbreviated = isCountAbbreviated;
  }

  static fromIncomingMessage(message, searchParams) {
    return new AppRequest({
      userAgent: message.headers['user-agent'] ?? '',
      username: searchParams.get('username') ?? '',
      badgeLabel: searchParams.get('label'),
      badgeColor: searchParams.get('color'),
      badgeStyle: searchParams.get('style'),
      baseCount: searchParams.get('base'),
      isCountAbbreviated: parseBoolean(searchParams.get('abbreviated'))
    });
  }

  userAgent() {
    return this.userAgentValue;
  }

  username() {
    return this.usernameValue;
  }

  badgeLabel() {
    return this.badgeLabelValue;
  }

  badgeColor() {
    return this.badgeColorValue;
  }

  badgeStyle() {
    return this.badgeStyleValue;
  }

  baseCount() {
    return this.baseCountValue;
  }

  isCountAbbreviated() {
    return this.countAbbreviated;
  }
}

function parseBoolean(value) {
  if (value === null) {
    return false;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}
