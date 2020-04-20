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
 * Internal dependencies
 */
import storyReducer, { ACTION_TYPES } from '../stories';

describe('storyReducer', () => {
  const initialState = {
    isLoading: false,
    stories: {},
    storiesOrderById: [],
    totalStories: null,
    totalPages: null,
  };
  it(`should update stories state when ${ACTION_TYPES.UPDATE_STORIES} is called`, () => {
    const result = storyReducer(initialState, {
      type: ACTION_TYPES.UPDATE_STORIES,
      payload: [
        { id: 94, status: 'draft', title: 'my test story 1' },
        { id: 65, status: 'published', title: 'my test story 2' },
        { id: 78, status: 'draft', title: 'my test story 3' },
        { id: 12, status: 'draft', title: 'my test story 4' },
      ],
    });

    expect(result).toMatchObject({
      ...initialState,
      storiesOrderById: [94, 65, 78, 12],
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        65: { id: 65, status: 'published', title: 'my test story 2' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
    });
  });

  it(`should update stories state when ${ACTION_TYPES.UPDATE_STORIES} is called and maintain order from existing state`, () => {
    const result = storyReducer(
      { ...initialState, storiesOrderById: [55, 99, 10, 3] },
      {
        type: ACTION_TYPES.UPDATE_STORIES,
        payload: [
          { id: 94, status: 'draft', title: 'my test story 1' },
          { id: 65, status: 'published', title: 'my test story 2' },
          { id: 78, status: 'draft', title: 'my test story 3' },
          { id: 12, status: 'draft', title: 'my test story 4' },
        ],
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      storiesOrderById: [55, 99, 10, 3, 94, 65, 78, 12],
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        65: { id: 65, status: 'published', title: 'my test story 2' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
    });
  });

  it(`should update totalStories state when ${ACTION_TYPES.UPDATE_TOTAL_STORIES_COUNT} is called`, () => {
    const result = storyReducer(initialState, {
      type: ACTION_TYPES.UPDATE_TOTAL_STORIES_COUNT,
      payload: 10,
    });

    expect(result).toMatchObject({
      ...initialState,
      totalStories: 10,
    });
  });

  it(`should update totalPages state when ${ACTION_TYPES.UPDATE_TOTAL_STORIES_PAGES} is called`, () => {
    const result = storyReducer(initialState, {
      type: ACTION_TYPES.UPDATE_TOTAL_STORIES_PAGES,
      payload: 3,
    });

    expect(result).toMatchObject({
      ...initialState,
      totalPages: 3,
    });
  });

  it(`should update isLoading state to true when ${ACTION_TYPES.LOADING_STORIES} is called with true payload`, () => {
    const result = storyReducer(initialState, {
      type: ACTION_TYPES.LOADING_STORIES,
      payload: true,
    });

    expect(result).toMatchObject({
      ...initialState,
      isLoading: true,
    });
  });

  it(`should update isLoading state to false when ${ACTION_TYPES.LOADING_STORIES} is called with false payload`, () => {
    const result = storyReducer(
      { ...initialState, isLoading: true },
      {
        type: ACTION_TYPES.LOADING_STORIES,
        payload: false,
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      isLoading: false,
    });
  });
});
