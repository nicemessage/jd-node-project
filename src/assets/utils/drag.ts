import Vue from 'vue';
import * as tools from './tools';
// let arr, childrenNode;
/* 拖拽命令 */
Vue.directive('drag', {
    bind: function(el, binding) {
        setTimeout(() => {
            el.onmousedown = function(e: any) {
                const elIndex: any = binding.value;
                let index: number | null;
                const tags: any = document.querySelectorAll('.tag-groups .item-tags');
                const tagsOffset: any[] = [];
                tags.forEach((item: any) => {
                    const t = item.getBoundingClientRect().top;
                    const r = item.getBoundingClientRect().left + item.offsetWidth;
                    const b = item.getBoundingClientRect().top + item.offsetHeight;
                    const l = item.getBoundingClientRect().left;
                    const data: any[] = [t, r, b, l];
                    tagsOffset.push(data);
                });
                const parentNode: any = document.querySelector('#app');
                const disY = el.getBoundingClientRect().top;
                const disX = el.getBoundingClientRect().left;
                const top = e.clientY - disY;
                const left = e.clientX - disX;
                const targetClone: any = el.cloneNode(true);
                const width: number = el.offsetWidth;
                targetClone.style.visibility = 'hidden';
                targetClone.style.width = `${width}px`;
                targetClone.style.position = 'absolute';
                targetClone.style.top = `${disY}px`;
                targetClone.style.left = `${disX}px`;
                parentNode.appendChild(targetClone);
                document.onmousemove = function(e) {
                    el.style.visibility = 'hidden';
                    targetClone.style.visibility = 'visible';
                    let y: any = e.clientY - top;
                    let x: any = e.clientX - left;
                    if (y < 0) {
                        y = 0;
                    }
                    if (y > window.innerHeight - targetClone.offsetHeight - 10) {
                        y = window.innerHeight - targetClone.offsetHeight - 10;
                    }
                    if (x < 0) {
                        x = 0;
                    }
                    if (x > window.innerWidth - targetClone.offsetWidth) {
                        x = window.innerWidth - targetClone.offsetWidth;
                    }
                    targetClone.style.top = `${y}px`;
                    targetClone.style.left = `${x}px`;
                    const t1 = targetClone.getBoundingClientRect().top;
                    const r1 = targetClone.getBoundingClientRect().left + targetClone.offsetWidth;
                    const b1 = targetClone.getBoundingClientRect().top + targetClone.offsetHeight;
                    const l1 = targetClone.getBoundingClientRect().left;
                    for (let i = 0; i < tagsOffset.length; i++) {
                        if (l1 < tagsOffset[i][1] && t1 < tagsOffset[i][2] && r1 > tagsOffset[i][3] && b1 > tagsOffset[i][0]) {
                            index = i;
                            tags.forEach((dom: any) => {
                                tools.removeClass(dom, 'border');
                            });
                            tools.addClass(tags[i], 'border');
                            return;
                        } else {
                            index = null;
                            tags.forEach((dom: any) => {
                                tools.removeClass(dom, 'border');
                            });
                        }
                    }
                };
                document.onmouseup = function() {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    parentNode.removeChild(targetClone);
                    el.style.visibility = 'visible';
                    Vue.prototype.$bus.$emit('bomb', elIndex, index);
                    tags.forEach((dom: any) => {
                        tools.removeClass(dom, 'border');
                    });
                };
            };
        }, 300);
    }
});
