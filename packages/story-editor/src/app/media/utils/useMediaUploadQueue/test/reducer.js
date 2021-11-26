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
import { revokeBlob } from '@web-stories-wp/media';
/**
 * Internal dependencies
 */
import {
  addItem,
  cancelUploading,
  finishMuting,
  finishTranscoding,
  finishTrimming,
  finishUploading,
  replacePlaceholderResource,
  startMuting,
  startTranscoding,
  startTrimming,
  startUploading,
} from '../reducer';

jest.mock('@web-stories-wp/media', () => ({
  revokeBlob: jest.fn(),
}));

describe('useMediaUploadQueue', () => {
  describe('addItem', () => {
    it('should add item to queue with ID and pending state', () => {
      const initialState = { queue: [] };

      const result = addItem(initialState, {
        payload: {
          file: {},
          resource: {
            id: 456,
            foo: 'bar',
          },
        },
      });

      expect(result).toStrictEqual({
        queue: [
          expect.objectContaining({
            id: expect.any(String),
            state: 'PENDING',
            file: {},
            resource: expect.objectContaining({
              id: expect.any(String),
              originalResourceId: 456,
              foo: 'bar',
            }),
          }),
        ],
      });
    });
  });

  describe('startUploading', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {},
            state: 'PENDING',
          },
        ],
      };

      const result = startUploading(initialState, {
        payload: {
          id: 123,
          resource: {
            foo: 'bar',
          },
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {},
            state: 'UPLOADING',
          },
        ],
      });
    });
  });

  describe('finishUploading', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              src: 'foo',
              originalResourceId: 456,
            },
            state: 'UPLOADING',
            posterFile: {},
          },
        ],
      };

      const result = finishUploading(initialState, {
        payload: {
          id: 123,
          resource: {
            src: 'bar',
            originalResourceId: 456,
          },
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            posterFile: null,
            resource: {
              src: 'bar',
            },
            state: 'UPLOADED',
          },
        ],
      });
    });

    it('leaves state unchanged if item is not in queue', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {},
            state: 'UPLOADING',
          },
        ],
      };

      const result = finishUploading(initialState, {
        payload: {
          id: 456,
        },
      });

      expect(result).toStrictEqual(initialState);
    });

    it('revokes previous blob URLs', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'PENDING',
          },
        ],
      };

      finishUploading(initialState, {
        payload: {
          id: 123,
          resource: {
            id: 456,
            bar: 'baz',
          },
        },
      });
      expect(revokeBlob).toHaveBeenCalledTimes(2);
    });
  });

  describe('cancelUploading', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {},
            state: 'UPLOADING',
          },
        ],
      };

      const result = cancelUploading(initialState, {
        payload: {
          id: 123,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {},
            state: 'CANCELLED',
          },
        ],
      });
    });
  });

  describe('startMuting', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'PENDING',
          },
        ],
      };

      const result = startMuting(initialState, {
        payload: {
          id: 123,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'MUTING',
          },
        ],
      });
    });
  });

  describe('finishMuting', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {
              bar: 'baz',
            },
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'MUTING',
          },
        ],
      };

      const result = finishMuting(initialState, {
        payload: {
          id: 123,
          file: {
            bar: 'foobar',
          },
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {
              bar: 'foobar',
            },
            resource: {
              foo: 'bar',
              id: 456,
              isMuted: true,
            },
            state: 'MUTED',
          },
        ],
      });
    });
  });

  describe('startTrimming', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'PENDING',
          },
        ],
      };

      const result = startTrimming(initialState, {
        payload: {
          id: 123,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'TRIMMING',
          },
        ],
      });
    });
  });

  describe('finishTrimming', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {
              bar: 'baz',
            },
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'TRIMMING',
          },
        ],
      };

      const result = finishTrimming(initialState, {
        payload: {
          id: 123,
          file: {
            bar: 'foobar',
          },
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {
              bar: 'foobar',
            },
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'TRIMMED',
          },
        ],
      });
    });
  });

  describe('startTranscoding', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'PENDING',
          },
        ],
      };

      const result = startTranscoding(initialState, {
        payload: {
          id: 123,
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'TRANSCODING',
          },
        ],
      });
    });
  });

  describe('finishTranscoding', () => {
    it('changes state of uploaded item', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {
              bar: 'baz',
            },
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'TRANSCODING',
          },
        ],
      };

      const result = finishTranscoding(initialState, {
        payload: {
          id: 123,
          file: {
            bar: 'foobar',
          },
        },
      });

      expect(result).toStrictEqual({
        queue: [
          {
            id: 123,
            file: {
              bar: 'foobar',
            },
            resource: {
              id: 456,
              foo: 'bar',
              isOptimized: true,
            },
            state: 'TRANSCODED',
          },
        ],
      });
    });
  });

  describe('replacePlaceholderResource', () => {
    it('leaves state unchanged if item is not in queue', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
            },
            state: 'UPLOADING',
          },
        ],
      };

      const result = replacePlaceholderResource(initialState, {
        payload: {
          id: 456,
          resource: {
            id: 456,
            foo: 'baz',
          },
        },
      });

      expect(result).toStrictEqual(initialState);
    });

    it('leaves state unchanged if resource is not a placeholder', () => {
      const initialState = {
        queue: [
          {
            id: 123,
            file: {},
            resource: {
              id: 456,
              foo: 'bar',
              isPlaceholder: false,
            },
            state: 'UPLOADING',
          },
        ],
      };

      const result = replacePlaceholderResource(initialState, {
        payload: {
          id: 456,
          resource: {
            id: 456,
            foo: 'baz',
          },
        },
      });

      expect(result).toStrictEqual(initialState);
    });
  });

  describe('removeItem', () => {});
});
