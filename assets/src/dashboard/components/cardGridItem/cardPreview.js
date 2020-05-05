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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Button } from '..';
import { BUTTON_TYPES } from '../../constants';
import usePagePreviewSize from '../../utils/usePagePreviewSize';
import { ActionLabel } from './types';

const PreviewPane = styled.div`
  position: relative;
  border-radius: 8px;
  height: ${({ cardSize }) => `${cardSize.height}px`};
  width: ${({ cardSize }) => `${cardSize.width}px`};
  overflow: hidden;
  z-index: -1;
`;

const EditControls = styled.div`
  height: ${({ cardSize }) => `${cardSize.height}px`};
  width: ${({ cardSize }) => `${cardSize.width}px`};
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
  opacity: 0;
  transition: opacity ease-in-out 300ms;
  background: ${({ theme }) => theme.cardItem.previewOverlay};
  border-radius: 8px;

  &:hover {
    opacity: 1;
  }

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    button,
    a {
      min-width: ${({ cardSize }) => cardSize.width};
      & > label {
        font-size: 12px;
      }
    }
  }
`;

const ActionContainer = styled.div`
  padding: 20px;
`;

const EmptyActionContainer = styled(ActionContainer)`
  padding: 40px;
`;

const CenterActionButton = styled(Button)`
  width: 100%;
  font-size: 22px;
  line-height: 22px;
`;

const BottomActionButton = styled(Button)`
  width: 100%;
`;

const getActionAttributes = (targetAction) =>
  typeof targetAction === 'string'
    ? { href: targetAction, isLink: true }
    : { onClick: targetAction };

const CardPreviewContainer = ({ centerAction, bottomAction, children }) => {
  const { pageSize } = usePagePreviewSize();

  return (
    <>
      <PreviewPane cardSize={pageSize}>{children}</PreviewPane>
      <EditControls cardSize={pageSize}>
        <EmptyActionContainer />
        {centerAction && (
          <ActionContainer>
            <CenterActionButton
              type={BUTTON_TYPES.SECONDARY}
              {...getActionAttributes(centerAction.targetAction)}
            >
              {centerAction.label}
            </CenterActionButton>
          </ActionContainer>
        )}
        <ActionContainer>
          <BottomActionButton
            {...getActionAttributes(bottomAction.targetAction)}
          >
            {bottomAction.label}
          </BottomActionButton>
        </ActionContainer>
      </EditControls>
    </>
  );
};

const ActionButtonPropType = PropTypes.shape({
  targetAction: PropTypes.oneOfType([PropTypes.func, PropTypes.string])
    .isRequired,
  label: ActionLabel.isRequired,
});

CardPreviewContainer.propTypes = {
  children: PropTypes.node.isRequired,
  centerAction: ActionButtonPropType,
  bottomAction: ActionButtonPropType.isRequired,
};

export default CardPreviewContainer;
