import isEqual from 'lodash.isequal'
export default {
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
    /**
     * 该方法在微信端实现了重复路径回退，不新开activity
     * 另外需要实现路由10层内的管理
     * @param {*} url 页面地址
     * @param {*} param 页面参数
     */
    go(url, param ={}) {
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
    switch(url, param = {}) {
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
    /**
     * 获取当前页面URI对象
     * @returns Object<url, params>
     */
    getCurrentPageURI() {
        const pages = getCurrentPages();
        const page = pages[pages.length - 1];
        return {
            url: `/${page.route}`,
            params: page.options,
        }
    }
}