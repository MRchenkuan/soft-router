import Router from '../dist/bundle';
import module from './module';

export default new Router(module.map(route => {
    const routeConfig = { ...route };
    return {
        ...route,
        before: async () => {
            if (!await routeConfig.before()) return false;
            if (routeConfig.authorize) {
                this.go('loginPage');
            }
            return true;
        }
    }
}))
