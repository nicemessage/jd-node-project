import Vue from 'vue';
import SvgIcon from "@/components/SvgIcon.vue"; // svg组件

// 注册到全局
Vue.component('svg-icon', SvgIcon);

const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);
const req = (require as any).context('@/assets/svg', true, /\.svg$/);
requireAll(req);
