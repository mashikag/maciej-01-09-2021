import { Remote } from 'comlink';
import { MutableRefObject } from 'react';
import { OrdersFeed } from 'resources/ordersFeed/types';

export type OrdersFeedHandle = MutableRefObject<Remote<OrdersFeed>>;
