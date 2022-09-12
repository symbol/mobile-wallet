import { Router } from '@src/Router';

export const createGoBack = componentId => () => Router.goBack(componentId);
