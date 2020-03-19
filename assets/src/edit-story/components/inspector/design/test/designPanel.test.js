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
import { render, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import DesignPanel from '../designPanel';
import useFormContext from '../../../form/useFormContext';
import { MULTIPLE_VALUE, usePresubmitHandler } from '../../../form';

describe('DesignPanel', () => {
  let element1, element2;
  let presubmitHandler1, presubmitHandler2;
  let onSetProperties;
  let formContext;
  let lastProps;

  beforeEach(() => {
    element1 = {
      id: '1',
      type: 'image',
      x: 11,
      y: 12,
      width: 111,
      height: 121,
      rotationAngle: 0,
    };
    element2 = {
      id: '2',
      type: 'text',
      x: 111,
      y: 112,
      width: 211,
      height: 221,
      rotationAngle: 1,
    };
    onSetProperties = jest.fn();
    formContext = null;
    presubmitHandler1 = jest.fn(({ x }) => ({ x: x + 1 }));
    presubmitHandler2 = jest.fn(({ y }) => ({ y: y + 1 }));
  });

  function CustomPanel(props) {
    lastProps = { ...props };
    formContext = useFormContext();
    usePresubmitHandler(presubmitHandler1, []);
    usePresubmitHandler(presubmitHandler2, []);
    return <div />;
  }

  describe('single element', () => {
    let selectedElements;

    beforeEach(() => {
      selectedElements = [element1];
      render(
        <DesignPanel
          panelType={CustomPanel}
          selectedElements={selectedElements}
          onSetProperties={onSetProperties}
        />
      );
    });

    it('should configure form context', () => {
      expect(formContext.isMultiple).toBe(false);
      expect(typeof formContext.registerPresubmitHandler === 'function').toBe(
        true
      );
    });

    it('should push and accumulate updates', () => {
      const { pushUpdate } = lastProps;

      // First update.
      act(() => pushUpdate({ x: 12, y: MULTIPLE_VALUE }));
      const {
        selectedElements: [updatedElementA],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...element1,
        x: 12,
        y: MULTIPLE_VALUE,
      });

      // Second update.
      act(() => pushUpdate({ x: 12, y: 14 }));
      const {
        selectedElements: [updatedElementB],
      } = lastProps;
      expect(updatedElementB).toStrictEqual({
        ...element1,
        x: 12,
        y: 14,
      });

      expect(presubmitHandler1).not.toHaveBeenCalledWith(expect.anything());
      expect(presubmitHandler2).not.toHaveBeenCalledWith(expect.anything());
      expect(onSetProperties).not.toHaveBeenCalledWith(expect.anything());
    });

    it('should submit updates and run presubmits', () => {
      const { pushUpdate } = lastProps;

      // First update.
      act(() => pushUpdate({ x: 12, y: MULTIPLE_VALUE }));
      const {
        selectedElements: [updatedElementA],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...element1,
        x: 12,
        y: MULTIPLE_VALUE,
      });

      // Submit.
      const { submit } = lastProps;
      act(() => submit());
      expect(presubmitHandler1).toHaveBeenCalledWith(expect.anything());
      expect(presubmitHandler2).toHaveBeenCalledWith(expect.anything());
      expect(onSetProperties).toHaveBeenCalledWith(expect.anything());
      const func = onSetProperties.mock.calls[0][0];
      expect(func(element1)).toStrictEqual({
        x: 12 + 1,
        y: element1.y + 1,
      });
    });
  });

  describe('multiple elements', () => {
    let selectedElements;

    beforeEach(() => {
      selectedElements = [element1, element2];
      render(
        <DesignPanel
          panelType={CustomPanel}
          selectedElements={selectedElements}
          onSetProperties={onSetProperties}
        />
      );
    });

    it('should configure form context', () => {
      expect(formContext.isMultiple).toBe(true);
    });

    it('should push updates to all elements', () => {
      const { pushUpdate } = lastProps;

      act(() => pushUpdate({ x: 12, y: MULTIPLE_VALUE }));
      const {
        selectedElements: [updatedElement1, updatedElement2],
      } = lastProps;
      expect(updatedElement1).toStrictEqual({
        ...element1,
        x: 12,
        y: MULTIPLE_VALUE,
      });
      expect(updatedElement2).toStrictEqual({
        ...element2,
        x: 12,
        y: MULTIPLE_VALUE,
      });
    });

    it('should submit updates and run presubmits', () => {
      const { pushUpdate } = lastProps;

      // First update.
      act(() => pushUpdate({ x: 12, y: MULTIPLE_VALUE }));
      const {
        selectedElements: [updatedElementA],
      } = lastProps;
      expect(updatedElementA).toStrictEqual({
        ...element1,
        x: 12,
        y: MULTIPLE_VALUE,
      });

      // Submit.
      const { submit } = lastProps;
      act(() => submit());
      expect(presubmitHandler1).toHaveBeenCalledTimes(2);
      expect(presubmitHandler2).toHaveBeenCalledTimes(2);
      expect(onSetProperties).toHaveBeenCalledTimes(1);
      const func = onSetProperties.mock.calls[0][0];
      expect(func(element1)).toStrictEqual({
        x: 12 + 1,
        y: element1.y + 1,
      });
      expect(func(element2)).toStrictEqual({
        x: 12 + 1,
        y: element2.y + 1,
      });
    });
  });
});
