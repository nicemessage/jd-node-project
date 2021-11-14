<template>
    <div class="tag-list">
        <template v-if="showType == 'item'">
            <el-row :gutter="20">
                <el-col :md="24" :lg="12" :xl="8" v-for="item of tagList" :key="`tag-item-${item.id}`">
                    <TagItemComp  :data="item"></TagItemComp>
                </el-col>
            </el-row>
        </template>
        <template v-else-if="showType == 'table'">
            <el-table :data="tagList" size="small" style="width: 100%"
                      :header-cell-style="{ fontWeight: 'bold', color: '#000' }"
                      border>
                <el-table-column prop="tagName" label="标签名称" min-width="160"></el-table-column>
                <el-table-column prop="tagCode" label="标签编码" min-width="120"></el-table-column>
                <el-table-column prop="" label="标签状态" width="80">
                    <template slot-scope="scope">
                        {{grantStateMap[scope.row.grantState]}}
                    </template>
                </el-table-column>
                <el-table-column label="数据更新" min-width="100">
                    <template slot-scope="scope">
                        {{tagClassifyMap[scope.row.tagClassify]}}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="标签类型" min-width="100">
                    <template slot-scope="scope">
                        {{tagDataTypeMap[scope.row.tagDataType]}}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="覆盖人数" min-width="90">
                    <template slot-scope="scope">
                        {{ scope.row.coverNum === null ? '' : scope.row.coverNum.toLocaleString() }}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="群体引用数" min-width="90">
                    <template slot-scope="scope">
                        {{ scope.row.referNum === null ? '' : scope.row.referNum.toLocaleString() }}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="浏览数量" min-width="90">
                    <template slot-scope="scope">
                        {{ scope.row.browseNum === null ? '' : scope.row.browseNum.toLocaleString() }}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="更新日期" min-width="100">
                    <template slot-scope="scope">
                        {{ scope.row.dataDt ? formatDate(parseInt(scope.row.dataDt + '000'),'YYYY-MM-DD') : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="120" fixed="right">
                    <template slot-scope="scope">
                        <template v-if="scope.row.grantState == 1">
                            <span class="span-a" v-if="tagListAddType(scope.row)">已添加</span>
                            <a v-else @click="addToShopCar(scope.row)">添加</a>
                        </template>
                        <template v-else>
                            <a v-if="scope.row.grantState != 2" @click="showApplyDialog(scope.row.tagCode)">申请</a>
                            <span v-if="scope.row.grantState == 2" style="color: #aaa;cursor: not-allowed;padding-right: 15px;">申请</span>
                        </template>
                        <a @click="checkTagInfo(scope.row)">详情</a>
                    </template>
                </el-table-column>
            </el-table>
        </template>

        <el-dialog :close-on-click-modal="false" :visible.sync="applyDialogVisible" width="30%">
            <div slot="title" class="dialog-title">提出申请</div>
            <div style="padding: 15px;"><el-input type="textarea" :rows="4" :placeholder="reasonPlaceHold" v-model="applyReasion"></el-input></div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="applyDialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="apply">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Component, Vue, Prop } from 'vue-property-decorator';
    import { State } from 'vuex-class';
    import TagItemComp from './TagItem.vue';
    // import Template from '@/Template.vue';
    import moment from 'moment';

    interface Tag {
        id: number; // 主键ID
        tagCode: string; // 标签编码
        tagName: string; // 标签名称
        subjectId: number; // 主体ID
        grantState: number; // 授权状态
        tagDataType: number; // 标签数据类型
        tagClassify: number; // 标签类型
        tagLogicDesc: string; //标签逻辑描述
        tagSecLevel: number; // 标签安全级
        tagStatus: number; // 标签状态
        tagDesc: string; //标签描述
        modifiedTime: string; // 修改时间
        createdTime: string; // 创建时间
        coverNum: number; // 覆盖数
        browseNum: number; // 浏览数
        referNum: number; // 群体引用
        [propName: string]: any;
    }

    interface Apply {
        subjectId: number;
        tagCode: string;
        reason: string;
    }

    interface Subject {
        id: number;
        subjectCn: string;
        subjectEn: string;
        subjectDesc: string;
        subjectSort: number;
    }

    @Component({
        components: {
            TagItemComp
        }
    })
    export default class TagList extends Vue {
        @State(state => state.curSubject) curSubject!: Subject | null;

        @Prop({
            require: true
        })
        private showType!: string;

        @Prop({
            require: true
        })
        private tagList!: Array<Tag>;


        private grantStateMap: object = {
            0: '未授权',
            1: '已授权',
            2: '审批中',
            3: '已驳回'
        };
        private tagClassifyMap: object = {
            1: '离线更新',
            2: '离线更新',
            3: '实时更新'
        };
        private tagDataTypeMap: object = {
            1: '事实及统计类',
            2: '挖掘预测类'
        };

        private applyDialogVisible: boole = false;
        private reasonPlaceHold: string = '请填写使用说明，确认后将进入审批流程';
        private applyReasion: string = '';
        private applyTagCode: string | null = null;

        private tagListAddType (data:any) {
            const tagList:[] = this.$bus.$emit('addType');
            // 已添加检查
            const idx = tagList.findIndex((tag: Tag) => {
                return data.tagCode == tag.tagCode;
            });
            if (idx >= 0) {
                return true;
            }
            return false;
        }

        private formatDate(dateStr: string, formatStr?: string) {
            return moment(dateStr).format(formatStr ? formatStr : 'YYYY-MM-DD HH:mm:ss');
        }

        private addToShopCar(tag: Tag) {
            // console.log(tag);
            this.$bus.$emit('addTagToShopCar', tag);
        }

        private showApplyDialog(tagCode: string) {
            this.applyReasion = '';
            this.applyTagCode = tagCode;
            this.applyDialogVisible = true;
        }

        private apply() {

            if (!this.applyTagCode) {
                this.$message.error('未检查到标签信息');
                return;
            }
            if (!this.applyReasion || this.applyReasion == '') {
                this.$message.warning('未填写任何说明');
                return;
            }
            if (!this.curSubject) {
                this.$message.warning('缺失主体信息');
                return;
            }
            const applyInfo: Apply = {
                subjectId: this.curSubject.id,
                tagCode: this.applyTagCode,
                reason: this.applyReasion
            };
            this.addGrant(applyInfo)
                .then(() => {
                    this.$bus.$emit('applyTagGrant');
                    this.$message.success('申请已提交');
                    this.applyDialogVisible = false;
                })
                .catch(err => {
                    console.log(err);
                });
        }

        private checkTagInfo(tag:Tag){
            this.$bus.$emit('checkTagInfo',tag.id);
        }


        // ========== ajax request  ==========

        private addGrant(info: Apply) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/userGrantTag/add';
                const data = info;
                this.$api
                    .post(url, data)
                    .then((res: any) => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }
    }
</script>

<style scoped lang="scss">
    a {
        padding: 0 15px 0 0;
    }
    .span-a{
        padding: 0 15px 0 0;
        color: #888;
        cursor: not-allowed;
    }
    .info{
        color: #999
    }
</style>
