import isEqual from 'lodash.isequal'
const router = {
    _createPromiseResult(resolve, reject) {
        let result = false;
        return {
            success: function (res) {
                result = true;
                resolve(res);
            },
            fail: function () {
                result = false;
                // fail
                reject()
            },
            complete: function () {
                // complete
                result ? resolve() : reject()
            }
        }
    },
    go(url, param) {
        return new Promise((resolve, reject) => {
            const pages = getCurrentPages();
            let distance = 0;
            pages.some((page, id) => {
                if (url.indexOf(page.route) === 1 && isEqual(param, page.options)) {
                    distance = pages.length - id - 1;
                }
            })
            const paramEntries = Object.keys(param || {})
            if (paramEntries.length) url += `?${paramEntries.map(key => `${key}=${param[key]}`).join('&')}`
            if (distance > 0) {
                this.back(distance)
            } else {
                wx.navigateTo({
                    url,
                    ...this._createPromiseResult(resolve, reject)
                })
            }
        })
    },
    switch(url) {
        return new Promise((resolve, reject) => {
            url += `?${Object.keys(param).map(key => `${key}=${param[key]}`).join('&')}`
            wx.redirectTo({
                url,
                ...this._createPromiseResult(resolve, reject)
            })
        })
    },
    back(delta = 1) {
        return new Promise((resolve, reject) => {
            wx.navigateBack({
                delta,
                ...this._createPromiseResult(resolve, reject)
            })
        })
    },
    getPageUrl() {
        const pages = wx.getCurrentPages();
        return pages[pages.length - 1].route;
    }

}

export default function Router(configs, platform="wx") {
    const router = platform === "wx" ? router : router
    if (!configs || !configs.length) throw new Error('导航配置失败')
    this.configs = configs;
    return {
        go(routerName, param) {
            return new Promise(async (res, rej) => {
                const routerConfig = configs.find(it => {
                    return it.name === routerName;
                })
                if (!routerConfig) return;
                const { url, name, before } = routerConfig;
                typeof before === 'function' && await (before() !== false) && router.go(url, param).then(res).catch(rej)
            })

        },
        switch(name, param) {
            return new Promise(async (res, rej) => {
                const routerConfig = configs.find(it => {
                    return it.name === routerName;
                })
                if (!routerConfig) return;
                const { url, name, before } = routerConfig;
                typeof before === 'function' && await (before() !== false) && router.switch(url, param).then(res).catch(rej)
            })
        },
        redirectTo(routerName, param) {
            const routerConfig = configs.find(it => {
                return it.name === routerName;
            })
            if (!routerConfig) return;
            const { url, name } = routerConfig;
            return router.switch(url, param)
        },
        back(delta = 1) {
            router.back(delta);
        },
    }
}
