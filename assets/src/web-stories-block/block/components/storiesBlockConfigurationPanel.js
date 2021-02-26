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

const FallbackComponent = ({ children, ...additionalProps }) => (
  <div {...additionalProps}>{children}</div>
);

FallbackComponent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import * as Components from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';

// Note: Card, CardBody, CardMedia are only available in Gutenberg 7.0 or later,
// so they do not exist in WP 5.3.
const {
  Card = FallbackComponent,
  CardBody = FallbackComponent,
  CardMedia = FallbackComponent,
  Placeholder,
  Icon,
} = Components;

const TypeGrid = styled.div`
  width: 100%;
  display: grid;
  gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  grid-template-columns: ${({ $columnCount }) =>
    `repeat(${$columnCount}, 1fr)`};

  & * {
    cursor: pointer;
  }
`;

const TypeCard = styled(Card)`
  border: none !important;
`;

const TypeMedia = styled(CardMedia)`
  display: flex;
  align-items: center;
  color: #347bb5;
  justify-content: center;
  border: 1px solid currentColor;
  border-radius: 2px;
  padding-top: 14px;
  padding-bottom: 14px;
  height: 80px;
  background-color: white;
`;

const TypeCardBody = styled(CardBody)`
  text-align: center;
  font-weight: 500;
  font-size: 13px;
  line-height: 140%;
  padding: 16px 12px;
`;

function BlockConfigurationPanel({
  instruction,
  columnCount,
  icon,
  setAttributes,
  selectionOptions,
  selectionType,
}) {
  const label = __('Web Stories', 'web-stories');

  return (
    <Placeholder
      icon={<BlockIcon icon={icon} showColors />}
      label={label}
      instructions={instruction}
      data-testid="ws-block-configuration-panel"
    >
      <TypeGrid $columnCount={columnCount}>
        {selectionOptions.map((option) => (
          <TypeCard
            className="components-card"
            key={option.id}
            onClick={() => {
              setAttributes({ [selectionType]: option.id });
            }}
          >
            <TypeMedia className="components-card__media">
              {'viewType' === selectionType && <Icon icon={option.panelIcon} />}
              {'blockType' === selectionType && <Icon icon={option.icon} />}
            </TypeMedia>
            <TypeCardBody className="components-card__body">
              {option.label}
            </TypeCardBody>
          </TypeCard>
        ))}
      </TypeGrid>
    </Placeholder>
  );
}

BlockConfigurationPanel.propTypes = {
  selectionType: PropTypes.string,
  selectionOptions: PropTypes.array,
  instruction: PropTypes.string,
  columnCount: PropTypes.number,
  icon: PropTypes.func,
  setAttributes: PropTypes.func.isRequired,
};

export default BlockConfigurationPanel;
