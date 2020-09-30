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
import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import { v4 as uuidv4 } from 'uuid';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ArrowDown } from '../../../../button';
import { useKeyDownEffect } from '../../../../keyboard';
import useRovingTabIndex from '../../../../../utils/useRovingTabIndex';
import Pill from './pill';

/**
 * Internal dependencies
 */
import {
  PILL_COLLAPSED_FULL_HEIGHT,
  PILL_BOTTOM_MARGIN,
  PILL_TOP_MARGIN,
} from './constants';
import useExpandAnimation from './useExpandAnimation';
import useHandleRowVisibility from './useHandleRowVisibility';

const Section = styled.div`
  height: ${PILL_COLLAPSED_FULL_HEIGHT}px;
  min-height: ${PILL_COLLAPSED_FULL_HEIGHT}px;
  background-color: ${({ theme }) => rgba(theme.colors.bg.workspace, 0.8)};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 0 1 auto;
  position: relative;
  transition: height 0.2s, min-height 0.2s;
`;

// This hides the pills unless expanded
const Container = styled.div`
  overflow: hidden;
  margin: ${PILL_TOP_MARGIN}px 12px ${PILL_BOTTOM_MARGIN}px 24px;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  transition: transform 0.2s;
`;

// Flips the button upside down when expanded;
// Important: the visibily is 'inherit' when props.visible because otherwise
// it gets shown even when the provider is not the selectedProvider!
const ExpandButton = styled(ArrowDown)`
  display: flex;
  position: absolute;
  bottom: -16px;
  background: ${({ theme }) => theme.colors.fg.gray16};
  max-height: none;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  ${({ isExpanded }) => isExpanded && 'transform: matrix(1, 0, 0, -1, 0, 0);'}
  visibility: inherit;
  align-self: center;
  justify-content: center;
  align-items: center;
`;

const PillGroup = ({ items, selectedItemId, selectItem, deselectItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sectionRef = useRef();
  const innerContainerRef = useRef();

  const itemRefs = useRef([]);

  const [focusedRowOffset, setFocusedRowOffset] = useState(0);

  const handleClick = (selected, id) => {
    if (selected) {
      deselectItem();
    } else {
      setIsExpanded(false);
      selectItem(id);
    }
  };

  useExpandAnimation({
    sectionRef,
    innerContainerRef,
    isExpanded,
    setFocusedRowOffset,
  });

  useHandleRowVisibility({
    isExpanded,
    innerContainerRef,
    selectedItemId,
    setFocusedRowOffset,
    itemRefs,
  });

  const hasItems = items.length > 0;
  useRovingTabIndex({ ref: sectionRef }, [isExpanded]);
  useKeyDownEffect(
    sectionRef,
    !isExpanded ? 'down' : '',
    () => hasItems && setIsExpanded(true),
    [isExpanded, hasItems]
  );

  const containerId = `pill-group-${uuidv4()}`;
  return (
    <Section ref={sectionRef}>
      {hasItems && (
        <>
          <Container
            id={containerId}
            isExpanded={isExpanded}
            role="listbox"
            aria-label={__('List of filtering options', 'web-stories')}
          >
            <InnerContainer
              role="presentation"
              ref={innerContainerRef}
              style={{ transform: `translateY(-${focusedRowOffset}px` }}
            >
              {items.map((item, i) => {
                const { id, label } = item;
                const selected = id === selectedItemId;
                return (
                  <Pill
                    itemRef={(el) => {
                      itemRefs.current[id] = el;
                    }}
                    index={i}
                    isSelected={selected}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    key={id}
                    onClick={() => handleClick(selected, id)}
                  >
                    {label}
                  </Pill>
                );
              })}
            </InnerContainer>
          </Container>
          <ExpandButton
            onClick={() => setIsExpanded(!isExpanded)}
            isExpanded={isExpanded}
            aria-controls={containerId}
            aria-expanded={isExpanded}
            aria-label={__('Expand', 'web-stories')}
          />
        </>
      )}
    </Section>
  );
};

PillGroup.propTypes = {
  items: PropTypes.array.isRequired,
  selectedItemId: PropTypes.string,
  selectItem: PropTypes.func,
  deselectItem: PropTypes.func,
};

export default PillGroup;
