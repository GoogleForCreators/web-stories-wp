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
import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import { useFeatures } from 'flagged';

/**
 * Internal dependencies
 */
import {
  Button,
  Icons,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
  PLACEMENT,
} from '../../../design-system';
import { useMetaBoxes } from '../../integrations/wordpress/metaBoxes';
import Modal from '../modal';
import Tooltip from '../tooltip';
import GridView from './gridview';
import ZoomSelector from './zoomSelector';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`;

const MenuItems = styled.div`
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin: 0 16px 16px;
`;

const Box = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Space = styled.span`
  width: 8px;
`;

function PrimaryMenu() {
  const [isGridViewOpen, setIsGridViewOpen] = useState(false);

  const toggleModal = useCallback(() => {
    setIsGridViewOpen((prevIsOpen) => {
      const newIsOpen = !prevIsOpen;

      trackEvent('grid_view_toggled', {
        status: newIsOpen ? 'open' : 'closed',
      });

      return newIsOpen;
    });
  }, [setIsGridViewOpen]);
  const { hasCanvasZoom } = useFeatures();

  const {
    metaBoxesVisible,
    toggleMetaBoxesVisible,
    hasMetaBoxes,
  } = useMetaBoxes(({ state, actions }) => ({
    hasMetaBoxes: state.hasMetaBoxes,
    metaBoxesVisible: state.metaBoxesVisible,
    toggleMetaBoxesVisible: actions.toggleMetaBoxesVisible,
  }));

  const handleMetaBoxesClick = useCallback(() => {
    toggleMetaBoxesVisible();
    trackEvent('meta_boxes_toggled', {
      status: metaBoxesVisible ? 'visible' : 'hidden',
    });
  }, [metaBoxesVisible, toggleMetaBoxesVisible]);

  return (
    <>
      <Wrapper>
        <MenuItems>
          {hasMetaBoxes && (
            <>
              <Box>
                <Tooltip
                  title={__('Third-Party Meta Boxes', 'web-stories')}
                  placement={PLACEMENT.TOP}
                  hasTail
                >
                  <Button
                    variant={BUTTON_VARIANTS.SQUARE}
                    type={BUTTON_TYPES.TERTIARY}
                    size={BUTTON_SIZES.SMALL}
                    onClick={handleMetaBoxesClick}
                    aria-label={__('Third-Party Meta Boxes', 'web-stories')}
                  >
                    <Icons.LetterMOutline />
                  </Button>
                </Tooltip>
              </Box>
              <Space />
            </>
          )}
          <Box>
            <Tooltip
              title={__('Grid View', 'web-stories')}
              placement={PLACEMENT.TOP}
              hasTail
            >
              <Button
                variant={BUTTON_VARIANTS.SQUARE}
                type={BUTTON_TYPES.PLAIN}
                size={BUTTON_SIZES.SMALL}
                onClick={toggleModal}
                aria-label={__('Grid View', 'web-stories')}
              >
                <Icons.Box4 />
              </Button>
            </Tooltip>
          </Box>
          {hasCanvasZoom && <ZoomSelector />}
        </MenuItems>
      </Wrapper>
      <Modal
        open={isGridViewOpen}
        onClose={toggleModal}
        contentLabel={__('Grid View', 'web-stories')}
        overlayStyles={{
          alignItems: 'stretch',
        }}
        contentStyles={{
          pointerEvents: 'none',
          flex: 1,
        }}
      >
        <GridView onClose={toggleModal} />
      </Modal>
    </>
  );
}

export default PrimaryMenu;
