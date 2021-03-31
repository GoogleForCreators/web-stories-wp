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
import {
  MULTIPLE_VALUE,
  MULTIPLE_DISPLAY_VALUE,
} from '../../../../../constants';
import { getDefinitionForType } from '../../../../../elements';
import { dataPixels } from '../../../../../units';
import { renderPanel } from '../../../shared/test/_utils';

import SizePosition from '../sizePosition';

jest.mock('../../../../../elements');

describe('panels/SizePosition', () => {
  let defaultElement, defaultImage, defaultText, unlockAspectRatioElement;
  let defaultFlip;
  const aspectRatioLockButtonLabel = 'Lock aspect ratio';

  beforeEach(() => {
    defaultFlip = { horizontal: false, vertical: false };
    defaultElement = {
      id: '1',
      isBackground: false,
      x: 20,
      y: 20,
      width: 100,
      height: 80,
      rotationAngle: 0,
      lockAspectRatio: true,
    };
    unlockAspectRatioElement = {
      id: '1',
      isBackground: false,
      x: 20,
      y: 20,
      width: 100,
      height: 80,
      rotationAngle: 0,
      lockAspectRatio: false,
    };
    defaultImage = {
      ...defaultElement,
      type: 'image',
    };
    defaultText = {
      ...defaultElement,
      type: 'text',
    };
    getDefinitionForType.mockImplementation((type) => {
      return {
        isMedia: 'image' === type,
        canFlip: 'image' === type,
      };
    });
  });

  function renderSizePosition(...args) {
    return renderPanel(SizePosition, ...args);
  }

  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:size',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render <SizePosition /> panel', () => {
    const { getByRole } = renderSizePosition([defaultElement]);
    const element = getByRole('button', { name: 'Size & position' });
    expect(element).toBeInTheDocument();
  });

  describe('single selection', () => {
    it('should not render flip controls when not allowed', () => {
      const { queryByTitle } = renderSizePosition([defaultText]);
      const horiz = queryByTitle('Flip horizontally');
      const vert = queryByTitle('Flip vertically');
      expect(horiz).not.toBeInTheDocument();
      expect(vert).not.toBeInTheDocument();
    });

    it('should render default flip controls', () => {
      const { getByRole } = renderSizePosition([defaultImage]);
      const horiz = getByRole('button', { name: 'Flip horizontally' });
      const vert = getByRole('button', { name: 'Flip vertically' });
      expect(horiz).not.toBeChecked();
      expect(vert).not.toBeChecked();
    });

    it('should render specified flip controls', () => {
      const { getByRole } = renderSizePosition([
        {
          ...defaultImage,
          flip: { horizontal: true, vertical: true },
        },
      ]);
      const horiz = getByRole('button', { name: 'Flip horizontally' });
      const vert = getByRole('button', { name: 'Flip vertically' });
      expect(horiz).toHaveAttribute('aria-pressed', 'true');
      expect(vert).toHaveAttribute('aria-pressed', 'true');
    });

    it('should update flip horizontal controls', () => {
      const { getByRole, pushUpdateForObject } = renderSizePosition([
        defaultImage,
      ]);
      const horiz = getByRole('button', { name: 'Flip horizontally' });
      fireEvent.click(horiz);
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'flip',
        { horizontal: true, vertical: false },
        defaultFlip,
        true
      );
    });

    it('should update flip vertical controls', () => {
      const { getByRole, pushUpdateForObject } = renderSizePosition([
        defaultImage,
      ]);
      const vert = getByRole('button', { name: 'Flip vertically' });
      fireEvent.click(vert);
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'flip',
        { horizontal: false, vertical: true },
        defaultFlip,
        true
      );
    });

    it('should update width with lock ratio', () => {
      const { getByRole, pushUpdate } = renderSizePosition([defaultImage]);
      const input = getByRole('textbox', { name: 'Width' });
      fireEvent.change(input, { target: { value: '150' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      const [updateArg, submitArg] = pushUpdate.mock.calls[0];
      expect(updateArg()).toStrictEqual({
        width: 150,
        height: 150 / (100 / 80),
      });
      expect(submitArg).toBeTrue();
    });

    it('should update height with lock ratio', () => {
      const { getByRole, pushUpdate } = renderSizePosition([defaultImage]);
      const input = getByRole('textbox', { name: 'Height' });
      fireEvent.change(input, { target: { value: '160' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      const [updateArg, submitArg] = pushUpdate.mock.calls[0];
      expect(updateArg()).toStrictEqual({
        height: 160,
        width: 160 * (100 / 80),
      });
      expect(submitArg).toBeTrue();
    });

    it('should update width without lock ratio', () => {
      const { getByRole, pushUpdate } = renderSizePosition([
        unlockAspectRatioElement,
      ]);

      const input = getByRole('textbox', { name: 'Width' });
      fireEvent.change(input, { target: { value: '150' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      const [updateArg, submitArg] = pushUpdate.mock.calls[0];
      expect(updateArg()).toStrictEqual({ width: 150, height: 80 });
      expect(submitArg).toBeTrue();
    });

    it('should disable height without lock ratio for text element', () => {
      const { getByRole } = renderSizePosition([
        {
          ...unlockAspectRatioElement,
          type: 'text',
        },
      ]);
      const input = getByRole('textbox', { name: 'Height' });
      expect(input).toBeDisabled();
      expect(input).toHaveValue('');
      expect(input.placeholder).toStrictEqual('Auto');
    });

    it('should disable height without lock ratio for multi-selection with text', () => {
      const { getByRole } = renderSizePosition([
        {
          ...unlockAspectRatioElement,
          type: 'text',
        },
        {
          ...defaultImage,
          lockAspectRatio: false,
        },
      ]);

      const input = getByRole('textbox', { name: 'Height' });
      expect(input).toBeDisabled();
      expect(input).toHaveValue('');
      expect(input.placeholder).toStrictEqual('Auto');
    });

    it('should not update width if empty value is submitted', () => {
      const { getByRole, pushUpdate } = renderSizePosition([defaultImage]);
      const inputWidth = getByRole('textbox', { name: 'Width' });
      fireEvent.change(inputWidth, { target: { value: '' } });
      fireEvent.keyDown(inputWidth, { key: 'Enter', which: 13 });
      expect(pushUpdate).not.toHaveBeenCalled();
    });

    it('should not update height if empty value is submitted', () => {
      const { getByRole, pushUpdate } = renderSizePosition([defaultImage]);
      const inputHeight = getByRole('textbox', { name: 'Height' });
      fireEvent.change(inputHeight, { target: { value: '' } });
      fireEvent.keyDown(inputHeight, { key: 'Enter', which: 13 });
      expect(pushUpdate).not.toHaveBeenCalled();
    });

    it('should update lock ratio to false for element', () => {
      const { getByRole, pushUpdate } = renderSizePosition([defaultImage]);
      fireEvent.click(
        getByRole('button', { name: aspectRatioLockButtonLabel })
      );
      expect(pushUpdate).toHaveBeenCalledWith({ lockAspectRatio: false }, true);
    });

    it('should update lock ratio to true for unlock aspect ratio element', () => {
      const { getByRole, pushUpdate } = renderSizePosition([
        unlockAspectRatioElement,
      ]);
      fireEvent.click(
        getByRole('button', { name: aspectRatioLockButtonLabel })
      );
      expect(pushUpdate).toHaveBeenCalledWith({ lockAspectRatio: true }, true);
    });
  });

  describe('multi selection', () => {
    let image, imageWithSameSize, imageWithDifferentSize;
    let unlockImage, unlockImageWithSameSize;

    beforeEach(() => {
      image = defaultImage;
      unlockImage = {
        ...defaultImage,
        lockAspectRatio: false,
      };
      imageWithSameSize = { ...image, id: 'imageWithSameSize' };
      unlockImageWithSameSize = {
        ...imageWithSameSize,
        lockAspectRatio: false,
      };
      imageWithDifferentSize = {
        ...image,
        id: 'imageWithDifferentSize',
        width: 200,
        height: 120,
      };
    });

    it('should update flip controls', () => {
      const { getByRole, pushUpdateForObject } = renderSizePosition([
        {
          ...image,
          flip: { horizontal: true, vertical: false },
        },
        {
          ...image,
          flip: { horizontal: false, vertical: true },
        },
      ]);
      const horiz = getByRole('button', { name: 'Flip horizontally' });
      fireEvent.click(horiz);
      expect(pushUpdateForObject).toHaveBeenCalledWith(
        'flip',
        { horizontal: true, vertical: MULTIPLE_VALUE },
        defaultFlip,
        true
      );
    });

    it('should update width with lock ratio and same size', () => {
      const { getByRole, pushUpdate, submit } = renderSizePosition([
        image,
        imageWithSameSize,
      ]);
      const input = getByRole('textbox', { name: 'Width' });
      fireEvent.change(input, { target: { value: '150' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      const [updateArg, submitArg] = pushUpdate.mock.calls[0];
      expect(updateArg()).toStrictEqual({
        width: 150,
        height: dataPixels(150 / (100 / 80)),
      });
      expect(submitArg).toBeTrue();

      const submits = submit({ width: 150, height: MULTIPLE_VALUE });
      expect(submits[image.id]).toStrictEqual(
        expect.objectContaining({
          width: 150,
          height: dataPixels(150 / (100 / 80)),
        })
      );
      expect(submits[imageWithSameSize.id]).toStrictEqual(
        expect.objectContaining({
          width: 150,
          height: dataPixels(150 / (100 / 80)),
        })
      );
    });

    it('should update width with lock ratio and different size', () => {
      const { getByRole, pushUpdate, submit } = renderSizePosition([
        image,
        imageWithDifferentSize,
      ]);
      const input = getByRole('textbox', { name: 'Width' });
      fireEvent.change(input, { target: { value: '150' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      const [updateArg, submitArg] = pushUpdate.mock.calls[0];
      expect(updateArg()).toStrictEqual({
        width: 150,
        height: MULTIPLE_VALUE,
      });
      expect(submitArg).toBeTrue();

      const submits = submit({ width: 150, height: MULTIPLE_VALUE });
      expect(submits[image.id]).toStrictEqual(
        expect.objectContaining({
          width: 150,
          height: 150 / (100 / 80),
        })
      );
      expect(submits[imageWithDifferentSize.id]).toStrictEqual(
        expect.objectContaining({
          width: 150,
          height: dataPixels(150 / (200 / 120)),
        })
      );
    });

    it('should update height with lock ratio and different size', () => {
      const { getByRole, pushUpdate, submit } = renderSizePosition([
        image,
        imageWithDifferentSize,
      ]);
      const input = getByRole('textbox', { name: 'Height' });
      fireEvent.change(input, { target: { value: '160' } });
      fireEvent.keyDown(input, { key: 'Enter', which: 13 });
      const [updateArg, submitArg] = pushUpdate.mock.calls[0];
      expect(updateArg()).toStrictEqual({
        height: 160,
        width: MULTIPLE_VALUE,
      });
      expect(submitArg).toBeTrue();

      const submits = submit({ height: 160, width: MULTIPLE_VALUE });
      expect(submits[image.id]).toStrictEqual(
        expect.objectContaining({
          height: 160,
          width: 160 * (100 / 80),
        })
      );
      expect(submits[imageWithDifferentSize.id]).toStrictEqual(
        expect.objectContaining({
          height: 160,
          width: dataPixels(160 * (200 / 120)),
        })
      );
    });

    it('should disable aspect ratio lock if all elements had lock enabled', () => {
      const { getByRole, pushUpdate } = renderSizePosition([
        image,
        imageWithSameSize,
      ]);
      fireEvent.click(
        getByRole('button', { name: aspectRatioLockButtonLabel })
      );
      expect(pushUpdate).toHaveBeenCalledWith({ lockAspectRatio: false }, true);
    });

    it('should disable aspect ratio lock if elements had different settings for aspect ratio lock', () => {
      const { getByRole, pushUpdate } = renderSizePosition([
        unlockImage,
        imageWithSameSize,
      ]);
      fireEvent.click(
        getByRole('button', { name: aspectRatioLockButtonLabel })
      );
      expect(pushUpdate).toHaveBeenCalledWith({ lockAspectRatio: false }, true);
    });

    it('should enable aspect ratio lock only if all elements had lock disabled', () => {
      const { getByRole, pushUpdate } = renderSizePosition([
        unlockImageWithSameSize,
        unlockImage,
      ]);
      fireEvent.click(
        getByRole('button', { name: aspectRatioLockButtonLabel })
      );
      expect(pushUpdate).toHaveBeenCalledWith({ lockAspectRatio: true }, true);
    });

    it('should update height with lock ratio and extrapolated size and reset to max allowed', () => {
      const { getByRole, pushUpdate, submit } = renderSizePosition([image]);
      const input = getByRole('textbox', { name: 'Height' });
      fireEvent.change(input, { target: { value: '2000' } });
      fireEvent.blur(input);
      const [updateArg, submitArg] = pushUpdate.mock.calls[0];
      expect(updateArg()).toStrictEqual({
        height: 1000,
        width: 1000 * (100 / 80),
      });
      expect(submitArg).toBeTrue();

      const submits = submit({ height: 2000, width: 2000 * (100 / 80) });
      expect(submits[image.id]).toStrictEqual(
        expect.objectContaining({
          height: 1000 / (100 / 80),
          width: 1000,
        })
      );
    });

    it('should display Mixed as placeholder in case of mixed values multi-selectio', () => {
      const { getByRole } = renderSizePosition([
        defaultText,
        {
          ...defaultImage,
          width: 200,
          height: 200,
          rotationAngle: 20,
        },
      ]);

      const height = getByRole('textbox', { name: 'Height' });
      expect(height.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
      expect(height).toHaveValue('');

      const width = getByRole('textbox', { name: 'Width' });
      expect(width.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
      expect(width).toHaveValue('');

      const rotationAngle = getByRole('textbox', { name: 'Rotation' });
      expect(rotationAngle.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
      expect(rotationAngle).toHaveValue('');
    });
  });
});
