<template>
    <section class="lost">
        <img src="@/assets/img/welcome.png" alt="" />
    </section>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class Lost extends Vue {}
</script>
<style lang="scss" scoped>
.lost {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
        width: 80%;
    }
}
</style>
