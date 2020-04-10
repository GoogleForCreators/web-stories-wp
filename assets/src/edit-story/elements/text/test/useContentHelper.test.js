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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import useContentHelper from '../useContentHelper';

describe('useContentHelper', () => {
  let setFlag;
  let isFlagSet;
  let toggleFlag;
  let setCustomStyle;

  beforeEach(() => {
    setFlag = null;
    render(<StubElement />);
  });

  function StubElement() {
    const contentHelper = useContentHelper();
    ({ setFlag, isFlagSet, toggleFlag, setCustomStyle } = contentHelper);
    return <div />;
  }

  describe('set a flag', () => {
    it('should set a flag', () => {
      expect(setFlag('hello &amp; world', 'b', true)).toBe(
        '<b>hello &amp; world</b>'
      );
    });

    it('should set a flag on empty content', () => {
      expect(setFlag('', 'b', true)).toBe('<b></b>');
    });

    it('should set a flag when already set', () => {
      expect(setFlag('<b>hello world</b>', 'b', true)).toBe(
        '<b>hello world</b>'
      );
    });

    it('should set a flag when already set nested', () => {
      expect(setFlag('<b>hello <b>world</b></b>', 'b', true)).toBe(
        '<b>hello world</b>'
      );
    });

    it('should set a flag when already partially set', () => {
      expect(
        setFlag('hello <b>world</b> <i>A <b>even deeper</b> B</i> C', 'b', true)
      ).toBe('<b>hello world <i>A even deeper B</i> C</b>');
    });
  });

  describe('unset a flag', () => {
    it('should unset a flag', () => {
      expect(setFlag('<b>hello &amp; world</b>', 'b', false)).toBe(
        'hello &amp; world'
      );
    });

    it('should unset a flag on empty content', () => {
      expect(setFlag('', 'b', false)).toBe('');
      expect(setFlag('<b></b>', 'b', false)).toBe('');
    });

    it('should unset a flag when set nested', () => {
      expect(setFlag('<b>hello <b>world</b></b>', 'b', false)).toBe(
        'hello world'
      );
      expect(setFlag('hello <b>world</b>', 'b', false)).toBe('hello world');
    });

    it('should unset a flag when already partially set', () => {
      expect(
        setFlag(
          'hello <b>world</b> <i>A <b>even deeper</b> B</i> C',
          'b',
          false
        )
      ).toBe('hello world <i>A even deeper B</i> C');
    });
  });

  describe('isFlagSet', () => {
    it('should determine that a flag is set', () => {
      expect(isFlagSet('<b>hello &amp; world</b>', 'b')).toBe(true);
    });

    it('should determine that a flag is not set', () => {
      expect(isFlagSet('hello &amp; world', 'b')).toBe(false);
    });

    it('should determine that a flag is not set on partial', () => {
      expect(isFlagSet('<b>hello</b> &amp; <b>world</b>', 'b')).toBe(false);
    });

    it('should determine that a flag is set/not set on empty content', () => {
      expect(isFlagSet('', 'b')).toBe(false);
      expect(isFlagSet('<b></b>', 'b')).toBe(true);
    });
  });

  describe('toggleFlag', () => {
    it('should toggle flag on empty', () => {
      expect(toggleFlag('', 'b')).toBe('<b></b>');
      expect(toggleFlag('<b></b>', 'b')).toBe('');
    });

    it('should toggle flag', () => {
      expect(toggleFlag('hello world', 'b')).toBe('<b>hello world</b>');
      expect(toggleFlag('<b>hello world</b>', 'b')).toBe('hello world');
    });
  });

  describe('setCustomStyle', () => {
    it('should set a custom bold style', () => {
      expect(
        setCustomStyle('<b>hello <b>nested</b></b>', 'b', { fontWeight: 900 })
      ).toBe(
        '<b style="font-weight: 900;">hello <b style="font-weight: 900;">nested</b></b>'
      );
    });
  });
});
