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
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Chip,
  Icons,
  useKeyDownEffect,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import useRovingTabIndex from '../../../../../utils/useRovingTabIndex';
import { useExpandAnimation, useHandleRowVisibility } from '../hooks';
import {
  CHIP_COLLAPSED_FULL_HEIGHT,
  CHIP_BOTTOM_MARGIN,
  CHIP_TOP_MARGIN,
  FOCUS_BORDER_SPACING,
} from './constants';

const Section = styled.div`
  height: ${CHIP_COLLAPSED_FULL_HEIGHT}px;
  min-height: ${CHIP_COLLAPSED_FULL_HEIGHT}px;
  background-color: ${({ theme }) => theme.colors.divider.tertiary};
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
  margin: ${CHIP_TOP_MARGIN}px 12px ${CHIP_BOTTOM_MARGIN}px 24px;
`;

const InnerContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
  padding: 4px 0;
  transition: transform 0.2s;
  column-gap: 8px;
  row-gap: 14px;
`;

// Flips the button upside down when expanded;
// Important: the visibility is 'inherit' when props.visible because otherwise
// it gets shown even when the provider is not the selectedProvider!
const ExpandButton = styled(Button).attrs({
  type: BUTTON_TYPES.TERTIARY,
  size: BUTTON_SIZES.SMALL,
  variant: BUTTON_VARIANTS.CIRCLE,
})`
  display: flex;
  position: absolute;
  bottom: -24px;
  background: ${({ theme }) => theme.colors.bg.tertiary};
  max-height: none;
  width: 32px;
  height: 32px;
  ${({ isExpanded }) => isExpanded && 'transform: scaleY(-1);'}
  visibility: inherit;
  align-self: center;
  justify-content: center;
  align-items: center;
`;

const ChipGroup = ({
  items,
  selectedItemId,
  selectItem,
  deselectItem,
  ariaLabel,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const sectionRef = useRef();
  const innerContainerRef = useRef();

  const itemRefs = useRef([]);

  const [focusedRowOffset, setFocusedRowOffset] = useState(0);

  const handleClick = useCallback(
    (selected, id) => {
      if (selected && id !== null) {
        deselectItem();
      } else {
        setIsExpanded(false);
        selectItem(id);
      }
    },
    [deselectItem, selectItem]
  );

  const handleExpandClick = useCallback(
    () => setIsExpanded((currentExpanded) => !currentExpanded),
    []
  );

  useExpandAnimation({
    sectionRef,
    innerContainerRef,
    isExpanded,
    setFocusedRowOffset,
    collapsedHeight: CHIP_COLLAPSED_FULL_HEIGHT,
    bottomMargin: CHIP_BOTTOM_MARGIN,
    topMargin: CHIP_TOP_MARGIN,
  });

  useHandleRowVisibility({
    isExpanded,
    innerContainerRef,
    selectedItemId,
    setFocusedRowOffset,
    itemRefs,
    offsetSpacing: FOCUS_BORDER_SPACING,
  });

  const hasItems = items.length > 0;
  useRovingTabIndex({ ref: sectionRef }, [isExpanded]);
  useKeyDownEffect(
    sectionRef,
    !isExpanded ? 'down' : '',
    () => hasItems && setIsExpanded(true),
    [isExpanded, hasItems]
  );

  const containerId = useMemo(() => `pill-group-${uuidv4()}`, []);
  return (
    <Section ref={sectionRef}>
      {hasItems && (
        <>
          <Container
            id={containerId}
            isExpanded={isExpanded}
            role="listbox"
            aria-label={
              ariaLabel || __('List of filtering options', 'web-stories')
            }
          >
            <InnerContainer
              role="presentation"
              ref={innerContainerRef}
              style={{ transform: `translateY(-${focusedRowOffset}px` }}
            >
              {items.map((item, index) => {
                const { id, label } = item;
                const selected = id === selectedItemId;
                const tabIndex =
                  selected || (!selected && index === 0) ? 0 : -1;

                return (
                  <Chip
                    key={id}
                    role="option"
                    ref={(el) => {
                      itemRefs.current[id] = el;
                    }}
                    active={selected}
                    aria-selected={selected}
                    onClick={() => handleClick(selected, id)}
                    tabIndex={tabIndex}
                  >
                    {label}
                  </Chip>
                );
              })}
            </InnerContainer>
          </Container>
          <ExpandButton
            onClick={handleExpandClick}
            isExpanded={isExpanded}
            aria-controls={containerId}
            aria-expanded={isExpanded}
            aria-label={__('Expand', 'web-stories')}
          >
            <Icons.ChevronUp />
          </ExpandButton>
        </>
      )}
    </Section>
  );
};

ChipGroup.propTypes = {
  items: PropTypes.array.isRequired,
  selectedItemId: PropTypes.string,
  selectItem: PropTypes.func,
  deselectItem: PropTypes.func,
  ariaLabel: PropTypes.string,
};

export default ChipGroup;
