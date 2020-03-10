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
import { render, wait, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../theme';
import createSolid from '../../../utils/createSolid';
import ColorPicker from '../';

function getResolvingPromise(mock) {
  return new Promise((resolve) => {
    mock.mockImplementationOnce(() => {
      resolve();
    });
  });
}

function arrange(customProps = {}) {
  const onChange = jest.fn();
  const onClose = jest.fn();
  const props = {
    onChange,
    onClose,
    ...customProps,
  };
  const accessors = render(
    <ThemeProvider theme={theme}>
      <ColorPicker {...props} />
    </ThemeProvider>
  );
  const { getByRole, queryByLabelText, rerender } = accessors;
  const getDialog = () => getByRole('dialog');
  const getSolidButton = () => queryByLabelText(/solid pattern/i);
  const getLinearButton = () => queryByLabelText(/linear gradient pattern/i);
  const getRadialButton = () => queryByLabelText(/radial gradient pattern/i);
  const getConicButton = () => queryByLabelText(/conic gradient pattern/i);
  const getCloseButton = () => queryByLabelText(/close/i);
  const getEditableHexElement = () => queryByLabelText(/edit hex/i);
  const getEditableAlphaElement = () => queryByLabelText(/edit opacity/i);
  const getGradientLine = () => queryByLabelText(/gradient line/i);
  const getGradientStopAt = (pct) =>
    queryByLabelText(new RegExp(`gradient stop at ${pct}%`, 'i'));
  const wrapperRerender = (moreCustomProps) =>
    rerender(
      <ThemeProvider theme={theme}>
        <ColorPicker {...props} {...moreCustomProps} />
      </ThemeProvider>
    );
  return {
    ...accessors,
    getDialog,
    getSolidButton,
    getLinearButton,
    getRadialButton,
    getConicButton,
    getCloseButton,
    getEditableHexElement,
    getEditableAlphaElement,
    getGradientLine,
    getGradientStopAt,
    onChange,
    onClose,
    rerender: wrapperRerender,
  };
}

describe('<ColorPicker />', () => {
  describe('As it loads', () => {
    it('should render with initial focus forced to the solid pattern button', () => {
      const { getSolidButton } = arrange();

      const solidButton = getSolidButton();
      expect(solidButton).toBeInTheDocument();
      expect(solidButton).toHaveFocus();
    });

    it('should correctly set color based on given prop', () => {
      const { getEditableHexElement, rerender } = arrange({
        color: createSolid(255, 0, 0),
      });

      expect(getEditableHexElement()).toHaveTextContent(/#ff0000/i);

      rerender({ color: createSolid(0, 0, 255) });

      expect(getEditableHexElement()).toHaveTextContent(/#0000ff/i);
    });

    it('should correctly set opacity based on given prop', () => {
      const { getEditableAlphaElement, rerender } = arrange({
        color: createSolid(255, 0, 0, 0.7),
      });

      expect(getEditableAlphaElement()).toHaveTextContent(/70%/i);

      rerender({ color: createSolid(0, 0, 255) });

      expect(getEditableAlphaElement()).toHaveTextContent(/100%/i);
    });

    it('should correctly set color and opacity based on first stop for a gradient', () => {
      const { getEditableHexElement, getEditableAlphaElement } = arrange({
        color: {
          type: 'linear',
          stops: [
            { color: { r: 0, g: 255, b: 0, a: 0.4 }, position: 0 },
            { color: { r: 255, g: 0, b: 255, a: 0.8 }, position: 0 },
          ],
        },
      });

      expect(getEditableHexElement()).toHaveTextContent(/#00ff00/i);
      expect(getEditableAlphaElement()).toHaveTextContent(/40%/i);
    });

    it('should have gradient buttons only if enabled', () => {
      const {
        getSolidButton,
        getLinearButton,
        getRadialButton,
        getConicButton,
        rerender,
      } = arrange();

      expect(getSolidButton()).toBeInTheDocument();
      expect(getLinearButton()).not.toBeInTheDocument();
      expect(getRadialButton()).not.toBeInTheDocument();
      expect(getConicButton()).not.toBeInTheDocument();

      rerender({ hasGradient: true });

      expect(getSolidButton()).toBeInTheDocument();
      expect(getLinearButton()).toBeInTheDocument();
      expect(getRadialButton()).toBeInTheDocument();
      expect(getConicButton()).toBeInTheDocument();
    });

    it('should have gradient line only if pattern is non-solid', () => {
      const { getGradientLine, rerender } = arrange({
        color: createSolid(0, 0, 0),
        hasGradient: true,
      });

      expect(getGradientLine()).not.toBeInTheDocument();

      rerender({
        color: {
          stops: [
            { color: { r: 0, g: 0, b: 255 }, position: 0 },
            { color: { r: 0, g: 0, b: 255 }, position: 1 },
          ],
          type: 'linear',
        },
        hasGradient: true,
      });

      expect(getGradientLine()).toBeInTheDocument();
    });
  });

  describe('As it closes', () => {
    it('should invoke onclose and restore focus when pressing "escape"', async () => {
      // Body has focus before the test runs. Make sure body is re-focusable
      document.body.tabIndex = 0;
      expect(document.body).toHaveFocus();

      const { getDialog, onClose } = arrange();
      expect(document.body).not.toHaveFocus();
      const dialog = getDialog();

      // press escape and wait for onClose to be invoked
      await wait(() => {
        const promise = getResolvingPromise(onClose);
        fireEvent.keyDown(dialog, { key: 'Escape', which: 27 });
        return promise;
      });

      expect(onClose).toHaveBeenCalledWith();
      await wait(() => expect(document.body).toHaveFocus());
    });

    it('should invoke onclose and restore focus when clicking close button', async () => {
      // Body has focus before the test runs. Make sure body is re-focusable
      document.body.tabIndex = 0;
      expect(document.body).toHaveFocus();

      const { getCloseButton, onClose } = arrange();
      expect(document.body).not.toHaveFocus();
      const closeButton = getCloseButton();

      // click close button and wait for onClose to be invoked
      await wait(() => {
        const promise = getResolvingPromise(onClose);
        fireEvent.click(closeButton);
        return promise;
      });

      expect(onClose).toHaveBeenCalledWith();
      await wait(() => expect(document.body).toHaveFocus());
    });
  });

  describe('As the header is interacted with', () => {
    it('should invoke onchange with new correct pattern when switching to linear', () => {
      const { getLinearButton, onChange } = arrange({
        color: createSolid(0, 0, 255),
        hasGradient: true,
      });

      fireEvent.click(getLinearButton());

      expect(onChange).toHaveBeenCalledWith({
        rotation: 0.5,
        stops: [
          { color: { r: 0, g: 0, b: 255 }, position: 0 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
        type: 'linear',
      });
    });

    it('should invoke onchange with new correct pattern when switching to radial', () => {
      const { getRadialButton, onChange } = arrange({
        color: createSolid(0, 0, 255),
        hasGradient: true,
      });

      fireEvent.click(getRadialButton());

      expect(onChange).toHaveBeenCalledWith({
        stops: [
          { color: { r: 0, g: 0, b: 255 }, position: 0 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
        type: 'radial',
      });
    });

    it('should invoke onchange with new correct pattern when switching to conic', () => {
      const { getConicButton, onChange } = arrange({
        color: createSolid(0, 0, 255),
        hasGradient: true,
      });

      fireEvent.click(getConicButton());

      expect(onChange).toHaveBeenCalledWith({
        rotation: 0.5,
        stops: [
          { color: { r: 0, g: 0, b: 255 }, position: 0 },
          { color: { r: 0, g: 0, b: 255 }, position: 1 },
        ],
        type: 'conic',
      });
    });

    it('should have gradient line if switching to non-solid pattern', () => {
      const { getGradientLine, getLinearButton } = arrange({
        color: createSolid(0, 0, 0),
        hasGradient: true,
      });

      expect(getGradientLine()).not.toBeInTheDocument();

      fireEvent.click(getLinearButton());

      expect(getGradientLine()).toBeInTheDocument();
    });
  });

  describe('As the footer is interacted with', () => {
    it('should set hex when edited and invoke onChange', async () => {
      const { getEditableHexElement, onChange } = arrange({
        color: createSolid(0, 0, 255),
        hasGradient: true,
      });

      // At first it's a button
      const initialButton = getEditableHexElement();
      expect(initialButton).toHaveTextContent(/#0000ff/i);
      fireEvent.click(initialButton);

      // When clicked, it's an input
      const input = getEditableHexElement();
      expect(input).toHaveValue('0000FF'); // toHaveValue doesn't support regex
      await wait(() => expect(input).toHaveFocus());
      fireEvent.change(input, { target: { value: 'ff00ff' } });

      // Press esc to abort editing
      fireEvent.keyDown(input, { key: 'Escape', which: 27 });

      // It's the button again
      await wait(() =>
        expect(getEditableHexElement()).toHaveTextContent(/#ff00ff/i)
      );

      expect(onChange).toHaveBeenCalledWith(createSolid(255, 0, 255));
    });

    it('should set opacity when edited and invoke onChange', async () => {
      const { getEditableAlphaElement, getSolidButton, onChange } = arrange({
        color: createSolid(0, 0, 255, 0.4),
        hasGradient: true,
      });

      // At first it's a button
      const initialButton = getEditableAlphaElement();
      expect(initialButton).toHaveTextContent(/40%/i);
      fireEvent.click(initialButton);

      // When clicked, it's an input
      const input = getEditableAlphaElement();
      expect(input).toHaveValue('40');
      await wait(() => expect(input).toHaveFocus());
      fireEvent.change(input, { target: { value: '70' } });

      // focus solid button in order to blur and thus abort editin
      // NB: has to be done with `act` rather than `fireEvent.focus` due to
      // https://github.com/testing-library/react-testing-library/issues/376
      act(() => getSolidButton().focus());

      // It's the button again
      await wait(() =>
        expect(getEditableAlphaElement()).toHaveTextContent(/70%/i)
      );

      expect(onChange).toHaveBeenCalledWith(createSolid(0, 0, 255, 0.7));
    });
  });
});
