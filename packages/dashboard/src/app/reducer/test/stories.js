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
import { STORY_STATUS } from '../../../constants';
import { ERRORS } from '../../textContent';

describe('storyReducer', () => {
  const initialState = {
    error: {},
    isLoading: false,
    stories: {},
    storiesOrderById: [],
    totalStoriesByStatus: {},
    totalPages: null,
  };

  const MOCK_ERROR_ID = Date.now();

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => MOCK_ERROR_ID);
  });

  it(`should update stories state when ${ACTION_TYPES.TRASH_STORY} is called`, () => {
    const result = storyReducer(
      {
        ...initialState,
        storiesOrderById: [94, 65, 78, 12],
        stories: {
          94: { id: 94, status: 'draft', title: 'my test story 1' },
          65: { id: 65, status: 'publish', title: 'my test story 2' },
          78: { id: 78, status: 'draft', title: 'my test story 3' },
          12: { id: 12, status: 'draft', title: 'my test story 4' },
        },
        totalStoriesByStatus: {
          all: 44,
          [STORY_STATUS.DRAFT]: 40,
          [STORY_STATUS.PUBLISH]: 4,
        },
        totalPages: 4,
      },
      {
        type: ACTION_TYPES.TRASH_STORY,
        payload: {
          id: 65,
          storyStatus: 'publish',
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      error: {},
      storiesOrderById: [94, 78, 12],
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
      totalStoriesByStatus: {
        all: 43,
        [STORY_STATUS.DRAFT]: 40,
        [STORY_STATUS.PUBLISH]: 3,
      },
      totalPages: 4,
    });
  });

  it(`should update error when ${ACTION_TYPES.TRASH_STORY_FAILURE} is called`, () => {
    const result = storyReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.TRASH_STORY_FAILURE,
        payload: {
          message: ERRORS.DELETE_STORY.MESSAGE,
          code: 'my_error_code',
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      error: {
        message: ERRORS.DELETE_STORY.MESSAGE,
        id: MOCK_ERROR_ID,
        code: 'my_error_code',
      },
    });
  });

  it(`should update stories state when ${ACTION_TYPES.DUPLICATE_STORY} is called`, () => {
    const result = storyReducer(
      {
        ...initialState,
        storiesOrderById: [94, 65, 78, 12],
        stories: {
          94: { id: 94, status: 'draft', title: 'my test story 1' },
          65: { id: 65, status: 'publish', title: 'my test story 2' },
          78: { id: 78, status: 'draft', title: 'my test story 3' },
          12: { id: 12, status: 'draft', title: 'my test story 4' },
        },
        totalStoriesByStatus: {
          all: 44,
          [STORY_STATUS.DRAFT]: 40,
          [STORY_STATUS.PUBLISH]: 4,
        },
        totalPages: 4,
      },
      {
        type: ACTION_TYPES.DUPLICATE_STORY,
        payload: { id: 95, status: 'draft', title: 'my test story 1 - copy' },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      error: {},
      storiesOrderById: [95, 94, 65, 78, 12],
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        95: { id: 95, status: 'draft', title: 'my test story 1 - copy' },
        65: { id: 65, status: 'publish', title: 'my test story 2' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
      totalStoriesByStatus: {
        all: 45,
        [STORY_STATUS.DRAFT]: 41,
        [STORY_STATUS.PUBLISH]: 4,
      },
      totalPages: 4,
    });
  });

  it(`should update error when ${ACTION_TYPES.DUPLICATE_STORY_FAILURE} is called`, () => {
    const result = storyReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.DUPLICATE_STORY_FAILURE,
        payload: {
          message: ERRORS.DUPLICATE_STORY.MESSAGE,
          code: 'my_error_code',
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      error: {
        message: ERRORS.DUPLICATE_STORY.MESSAGE,
        id: MOCK_ERROR_ID,
        code: 'my_error_code',
      },
    });
  });

  it(`should update stories state when ${ACTION_TYPES.FETCH_STORIES_SUCCESS} is called`, () => {
    const result = storyReducer(initialState, {
      type: ACTION_TYPES.FETCH_STORIES_SUCCESS,
      payload: {
        page: 1,
        stories: {
          94: { id: 94, status: 'draft', title: 'my test story 1' },
          65: { id: 65, status: 'publish', title: 'my test story 2' },
          78: { id: 78, status: 'draft', title: 'my test story 3' },
          12: { id: 12, status: 'draft', title: 'my test story 4' },
        },
        totalStoriesByStatus: {
          all: 44,
          [STORY_STATUS.DRAFT]: 40,
          [STORY_STATUS.PUBLISH]: 4,
        },
        totalPages: 4,
        fetchedStoryIds: [94, 65, 78, 12],
      },
    });

    expect(result).toMatchObject({
      ...initialState,
      error: {},
      storiesOrderById: [94, 65, 78, 12],
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        65: { id: 65, status: 'publish', title: 'my test story 2' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
      totalStoriesByStatus: {
        all: 44,
        [STORY_STATUS.DRAFT]: 40,
        [STORY_STATUS.PUBLISH]: 4,
      },
      totalPages: 4,
      allPagesFetched: false,
    });
  });

  it(`should update stories state when ${ACTION_TYPES.FETCH_STORIES_SUCCESS} is called and maintain order from existing state`, () => {
    const result = storyReducer(
      { ...initialState, storiesOrderById: [55, 99, 10, 3] },
      {
        type: ACTION_TYPES.FETCH_STORIES_SUCCESS,
        payload: {
          page: 2,
          stories: {
            94: { id: 94, status: 'draft', title: 'my test story 1' },
            65: { id: 65, status: 'publish', title: 'my test story 2' },
            78: { id: 78, status: 'draft', title: 'my test story 3' },
            12: { id: 12, status: 'draft', title: 'my test story 4' },
          },
          totalStoriesByStatus: {
            all: 18,
            [STORY_STATUS.DRAFT]: 14,
            [STORY_STATUS.PUBLISH]: 4,
          },
          totalPages: 2,
          fetchedStoryIds: [94, 65, 78, 12],
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      storiesOrderById: [55, 99, 10, 3, 94, 65, 78, 12],
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        65: { id: 65, status: 'publish', title: 'my test story 2' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
      totalStoriesByStatus: {
        all: 18,
        [STORY_STATUS.DRAFT]: 14,
        [STORY_STATUS.PUBLISH]: 4,
      },
      totalPages: 2,
      allPagesFetched: true,
    });
  });

  it(`should update stories state when ${ACTION_TYPES.FETCH_STORIES_SUCCESS} is called and set totalPages to at least one`, () => {
    const result = storyReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.FETCH_STORIES_SUCCESS,
        payload: {
          page: 1,
          stories: {},
          totalStoriesByStatus: {
            all: 0,
            [STORY_STATUS.DRAFT]: 0,
            [STORY_STATUS.PUBLISH]: 0,
            [STORY_STATUS.FUTURE]: 0,
            [STORY_STATUS.PENDING]: 0,
            [STORY_STATUS.PRIVATE]: 0,
            [STORY_STATUS.PUBLISH]: 0,
          },
          totalPages: 0,
          fetchedStoryIds: [],
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      storiesOrderById: [],
      stories: {},
      totalStoriesByStatus: {
        all: 0,
        [STORY_STATUS.DRAFT]: 0,
        [STORY_STATUS.PUBLISH]: 0,
        [STORY_STATUS.FUTURE]: 0,
        [STORY_STATUS.PENDING]: 0,
        [STORY_STATUS.PRIVATE]: 0,
        [STORY_STATUS.PUBLISH]: 0,
      },
      totalPages: 1,
      allPagesFetched: true,
    });
  });

  it(`should update isLoading when ${ACTION_TYPES.LOADING_STORIES} is called`, () => {
    const result = storyReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.LOADING_STORIES,
        payload: true,
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      isLoading: true,
    });
  });

  it(`should update isLoading when ${ACTION_TYPES.CREATING_STORY_FROM_TEMPLATE} is called`, () => {
    const result = storyReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.CREATING_STORY_FROM_TEMPLATE,
        payload: true,
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      isLoading: true,
    });
  });

  it(`should update error to empty object when ${ACTION_TYPES.CREATE_STORY_FROM_TEMPLATE_SUCCESS} is called`, () => {
    const result = storyReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.CREATE_STORY_FROM_TEMPLATE_SUCCESS,
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      error: {},
    });
  });

  it(`should update error when ${ACTION_TYPES.FETCH_STORIES_FAILURE} is called`, () => {
    const result = storyReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.FETCH_STORIES_FAILURE,
        payload: {
          message: ERRORS.LOAD_STORIES.MESSAGE,
          code: 'my_error_code',
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      error: {
        message: ERRORS.LOAD_STORIES.MESSAGE,
        id: MOCK_ERROR_ID,
        code: 'my_error_code',
      },
    });
  });

  it(`should update error when ${ACTION_TYPES.CREATE_STORY_FROM_TEMPLATE_FAILURE} is called`, () => {
    const result = storyReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.CREATE_STORY_FROM_TEMPLATE_FAILURE,
        payload: {
          message: ERRORS.CREATE_STORY_FROM_TEMPLATE.MESSAGE,
          code: 'my_error_code',
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      error: {
        message: ERRORS.CREATE_STORY_FROM_TEMPLATE.MESSAGE,
        id: MOCK_ERROR_ID,
        code: 'my_error_code',
      },
    });
  });

  it(`should update stories state when ${ACTION_TYPES.UPDATE_STORY} is called`, () => {
    const result = storyReducer(
      {
        ...initialState,
        stories: {
          94: { id: 94, status: 'draft', title: 'my test story 1' },
          65: { id: 65, status: 'publish', title: 'my test story 2' },
          78: { id: 78, status: 'draft', title: 'my test story 3' },
          12: { id: 12, status: 'draft', title: 'my test story 4' },
        },
      },
      {
        type: ACTION_TYPES.UPDATE_STORY,
        payload: { id: 65, status: 'publish', title: 'new title for story' },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      stories: {
        94: { id: 94, status: 'draft', title: 'my test story 1' },
        65: { id: 65, status: 'publish', title: 'new title for story' },
        78: { id: 78, status: 'draft', title: 'my test story 3' },
        12: { id: 12, status: 'draft', title: 'my test story 4' },
      },
    });
  });

  it(`should update error when ${ACTION_TYPES.UPDATE_STORY_FAILURE} is called`, () => {
    const result = storyReducer(
      { ...initialState },
      {
        type: ACTION_TYPES.UPDATE_STORY_FAILURE,
        payload: {
          message: ERRORS.UPDATE_STORY.MESSAGE,
          code: 'my_error_code',
        },
      }
    );

    expect(result).toMatchObject({
      ...initialState,
      error: {
        message: ERRORS.UPDATE_STORY.MESSAGE,
        id: MOCK_ERROR_ID,
        code: 'my_error_code',
      },
    });
  });
});
