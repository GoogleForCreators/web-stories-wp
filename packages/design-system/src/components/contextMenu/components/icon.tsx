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
import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { VisuallyHidden } from '../../visuallyHidden';

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  > * {
    flex: 1;
  }
`;

export interface MenuIconProps extends ComponentPropsWithoutRef<'div'> {
  title: string;
}
/**
 * A styled icon for use in the context menu. To be used within
 * the styled Button for the context menu.
 */
function Icon({
  children,
  title,
  className = '',
  ...props
}: PropsWithChildren<MenuIconProps>) {
  return (
    <>
      <VisuallyHidden>{title}</VisuallyHidden>
      <IconWrapper className={className} {...props}>
        {children}
      </IconWrapper>
    </>
  );
}

export default Icon;
