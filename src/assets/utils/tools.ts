export const getUrl = (name: string) => {
    const reg = new RegExp(`(^|[&?]{1})${name}=([^&]*)(|$)`, 'i');
    const j = window.location.href;
    let r = null;
    if (j.split('?')[1]) {
        r = j.split('?')[1].match(reg);
    }
    if (r != null) return decodeURIComponent(r[2]).replace(/[~'!<>]/g, '');
    return null;
};
export const debounce = function(func: any, wait: number, immediate?: any, ...args: any) {
    let timeout: any = undefined;
    return function() {
        const later = function() {
            timeout = undefined;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
};

export const addClass = (element: any, className: string) => {
    if (!element) {
        return;
    }
    let arr = [];
    if (Array.isArray(element) || element.length !== undefined) {
        arr = Array.prototype.slice.call(element);
    } else {
        arr = [element];
    }
    arr.forEach(x => {
        x.classList.add(...className.split(' '));
    });
};

export const removeClass = (element: any, className: string) => {
    if (!element) {
        return;
    }
    let arr = [];
    if (Array.isArray(element) || element.length !== undefined) {
        arr = Array.prototype.slice.call(element);
    } else {
        arr = [element];
    }
    if (className) {
        arr.forEach(x => {
            x.classList.remove(...className.split(' '));
        });
    } else {
        arr.forEach(x => {
            x.classList = [];
        });
    }
};
// 时间格式
export const formatDate = (date: any, fmt?: any) => {
    if (typeof date === 'string' || typeof date === 'number') {
        const userAgent = window.navigator.userAgent;
        if (
            (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) ||
            userAgent.indexOf('MSIE') !== -1 ||
            userAgent.indexOf('Edge') !== -1 ||
            userAgent.indexOf('Trident') !== -1
        ) {
            if ((date as string).indexOf('T') !== -1) {
                const arr = (date as string).split('T');
                const day = arr[0];
                const timeArr = arr[1].split('.000');
                const time = timeArr[0];
                const result = `${day} ${time}`;
                date = new Date(result.replace(/-/g, '/'));
            } else {
                date = new Date((date as string).replace(/-/g, '/'));
            }
        } else {
            if (typeof date === 'number' && date.toString().length == 10) {
                date = new Date(parseInt(String(date)) * 1000);
            } else {
                date = new Date(date);
            }
            date = new Date(date);
        }
    }
    if (!fmt) fmt = 'yyyy-MM-dd hh:mm:ss';

    if (!date || date == null) return null;
    const o: any = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
        }
    }
    return fmt;
};
export const getArrayObjDb = (arr: any[], key1: string, val1: any, key2: string, val2: any) => {
    const json: any = {};
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key1] == val1 && arr[i][key2] == val2) {
            json.val = arr[i];
            json.index = i;
            return json;
        }
    }
    return false;
};
// 获取数组内指定值的对象
export const getArrayObj = (arr: any[], key: string, val: any) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] && arr[i][key] == val) {
            return arr[i];
        }
    }
    return false;
};
// 千分位
export const kilbit = (val: any) => {
    if (val) {
        if (val === '--') {
            return val;
        }
        if (typeof val === 'number') {
            val = val.toString();
        }
        if (val.length > 3) {
            return val.replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,');
        } else {
            return val;
        }
    } else {
        return '0';
    }
};
