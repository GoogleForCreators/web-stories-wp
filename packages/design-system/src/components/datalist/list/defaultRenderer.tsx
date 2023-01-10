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
import type { ForwardedRef } from 'react';
import { forwardRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import type { AbstractOption, OptionRendererProps } from '../types';
import { ListElement, Selected, OverflowEllipses } from './styled';

function DefaultRendererWithRef<O extends AbstractOption>(
  { option, value, ...rest }: OptionRendererProps<O>,
  ref: ForwardedRef<HTMLLIElement>
) {
  return (
    <ListElement key={option.id} {...rest} ref={ref}>
      {value === option.id && (
        <Selected aria-label={__('Selected', 'web-stories')} />
      )}
      <OverflowEllipses>{option.name}</OverflowEllipses>
    </ListElement>
  );
}

// This cast is really annoying, but required to make a forwardRef'ed component
// accept a generic type argument.
// @see https://fettblog.eu/typescript-react-generic-forward-refs/
const DefaultRenderer = forwardRef(DefaultRendererWithRef) as <
  O extends AbstractOption
>(
  props: OptionRendererProps<O> & {
    ref?: React.ForwardedRef<HTMLLIElement>;
  }
) => ReturnType<typeof DefaultRendererWithRef>;

export default DefaultRenderer;
