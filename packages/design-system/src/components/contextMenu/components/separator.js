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
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { useContextMenu } from '../contextMenuProvider';

const Line = styled.div`
  display: block;
  background-color: ${({ theme }) => theme.colors.divider.primary};
  ${({ $isHorizontal, $isIconMenu }) =>
    $isHorizontal
      ? `
        width: 1px;
        height: 86%; /* 31px out of 36px */
        margin: auto 2px; /* there's an extra 6px horizontal flexbox gap */
      `
      : `
        height: 1px;
        margin: 2px auto; /* there's an extra 6p vertical flexbox gap */
        width: ${$isIconMenu ? 40 : 100}%;
      `}
`;

/**
 * A horizontal line that can be rendered between context menu
 * items.
 *
 * @return {Node} The react node
 */
function Separator() {
  const { isIconMenu, isHorizontal } = useContextMenu(
    ({ state: { isIconMenu, isHorizontal } }) => ({ isIconMenu, isHorizontal })
  );

  return <Line $isIconMenu={isIconMenu} $isHorizontal={isHorizontal} />;
}

export default Separator;
