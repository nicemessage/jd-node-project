<template>
    <section class="welcome">
        <div class="test">
            欢迎访问统一画像平台
        </div>
    </section>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Welcome extends Vue {}
</script>

<style scoped lang="scss">
    .welcome{
        width: 100%;
        height: 100%;
        position: relative;

        .test{
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
        }
    }
</style>
