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
import PropTypes from 'prop-types';
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';

/**
 * Internal dependencies
 */
import { PAGE_RATIO } from '../../constants';
import { UnitsProvider } from '../../../edit-story/units';
import {
  ActiveCard,
  GalleryContainer,
  MiniCardsContainer,
  MiniCardWrapper,
  MiniCard,
} from './components';

const MAX_WIDTH = 680;
const ACTIVE_CARD_WIDTH = 330;
const MINI_CARD_WIDTH = 75;
const CARD_GAP = 15;
const CARD_WRAPPER_BUFFER = 12;

function CardGallery({ children }) {
  const [dimensionMultiplier, setDimensionMultiplier] = useState(1);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const containerRef = useRef();

  const cards = useMemo(
    () => (Array.isArray(children) ? [...children] : [children]),
    [children]
  );

  const { activeCardWidth, miniCardWidth, gap } = useMemo(
    () => ({
      activeCardWidth: ACTIVE_CARD_WIDTH * dimensionMultiplier,
      miniCardWidth: MINI_CARD_WIDTH * dimensionMultiplier,
      gap: CARD_GAP * dimensionMultiplier,
    }),
    [dimensionMultiplier]
  );

  const activeCardSize = useMemo(
    () => ({
      width: activeCardWidth,
      height: activeCardWidth * PAGE_RATIO,
    }),
    [activeCardWidth]
  );

  const miniCardSize = useMemo(
    () => ({
      width: miniCardWidth,
      height: miniCardWidth * PAGE_RATIO,
    }),
    [miniCardWidth]
  );

  const miniWrapperCardSize = useMemo(
    () => ({
      width: miniCardWidth + CARD_WRAPPER_BUFFER,
      height: miniCardWidth * PAGE_RATIO + CARD_WRAPPER_BUFFER,
    }),
    [miniCardWidth]
  );

  const handleMiniCardClick = useCallback((index) => {
    setActiveCardIndex(index);
  }, []);

  const updateContainerSize = useCallback(() => {
    const ratio = containerRef.current.offsetWidth / MAX_WIDTH;

    if (ratio > 0.92) {
      setDimensionMultiplier(1);
    } else if (ratio > 0.75) {
      setDimensionMultiplier(0.8);
    } else if (ratio > 0.6) {
      setDimensionMultiplier(0.6);
    } else {
      setDimensionMultiplier(0.5);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateContainerSize);
    updateContainerSize();
    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, [updateContainerSize]);

  return (
    <GalleryContainer ref={containerRef} maxWidth={MAX_WIDTH}>
      <UnitsProvider pageSize={miniCardSize}>
        <MiniCardsContainer rowHeight={miniWrapperCardSize.height} gap={gap}>
          {cards.map((card, index) => (
            <MiniCardWrapper
              key={index}
              isSelected={index === activeCardIndex}
              {...miniWrapperCardSize}
              onClick={() => handleMiniCardClick(index)}
            >
              <MiniCard {...miniCardSize}>{card}</MiniCard>
            </MiniCardWrapper>
          ))}
        </MiniCardsContainer>
      </UnitsProvider>
      <UnitsProvider pageSize={activeCardSize}>
        <ActiveCard {...activeCardSize}>{cards[activeCardIndex]}</ActiveCard>
      </UnitsProvider>
    </GalleryContainer>
  );
}

CardGallery.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
};

export default CardGallery;
