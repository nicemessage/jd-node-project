import Vue from 'vue';

/* 千位符 */
Vue.filter('kilbit', (val: any) => {
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
});
/* 千位符 */
Vue.filter('chineseNum', (num: any) => {
    const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; // changeNum[0] = "零"
    const unit = ['', '十', '百', '千', '万'];
    num = parseInt(num, 0);
    const getWan = (temp: any) => {
        const strArr = temp
            .toString()
            .split('')
            .reverse();
        let newNum = '';
        for (let i = 0; i < strArr.length; i++) {
            newNum =
                (i === 0 && strArr[i] === 0
                    ? ''
                    : i > 0 && strArr[i] === 0 && strArr[i - 1] === 0
                    ? ''
                    : changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i])) + newNum;
        }
        return newNum;
    };
    const overWan = Math.floor(num / 10000);
    let noWan: any = num % 10000;
    if (noWan.toString().length < 4) noWan = `0${noWan}`;
    return overWan ? `${getWan(overWan)}万${getWan(noWan)}` : getWan(num);
});
