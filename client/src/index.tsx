import React from 'react';
import { render } from 'react-dom';
import App from './app';
import './index.css';
import 'materialize-css';

const container: HTMLElement | null = document.getElementById('root');

if (!container) {
    // eslint-disable-next-line no-console
    console.error('can`t find root div');
}

render(
    <App />,
    container,
);
