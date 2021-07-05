/*
 * Copyright 2021 Google LLC
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
import { renderHook } from '@testing-library/react-hooks';
import { PAGE_RATIO, PAGE_WIDTH } from '@web-stories-wp/units';
/**
 * Internal dependencies
 */
import { ChecklistCheckpointProvider, useCheckpoint } from '..';
import { LayoutProvider } from '../../../../app/layout';
import StoryContext from '../../../../app/story/context';
import { StoryTriggersProvider } from '../../../../app/story/storyTriggers';
import { createPage } from '../../../../elements';
import { PPC_CHECKPOINT_STATE } from '../../constants';

// Static context that providers need above PPC
const layoutContext = {
  state: {
    pageSize: {
      width: PAGE_WIDTH,
      height: PAGE_WIDTH / PAGE_RATIO,
    },
  },
};

const generateStoryPages = (pageCount) => {
  if (pageCount === 1) {
    return [
      {
        id: 1,
        elements: [
          {
            type: 'text',
            content: 'The prepublish checklist should return an empty array',
          },
        ],
      },
    ];
  }
  const generatedPages = [];
  for (let index = 0; index < pageCount; index++) {
    generatedPages.push(createPage());
  }
  return generatedPages;
};

function setup({ pageCount = 7 }) {
  const fullStory = {
    currentPage: {},
    pages: [...generateStoryPages(pageCount)],
    story: {
      featuredMedia: {
        url: 'https://greatimageaggregate.com/1234',
      },
      title: 'How to get rich',
      excerpt: "There's a secret no one wants you to know about",
      author: { id: 1, name: 'admin' },
      status: 'draft',
      pages: generateStoryPages(pageCount),
    },
  };
  const storyContext = {
    actions: {},
    state: fullStory,
  };

  const wrapper = ({ children }) => (
    <StoryContext.Provider value={storyContext}>
      <StoryTriggersProvider story={fullStory}>
        <LayoutProvider value={layoutContext}>
          <ChecklistCheckpointProvider>{children}</ChecklistCheckpointProvider>
        </LayoutProvider>
      </StoryTriggersProvider>
    </StoryContext.Provider>
  );

  return renderHook(() => useCheckpoint(), { wrapper });
}

describe('useCheckpoint', () => {
  it(`returns checkpoint "${PPC_CHECKPOINT_STATE.UNAVAILABLE}" as default`, () => {
    const { result } = setup({ pageCount: 1 });

    expect(result.current.state.checkpoint).toBe(
      PPC_CHECKPOINT_STATE.UNAVAILABLE
    );
  });

  // TODO #8085 add more tests
});
