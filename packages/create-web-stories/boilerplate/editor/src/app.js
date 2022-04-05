/**
 * External dependencies.
 */
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

/**
 * Internal dependencies.
 */
import Editor from "./components/story-editor";
import Preview from "./components/preview";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route exact path="/" element={<Editor />} />
          <Route path="preview" element={<Preview />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
