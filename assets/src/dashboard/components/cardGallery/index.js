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
import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  Children,
} from 'react';

/**
 * Internal dependencies
 */
import { PAGE_RATIO } from '../../constants/pageStructure';
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
  const [dimensionMultiplier, setDimensionMultiplier] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const containerRef = useRef();

  useEffect(() => {
    const count = Children.count(children);
    if (count > 1) {
      setCards(children);
    } else if (count === 1) {
      setCards([children]);
    } else if (count === 0) {
      setCards([]);
    }
  }, [children]);

  const metrics = useMemo(() => {
    if (!dimensionMultiplier) {
      return {};
    }
    const activeCardWidth = ACTIVE_CARD_WIDTH * dimensionMultiplier;
    const miniCardWidth = MINI_CARD_WIDTH * dimensionMultiplier;
    return {
      activeCardSize: {
        width: activeCardWidth,
        height: activeCardWidth / PAGE_RATIO,
      },
      miniCardSize: {
        width: miniCardWidth,
        height: miniCardWidth / PAGE_RATIO,
      },
      miniWrapperSize: {
        width: miniCardWidth + CARD_WRAPPER_BUFFER,
        height: miniCardWidth / PAGE_RATIO + CARD_WRAPPER_BUFFER,
      },
      gap: CARD_GAP * dimensionMultiplier,
    };
  }, [dimensionMultiplier]);

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

  useEffect(() => {
    setActiveCardIndex(0);
  }, [children]);

  return (
    <GalleryContainer ref={containerRef} maxWidth={MAX_WIDTH}>
      {metrics.miniCardSize && (
        <UnitsProvider pageSize={metrics.miniCardSize}>
          <MiniCardsContainer
            rowHeight={metrics.miniWrapperSize.height}
            gap={metrics.gap}
          >
            {cards.map((card, index) => (
              <MiniCardWrapper
                key={index}
                isSelected={index === activeCardIndex}
                {...metrics.miniWrapperSize}
                onClick={() => handleMiniCardClick(index)}
              >
                <MiniCard {...metrics.miniCardSize}>{card}</MiniCard>
              </MiniCardWrapper>
            ))}
          </MiniCardsContainer>
        </UnitsProvider>
      )}
      {metrics.activeCardSize && cards[activeCardIndex] && (
        <UnitsProvider pageSize={metrics.activeCardSize}>
          <ActiveCard {...metrics.activeCardSize}>
            {cards[activeCardIndex]}
          </ActiveCard>
        </UnitsProvider>
      )}
    </GalleryContainer>
  );
}

CardGallery.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CardGallery;
