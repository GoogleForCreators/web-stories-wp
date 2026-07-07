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
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { metadata, settings } from '..';

describe('Block Registration', () => {
  it('should register Web Stories block without errors and inherit metadata properties', () => {
    const block = registerBlockType(metadata, settings);
    expect(block).toBeDefined();
    expect(block.apiVersion).toBe(3);
    expect(block.name).toBe('web-stories/embed');
    expect(block.category).toBe('embed');
    expect(block.usesContext).toStrictEqual(['postId', 'postType', 'queryId']);
    expect(block.supports).toStrictEqual({
      align: ['wide', 'full', 'left', 'right', 'center'],
      interactivity: true,
    });
    expect(block.attributes).toBeDefined();
    expect(block.attributes.url).toBeDefined();
  });
});
