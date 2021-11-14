import { Component, Vue } from 'vue-property-decorator';
@Component
export class PageMixin extends Vue {
    public pageNo: number = 1;
    public pageSize: number = 10;
    public total: number = 0;
    public hideOnPage: boolean = true;
    public pageCount: number = 1;
    public pageSizeList: Array<number> = [10, 20, 50, 100];
}
