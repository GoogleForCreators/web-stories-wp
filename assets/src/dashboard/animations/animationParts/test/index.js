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
import { ANIMATION_TYPES } from '../../constants';
import { WAAPI } from '..';

describe('WAAPI', () => {
  /**
   * These aren't defined in jsdom so
   * can't mock. So instead just adding
   * them to the window and restoring
   * incase they ever get support.
   */
  let KeyframeEffectTmp;
  let AnimationTmp;
  beforeEach(() => {
    KeyframeEffectTmp = window.KeyframeEffect;
    window.KeyframeEffect = function () {
      return {};
    };
    AnimationTmp = window.Animation;
    window.Animation = function () {
      return {};
    };
  });
  afterEach(() => {
    window.KeyframeEffect = KeyframeEffectTmp;
    window.Animation = AnimationTmp;
  });

  /**
   * Ensures every animation type resolves
   * to a react component as new animations
   * are created
   */
  it.each(Object.keys(ANIMATION_TYPES))(
    'type: %s returns a react component',
    (type) => {
      const args = {};
      const WAAPIWrapper = WAAPI(type, args);
      const { getByTestId } = render(
        <WAAPIWrapper hoistAnimation={() => {}}>
          <div data-testid="child-rendered" />
        </WAAPIWrapper>
      );
      expect(getByTestId('child-rendered')).toBeDefined();
    }
  );
});
