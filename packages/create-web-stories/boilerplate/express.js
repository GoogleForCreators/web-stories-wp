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
const express = require('express');

const app = express();
const SOURCE_DIR = 'dist';
const PORT = process.env.PORT || 8080;

app.use(express.static(SOURCE_DIR));

app.get('/editor', (req, res) => {
  res.sendFile(__dirname + '/' + SOURCE_DIR + '/index.html');
});

app.get('/preview', (req, res) => {
  res.sendFile(__dirname + '/' + SOURCE_DIR + '/index.html');
});

app.listen(PORT, () => {
  console.log(`Web Server started at: http://localhost:${PORT}`);
});
