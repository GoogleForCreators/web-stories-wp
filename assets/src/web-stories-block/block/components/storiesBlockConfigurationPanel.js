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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
  Card,
  CardBody,
  CardMedia,
  Placeholder,
  Icon,
} from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';

const TypeGrid = styled.div`
  width: 100%;
  display: grid;
  gap: 10px;
  grid-auto-rows: minmax(100px, auto);

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
  justify-content: center;
  border: 1px solid #347bb5;
  border-radius: 2px;
  padding-top: 14px;
  padding-bottom: 14px;
  height: 80px;
`;

const TypeCardBody = styled(CardBody)`
  text-align: center;
  font-weight: 500;
  font-size: 13px;
  line-height: 140%;
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
    >
      <TypeGrid style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}>
        {selectionOptions.map((option) => (
          <TypeCard
            key={option.id}
            size="extraSmall"
            onClick={() => {
              setAttributes({ [selectionType]: option.id });
            }}
          >
            <TypeMedia>
              <Icon icon={option.icon} />
            </TypeMedia>
            <TypeCardBody>{option.label}</TypeCardBody>
          </TypeCard>
        ))}
      </TypeGrid>
    </Placeholder>
  );
}

BlockConfigurationPanel.propTypes = {
  selectionType: PropTypes.string,
  selectionOptions: PropTypes.object,
  instruction: PropTypes.string,
  columnCount: PropTypes.number,
  icon: PropTypes.func,
  setAttributes: PropTypes.func.isRequired,
};

export default BlockConfigurationPanel;
