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
  border-bottom: 3px dashed ${({ theme }) => rgba(theme.colors.fg.v1, 0.4)};
  mix-blend-mode: difference;
  pointer-events: none;
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
  const [linkType, setLinkType] = useState(LinkType.TWO_TAP);
  const {
    state: { selectedElements, currentPageNumber },
    actions: { updateElementById },
  } = useStory();
  const {
    actions: { editorToDataY },
  } = useUnits();

  const selectedElement = selectedElements.length === 1 && selectedElements[0];
  const link = getLinkFromElement(selectedElement);
  const hasOneTapLinks = selectedElement && link && currentPageNumber !== 1;

  useEffect(() => {
    if (hasOneTapLinks) {
      setLinkType(inferLinkType(selectedElement));
    }
  }, [hasOneTapLinks, selectedElement, setLinkType]);

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

  useEffect(() => {
    if (!linkType || !link || link.type === linkType || !hasOneTapLinks) {
      return;
    }

    updateElementById({
      elementId: selectedElement.id,
      properties: {
        link: { ...link, type: linkType },
      },
    });
  }, [linkType, link, hasOneTapLinks, selectedElement, updateElementById]);

  if (!selectedElement || !link || currentPageNumber === 1) {
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
