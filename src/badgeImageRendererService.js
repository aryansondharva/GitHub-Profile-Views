const ABBREVIATIONS = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];

const COLORS = new Map([
  ['brightgreen', '#4c1'],
  ['green', '#97ca00'],
  ['yellow', '#dfb317'],
  ['yellowgreen', '#a4a61d'],
  ['orange', '#fe7d37'],
  ['red', '#e05d44'],
  ['blue', '#007ec6'],
  ['grey', '#555'],
  ['gray', '#555'],
  ['lightgrey', '#9f9f9f'],
  ['lightgray', '#9f9f9f'],
  ['blueviolet', '#8833d7']
]);

export class BadgeImageRendererService {
  renderBadgeWithCount(label, count, messageBackgroundFill, badgeStyle, isCountAbbreviated) {
    const message = formatNumber(count.toBigInt(), isCountAbbreviated);

    return this.renderBadge(label, message, messageBackgroundFill, badgeStyle);
  }

  renderBadgeWithError(label, message, badgeStyle) {
    return this.renderBadge(label, message, 'red', badgeStyle);
  }

  renderPixel() {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>';
  }

  renderBadge(label, message, messageBackgroundFill, badgeStyle) {
    const style = normalizeBadgeStyle(badgeStyle);
    const displayLabel = style === 'for-the-badge' ? label.toUpperCase() : label;
    const displayMessage = style === 'for-the-badge' ? message.toUpperCase() : message;
    const labelWidth = textWidth(displayLabel, style);
    const messageWidth = textWidth(displayMessage, style);
    const width = labelWidth + messageWidth;
    const height = style === 'for-the-badge' ? 28 : 20;
    const radius = ['flat-square', 'for-the-badge'].includes(style) ? 0 : 3;
    const fontSize = style === 'for-the-badge' ? 11 : 11;
    const textY = style === 'for-the-badge' ? 19 : 14;
    const messageFill = resolveColor(messageBackgroundFill);
    const labelFill = style === 'plastic' ? 'url(#labelGradient)' : '#555';
    const valueFill = style === 'plastic' ? 'url(#messageGradient)' : messageFill;
    const title = `${displayLabel}: ${displayMessage}`;

    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}">`,
      '<title>' + escapeXml(title) + '</title>',
      style === 'plastic' ? gradients(messageFill) : '',
      `<rect width="${labelWidth}" height="${height}" fill="${labelFill}" rx="${radius}"/>`,
      `<rect x="${labelWidth}" width="${messageWidth}" height="${height}" fill="${valueFill}" rx="${radius}"/>`,
      `<rect x="${labelWidth - radius}" width="${radius}" height="${height}" fill="${valueFill}"/>`,
      `<text fill="#fff" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="${fontSize}" text-anchor="middle" x="${labelWidth / 2}" y="${textY}">${escapeXml(displayLabel)}</text>`,
      `<text fill="#fff" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="${fontSize}" text-anchor="middle" x="${labelWidth + messageWidth / 2}" y="${textY}">${escapeXml(displayMessage)}</text>`,
      '</svg>'
    ].join('');
  }
}

export function normalizeBadgeStyle(style) {
  return ['flat', 'flat-square', 'plastic', 'for-the-badge', 'pixel'].includes(style)
    ? style
    : 'flat';
}

export function formatNumber(number, isCountAbbreviated) {
  if (isCountAbbreviated) {
    return formatAbbreviatedNumber(number);
  }

  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatAbbreviatedNumber(number) {
  let abbreviationIndex = 0;
  let divisor = 1n;

  while (number >= divisor * 1000n && abbreviationIndex < ABBREVIATIONS.length - 1) {
    divisor *= 1000n;
    abbreviationIndex++;
  }

  if (abbreviationIndex === 0) {
    return number.toString();
  }

  const scaledTenths = (number * 10n + divisor / 2n) / divisor;
  const whole = scaledTenths / 10n;
  const decimal = scaledTenths % 10n;
  const formatted = decimal === 0n ? whole.toString() : `${whole}.${decimal}`;

  return `${formatted}${ABBREVIATIONS[abbreviationIndex]}`;
}

function textWidth(value, style) {
  const padding = style === 'for-the-badge' ? 18 : 10;
  const averageCharacterWidth = style === 'for-the-badge' ? 7.5 : 7;

  return Math.ceil([...value].length * averageCharacterWidth + padding);
}

function resolveColor(color) {
  const value = (color ?? 'blue').replace(/^#/, '').toLowerCase();

  if (COLORS.has(value)) {
    return COLORS.get(value);
  }

  if (/^[a-f0-9]{3}([a-f0-9]{3})?$/.test(value)) {
    return `#${value}`;
  }

  return COLORS.get('blue');
}

function gradients(messageFill) {
  return [
    '<defs>',
    '<linearGradient id="labelGradient" x2="0" y2="100%">',
    '<stop offset="0" stop-color="#777"/>',
    '<stop offset="1" stop-color="#444"/>',
    '</linearGradient>',
    '<linearGradient id="messageGradient" x2="0" y2="100%">',
    `<stop offset="0" stop-color="${messageFill}"/>`,
    `<stop offset="1" stop-color="${messageFill}"/>`,
    '</linearGradient>',
    '</defs>'
  ].join('');
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
