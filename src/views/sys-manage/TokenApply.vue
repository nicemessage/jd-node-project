<template>
    <div class="token-apply">
        <div class="header">
            <div class="search-tool">
                <div class="search-item">
                    <SysSubject></SysSubject>
                </div>
                <div class="spacer"></div>
                <div class="search-item col300">
                    <el-input v-model="searchWord" size="small" clearable placeholder="请输入系统中文名称/系统ID"
                              @change="getTokenList">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="getTokenList"></i>
                    </el-input>
                </div>
                <div class="search-item">
                    <el-button size="small" type="primary" @click="applyNew" class="el-icon-plus"> 新增对接系统</el-button>
                </div>
            </div>
        </div>
        <div class="body">
            <div class="token-list">
                <el-table :data="tokenList" size="small" border :header-cell-style="{ fontWeight: 'bold', color: '#000' }"
                          style="width:auto;min-width:100%">
                    <el-table-column prop="sysName" label="系统中文名称" min-width="150px">
                        <template slot-scope="scope">
                            <a v-if="scope.row.state == 1" @click="showDetail(scope.row)">{{scope.row.sysName}}</a>
                            <span v-else>{{scope.row.sysName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sysCode" label="系统英文名称" min-width="150px"></el-table-column>
                    <el-table-column prop="token" label="系统ID（token）" min-width="180px"></el-table-column>
                    <el-table-column prop="sysManager" label="系统管理员" min-width="100px"></el-table-column>
                    <el-table-column label="状态" min-width="80px">
                        <template slot-scope="scope">
                            <span v-if="scope.row.state == 1">已授权</span>
                            <span v-else-if="scope.row.state == 2">审批中</span>
                            <span v-else-if="scope.row.state == 3">已驳回</span>
                            <span v-else></span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="180px">
                        <template slot="header">
                            <div>创建时间</div>
                            <div>修改时间</div>
                        </template>
                        <template slot-scope="scope">
                            <div>{{ formatDate(scope.row.createdTime) }}</div>
                            <div>{{ formatDate(scope.row.modifiedTime) }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="170px" fixed="right">
                        <template slot-scope="scope">
                            <a v-if="scope.row.state == 1" @click="showEdit(scope.row)">修改</a>
                            <a v-if="scope.row.state == 1 || scope.row.state == 3" @click="showDel(scope.row)">删除</a>
                            <a v-if="scope.row.state == 1" @click="showTagAuth(scope.row)">权限标签</a>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="paginationa">
                <el-pagination
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        :page-size.sync="pageSize"
                        :current-page.sync="pageNo"
                        :page-sizes="pageSizeList"
                >
                </el-pagination>
            </div>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="showAddTokenDialog" width="500px">
            <div slot="title" class="dialog-title">{{ newToken.id === null ? '新增系统' : '修改系统' }}</div>
            <div v-if="showAddTokenDialog" style="padding: 30px;">
                <el-form :model="newToken" :rules="addNewRules" ref="addNewToken" label-width="120px"
                         class="add-form-style">
                    <el-form-item label="系统英文名称" prop="sysCode">
                        <el-input v-model="newToken.sysCode" @input="changeSysCode(newToken.sysCode)"></el-input>
                    </el-form-item>
                    <el-form-item label="系统中文名称" prop="sysName">
                        <el-input v-model="newToken.sysName"></el-input>
                    </el-form-item>
                    <el-form-item label="系统负责人" prop="sysManagerList">
                        <SearchErp :value.sync="newToken.sysManagerList" multiple></SearchErp>
                    </el-form-item>
                    <el-form-item label="系统描述" prop="sysDesc">
                        <el-input type="textarea" v-model="newToken.sysDesc" :autosize="{ minRows: 4 }"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="showAddTokenDialog = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="submitAdd">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showDelTokenDialog">
            <div slot="title" class="dialog-title">删除系统</div>
            <span>确认删除该系统？</span>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showDelTokenDialog = false">取 消</el-button>
                <el-button size="small" type="danger" @click="delTokenItem">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="showDetailTokenDialog" width="800px">
            <div slot="title" class="dialog-title">查看详情</div>
            <div style="padding: 30px; overflow: auto;max-height: 500px;">
                <div class="token-detail-title" v-if="showDetailTokenDialog">系统信息</div>
                <el-form :model="viewToken" label-width="150px">
                    <el-form-item label="系统英文名称" prop="sysCode">
                        <el-input v-model="viewToken.sysCode" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="系统中文名称" prop="sysName">
                        <el-input v-model="viewToken.sysName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="系统负责人" prop="sysManager">
                        <el-input v-model="viewToken.sysManager" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="系统描述" prop="sysDesc">
                        <el-input type="textarea" v-model="viewToken.sysDesc" :autosize="{ minRows: 4 }"
                                  disabled></el-input>
                    </el-form-item>
                </el-form>
                <div class="token-detail-title">权限标签</div>
                <el-table :data="viewToken.authList" size="small" style="width: 100%">
                    <el-table-column prop="tagName" label="标签名称" width="120"></el-table-column>
                    <el-table-column prop="tagCode" label="标签编码" min-width="180"></el-table-column>
                    <el-table-column label="申请时间" min-width="150">
                        <template slot-scope="scope">
                            {{ formatDate(scope.row.createdTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" min-width="120">
                        <template slot-scope="scope">
                            <div v-if="scope.row.state == 1">已授权</div>
                            <div v-if="scope.row.state == 2">审批中</div>
                            <div v-if="scope.row.state == 3">已驳回</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

        </el-dialog>
        <el-dialog :close-on-click-modal="false" :before-close="beforeClose" :visible.sync="showTagAuthDialog" width="1000px">
            <div slot="title" class="dialog-title">
                修改权限
                <el-input v-model="tagName" placeholder="请输入标签名称/标签编码/标签描述" @keyup.enter.native="tagQuery" clearable size="mini" style="width: 260px;margin-left: 20px;margin-right: 10px;">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button size="mini" type="primary" @click="tagQuery">搜索</el-button>
            </div>
            <div class="tag-auth-container" v-if="showTagAuthDialog">
                <div class="tag-category tag-auth-container-item">
                    <div class="tag-auth-container-item-header">标签分类
                        <el-input prefix-icon="el-icon-search" placeholder="输入关键字" size="mini" v-model="filterText"
                                  style="width: 160px;margin-left: 10px;"></el-input>
                    </div>
                    <div class="tag-auth-container-item-body">
                        <el-tree ref="tag-tree" :filter-node-method="filterNode" :props="tagCategoryProp"
                                 :load="loadTagCategory" lazy @node-click="handleTagCategoryClick"></el-tree>
                    </div>
                </div>
                <div class="tag-list  tag-auth-container-item" v-loading="loading1">
                    <div class="tag-auth-container-item-header">
                        标签名称
                        <span v-show="tagList.length > 0">
                            <el-checkbox v-model="tagCheckAll" @change="handleCheckAllTagChange">全选</el-checkbox>
                        </span>
                    </div>
                    <div class="tag-auth-container-item-body">
                        <el-checkbox-group v-model="selectTagCodes">
                            <div class="tag-item" v-for="tag of tagList" :key="tag.id">
                                <el-checkbox :label="tag.tagCode" @change="handleCheckTagChange(tag)">
                                    {{ tag.tagName }}
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>
                </div>
                <div class="tag-selected  tag-auth-container-item item-w">
                    <div class="tag-auth-container-item-header">已选条件</div>
                    <div class="tag-auth-container-item-body">
                        <div class="tag-select-item" v-for="item of selectTags.values()" :key="item.tagCode">
                            {{ item.tagName }}
                            <i class="el-icon-close" @click="removeTag(item.tagCode)"></i>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
<!--                <el-button size="medium" @click="beforeClose">取消</el-button>-->
                <el-button size="medium" type="primary" @click="saveAuthTag">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    /**
     * @name TokenApply
     * @author tokenApply
     * @namespace
     * @property
     * @param
     * @computed
     * @function
     * @description 组件书写模板
     */
    import { Component, Mixins, Watch } from 'vue-property-decorator';
    import { State } from 'vuex-class';

    // mixin引入
    import { PageMixin } from '@/mixins/pageMixin';

    // 第三方库引入
    import moment from 'moment';

    // 静态配置引入

    // 公共组件引入
    import SysSubject from '@/components/SysSubject.vue';
    import SearchErp from '@/components/SearchErp.vue';

    // 公共类引入

    // 私有组件引入

    // 私有类引入

    // 本地定义和声明
    interface NewToken {
        sysCode: string | null;
        sysName: string | null;
        sysDesc: string | null;
        id: string | null;

        [propName: string]: any;
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
            SysSubject,
            SearchErp
        }
    })
    export default class TokenApply extends Mixins(PageMixin) {
        @State(state => state.curSubject) curSubject!: Subject | null;

        private searchWord: string = '';

        private tokenList: any[] = [];
        private loading1: boolean = false;

        private filterText: string = '';

        @Watch('filterText')
        private filterTextChange(val: string) {
            this.$refs['tag-tree'].filter(val);
        }

        private showAddTokenDialog: boolean = false;
        private showDelTokenDialog: boolean = false;
        private showDetailTokenDialog: boolean = false;
        private showTagAuthDialog: boolean = false;

        @Watch('pageSize')
        private pageSizeChange() {
            this.init();
        }

        @Watch('pageNo')
        private pageNoChange() {
            this.init();
        }

        private checkSysCode: any = (str: string) => {
            const patter: any = /[^A-Za-z0-9|_|-|.]+$/;
            return !patter.test(str);
        };

        private changeSysCode(val: string) {
            const regx:string = /[^A-Za-z0-9|_|-|.]+$/;
            const str:string = val.split("");
            let newStr:string = "";
            for(let i = 0;i<str.length;i++){
                if(!regx.test(str[i])){
                    newStr += str[i];
                }
            }
            this.newToken.sysCode = newStr;
        }

        // 标签查询
        private tagName: any | null = null;
        private tagQuery() {
            // this.$refs.ES.tagNameQuery(this.tagName);
            if (!this.tagName) {
                this.tagList = [];
                return;
            }
            const data:any = {
                subjectId: this.curSubject?.id,
                isEnumType: 1,
                keyword: this.tagName,
                token: this.newToken.token
            };
            this.loading1 = true;
            this.$api
                .post('/api/ava/tag/getTagsByParams', data)
                .then(res => {
                    this.loading1 = false;
                    this.tagList = [];
                    res.forEach((tag: any) => {
                        if(tag.tagGranted != 1){
                            this.tagList.push(tag);
                        }
                    });
                })
                .catch(err => {
                    this.loading1 = false;
                    this.tagList = [];
                });
        }
        private beforeClose() {
            this.tagName = '';
            this.showTagAuthDialog = false;
        }

        private checkSysName: any = (str: string) => {
            // const specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'";
            const specialKey = '[`~!#$^&*=|{}\':;\'\\[\\]<>/?~！#￥……&*——|{}【】‘；：”“\'。，、？]‘\'';
            for (let i = 0; i < str.length; i++) {
                if (specialKey.indexOf(str.substr(i, 1)) != -1) {
                    return false;
                }
            }
            return true;
        };
        private validatecheckSysCodeInput: any = (rule: any, value: any, callback: any) => {
            if (!this.checkSysCode(value)) {
                callback(new Error('不能含有特殊字符！！'));
            } else {
                callback();
            }
        };

        private validateSysNameInput: any = (rule: any, value: any, callback: any) => {
            if (!this.checkSysName(value)) {
                callback(new Error('不能含有特殊字符！！'));
            } else {
                callback();
            }
        };

        private filterNode(value, data) {
            if (!value) return true;
            return data.tagCateName.indexOf(value) !== -1;
        }

        private addNewRules: object = {
            sysCode: [
                { required: true, message: '请填写系统英文名称', trigger: 'blur' },
                { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' },
                { validator: this.validatecheckSysCodeInput, message: '只支持英文字符、\'.\'、\'-\'和\'_\'', trigger: 'blur' }
            ],
            sysName: [
                { required: true, message: '请填写系统中文名称', trigger: 'blur' },
                { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
                { validator: this.validateSysNameInput, message: '包含不支持的特殊字符', ttrigger: 'blur' }
            ],
            sysManagerList: [{ required: true, message: '请填写系统管理员', trigger: 'change' }],
            sysDesc: [
                { required: true, message: '请填写系统描述', trigger: 'blur' },
                { min: 3, max: 200, message: '长度在 3 到 200 个字符', trigger: 'blur' }
            ]
        };

        private newToken: NewToken = {
            sysCode: '',
            sysName: '',
            sysManagerList: [],
            sysDesc: '',
            id: null
        };
        private viewToken: NewToken = {
            sysCode: null,
            sysName: null,
            sysManager: null,
            sysDesc: null,
            id: null
        };

        private delItem: any = null;
        private detailItem: any = null;

        private tagCategoryProp: object = {
            label: 'tagCateName',
            children: 'children',
            isLeaf: this.isLeaf
        };
        private tagList: any[] = [];
        private selectTagCategory: string | null = null;
        private selectTagCodes: any[] = [];
        private tagCheckAll: boolean = false;
        private selectTags: any = new Map();

        private mounted() {
            this.init();
        }

        private init() {
            if (!this.curSubject) {
                return setTimeout(this.init, 500);
            }

            this.delItem = null;
            this.detailItem = null;

            this.getTokenList();
        }

        private getTokenList() {
            this.$bus.$emit('main-loading', true);
            this.queryList(this.searchWord ? this.searchWord : undefined).then((res: any) => {
                this.$bus.$emit('main-loading', false);
                this.tokenList = res.list.slice(0);
                this.total = res.total;
            }).catch(err => {
                this.$bus.$emit('main-loading', false);
            });
        }

        private applyNew() {
            this.newToken = {
                sysCode: '',
                sysName: '',
                sysManager: null,
                sysManagerList: [],
                sysDesc: '',
                id: null
            };
            this.showAddTokenDialog = true;
            this.$nextTick(() => {
                this.$refs['addNewToken'] && (this.$refs['addNewToken'] as any).clearValidate();
            });
        }

        private formatDate(dateStr: string) {
            return moment(dateStr).format('YYYY-MM-DD HH:mm:ss');
        }

        private showDel(item: any) {
            this.delItem = item;
            // console.log(this.delItem);
            // this.showDelTokenDialog = true;
            this.$confirm(`确认删除【${this.delItem.sysName}】系统？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delTokenItem();
            });
        }

        private delTokenItem() {
            if (!this.delItem) {
                this.showDelTokenDialog = false;
                return;
            }
            this.del(this.delItem.id)
                .then(() => {
                    this.$message.success('token删除成功');
                    this.showDelTokenDialog = false;
                    this.init();
                })
                .catch(() => {
                    // do no-thing
                });
        }

        private async showDetail(item: any) {
            try {
                const viewData = await this.detail(item.id);
                const authData = await this.queryAuthList(item.token);
                Object.assign(this.viewToken, viewData, {
                    authList: authData
                });
                this.showDetailTokenDialog = true;
            } catch (err) {
                console.log(err);
            }
        }

        private showEdit(item: any) {
            Object.assign(this.newToken, item);
            this.newToken.sysManagerList = this.newToken.sysManager.split(',');
            this.showAddTokenDialog = true;
            this.$nextTick(() => {
                this.$refs['addNewToken'] && (this.$refs['addNewToken'] as any).clearValidate();
            });
        }

        private submitAdd() {
            (this.$refs['addNewToken'] as any).validate((valid: any) => {
                if (valid) {
                    this.$bus.$emit('main-loading', true);
                    if (this.newToken.id == null) {
                        this.add(this.newToken).then(() => {
                            this.$bus.$emit('main-loading', false);
                            this.$message.success('添加成功');
                            this.showAddTokenDialog = false;
                            this.init();
                        }).catch(err => {
                            this.$bus.$emit('main-loading', false);
                        });
                    } else {
                        this.update(this.newToken).then(() => {
                            this.$bus.$emit('main-loading', false);
                            this.$message.success('修改成功');
                            this.showAddTokenDialog = false;
                            this.init();
                        }).catch(err => {
                            this.$bus.$emit('main-loading', false);
                        });
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }

        private showTagAuth(item: any) {
            Object.assign(this.newToken, item);

            this.selectTagCodes = [];
            this.tagList = [];
            this.selectTagCategory = null;
            this.tagCheckAll = false;
            this.selectTags.clear();

            this.$nextTick(() => {
                this.showTagAuthDialog = true;
            });
        }

        private isLeaf(data: any) {
            if (data.tagCateIsLeaf == 1) {
                return true;
            }
            return false;
        }

        private loadTagCategory(node: any, resolve: any) {
            const id = node && node.data ? node.data.id : 0;
            this.findSub(id).then(res => {
                resolve(res);
            });
        }

        private handleTagCategoryClick(data: any) {
            this.tagName = '';
            if (!data || data.tagCateIsLeaf != 1) {
                return;
            }
            // if (data.id == this.selectTagCategory) {
            //     return;
            // }
            this.loading1 = true;
            this.tagListAll([data.id], this.newToken.token).then((res: any) => {
                this.loading1 = false;
                this.selectTagCategory = data.id;
                this.tagList = res.slice(0);
                this.selectTagCodes = [];
                this.tagCheckAll = false;
                this.tagListAdd();
                if (this.selectTagCodes.length == this.tagList.length && this.tagList.length > 0) {
                    this.tagCheckAll = true;
                }
            }).catch(err => {
                this.loading1 = false;
            });

        }

        // 回显标签
        private tagListAdd() {
            this.selectTagCodes = [];
            for (const i in this.tagList) {
                if (this.selectTags.has(this.tagList[i].tagCode)) {
                    this.selectTagCodes.push(this.tagList[i].tagCode);
                }
            }
        }

        private handleCheckAllTagChange() {
            if (this.selectTagCodes.length == this.tagList.length) {
                this.selectTagCodes.forEach((code: string) => {
                    if (this.selectTags.has(code)) {
                        this.selectTags.delete(code);
                        this.selectTags = new Map(this.selectTags);
                    }
                });
                this.selectTagCodes = [];
                this.tagCheckAll = false;
            } else {
                const list: any = [];
                this.tagList.forEach((tag: any) => {
                    if(tag.tagGranted != 1){
                        list.push(tag.tagCode);
                    }
                });
                this.selectTagCodes = list;
                this.tagCheckAll = true;
                this.updateSelectTagMap();
                this.tagListAdd();
            }
        }

        private handleCheckTagChange(tag?: any) {
            this.tagCheckAll = this.selectTagCodes.length === this.tagList.length;

            if (tag) {
                const idx = this.selectTagCodes.findIndex((code: string) => {
                    return code == tag.tagCode;
                });
                if (idx >= 0) {
                    if (!this.selectTags.has(tag.tagCode)) {
                        this.selectTags.set(tag.tagCode, tag);
                    }
                } else {
                    if (this.selectTags.has(tag.tagCode)) {
                        this.selectTags.delete(tag.tagCode);
                    }
                }
            }
        }

        private updateSelectTagMap() {
            if (this.selectTagCodes.length == 0) {
                this.selectTagCodes.forEach((code: string) => {
                    if (this.selectTags.has(code)) {
                        this.selectTags.delete(code);
                        this.selectTags = new Map(this.selectTags);
                    }
                });
            } else if (this.tagCheckAll) {
                this.selectTagCodes.forEach((code: string) => {
                    if (!this.selectTags.has(code)) {
                        const item = this.tagList.find((item: any) => {
                            return item.tagCode == code;
                        });
                        if (item) {
                            this.selectTags.set(code, item);
                        }
                    }
                });
            }
        }

        private removeTag(tagCode: string) {
            // console.log(tagCode);
            this.selectTags.delete(tagCode);
            this.selectTags = new Map(this.selectTags);

            const idx = this.selectTagCodes.findIndex((code: string) => {
                return code == tagCode;
            });
            if (idx >= 0) {
                this.selectTagCodes.splice(idx, 1);
                this.handleCheckTagChange();
            }
        }

        private saveAuthTag() {
            if (this.selectTags.size == 0) {
                this.$message.warning('未选择任何标签');
                return;
            }
            const authTags: Array<any> = [];
            for (const item of this.selectTags.values()) {
                const tag = {
                    tagName: item.tagName,
                    tagCode: item.tagCode,
                    subjectId: this.curSubject?.id
                };
                authTags.push(tag);
            }

            const token: string = this.newToken.token;

            if (!authTags || authTags.length < 1 || !token) {
                return;
            }
            this.updateAuth(authTags, token).then(() => {
                this.$message.success('提交申请成功');
                this.showTagAuthDialog = false;
            });
        }

        // ========== ajax request  ==========

        private queryList(keyword?: string) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/token/queryList';
                const data = {
                    pageNum: this.pageNo,
                    pageSize: this.pageSize
                };
                if (keyword) {
                    Object.assign(data, {
                        keyword: keyword
                    });
                }
                this.$api
                    .post(url, data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

        private add(token: NewToken) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/token/add';
                const data = {
                    sysCode: token.sysCode,
                    sysName: token.sysName,
                    sysManagerList: token.sysManagerList,
                    sysDesc: token.sysDesc
                };
                this.$api
                    .post(url, data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

        private update(token: NewToken) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/token/update';
                const data = token;
                this.$api
                    .post(url, data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

        private del(id: string) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/token/del';
                const data = {
                    id: id
                };
                this.$api
                    .get(url, data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

        private detail(id: string) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/token/detail';
                const data = {
                    id: id
                };
                this.$api
                    .get(url, data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

        private queryAuthList(token: string) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/token/queryAuthList';
                const data = {
                    token: token,
                    subjectId: this.curSubject?.id
                };
                this.$api
                    .get(url, data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

        private findAboveLevel(level: number) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/tagCategory/findAboveLevel';
                const data = {
                    tagCateLevel: level,
                    subjectId: this.curSubject?.id
                };
                this.$api
                    .get(url, data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

        private findSub(pid: number) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/tagCategory/findSub';
                const data = {
                    pid: pid,
                    tagCateType: 1,
                    subjectId: this.curSubject?.id
                };
                this.$api
                    .get(url, data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

        private tagListAll(lastTagCateIdList: any, token: string, keyword?: string) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/tag/listWithoutGrant';
                const data = {
                    lastTagCateIdList: lastTagCateIdList,
                    token: token,
                    subjectId: this.curSubject?.id
                };
                if (keyword) {
                    Object.assign(data, {
                        keyword: keyword
                    });
                }
                this.$api
                    .post(url, data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }

        private updateAuth(authTags: Array<any>, token: string) {
            return new Promise((resolve, reject) => {
                const url = '/api/admin/token/updateAuth';
                const data = {
                    authTags: authTags,
                    token: token
                };
                this.$api
                    .post(url, data)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }
    }
</script>
<style lang="scss" scoped>
    .token-apply {
        width: 100%;
        height: 100%;
        background-color: #f9fafd;
        position: relative;
        overflow: hidden;

        .header {
            width: 100%;
            height: 60px;
            padding: 0px 20px 0 0;
            border-bottom: 1px solid #EAF0F9;

            .search-tool {
                width: 100%;
                margin-bottom: 20px;
                display: flex;
                align-items: center;

                .search-item {
                    flex: 0 0 auto;
                    margin-left: 20px;
                    display: flex;

                    &:first-child {
                        margin-left: 0px;
                    }

                    &.col150 {
                        width: 150px;
                    }

                    &.col300 {
                        width: 300px;
                    }
                }

                .select-item {
                    height: 30px;
                }

                .spacer {
                    flex: 1 1 auto;
                }
                /deep/.el-input__inner{
                    background: none;
                }
            }
        }

        .body {
            width: 100%;
            height: calc(100% - 68px);
            margin-top: 4px;
            padding: 18px 20px;
            box-sizing: border-box;
            a {
                padding: 0 15px 0 0;
            }

            .token-list {
                width: 100%;
                /*height: calc(100% - 120px);*/
                height: calc(100% - 40px);
                overflow: auto;
                /*box-shadow: 0px 0px 10px rgba(204, 204, 204, 0.6);*/
                background-color: #fff;
            }

            .option-item {
                margin-right: 10px;
                // color: rgba(57, 107, 246, 1);
                cursor: pointer;
            }

            .paginationa {
                width: 100%;
                padding: {
                    top: 18px;
                    bottom: 0px;
                }
                display: flex;
                justify-content: flex-end;
            }
        }

        .tag-auth-container {
            width: 100%;
            height: 400px;
            display: flex;
            overflow: hidden;
            .item-w {
                width: 400px;
            }
            &-item {
                flex: 0 0 auto;
                width: 30%;
                height: 100%;
                border-left: 1px solid #EAF0F9;

                &-header {
                    width: 100%;
                    height: 48px;
                    line-height: 48px;
                    padding-left: 20px;
                    font-size: 0.875rem;
                    font-weight: bold;
                    color: rgba(51, 51, 51, 1);
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    position: relative;
                    &::after{
                        content: '';
                        height: 13px;
                        width: 3px;
                        background-color: #3E6AF6;
                        position: absolute;
                        left: 10px;
                        top: 18px;
                    }
                }

                &-body {
                    width: 100%;
                    // padding: 20px;
                    height: calc(100% - 48px);
                    overflow: auto;
                }
            }

            .spacer {
                flex: 1 1 auto;

                &.x3 {
                    flex: 3 1 auto;
                }
            }
        }

        .tag-list .tag-auth-container-item-body,
        .tag-selected .tag-auth-container-item-body {
            .tag-item {
                width: 100%;
                height: 24px;
                padding-left: 20px;
                display: flex;
                align-items: center;
            }

            .tag-select-item {
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                &::before {
                    position: absolute;
                    content: " ";
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    overflow: hidden;
                    left: 8px;
                    top: 17px;
                    background: #B5C9DC;
                }
                &.active {
                    color: #3E6AF6;
                    &::before {
                        background: #3E6AF6;
                    }
                }
                padding: {
                    left: 20px;
                    right: 10px;
                }

                i {
                    position: absolute;
                    right: 10px;
                    top: 12px;
                    cursor: pointer;
                    font-size: 16px;
                }
            }
        }
    }

    .add-form-style {
        padding-right: 20px;
    }
    .el-dialog .token-detail-title {
        width: 100%;
        height: 32px;
        line-height: 32px;
        padding-left: 10px;
        margin-bottom: 20px;
        position: relative;
        font-size: 1rem;
        font-weight: bold;
        color: #1b1b1b;
        &:before {
            content: ' ';
            width: 3px;
            height: 16px;
            display: block;
            position: absolute;
            top: 8px;
            left: 0px;
            background: #396bf6;
        }
    }
</style>
