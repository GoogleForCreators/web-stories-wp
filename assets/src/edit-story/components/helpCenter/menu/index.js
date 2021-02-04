/*
 * Copyright 2021 Google LLC
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
import { __ } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { noop } from '../../../utils/noop';
import { GUTTER_WIDTH } from '../constants';
import { Footer } from './footer';
import { Header } from './header';
import { Tips } from './tips';
import { Transitioner } from './transitioner';

const Container = styled.div`
  padding: 0 ${GUTTER_WIDTH}px;
  max-height: 60vh;
  overflow-y: scroll;
`;

export function Menu({ onTipSelect = noop, read, ...transitionProps }) {
  return (
    <Transitioner {...transitionProps}>
      <Container aria-label={__('Help Center Main Menu', 'web-stories')}>
        <Header />
        <Tips read={read} onTipSelect={onTipSelect} />
        <Footer />
      </Container>
    </Transitioner>
  );
}
Menu.propTypes = {
  read: PropTypes.arrayOf(PropTypes.string).isRequired,
  onTipSelect: PropTypes.func.isRequired,
};
