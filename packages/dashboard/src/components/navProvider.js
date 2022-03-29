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
import {
  useCallback,
  useMemo,
  useState,
  createContext,
  useContextSelector,
  identity,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';

export const NavContext = createContext({ actions: {}, state: {} });

export function useNavContext(selector = identity) {
  return useContextSelector(NavContext, selector);
}

export default function NavProvider({ children }) {
  const [sideBarVisible, setSideBarVisible] = useState(false);

  const toggleSideBar = useCallback(() => {
    setSideBarVisible(!sideBarVisible);
  }, [sideBarVisible]);

  const value = useMemo(
    () => ({
      actions: { toggleSideBar },
      state: { sideBarVisible },
    }),
    [sideBarVisible, toggleSideBar]
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

NavProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
