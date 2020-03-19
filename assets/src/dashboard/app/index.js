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
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme, { GlobalStyle } from '../theme';
import KeyboardOnlyOutline from '../utils/keyboardOnlyOutline';
import { NavigationBar } from '../components';
import { Route, RouterProvider } from './router';
import { MyStoriesView, TemplatesGalleryView, MyBookmarksView } from './views';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider>
        <GlobalStyle />
        <KeyboardOnlyOutline />
        <NavigationBar />
        <Route exact path="/" component={<MyStoriesView />} />
        <Route path="/templates-gallery" component={<TemplatesGalleryView />} />
        <Route path="/my-bookmarks" component={<MyBookmarksView />} />
      </RouterProvider>
    </ThemeProvider>
  );
}

export default App;
