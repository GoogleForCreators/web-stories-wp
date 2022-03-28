/*
 * Copyright 2022 Google LLC
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
import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/**
 * Internal dependencies
 */
import StoryDashboard from './dashboard';
import Editor from './story-editor';
import Preview from './components/preview';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route exact path="/" element={<StoryDashboard />} />
            <Route path="editor" element={<Editor />} />
            <Route path="preview" element={<Preview />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default hot(module)(App);
