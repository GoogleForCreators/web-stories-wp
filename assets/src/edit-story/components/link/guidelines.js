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
import { useState, useEffect } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import { useUnits } from '../../units';
import { CTA_ZONE_PERCENT } from '../../constants';
import { useTransformHandler } from '../transform';
import { LinkType, inferLinkType, getLinkFromElement } from '.';

const Separator = styled.div`
  position: absolute;
  bottom: ${CTA_ZONE_PERCENT * 100}%;
  left: 0px;
  width: 100%;
  mix-blend-mode: difference;
  pointer-events: none;
  z-index: 1;
  background-image: linear-gradient(
    to right,
    ${({ theme }) => theme.colors.fg.v1} 60%,
    rgba(255, 255, 255, 0) 0%
  );
  background-position: bottom;
  background-size: 10px 1px;
  background-repeat: repeat-x;
  height: 2px;
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
  ${({ pos }) => (pos === 'top' ? `bottom: 8px;` : `top: 8px;`)}
`;

function LinkGuidelines() {
  const [linkType, setLinkType] = useState(LinkType.TWO_TAP);
  const {
    state: { selectedElements, currentPageNumber },
    actions: { updateElementById },
  } = useStory();
  const {
    actions: { editorToDataY },
  } = useUnits();

  const selectedElement = selectedElements.length === 1 && selectedElements[0];
  const hasOneTapLinks = selectedElement?.link && currentPageNumber >= 1;

  // Disable reason: This effect only needs to be called whenever `selectedElement.y` changes (not `selectedElement` as a whole)
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (hasOneTapLinks) {
      setLinkType(inferLinkType(selectedElement));
    }
  }, [hasOneTapLinks, selectedElement?.y, setLinkType]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useTransformHandler(selectedElement?.id, (transform) => {
    if (!hasOneTapLinks) {
      return;
    }
    const translateY = transform?.translate?.[1];
    if (translateY) {
      setLinkType(
        inferLinkType({
          ...selectedElement,
          y: selectedElement?.y + editorToDataY(translateY),
        })
      );
    }
  });

  // Disable reason: This effect only needs to be called whenever `selectedElement.y` changes (not `selectedElement` as a whole)
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const link = getLinkFromElement(selectedElement);
    if (!linkType || !link || link.type === linkType || !hasOneTapLinks) {
      return;
    }
    updateElementById({
      elementId: selectedElement?.id,
      properties: {
        link: { ...link, type: linkType },
      },
    });
  }, [
    linkType,
    hasOneTapLinks,
    updateElementById,
    selectedElement?.id,
    selectedElement?.y,
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  if (!selectedElement || !selectedElement?.link || currentPageNumber === 1) {
    return null;
  }

  return (
    <Separator>
      <Tip active={linkType === LinkType.TWO_TAP} pos={'top'}>
        {__('2-TAP LINK', 'web-stories')}
      </Tip>
      <Tip active={linkType === LinkType.ONE_TAP} pos={'bottom'}>
        {__('1-TAP LINK', 'web-stories')}
      </Tip>
    </Separator>
  );
}

LinkGuidelines.propTypes = {};

export default LinkGuidelines;
