/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import type { Page } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import getUsedAmpExtensions from './utils/getUsedAmpExtensions';
import Boilerplate from './utils/ampBoilerplate';
import CustomCSS from './utils/styles';
import FontDeclarations from './utils/fontDeclarations';
import OutputPage from './page';
import getPreloadResources from './utils/getPreloadResources';
import { populateElementFontData } from './utils/populateElementFontData';
import type { StoryMetadata, Story } from './types';

interface OutputStoryProps {
  story: Story;
  pages: Page[];
  flags: Record<string, boolean>;
  metadata: StoryMetadata;
}

function OutputStory({
  story: {
    featuredMedia,
    link,
    title,
    fonts,
    autoAdvance,
    defaultPageDuration,
    backgroundAudio,
    publisherLogo,
  },
  pages,
  metadata: { publisher },
  flags,
}: OutputStoryProps) {
  const ampExtensions = getUsedAmpExtensions(pages);
  const preloadResources = getPreloadResources(pages);

  const featuredMediaUrl = featuredMedia?.url || '';
  const publisherLogoUrl = publisherLogo?.url || '';

  if (fonts && Object.keys(fonts).length >= 1) {
    // if fonts are stored at the story level, populate the font data to the elements
    pages = populateElementFontData(pages, fonts);
  }

  return (
    <html amp="" lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1"
        />
        {ampExtensions.map(({ name, src }) => (
          <script
            key={src}
            // @ts-expect-error -- To ensure valid AMP on the frontend.
            async="async"
            src={src}
            custom-element={name}
          />
        ))}
        <FontDeclarations pages={pages} />
        {preloadResources.map(({ url, type }) => (
          <link key={url} href={url} rel="preload" as={type} />
        ))}
        <Boilerplate />
        <CustomCSS />
        {/* Everything between these markers can be replaced server-side. */}
        <meta name="web-stories-replace-head-start" />
        <title>{title}</title>
        {link && <link rel="canonical" href={link} />}
        <meta name="web-stories-replace-head-end" />
      </head>
      <body>
        <amp-story
          standalone=""
          publisher={publisher}
          publisher-logo-src={publisherLogoUrl}
          title={title}
          poster-portrait-src={featuredMediaUrl}
          background-audio={backgroundAudio?.resource?.src ?? undefined}
        >
          {pages.map((page, index) => (
            <OutputPage
              key={page.id}
              page={index === 0 ? { ...page, animations: undefined } : page}
              defaultAutoAdvance={autoAdvance}
              defaultPageDuration={defaultPageDuration}
              flags={flags}
            />
          ))}
        </amp-story>
      </body>
    </html>
  );
}

export default OutputStory;
