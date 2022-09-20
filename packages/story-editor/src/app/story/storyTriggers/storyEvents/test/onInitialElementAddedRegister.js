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
import {
  OnInitialElementAddedRegister,
  isNewStory,
} from '../onInitialElementAddedRegister';
import { STORY_EVENTS } from '../types';

describe('OnInitialElementAddedRegister', () => {
  it('fires onInitialElementAdded once when story is not empty', () => {
    const dispatchMock = jest.fn();
    const currentStoryMock = {
      pages: [{ elements: [{}, {}] }],
    };

    const { rerender } = render(
      <OnInitialElementAddedRegister
        currentStory={currentStoryMock}
        dispatchStoryEvent={dispatchMock}
      />
    );

    // Should fire onInitialElementAdded event once when story starts empty
    expect(dispatchMock).toHaveBeenCalledOnce();
    expect(dispatchMock).toHaveBeenCalledWith(
      STORY_EVENTS.onInitialElementAdded
    );

    // Should not fire onInitialElementAdded again when updated current story
    // is also not empty, but onInitialElementAdded has already fired once.
    rerender(
      <OnInitialElementAddedRegister
        currentStory={{ ...currentStoryMock }}
        dispatchStoryEvent={dispatchMock}
      />
    );
    expect(dispatchMock).toHaveBeenCalledOnce();
  });

  it('fires onInitialElementAdded once when story first becomes non-empty', () => {
    const dispatchMock = jest.fn();
    const emptyStoryMock = {
      pages: [{ elements: [{ isBackground: true }] }],
    };
    const nonEmptyStoryMock = {
      pages: [{ elements: [{ isBackground: true }, {}] }],
    };

    const { rerender } = render(
      <OnInitialElementAddedRegister
        currentStory={emptyStoryMock}
        dispatchStoryEvent={dispatchMock}
      />
    );

    // Should fire onInitialElementAdded event once when story starts empty
    expect(dispatchMock).toHaveBeenCalledTimes(0);

    // Should not fire onInitialElementAdded again when updated current story
    // is also not empty, but onInitialElementAdded has already fired once.
    rerender(
      <OnInitialElementAddedRegister
        currentStory={nonEmptyStoryMock}
        dispatchStoryEvent={dispatchMock}
      />
    );
    expect(dispatchMock).toHaveBeenCalledOnce();
    expect(dispatchMock).toHaveBeenCalledWith(
      STORY_EVENTS.onInitialElementAdded
    );
  });
});

describe('isNewStory', () => {
  it('returns true if there are no pages in story', () => {
    expect(isNewStory({ pages: [] })).toBeTrue();
  });
  it('returns true if there is only one page in the story that only has a background element', () => {
    expect(
      isNewStory({ pages: [{ elements: [{ isBackground: true }] }] })
    ).toBeTrue();
  });
  it('returns false if there is more than page', () => {
    expect(
      isNewStory({
        pages: [
          { elements: [{ isBackground: true }] },
          { elements: [{ isBackground: true }] },
        ],
      })
    ).toBeFalse();
  });
  it('returns false if there is only one page and it has more than just the bg element', () => {
    expect(
      isNewStory({
        pages: [{ elements: [{ isBackground: true }, { id: 'otherElement' }] }],
      })
    ).toBeFalse();
  });
});
