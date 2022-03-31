/**
 * External dependencies.
 */
import React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/**
 * Internal dependencies.
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
              <Route path="editor" element={<Editor />}/>
            <Route path="preview" element={<Preview />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }
}

export default hot(module)(App);
