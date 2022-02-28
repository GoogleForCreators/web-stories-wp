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
import { clamp } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import cleanForSlug from '../../../utils/cleanForSlug';

function formatTag(tag) {
  return tag.replace(/( +)/g, ' ').trim();
}

function uniquesOnly(arr) {
  const slugMap = new Map();
  arr.forEach((item) => {
    slugMap.set(cleanForSlug(item), item);
  });
  return [...slugMap.values()];
}

function subsetAOfB(a = [], b = []) {
  return a.forEach((v) => b.includes(v));
}

export function deepEquals(a = [], b = []) {
  return a.length === b.length && a.every((item) => b.includes(item));
}

export const ACTIONS = {
  UPDATE_VALUE: 'updateValue',
  SUBMIT_VALUE: 'submitValue',
  REMOVE_TAG: 'removeTag',
  RESET_OFFSET: 'resetOffset',
  RESET_VALUE: 'resetValue',
  INCREMENT_OFFSET: 'incrementOffset',
  DECREMENT_OFFSET: 'decrementOffset',
  UPDATE_TAGS: 'updateTags',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_VALUE: {
      const values = action.payload.split(',');

      // if we're not adding any tags,
      // we don't want to update the tagBuffer
      if (values.length <= 1) {
        return {
          ...state,
          value: action.payload,
        };
      }

      const newTags = values
        .slice(0, -1)
        .map(formatTag)
        .filter((tag) => tag.length);
      const value = values[values.length - 1];

      // if we're not adding any tags,
      // we don't want to update the tagBuffer
      if (subsetAOfB(newTags, state.tags)) {
        return { ...state, value };
      }

      return {
        ...state,
        value,
        tagBuffer: uniquesOnly([
          ...state.tags.slice(0, state.tags.length - state.offset),
          ...newTags,
          ...state.tags.slice(state.tags.length - state.offset),
        ]),
      };
    }

    case ACTIONS.SUBMIT_VALUE: {
      const newTag = formatTag(action?.payload || state.value);

      // don't update tagBuffer if we're not
      // adding any tags
      if (newTag === '' || state.tags.includes(newTag)) {
        return { ...state, value: '' };
      }

      return {
        ...state,
        value: '',
        tagBuffer: uniquesOnly([
          ...state.tags.slice(0, state.tags.length - state.offset),
          newTag,
          ...state.tags.slice(state.tags.length - state.offset),
        ]),
      };
    }

    case ACTIONS.REMOVE_TAG: {
      const removedTagIndex =
        typeof action.payload === 'string'
          ? // if there's a specified tag, remove that tag
            state.tags.findIndex((tag) => tag === action.payload)
          : // otherwise remove at the current offset
            state.tags.length - 1 - state.offset;
      return removedTagIndex < 0
        ? state
        : {
            ...state,
            tagBuffer: [
              ...state.tags.slice(0, removedTagIndex),
              ...state.tags.slice(removedTagIndex + 1, state.tags.length),
            ],
          };
    }

    case ACTIONS.INCREMENT_OFFSET: {
      return {
        ...state,
        offset: clamp(state.offset + 1, { MIN: 0, MAX: state.tags.length }),
      };
    }

    case ACTIONS.DECREMENT_OFFSET: {
      return {
        ...state,
        offset: clamp(state.offset - 1, { MIN: 0, MAX: state.tags.length }),
      };
    }

    case ACTIONS.RESET_OFFSET: {
      return {
        ...state,
        offset: 0,
      };
    }

    case ACTIONS.RESET_VALUE: {
      return {
        ...state,
        value: '',
      };
    }

    // Retain order as much as possible
    // and append new tags to the end
    case ACTIONS.UPDATE_TAGS: {
      const stateTagsWithSlugs = state.tags.map((name) => [
        cleanForSlug(name),
        name,
      ]);
      const payloadTagsWithSlugs = action.payload.map((name) => [
        cleanForSlug(name),
        name,
      ]);
      // if the payload is the same as the existing tags
      // we don't want to cause an update.
      if (
        deepEquals(
          stateTagsWithSlugs.map(([slug]) => slug),
          payloadTagsWithSlugs.map(([slug]) => slug)
        )
      ) {
        return state;
      }

      const tagsToPersist = stateTagsWithSlugs
        .filter(([tagSlug]) =>
          payloadTagsWithSlugs.map(([slug]) => slug).includes(tagSlug)
        )
        .map(([, name]) => name);

      const tagsToAdd = payloadTagsWithSlugs
        .filter(
          ([tagSlug]) =>
            !stateTagsWithSlugs.map(([slug]) => slug).includes(tagSlug)
        )
        .map(([, name]) => name);

      return {
        ...state,
        tags: [...tagsToPersist, ...tagsToAdd],
        tagBuffer: null,
      };
    }

    default:
      return state;
  }
}

export default reducer;
