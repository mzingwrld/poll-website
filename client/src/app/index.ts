import { provider } from 'react-ioc';
import WebSocketService from '../core/services/websocket/WebSocketService';
import App from './App';

export default provider(
    WebSocketService,
)(App);
