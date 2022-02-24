/*
 * Copyright 2022 Google LLC
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
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';
/**
 * Internal dependencies
 */
import renderWithTheme from '../../../testUtils/renderWithTheme';
import { StoryContext } from '../../../app/story';
import { ConfigContext } from '../../../app/config';
import StoryPreview from '../content/storyPreview';

describe('publishModal/storyPreview', () => {
  const view = (props) => {
    const {
      storyTitle = '',
      featuredMedia = '',
      publisherLogo = '',
      publisher = '',
    } = props || {};

    return renderWithTheme(
      <ConfigContext.Provider
        value={{
          metadata: {
            publisher: publisher,
          },
          capabilities: {
            hasUploadMediaAction: false,
          },
        }}
      >
        <StoryContext.Provider
          value={{
            state: {
              story: {
                title: storyTitle,
                featuredMedia: {
                  url: featuredMedia,
                  width: 250,
                  height: 355,
                },
                publisherLogo: {
                  url: publisherLogo,
                  width: 25,
                  height: 25,
                },
              },
            },
          }}
        >
          <StoryPreview />
        </StoryContext.Provider>
      </ConfigContext.Provider>
    );
  };

  it('should have no accessibility issues', async () => {
    const { container } = view({
      storyTitle: 'Great books to read',
      featuredMedia: 'http://placekitten.com/230/342',
      publisherLogo: 'http://placekitten.com/158/96',
      publisher: 'My Site Title',
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should render the story title when present', () => {
    view({ storyTitle: 'Great books to read' });
    const storyTitle = screen.getByTestId('story_preview_title');

    expect(storyTitle).toBeInTheDocument();
  });

  it('should render the site title when present', () => {
    view({ publisher: 'My Site Title' });
    const siteTitle = screen.getByTestId('story_preview_publisher');

    expect(siteTitle).toBeInTheDocument();
  });

  it('should render the featured media image when present', () => {
    view({ featuredMedia: 'http://placekitten.com/230/342' });
    const featuredMedia = screen.getByTestId('story_preview_featured_media');

    expect(featuredMedia).toBeInTheDocument();
  });

  it('should render the publisher logo when present', () => {
    view({ publisherLogo: 'http://placekitten.com/158/96' });
    const publisherLogo = screen.getByTestId('story_preview_logo');

    expect(publisherLogo).toBeInTheDocument();
  });

  it('should not render the story title when not present', () => {
    view();
    const storyTitle = screen.queryByTestId('story_preview_title');

    expect(storyTitle).not.toBeInTheDocument();
  });

  it('should not render the site title when not present', () => {
    view();
    const siteTitle = screen.queryByTestId('story_preview_publisher');

    expect(siteTitle).not.toBeInTheDocument();
  });

  it('should not render the featured media image when not present', () => {
    view();
    const featuredMedia = screen.queryByTestId('story_preview_featured_media');

    expect(featuredMedia).not.toBeInTheDocument();
  });

  it('should not render the publisher logo when not present', () => {
    view();
    const publisherLogo = screen.queryByTestId('story_preview_logo');

    expect(publisherLogo).not.toBeInTheDocument();
  });
});
