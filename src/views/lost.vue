<template>
    <section class="lost">
        <img src="@/assets/img/404.png" alt="" v-if="type"/>
    </section>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class Lost extends Vue {
    get type(){
        if(this.$route.query.to){
            return false;
        } else {
            return true;
        }
    }
    private mounted() {
        if(!this.type){
            this.$alert('当前用户无访问页面权限，请联系管理员添加权限。', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    this.$router.push({
                        name: 'tag-market'
                    });
                }
            });
        }
        this.$message.close();
    }
}
</script>
<style lang="scss" scoped>
.lost {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .img {
        width: 80%;
    }
}
</style>
