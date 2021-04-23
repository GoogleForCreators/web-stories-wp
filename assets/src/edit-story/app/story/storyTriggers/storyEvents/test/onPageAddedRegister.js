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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { OnPageAddedRegister } from '../onPageAddedRegister';
import { STORY_EVENTS } from '../types';

describe('OnPageAddedRegister', () => {
  describe(`Story event: ${STORY_EVENTS.onSecondPageAdded}`, () => {
    it('fires onSecondPageAdded if the story starts with more than 1 page', () => {
      const dispatchMock = jest.fn();
      const currentStoryMock = {
        pages: [{ elements: [] }, { elements: [] }, { elements: [] }],
      };

      render(
        <OnPageAddedRegister
          currentStory={currentStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );

      // Should fire onSecondPageAdded event if story has more than one page
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith(STORY_EVENTS.onSecondPageAdded);
    });

    it('fires onSecondPageAdded once a story goes from 1 to 2 pages', () => {
      const dispatchMock = jest.fn();
      const onePageStoryMock = {
        pages: [{ elements: [] }],
      };
      const twoPageStoryMock = {
        pages: [{ elements: [] }, { elements: [] }],
      };

      const { rerender } = render(
        <OnPageAddedRegister
          currentStory={onePageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );

      // Should not fire when story is first created with less than 2 pages.
      expect(dispatchMock).toHaveBeenCalledTimes(0);

      // Should fire onSecondPageAdded when story goes from 1 to 2 pages
      rerender(
        <OnPageAddedRegister
          currentStory={twoPageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith(STORY_EVENTS.onSecondPageAdded);
    });

    it('should not fire onSecondPageAdded more than once', () => {
      const dispatchMock = jest.fn();
      const onePageStoryMock = {
        pages: [{ elements: [] }],
      };
      const twoPageStoryMock = {
        pages: [{ elements: [] }, { elements: [] }],
      };

      const { rerender } = render(
        <OnPageAddedRegister
          currentStory={onePageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );

      // Should not fire when story is first created with less than 2 pages.
      expect(dispatchMock).toHaveBeenCalledTimes(0);

      // Should fire onSecondPageAdded when story goes from 1 to 2 pages
      rerender(
        <OnPageAddedRegister
          currentStory={twoPageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith(STORY_EVENTS.onSecondPageAdded);

      // going from 1 to 2 pages again will not re-trigger the event
      rerender(
        <OnPageAddedRegister
          currentStory={onePageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );
      rerender(
        <OnPageAddedRegister
          currentStory={twoPageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );
      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe(`Story event: ${STORY_EVENTS.onFifthPageAdded}`, () => {
    it('fires onFifthPageAdded if the story starts with more than 1 page', () => {
      const dispatchMock = jest.fn();
      const currentStoryMock = {
        pages: [
          { elements: [] },
          { elements: [] },
          { elements: [] },
          { elements: [] },
          { elements: [] },
        ],
      };

      render(
        <OnPageAddedRegister
          currentStory={currentStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );

      // Should fire onFifthPageAdded event if story has more than 4 pages
      expect(dispatchMock).toHaveBeenCalledWith(STORY_EVENTS.onFifthPageAdded);
    });

    it('fires onFifthPageAdded once a story goes from 4 to 5 pages', () => {
      const dispatchMock = jest.fn();
      const fourPageStoryMock = {
        pages: [
          { elements: [] },
          { elements: [] },
          { elements: [] },
          { elements: [] },
        ],
      };
      const fivePageStoryMock = {
        pages: [
          { elements: [] },
          { elements: [] },
          { elements: [] },
          { elements: [] },
          { elements: [] },
        ],
      };

      const { rerender } = render(
        <OnPageAddedRegister
          currentStory={fourPageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );

      // Should not fire when story is first created with less than 5 pages.
      expect(dispatchMock).not.toHaveBeenCalledWith(
        STORY_EVENTS.onFifthPageAdded
      );

      // Should fire onFifthPageAdded when story goes from 4 to 5 pages
      rerender(
        <OnPageAddedRegister
          currentStory={fivePageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );
      expect(dispatchMock).toHaveBeenCalledWith(STORY_EVENTS.onFifthPageAdded);
    });

    it('should not fire onFifthPageAdded more than once', () => {
      const dispatchMock = jest.fn();
      const fourPageStoryMock = {
        pages: [
          { elements: [] },
          { elements: [] },
          { elements: [] },
          { elements: [] },
        ],
      };
      const fivePageStoryMock = {
        pages: [
          { elements: [] },
          { elements: [] },
          { elements: [] },
          { elements: [] },
          { elements: [] },
        ],
      };

      const { rerender } = render(
        <OnPageAddedRegister
          currentStory={fourPageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );

      // Should not fire when story is first created with less than 5 pages.
      expect(dispatchMock).not.toHaveBeenCalledWith(
        STORY_EVENTS.onFifthPageAdded
      );

      // Should fire onFifthPageAdded when story goes from 4 to 5 pages
      rerender(
        <OnPageAddedRegister
          currentStory={fivePageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );
      expect(dispatchMock).toHaveBeenCalledWith(STORY_EVENTS.onFifthPageAdded);

      dispatchMock.mockClear();

      // going from 4 to 5 pages again will not re-trigger the event
      rerender(
        <OnPageAddedRegister
          currentStory={fourPageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );
      rerender(
        <OnPageAddedRegister
          currentStory={fivePageStoryMock}
          dispatchStoryEvent={dispatchMock}
        />
      );
      expect(dispatchMock).not.toHaveBeenCalled();
    });
  });
});
