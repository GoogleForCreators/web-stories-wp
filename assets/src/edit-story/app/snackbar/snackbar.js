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

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.primary};
  border-radius: 4px;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.black};
  max-width: 456px;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: baseline;
  padding: 0;
  margin-bottom: ${({ place }) =>
    place.indexOf('bottom') === 0 ? '0.5em' : 0};
  margin-top: ${({ place }) => (place.indexOf('top') === 0 ? '0.5em' : 0)};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.lineHeight};
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
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.size};
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body2.lineHeight};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.tertiary};
  outline: none;
  border: 0;
  cursor: pointer;
  padding: 16px;
  text-transform: capitalize;
`;

const Snackbar = ({ notification, place }) => (
  <Container place={place}>
    <Main place={place}>
      <Content>
        {notification.message}
        {notification.list && notification.list.length > 0 && (
          <List>
            {notification.list.map((item) => (
              <ListItem key={item}>{item}</ListItem>
            ))}
          </List>
        )}
      </Content>
      {notification.buttonCallback && (
        <ActionButton onClick={notification.buttonCallback}>
          {notification.buttonlabel}
        </ActionButton>
      )}
    </Main>
  </Container>
);

Snackbar.propTypes = {
  notification: PropTypes.object,
  place: PropTypes.string,
};

Snackbar.defaultProps = {
  place: 'bottom-left',
};

export default Snackbar;
