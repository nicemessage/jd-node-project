<template>
    <el-dialog :close-on-click-modal="false" :title="(config==null?'新增筛选器':'编辑筛选器')+'（注意：画像系统默认读取最新分区的数据，所以设置分区筛选时不生效）'" :visible="isShow" :before-close="closeFilterDialog"
        :append-to-body="true">
        <div class="db-filter-dialog-content">
            <el-row style="padding: 15px 0;">
                <el-col :span="12">
                    <div>
                        <span>筛选字段：</span>
                        <el-select v-model="data.fieldName" filterable class="com-select com-width" clearable>
                            <template v-for="item in colList">
                                <el-option :key="item.name" :label="item.name" :value="item.name" :disabled="colID == item.name"></el-option>
                            </template>
                        </el-select>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div>
                        <span>字段类型：</span>
                        <el-select v-model="data.type" @change="changeType">
                            <el-option v-for="(t, i) in types" :key="i" :label="t.label" :value="t.value"></el-option>
                        </el-select>
                    </div>
                </el-col>
            </el-row>
            <!-- 字符串 -->
            <div v-if="data.type == 'STRING'"> 
                <div style="padding: 15px 0; margin-left: 70px;">
                    <span :class="data.op != 'IN'?'select-bt':'bt'" @click="changeStrOp('')">文本筛选</span>
                    <span :class="data.op == 'IN'?'select-bt':'bt'" @click="changeStrOp('IN')">枚举筛选</span>
                </div>
                <!-- 文本筛选 -->
                <template v-if="data.op != 'IN'">
                    <div style="padding: 15px 0;">
                        <span>筛选类型：</span>
                        <el-select v-model="data.op">
                            <el-option v-for="item in strFilterTypes" :key="item.label" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div v-if="(this.data.op != 'EMPTY' && this.data.op != 'NOT_EMPTY')" style="padding: 15px 0;">
                        <span>筛选文本：</span>
                        <el-input style="width:190px;" clearable v-model="data.value"></el-input>
                    </div>
                </template>
                <!-- 枚举筛选 -->
                <template v-else>
                    <div style="padding: 15px 0;">
                        <span>枚举值：</span>
                        <el-input style="width:260px;" clearable v-model="data.value">
                            <el-button slot="append" type="primary" @click="finishInputEnum" style="background: #2d68ff;color: #fff;border-radius: 0 3px 3px 0;">添加</el-button>
                        </el-input>
                    </div>
                    <!-- 枚举选择 -->
                    <div style="margin: 15px 0;border: 1px #eee solid; padding: 15px; border-radius: 5px;">
                        <el-tag style="padding: 0 10px 10px 5px; margin-right: 5px;" v-for="(tag, index) in data.values" :key="index" @close="delEnum(index)" closable>{{
                            tag
                        }}</el-tag>
                    </div>
                </template>
            </div>
            <!-- 数字 -->
            <div v-else-if="data.type == 'NUMBER'">
                <div style="padding: 15px 0;">
                    <span>筛选条件：</span>
                    <el-select style="width:60px;" v-model="data.op">
                        <el-option v-for="item in numFilterTypes" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-input @input="numberChange" style="width:190px; margin-left: 20px;" clearable v-model="data.value" @blur="numberBlur"></el-input>
                </div>
            </div>
            <!-- 时间 -->
            <div v-else-if="data.type == 'TIME'">
                <div style="padding: 15px 0; margin-left: 70px;">
                    <span :class="data.fieldType == 'DATETIME'?'select-bt':'bt'" @click="changeTimeType('DATETIME')">日期</span>
                    <span :class="data.fieldType == 'TIMERANGE'?'select-bt':'bt'" @click="changeTimeType('TIMERANGE')">时间区间</span>
                </div>
                <div style="padding: 15px 0;">
                    <span>时间粒度：</span>
                    <el-select v-model="data.grain">
                        <el-option v-for="item in grainTypes" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <div style="padding: 15px 0;">
                    <span>时间类型：</span>
                    <el-select v-model="data.timeCate">
                        <el-option v-for="item in cateTypes" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <!-- 日期 -->
                <div style="padding: 15px 0;" v-if="data.fieldType == 'DATETIME'">
                    <span>筛选时间：</span>
                    <!-- 静态时间 -->
                    <el-date-picker
                        v-if="data.timeCate == 'STATIC'"
                        v-model="data.value"
                        :type="data.grain=='DAY'?'date':(data.grain=='MONTH'?'month':'year')"
                        :value-format="data.grain=='DAY'?'yyyy-MM-dd':(data.grain=='MONTH'?'yyyy-MM':'yyyy')"
                        placeholder="选择日期">
                    </el-date-picker>
                    <!-- 动态时间 -->
                    <el-select v-else v-model="data.step">
                        <el-option v-for="item in staticFilterTypes[data.grain]" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </div>
                <!-- 时间区间 -->
                <div style="padding: 15px 0;" v-else>
                    <span>筛选时间：</span>
                    <!-- 静态时间 -->
                    <template v-if="data.timeCate == 'STATIC'">
                        <el-date-picker
                            v-if="data.grain != 'YEAR'"
                            v-model="data.timeRange"
                            :type="data.grain=='DAY'?'daterange':'monthrange'"
                            range-separator="~"
                            :value-format="data.grain=='DAY'?'yyyy-MM-dd':'yyyy-MM'"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                        <template v-else>
                            <el-date-picker v-model="data.begin" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                            <span> ~ </span>
                            <el-date-picker v-model="data.end" value-format="yyyy" type="year" placeholder="选择日期"></el-date-picker>
                        </template>
                    </template>
                    <!-- 动态时间 -->
                    <template v-else>
                        <span>近  <el-input style="width:60px;" v-model="data.step"></el-input>  {{{"DAY":"日","MONTH":"月","YEAR":"年"}[data.grain]}}</span>
                        <span style="margin-left: 20px;"><el-checkbox :true-label="1" :false-label="0" v-model="data.offset"></el-checkbox>  含当{{{"DAY":"日","MONTH":"月","YEAR":"年"}[data.grain]}}</span>
                    </template>
                </div>
            </div>
        </div>
        <div slot="footer">
            <el-button @click="cancelAction">取消</el-button>
            <el-button type="primary" @click="submitAction">确定</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
/**
 * @name DbFilterDialog
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { State } from 'vuex-class';
// 公共类引入
import SysSubject from '@/components/SysSubject.vue';
// 私有类引入

// mixin引入

// 第三方库引入

// 静态配置引入

// 公共组件引入

// 私有组件引入

// 本地定义和声明

@Component({
    components: {
        SysSubject
    }
})
export default class DbFilterDialog extends Vue {
    @Prop() config?: any;
    @Prop() colID?: any;
    @Prop() colList?: any;
    @Prop() show?: boolean;

    private isShow = false;
    @Watch('show')
    private changeShow(val) {
        this.show = val;
        this.isShow = val;
    }

    @Watch('config')
    private configChangeAction(val) {
        this.config = val;
        // 当有外部参数传入，合并到组件配置
        if (this.config) {
            Object.assign(this.data, this.config);
            this.data.type = this.data.fieldType;
            if (this.data.type != "STRING" && this.data.type != "NUMBER") {
                this.data.type = "TIME";
            }
            if (this.data.begin.length > 0) {
                this.data.timeRange = []
                this.data.timeRange.push(this.data.begin);
                this.data.timeRange.push(this.data.end);
            }
            if (this.data.fieldType == "STRING" || this.data.fieldType == "NUMBER") {
                if (this.data.op != 'IN') {
                    this.data.value = this.data.values[0];
                }
            }
        } else {
            // 如果没有，清空配置
            this.data = {
                fieldName:"",
                type: "STRING",
                fieldType:"STRING",
                op:"EQ",
                values:[],
                begin: "",
                end: "",
                timeRange: [],
                grain: "DAY",
                offset: "0",
                step: "0",
                timeCate: "STATIC",
                value: "",
            };
        }
    }
    @Watch('show')
    private showChange(val) {
        this.show = val;
        // 打开dialog，如果没有传入，则清空以前录入
        if (!this.config) {
            this.data = {
                fieldName:"",
                type: "STRING",
                fieldType:"STRING",
                op:"EQ",
                values:[],
                begin: "",
                end: "",
                timeRange: [],
                grain: "DAY",
                offset: "0",
                step: "0",
                timeCate: "STATIC",
                value: "",
            };
        }
    }

    private data = {
        fieldName:"", // 加载弹窗时，获取列表colList
        // *******附加属性，用来区分字符串、数字、时间
        type: "STRING",
        fieldType:"STRING", // 字段类型：STRING、NUMBER，DATETIME，TIMERANGE
        
        // 字符串，数字
        // 字符串对应枚举：EQ NEQ IN LIKE NOT_LIKE LIKE_LEFT LIKE_RIGHT EMPTY NOT_EMPTY
        // 数字对应枚举：EQ NEQ GT LT GE LE
        op:"EQ",
        values:[], // 单选取第一个

        // 时间
        begin: "", // 时间区间的值
        end: "",
        // ******* 附加属性，用来安放时间区间
        timeRange: [],
        grain: "DAY", // 时间粒度
        offset: "0", // 是否包含今天：含当日 offset为0 不含当日为1
        step: "0", // 动态时间：-1 最新日 0 当日， 昨日 1， 前日 2
        timeCate: "STATIC", //  时间类型：动态、静态
        value: "", // 时间的值
    };
    // 字段类型
    private types = [{label:'字符串',value:'STRING'},
        {label:'数字',value:'NUMBER'},
        {label:'时间',value:'TIME'}];
    // 字符串筛选操作类型
    private strFilterTypes = [
        {label:'精确匹配',value:'EQ'},
        {label:'不匹配',value:'NEQ'},
        {label:'包含',value:'LIKE'},
        {label:'不包含',value:'NOT_LIKE'},
        {label:'开头是',value:'LIKE_LEFT'},
        {label:'结尾是',value:'LIKE_RIGHT'},
        {label:'为空',value:'EMPTY'},
        {label:'不为空',value:'NOT_EMPTY'},
    ];
    // 数字筛选操作类型
    private numFilterTypes = [
        {label:'=',value:'EQ'},
        {label:'!=',value:'NEQ'},
        {label:'>',value:'GT'},
        {label:'<',value:'LT'},
        {label:'>=',value:'GE'},
        {label:'<=',value:'LE'},
    ];
    // 时间粒度
    private grainTypes = [
        {label:'日',value:'DAY'},
        {label:'月',value:'MONTH'},
        {label:'年',value:'YEAR'},
    ];
    // 时间类型
    private cateTypes = [
        {label:'静态时间',value:'STATIC'},
        {label:'动态时间',value:'DYNAMIC'},
    ];
    // 动态时间枚举
    private staticFilterTypes = {
        'DAY':[{label:'最新日',value:'-1'},{label:'当日',value:'0'},{label:'昨日',value:'1'},{label:'前日',value:'2'}],
        'MONTH':[{label:'当月',value:'0'},{label:'昨月',value:'1'},{label:'前月',value:'2'}],
        'YEAR':[{label:'当年',value:'0'},{label:'昨年',value:'1'},{label:'前年',value:'2'}]
    };


    private changeType(val:any) {
        // 修改字段类型，清除缓存
        if (this.data.type == 'TIME') {
            this.data.begin = "";
            this.data.end = "";
            this.data.grain = "DAY";
            this.data.offset = "0";
            this.data.step = "0";
            this.data.timeCate = "STATIC";
            this.data.value = "";
            this.data.fieldType = "DATETIME";
            this.data.timeRange = []
        } else {
            this.data.op = "EQ";
            this.data.value = "";
            this.data.values = [];
            this.data.fieldType = this.data.type;
        }
    }
    private changeStrOp(op: string) {
        // 修改文本、枚举筛选，清除缓存
        this.data.op = op;
        this.data.value = '';
        this.data.values = [];
    }
    private finishInputEnum() {
        // 枚举输入完成
        if (this.data.value) {
            this.data.values.push(this.data.value);
            this.data.value = "";
        }
    }
    private delEnum(idx: number) {
        // 删除枚举
        if (idx < this.data.values.length) {
            this.data.values.splice(idx, 1);
        }
    }
    private numberBlur(e: any) {
        // 数字失去焦点
        this.numberChange(e.target.value);
        e.target.value = this.data.value;
    }
    private numberChange(value: any) {
        // 数字输入，负数、小数、整数
        const val = value.match(/(^(?:-|[0-9]))(\d*)(\.)?(\d)*/g);
        if (val) {
            this.data.value = val[0];
        } else {
            this.data.value = "";
        }
    }
    private changeTimeType(type: string) {
        // 时间类型更改
        this.data.fieldType = type;
        this.data.begin = "";
        this.data.end = "";
        this.data.grain = "DAY";
        this.data.offset = "0";
        this.data.step = "0";
        this.data.timeCate = "STATIC";
        this.data.value = "";
    }
    private closeFilterDialog() {
        this.$emit('closeDialog');
    }

    private cancelAction() {
        this.$emit('closeDialog');
    }

    private submitAction() {
        // 提交
        if (this.data.fieldName.length <= 0) {
            this.$message.error("请选择字段");
            return;
        }
        // 参数拼装  与  校验
        const params = {};
        params.fieldName = this.data.fieldName;
        params.fieldType = this.data.fieldType;
        if (this.data.type == "STRING") {
            if (this.data.op.length <= 0) {
                this.$message.error("请选择筛选类型");
                return;
            }
            params.op = this.data.op;
            if (params.op == 'IN') {
                params.values = this.data.values;
                if (params.values.length <= 0) {
                    this.$message.error("请添加枚举");
                    return;
                }
            } else {
                if (this.data.value.length <= 0 && (this.data.op != "EMPTY" && this.data.op != "NOT_EMPTY")) {
                    this.$message.error("请添加筛选文本");
                    return;
                }
                params.values = [this.data.value];
            }
        } else if (this.data.type == "NUMBER") {
            if (this.data.op.length <= 0) {
                this.$message.error("请选择筛选条件");
                return;
            }
            params.op = this.data.op;
            if (this.data.value.length <= 0) {
                this.$message.error("请输入筛选值");
                return;
            }
            params.values = [this.data.value];
        } else {
            params.timeCate = this.data.timeCate;
            params.grain = this.data.grain;
            if (this.data.fieldType == 'DATETIME') {
                if (this.data.timeCate == "STATIC") {
                    params.step = "0";
                    if (this.data.value.length <= 0) {
                        this.$message.error("请选择时间");
                        return;
                    }
                    params.value = this.data.value;
                } else {
                    params.step = this.data.step;
                }
            } else {
                params.offset = this.data.offset;
                params.step = this.data.step;
                if (this.data.timeCate == "STATIC") {
                    if (this.data.grain == 'YEAR') {
                        params.begin = this.data.begin;
                        params.end = this.data.end;
                    } else {
                        params.begin = this.data.timeRange[0];
                        params.end = this.data.timeRange[1];
                    }
                    if (params.begin.length <= 0 || params.end.length <= 0) {
                        this.$message.error("请选择时间");
                        return;
                    }
                }
            }
        }
        this.$emit('finishFilterEdit', params, this.config==null);
    }
}
</script>
<style lang="scss" scoped>
.db-filter-dialog-content {
    padding: 20px 80px;
}

.bt {
    user-select: none;
    cursor: pointer;
    display: inline-block;
    width: 120px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    background-color: white;
    border: 1px #eee solid;
}
.select-bt {
    user-select: none;
    cursor: pointer;
    display: inline-block;
    width: 120px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border: 1px #eee solid;
    background-color: #2d68ff;
    color: white
}
</style>
