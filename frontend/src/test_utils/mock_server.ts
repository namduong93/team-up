import { setupServer } from 'msw/node';
import { handlers } from './mock_handlers';

export const server = setupServer(...handlers);
