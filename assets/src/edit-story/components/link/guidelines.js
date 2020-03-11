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
import styled from 'styled-components';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useStory } from '../../app';
import { CTA_ZONE_PERCENT } from '../../constants';
import { LinkType, inferLinkType, getLinkFromElement } from '.';

const Separator = styled.div`
  position: absolute;
  bottom: ${CTA_ZONE_PERCENT * 100}%;
  left: 0px;
  width: 100%;
  border-bottom: 3px dashed ${({ theme }) => rgba(theme.colors.fg.v1, 0.4)};
  mix-blend-mode: difference;
  z-index: 1;
`;

const Tip = styled.span`
  position: absolute;
  left: 100%;
  white-space: nowrap;
  margin-left: 12px;
  font-size: 12px;
  filter: none;
  color: ${({ theme, active }) =>
    active ? theme.colors.success.v0 : rgba(theme.colors.fg.v1, 0.84)};
  ${({ pos }) => (pos === 'top' ? `bottom: 0px;` : `top: 0px;`)}
`;

function LinkGuidelines({}) {
  const {
    state: { selectedElements },
  } = useStory();

  const selectedElement = selectedElements.length === 1 && selectedElements[0];
  if (!selectedElement) {
    return null;
  }

  const link = getLinkFromElement(selectedElement);
  if (!link) {
    return null;
  }

  const { x, y, width: w, height: h } = selectedElement;
  const inferredLinkType = inferLinkType(x, y, w, h);

  return (
    <Separator>
      <Tip active={inferredLinkType === LinkType.TWO_TAP} pos={'top'}>
        {__('2-TAP LINK', 'web-stories')}
      </Tip>
      <Tip active={inferredLinkType === LinkType.ONE_TAP} pos={'bottom'}>
        {__('1-TAP LINK', 'web-stories')}
      </Tip>
    </Separator>
  );
}

LinkGuidelines.propTypes = {};

export default LinkGuidelines;
