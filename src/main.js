import utils from './utils';
import wxCris from './cris/wx'
import h5Cris from './cris/h5'
/**
 * 通用路由
 * @param {*} cris 通用路由操作接口
 * @param {*} configs 路由配置表
 */
export default function Router(configs) {
    if (!configs || !configs.length) throw new Error('导航配置失败');
    const cris = utils.isWxApplet() ? wxCris : h5Cris;
    return {
        go(routerName, param) {
            return new Promise(async (res, rej) => {
                const routerConfig = configs.find(it => {
                    return it.name === routerName;
                })
                if (!routerConfig) return;
                const { url, name, before } = routerConfig;
                typeof before === 'function' && await (before() !== false) && cris.go(url, param).then(res).catch(rej)
            })

        },
        switch(name, param) {
            return new Promise(async (res, rej) => {
                const routerConfig = configs.find(it => {
                    return it.name === routerName;
                })
                if (!routerConfig) return;
                const { url, name, before } = routerConfig;
                typeof before === 'function' && await (before() !== false) && cris.switch(url, param).then(res).catch(rej)
            })
        },
        redirectTo(routerName, param) {
            const routerConfig = configs.find(it => {
                return it.name === routerName;
            })
            if (!routerConfig) return;
            const { url, name } = routerConfig;
            return cris.switch(url, param)
        },
        back(delta = 1) {
            cris.back(delta);
        },
        getCurrentRoute(){
            const { url, param } = cris.getCurrentPageURI();
            return configs.find(route=>route.url===url) || {};
        },
        isIn(name){
            return name === this.getCurrentRoute().name;
        }
    }
}
