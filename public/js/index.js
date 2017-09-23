/*
 * Entry point for front end assets
 */

import React from 'react';
import {render} from 'react-dom';
import '../sass/styles.sass';

import URLForm from './components/URLForm';

render(<URLForm />, document.getElementById('form-container'));
