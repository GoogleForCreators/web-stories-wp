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
import { useLayoutEffect, useRef, useState } from 'react';
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
import Pill, { PILL_HEIGHT } from './pill';

const CATEGORY_TOP_MARGIN = 16;
const CATEGORY_BOTTOM_MARGIN = 30;
const CATEGORY_COLLAPSED_FULL_HEIGHT =
  PILL_HEIGHT + CATEGORY_TOP_MARGIN + CATEGORY_BOTTOM_MARGIN;

const Section = styled.div`
  height: ${CATEGORY_COLLAPSED_FULL_HEIGHT}px;
  min-height: ${CATEGORY_COLLAPSED_FULL_HEIGHT}px;
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
  margin: ${CATEGORY_TOP_MARGIN}px 12px ${CATEGORY_BOTTOM_MARGIN}px 24px;
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

  const [focusedRowOffset, setFocusedRowOffset] = useState(0);

  // Handles expand and contract animation.
  // We calculate the actual height of the categories list, and set its explicit
  // height if it's expanded, in order to have a CSS height transition.
  useLayoutEffect(() => {
    if (!sectionRef.current || !innerContainerRef.current) {
      return;
    }
    let height;
    if (!isExpanded) {
      height = `${CATEGORY_COLLAPSED_FULL_HEIGHT}px`;
    } else {
      height = `${
        innerContainerRef.current.offsetHeight +
        CATEGORY_TOP_MARGIN +
        CATEGORY_BOTTOM_MARGIN
      }px`;
    }
    // Safari has some strange issues with flex-shrink that require setting
    // min-height as well.
    sectionRef.current.style.height = height;
    sectionRef.current.style.minHeight = height;

    setFocusedRowOffset(0);
  }, [sectionRef, innerContainerRef, isExpanded]);

  // Handles setting which row will be seen, by manipulating translateY.
  useLayoutEffect(() => {
    if (!innerContainerRef.current) {
      return;
    }
    const pills = Array.from(
      innerContainerRef.current.querySelectorAll('.categoryPill')
    );
    const selectedItem = selectedItemId
      ? pills.find((p) => p.dataset.categoryId == selectedItemId)
      : null;
    const selectedItemOffsetTop = selectedItem?.offsetTop || 0;

    if (!isExpanded && selectedItem) {
      setFocusedRowOffset(selectedItemOffsetTop);
    }
  }, [innerContainerRef, isExpanded, selectedItemId]);

  // Handles fading rows in and out depending on the selected item.
  useLayoutEffect(() => {
    if (!innerContainerRef.current) {
      return;
    }
    const pills = Array.from(
      innerContainerRef.current.querySelectorAll('.categoryPill')
    );
    const selectedItem = selectedItemId
      ? pills.find((p) => p.dataset.categoryId == selectedItemId)
      : null;
    const selectedItemOffsetTop = selectedItem?.offsetTop || 0;

    for (let item of pills) {
      const isSameRow = selectedItem && item.offsetTop == selectedItemOffsetTop;
      if (selectedItem && !isSameRow && !isExpanded) {
        item.classList.add('invisible');
      } else {
        item.classList.remove('invisible');
      }
    }
  }, [innerContainerRef, isExpanded, selectedItemId]);

  const containerId = `pillgroup-${uuidv4()}`;
  return (
    <Section ref={sectionRef} hasCategories={Boolean(items.length)}>
      {items.length ? (
        <>
          <Container id={containerId} isExpanded={isExpanded} role="tablist">
            <InnerContainer
              ref={innerContainerRef}
              style={{ transform: `translateY(-${focusedRowOffset}px` }}
            >
              {items.map((e, i) => {
                const selected = e.id === selectedItemId;
                return (
                  <Pill
                    index={i}
                    isSelected={selected}
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    key={e.id}
                    categoryId={e.id}
                    title={e.displayName}
                    onClick={() => {
                      if (selected) {
                        deselectItem();
                      } else {
                        setIsExpanded(false);
                        selectItem(e.id);
                      }
                    }}
                  />
                );
              })}
            </InnerContainer>
          </Container>
          <ExpandButton
            data-testid="category-expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
            isExpanded={isExpanded}
            aria-controls={containerId}
            aria-expanded={isExpanded}
            aria-label={__('Expand', 'web-stories')}
          />
        </>
      ) : null}
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
