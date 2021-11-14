<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Item from '@/components/PortraitItem.vue';

@Component({
    extends: Item
})
export default class PortraitItem extends Vue {}
</script>

<style lang="scss" scoped>
.portrait-item {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 4px;

    .header {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        padding: 0px 8px;

        .label {
            font-size: 1rem;
            color: rgba(51, 51, 51, 1);
            font-weight: bold;
            cursor: default;
            padding-left: 10px;
            .no-crowd {
                font-size: 0.75em;
                color: #bdbdbd;
                margin-left: 5px;
            }
        }
        .actions {
            display: flex;
            align-items: center;
            .chart-type-select {
                width: 120px;
                cursor: pointer;
            }
            .chart-action {
                margin-left: 10px;
                cursor: pointer;
            }
        }
    }
    .content {
        width: 100%;
        height: calc(100% - 60px);
        .no-data {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
