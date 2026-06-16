import { Count } from './count.js';
import {
  BadgeImageRendererService,
  normalizeBadgeStyle
} from './badgeImageRendererService.js';
import { createCounterRepository } from './counterRepositoryFactory.js';
import { AppRequest } from './request.js';
import { Username } from './username.js';

const DEFAULT_LABEL = 'Profile views';
const DEFAULT_COLOR = 'blue';
const DEFAULT_BASE_COUNT = '0';
const DEFAULT_STYLE = 'flat';
const PROJECT_URL = 'https://github.com/aryansondharva/GitHub-Profile-Views';

export function createRequestHandler({ appBasePath }) {
  const badgeImageRenderer = new BadgeImageRendererService();
  let counterRepositoryPromise;

  async function counterRepository() {
    counterRepositoryPromise ??= createCounterRepository(appBasePath);
    return counterRepositoryPromise;
  }

  return async function handleRequest(message, response) {
    const url = new URL(message.url ?? '/', `http://${message.headers.host ?? 'localhost'}`);
    const request = AppRequest.fromIncomingMessage(message, url.searchParams);
    const usernameValue = request.username().trim();

    if (usernameValue === '') {
      response.writeHead(302, { Location: PROJECT_URL });
      response.end();
      return;
    }

    const badgeLabel = request.badgeLabel() ?? DEFAULT_LABEL;
    const badgeColor = request.badgeColor() ?? DEFAULT_COLOR;
    const baseCount = request.baseCount() ?? DEFAULT_BASE_COUNT;
    const badgeStyle = normalizeBadgeStyle(request.badgeStyle() ?? DEFAULT_STYLE);

    response.setHeader('Content-Type', 'image/svg+xml');
    response.setHeader('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');

    try {
      const repository = await counterRepository();
      const username = new Username(usernameValue);

      if (request.userAgent().startsWith('github-camo')) {
        await repository.addViewByUsername(username);
      }

      if (badgeStyle === 'pixel') {
        response.end(badgeImageRenderer.renderPixel());
        return;
      }

      let count = new Count(await repository.getViewsCountByUsername(username));

      if (baseCount !== DEFAULT_BASE_COUNT) {
        count = count.plus(Count.ofString(baseCount));
      }

      response.end(
        badgeImageRenderer.renderBadgeWithCount(
          badgeLabel,
          count,
          badgeColor,
          badgeStyle,
          request.isCountAbbreviated()
        )
      );
    } catch (error) {
      console.error('Request error:', error);
      response.end(
        badgeImageRenderer.renderBadgeWithError(
          badgeLabel,
          error instanceof Error ? error.message : 'Unexpected error',
          badgeStyle
        )
      );
    }
  };
}
