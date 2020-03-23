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
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { __experimentalCreateInterpolateElement as createInterpolateElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useConfig } from '../config';

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v0};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.fg.v1};
  max-width: 456px;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: baseline;
  padding: 0;
  margin-bottom: ${({ position }) =>
    position.indexOf('bottom') === 0 ? '0.5em' : 0};
  margin-top: ${({ position }) =>
    position.indexOf('top') === 0 ? '0.5em' : 0};
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  flex-direction: row;
`;

const Content = styled.div`
  padding: 16px;
  flex-grow: 1;
`;

const List = styled.ul`
  list-style: disc;
  margin-left: 20px;
  font-weight: bold;
  margin-bottom: 0;
`;

const ListItem = styled.li``;

const ActionButton = styled.button`
  background: transparent;
  display: flex;
  justify-content: center;
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  color: ${({ theme }) => theme.colors.action};
  outline: none;
  border: 0;
  cursor: pointer;
  padding: 16px;
  text-transform: capitalize;
`;

function Snackbar({ notification, position }) {
  const {
    allowedMimeTypes: {
      image: allowedImageMimeTypes,
      video: allowedVideoMimeTypes,
    },
  } = useConfig();
  const allowedMimeTypes = [...allowedImageMimeTypes, ...allowedVideoMimeTypes];

  const notificationMessage = () => {
    if (notification.type === 'error') {
      if (notification.data === 'ValidError') {
        return (
          <Content>
            {createInterpolateElement(
              sprintf(
                __('Please choose only <b>%s</b> to upload.', 'web-stories'),
                allowedMimeTypes.join(', ')
              ),
              {
                b: <b />,
              }
            )}
          </Content>
        );
      } else if (notification.multiple) {
        return (
          <Content>
            {createInterpolateElement(
              sprintf(
                __(
                  'Please choose only <b>%s</b> to upload.  The following file failed to uploaded:',
                  'web-stories'
                ),
                allowedMimeTypes.join(', ')
              ),
              {
                b: <b />,
              }
            )}
            <List>
              {notification.data.map((item) => (
                <ListItem key={item}>{item}</ListItem>
              ))}
            </List>
          </Content>
        );
      }
      return <Content>{notification.message}</Content>;
    }
    return <Content>{notification.message}</Content>;
  };
  return (
    <Container positon={position}>
      <Main position={position}>
        {notificationMessage()}
        {notification.retryAction && (
          <ActionButton onClick={notification.retryAction}>
            {__('Retry', 'web-stories')}
          </ActionButton>
        )}
      </Main>
    </Container>
  );
}

Snackbar.propTypes = {
  notification: PropTypes.object,
  position: PropTypes.string,
};

Snackbar.defaultProps = {
  position: 'bottom',
};

export default Snackbar;
