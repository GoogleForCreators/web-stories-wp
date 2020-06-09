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
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import VideoAccessibility, { MIN_MAX } from '../videoAccessibility';
import { renderPanel } from './_utils';

jest.mock('../../mediaPicker', () => ({
  useMediaPicker: ({ onSelect }) => {
    const image = { url: 'media1' };
    onSelect(image);
  },
}));

describe('Panels/VideoAccessibility', () => {
  function renderVideoAccessibility(...args) {
    return renderPanel(VideoAccessibility, ...args);
  }

  it('should render <VideoAccessibility /> panel', () => {
    const { getByRole } = renderVideoAccessibility([
      { resource: { posterId: 0, poster: '' } },
    ]);
    const element = getByRole('button', { name: 'Edit: Video poster' });
    expect(element).toBeDefined();
  });

  it('should simulate a click on <VideoAccessibility />', () => {
    const { getByRole, pushUpdate } = renderVideoAccessibility([
      { resource: { posterId: 0, poster: '' } },
    ]);
    const element = getByRole('button', { name: 'Edit: Video poster' });
    fireEvent.click(element);
    expect(pushUpdate).toHaveBeenCalledTimes(1);
    expect(pushUpdate).toHaveBeenCalledWith({ poster: 'media1' }, true);
  });

  it('should set max to opacity value on change to max', () => {
    const { getByPlaceholderText, submit } = renderVideoAccessibility([
      { id: 1, resource: { posterId: 0, poster: '', alt: '' } },
    ]);
    const input = getByPlaceholderText('Assistive text');
    const bigText = [...Array(1001)].map(() => '1').join('');
    fireEvent.change(input, { target: { value: bigText } });
    const submits = submit({
      resource: { posterId: 0, poster: '', alt: bigText },
    });
    expect(submits[1].resource.alt).toHaveLength(MIN_MAX.ALT_TEXT.MAX);
  });
});
