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
    /**
     * 获取当前页面URI对象
     * @returns Object<url, params>
     */
    getCurrentPageURI() {
        const pages = wx.getCurrentPages();
        const page = pages[pages.length - 1];
        return {
            url: page.route,
            params: page.options,
        }
    }
}