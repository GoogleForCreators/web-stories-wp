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
import { createSolid } from '@googleforcreators/patterns';
import { waitFor, fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { arrange } from './_utils';

jest.mock(
  '../../../../app/story/useStory',
  () => (cb) =>
    cb({
      state: {
        story: {
          globalStoryStyles: {
            colors: [],
          },
          selectedElements: [],
        },
      },
      actions: {
        updateStory: jest.fn(),
      },
    })
);

describe('<ColorPicker /> as it loads', () => {
  describe('when opening the basic color picker', () => {
    it('should render with initial focus forced to the close button', async () => {
      const { getCloseButton } = arrange();

      const closeButton = getCloseButton();
      await waitFor(() => expect(closeButton).toBeInTheDocument());
      await waitFor(() => expect(closeButton).toHaveFocus());
    });

    it('should highlight the current color if in list', () => {
      const { getSelectedSwatch } = arrange({
        color: createSolid(238, 238, 238),
      });

      const swatch = getSelectedSwatch('Default');
      expect(swatch).toBeInTheDocument();
      expect(swatch).toHaveAccessibleName(/#eee/);
    });

    it('should not highlight any color if not in list', () => {
      const { getSelectedSwatch } = arrange({
        color: createSolid(237, 238, 238),
      });

      const swatch = getSelectedSwatch('Default');
      expect(swatch).toBeNull();
    });
  });

  describe('when opening the custom color picker', () => {
    it('should render with initial focus forced to the close button', async () => {
      const { getCloseButton } = arrange();

      const closeButton = getCloseButton();
      await waitFor(() => expect(closeButton).toBeInTheDocument());
      await waitFor(() => expect(closeButton).toHaveFocus());
    });

    it('should automatically do so if invoked on a gradient', async () => {
      const { getEditableHexElement } = arrange({
        color: {
          type: 'linear',
          stops: [
            { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
            { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 0 },
          ],
        },
        allowsGradient: true,
      });

      await waitFor(() => expect(getEditableHexElement()).toBeInTheDocument());
      expect(getEditableHexElement()).toBeInTheDocument();
    });
    it('should do so if invoked on a color and clicking custom button', async () => {
      const { getCustomButton, getEditableHexElement } = arrange({
        color: createSolid(255, 0, 0),
      });

      fireEvent.click(getCustomButton());

      await waitFor(() => expect(getEditableHexElement()).toBeInTheDocument());
      expect(getEditableHexElement()).toBeInTheDocument();
    });

    it('should correctly set color based on given prop', async () => {
      const { getCustomButton, getEditableHexElement, rerender } = arrange({
        color: createSolid(255, 0, 0),
      });

      fireEvent.click(getCustomButton());

      await waitFor(() => expect(getEditableHexElement()).toBeInTheDocument());
      expect(getEditableHexElement()).toHaveTextContent(/#ff0000/i);

      rerender({ color: createSolid(0, 0, 255) });

      fireEvent.click(getCustomButton());

      await waitFor(() => expect(getEditableHexElement()).toBeInTheDocument());
      expect(getEditableHexElement()).toHaveTextContent(/#0000ff/i);
    });

    it('should correctly set opacity based on given prop', async () => {
      const { getCustomButton, getEditableAlphaElement, rerender } = arrange({
        color: createSolid(255, 0, 0, 0.7),
      });

      fireEvent.click(getCustomButton());

      await waitFor(() =>
        expect(getEditableAlphaElement()).toBeInTheDocument()
      );
      expect(getEditableAlphaElement()).toHaveTextContent(/70%/i);

      rerender({ color: createSolid(0, 0, 255) });

      fireEvent.click(getCustomButton());

      await waitFor(() =>
        expect(getEditableAlphaElement()).toBeInTheDocument()
      );
      expect(getEditableAlphaElement()).toHaveTextContent(/100%/i);
    });

    it('should correctly set color and opacity based on first stop for a gradient', async () => {
      const { getEditableHexElement, getEditableAlphaElement } = arrange({
        color: {
          type: 'linear',
          stops: [
            { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
            { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 0 },
          ],
        },
        allowsGradient: true,
      });

      await waitFor(() => expect(getEditableHexElement()).toBeInTheDocument());

      expect(getEditableHexElement()).toHaveTextContent(/#00ff00/i);
      expect(getEditableAlphaElement()).toHaveTextContent(/40%/i);
    });

    it('should have pattern type buttons only if enabled', async () => {
      const {
        getCustomButton,
        getSolidButton,
        getLinearButton,
        getRadialButton,
        getEditableHexElement,
        rerender,
      } = arrange();

      fireEvent.click(getCustomButton());

      await waitFor(() => expect(getEditableHexElement()).toBeInTheDocument());

      expect(getSolidButton()).not.toBeInTheDocument();
      expect(getLinearButton()).not.toBeInTheDocument();
      expect(getRadialButton()).not.toBeInTheDocument();

      rerender({ allowsGradient: true });

      fireEvent.click(getCustomButton());

      await waitFor(() => expect(getEditableHexElement()).toBeInTheDocument());

      expect(getSolidButton()).toBeInTheDocument();
      expect(getLinearButton()).toBeInTheDocument();
      expect(getRadialButton()).toBeInTheDocument();
    });

    it('should have gradient line only if pattern is non-solid', async () => {
      const { getCustomButton, getGradientLine, rerender } = arrange({
        color: createSolid(0, 0, 0),
        allowsGradient: true,
      });

      fireEvent.click(getCustomButton());

      await waitFor(() => expect(getGradientLine()).not.toBeInTheDocument());

      rerender({
        color: {
          stops: [
            { color: { r: 0, g: 0, b: 255 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          type: 'linear',
        },
        allowsGradient: true,
      });

      await waitFor(() => expect(getGradientLine()).toBeInTheDocument());
    });
  });
});
