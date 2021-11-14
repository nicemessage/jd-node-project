<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<script lang="ts">
    /**
     * @name SvgIcon
     * @author jinxing16
     * @namespace
     * @description svg icon
     */
    import {
        Component,
        Vue,
        Prop
    } from 'vue-property-decorator';

    @Component
    export default class SvgIcon extends Vue {

        @Prop()
        private iconClass !: string;
        @Prop()
        private className !: string;

        get iconName() {
            return `#icon-${this.iconClass}`;
        }

        get svgClass() {
            if (this.className) {
                return `svg-icon ${this.className}`;
            } else {
                return 'svg-icon';
            }
        }

    }
</script>

<style scoped>
    .svg-icon {
        fill: currentColor;
        height: 1em;
        overflow: hidden;
        vertical-align: -0.15em;
        width: 1em;
    }
</style>


