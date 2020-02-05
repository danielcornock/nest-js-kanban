import * as routesConfig from './routes.config';

export const storyRouteProviders = () => {
  return buildAllRoutes(
    generateFullRoute(routesConfig.boardNested, routesConfig.columnNested, routesConfig.story),
    generateFullRoute(routesConfig.boardNested, routesConfig.story),
    routesConfig.story
  );
};

const generateFullRoute = (...args) => {
  return args.reduce((accum: string, next: string) => {
    return accum + next;
  }, '');
};

const buildAllRoutes = (...args) => {
  return args.reduce((accum: string, next: string, index: number) => {
    return accum + next + (index < args.length - 1 ? '|' : '');
  }, '');
};

export const routes = routesConfig;
