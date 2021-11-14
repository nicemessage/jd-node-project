<template>
    <section class="map-to-crowd">
        <section class="header">
            <div class="ipt-wapper">
                <div class="item">
                    <span>经度</span>
                    <el-input
                            v-model="crowdParams.longitude"
                            size="small"
                            placeholder="经度"
                            class="ipt-width">
                    </el-input>
                </div>
                <div class="item">
                    <span>纬度</span>
                    <el-input
                            v-model="crowdParams.latitude"
                            size="small"
                            placeholder="纬度"
                            class="ipt-width">
                    </el-input>
                </div>
                <div class="item">
                    <span>半径</span>
                    <el-input
                            v-model="crowdParams.radius"
                            size="small"
                            placeholder="半径"
                            class="ipt-width">
                    </el-input>
                    <em>米</em>
                </div>
                <div class="item">
                    <el-button type="primary" size="small" @click="addCircle" class="item">定位</el-button>
                </div>
                <div class="item">
                    <span>地区</span>
                    <el-select class="pos-select common-el" placeholder="请选择" filterable v-model="posValue"  size="small" @change="selectPos">
                        <el-option
                                v-for="(item,index) in posData"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
            </div>
        </section>
        <div class="body">
            <div class="map-content" id="map">
                <i class="icon-xuanze el-icon-aim" @click="startSelect" title="圈选范围"></i>
            </div>
        </div>
        <div class="footer">
            <el-button size="medium" v-if="newCrowd.crowdPredNum == -1" @click="getCrowdNum">计算群体数量</el-button>
            <el-button size="medium" v-if="newCrowd.crowdPredNum >= 0">群体数量预估：{{newCrowd.crowdPredNum}}</el-button>
            <el-button type="primary" @click="toPortrait" size="medium">保存群体</el-button>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="showCreateNewCrowdDialog" width="600px" :append-to-body="true">
            <div slot="title" class="dialog-title">保存群体</div>
            <div style="padding: 30px;">
                <el-form :model="newCrowd" :rules="addNewRules" ref="saveCrowd" label-width="100px">
                    <el-form-item label="群体名称" prop="crowdName">
                        <el-input size="small" v-model="newCrowd.crowdName"></el-input>
                    </el-form-item>
                    <el-form-item label="群体负责人" prop="crowdManagerList">
                        <SearchErp :value.sync="newCrowd.crowdManagerList" multiple></SearchErp>
                    </el-form-item>
                    <el-form-item label="群体数量">
                        <span class="crowd-num">{{ newCrowd.crowdPredNum === null ? '' : newCrowd.crowdPredNum.toLocaleString() }}</span>
                    </el-form-item>
                    <el-form-item label="群体描述" prop="crowdDesc">
                        <el-input size="small" type="textarea" :rows="3" maxlength="200" minlength="3" v-model="newCrowd.crowdDesc"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="showCreateNewCrowdDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="saveCrowd">保 存</el-button>
            </span>
        </el-dialog>
    </section>
</template>
<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {State} from "vuex-class";

    // mixin引入

    // 第三方库引入
    import L from 'leaflet';
    import 'leaflet.chinatmsproviders';


    // 静态配置引入

    // 公共组件引入
    import SearchErp from '@/components/SearchErp.vue';
    // 公共类引入

    // 私有组件引入

    // 私有类引入
    import { cityPos } from '@/assets/utils/pos'

    // 本地定义和声明

    // 本地定义和声明

    @Component({
        components: {
            SearchErp
        }
    })
    export default class MapToCrowd extends Vue {
        @State(state => state.curSubject) curSubject!: any | null;

        @Prop()
        private crowdData!: any | null;

        private crowdParams: any = {
            longitude:'',
            latitude:'',
            radius:''
        };

        private showCreateNewCrowdDialog:boolean = false;
        private map:any = null;
        private points:any = null;
        private r:any = 0;
        private tempCircle:any = null;
        private crowdDefine:any = {
            version:"5.0",
            lon:"",
            lat:"",
            radius:"",
            targetDb:"pin_source",
            targetTb:"tag_dmxupf_com_jdpin_offset_coordaddr_info_s_m",
            targetCol:"offset",
            style:"GEO"
        };
        private crowdQuery:any = {
            crowdPredNum: -1,
            crowdDefine:'',
            crowdDefineDesc:'',
            portraitData:sessionStorage.getItem('addressTem')||[],
        }
        private addNewRules: any = {
            crowdName: [{ required: true, message: '请填写群体名称', trigger: 'blur' }],
            crowdDesc: [
                { required: true, message: '请填写群体描述', trigger: 'blur' },
                { min: 3, max: 200, message: '长度在 3 到 20 个字符', trigger: 'blur' }
            ],
            crowdManagerList: [{ required: true, message: '请填写群体负责人', trigger: 'blur' }]
        };
        private newCrowd: any = {
            crowdName: '',
            crowdDesc: '',
            crowdManager: '',
            crowdManagerList:[],
            crowdPredNum: -1
        };
        private crowdDialog:boolean = false;
        private isMoveCircle:boolean = false;
        private crowdDetail:any = {};
        private posData:any = [];
        private posValue:string = '';

        private created() {
            if(cityPos){
                for(const key in cityPos){
                    const data = {
                        label:key,
                        value:JSON.stringify(cityPos[key])
                    };
                    if(data.label === '北京市'){
                        this.posValue = data.value;
                    }
                    this.posData.push(data);
                }

            }
        }

        private mounted() {
            this.initMap();
            this.newCrowd.crowdManagerList = [window.sessionStorage.getItem("userErp")];
            if(this.crowdData){
                this.$bus.$emit('main-loading', true);
                this.getCrowdDetail(this.crowdData.crowdCode as string).then((res: any) => {
                    this.$bus.$emit('main-loading', false);
                    const crowdData = res;
                    const crowdDefine = JSON.parse(crowdData.crowdDefine);
                    this.crowdParams = {
                        longitude:crowdDefine.lon,
                        latitude:crowdDefine.lat,
                        radius:crowdDefine.radius
                    }
                    this.addCircle();
                    this.newCrowd.crowdName = crowdData.crowdName;
                    this.newCrowd.crowdDesc = crowdData.crowdDesc;
                    this.newCrowd.crowdManagerList = crowdData.crowdManager.split(",");
                    this.newCrowd.crowdCode = crowdData.crowdCode;
                }).catch(err => {
                    this.$bus.$emit('main-loading', false);
                });
            }
        }

        private initMap(){
            try{
                this.map = L.map("map",{
                    center:JSON.parse(this.posValue).reverse(),
                    zoom:12,
                    zoomControl:false,
                    minZoom:4,
                    maxBounds: [
                        [-90,0],[90,360]
                    ]
                });
                // Google.Normal.Map   谷歌地图
                // Geoq.Normal.Map  智图地图
                // GaoDe.Normal.Map  高德地图
                L.tileLayer.chinaProvider('GaoDe.Normal.Map',
                    {
                        maxZoom: 18,
                        minZoom: 5,
                        subdomains: ["1", "2", "3", "4"],
                    }

                ).addTo(this.map);
                this.tempCircle = new L.circle();
            }catch(err){
                console.log(err);
            }
        }

        private startSelect(){
            if(this.tempCircle){
                this.map.removeLayer(this.tempCircle);
            }
            this.isMoveCircle = false;
            this.map.dragging.disable();
            this.map.on('mousedown',this.onmouseDown);
            this.map.on('mouseup',this.mouseUp);
            this.map.on('mousemove',this.onMove);
        }

        private onmouseDown(e:any){
            this.points = e.latlng;
        }

        private mouseUp(e:any){
            this.crowdParams.longitude = this.points.lng;
            this.crowdParams.latitude = this.points.lat;
            this.crowdParams.radius = this.r;
            this.points = null;
            this.r = 0;
            this.map.dragging.enable();
            this.map.off('mousedown',this.onmouseDown);
            this.map.off('mouseup',this.mouseUp);
            this.map.off('mousemove',this.onMove);
            this.tempCircle.on('mousedown',this.startCircle);
            this.tempCircle.off('mousemove',this.onMove);
        }

        private onMove(e:any){
            if(this.points){
                if(!this.isMoveCircle){
                    this.r = Math.floor(L.latLng(e.latlng).distanceTo(this.points));
                }else{
                    this.points = e.latlng;
                }
                if(this.r > 5000) this.r = 5000;
                this.crowdParams.longitude = this.points.lng;
                this.crowdParams.latitude = this.points.lat;
                this.crowdParams.radius = this.r;
                this.tempCircle.setLatLng(this.points);
                this.tempCircle.setRadius(this.r);
                this.tempCircle.setStyle({
                    color: '#ff0000',
                    fillColor: 'rgba(255,0,0,0.1)',
                    fillOpacity: 1
                })
                this.map.addLayer(this.tempCircle);
                this.newCrowd.crowdPredNum = -1;
            }
        }

        private startCircle(){
            this.isMoveCircle = true;
            this.r = this.crowdParams.radius;
            this.points = {
                lng:this.crowdParams.longitude,
                lat:this.crowdParams.latitude
            };
            this.map.dragging.disable();
            this.tempCircle.on('mousemove',this.onMove);
            this.tempCircle.on('mouseup',this.mouseUp);
        }

        private addCircle(){
            if(this.crowdParams.radius > 5000){
                this.$message('半径不能大于5000');
                return;
            }
            if(!this.crowdParams.longitude||this.crowdParams.longitude>360 || this.crowdParams.longitude<0){
                this.$message('经度请输入0-360范围内的数值');
                return;
            }
            if(!this.crowdParams.latitude||this.crowdParams.latitude>180 || this.crowdParams.latitude<-180){
                this.$message('纬度请输入-180-180范围内的数值');
                return;
            }
            if(!this.crowdParams.radius || this.crowdParams.radius==0){
                this.$message('半径为大于0且小于5000的数值');
                return;
            }
            if(isNaN(this.crowdParams.longitude)||isNaN(this.crowdParams.latitude)||isNaN(this.crowdParams.radius)){
                this.$message('请输入数字');
                return;
            }
            const data:any = {
                lng:this.crowdParams.longitude,
                lat:this.crowdParams.latitude
            };
            const index:number = this.posData.findIndex(d => d.value === JSON.stringify([Number(data.lat),Number(data.lng)]));
            this.map.setView([data.lat,data.lng]);
            if(index>-1){
                this.posValue = JSON.stringify([Number(data.lat),Number(data.lng)]);
            }else{
                this.posValue = '';
            }
            this.$nextTick(()=>{
                this.tempCircle.setLatLng(data)
                this.tempCircle.setRadius(this.crowdParams.radius)
                this.tempCircle.setStyle({
                    color: '#ff0000',
                    fillColor: 'rgba(255,0,0,0.1)',
                    fillOpacity: 1
                })
                this.map.addLayer(this.tempCircle);
                this.tempCircle.on('mousedown',this.startCircle);
            });
        }

        private selectPos() {
            this.map.setView(JSON.parse(this.posValue).reverse())
        }

        private getCrowdNum() {
            if(!this.crowdParams.radius || !this.crowdParams.latitude || !this.crowdParams.longitude) {
                this.$message('请选择地址区域');
                return;
            }
            // const vals:any = [];
            // vals.push(this.crowdParams.latitude);
            // vals.push(this.crowdParams.longitude);
            // vals.push(this.crowdParams.radius);
            // this.crowdDefine.list[0].elements[0].conditions[0].vals = vals;
            this.crowdDefine.lon = this.crowdParams.longitude.toString();
            this.crowdDefine.lat = this.crowdParams.latitude.toString();
            this.crowdDefine.radius = this.crowdParams.radius.toString();
            // console.log(this.curSubject);

            this.$bus.$emit('main-loading', true);
            this.crowdNumber(this.crowdDefine).then((num: any) => {
                this.$bus.$emit('main-loading', false);
                this.newCrowd.crowdPredNum = num;
            }).catch(err => {
                this.$bus.$emit('main-loading', false);
            });
        }

        private backToCM(type?:any) {
            if (type == '1') {
                this.$bus.$emit('HideToCrowd');
                return false;
            }
            this.$bus.$emit('HideToCrowd',true);
            this.$message({
                message: '群体保存成功！预计加工时间30s-5min，有效后才能在“群体应用”中选择到该群体~',
                type: 'success'
            });
            // this.$router.push({
            //     name: 'crowd-manage'
            // });
        }

        private toPortrait() {
            if(!this.crowdParams.radius || !this.crowdParams.latitude || !this.crowdParams.longitude) {
                this.$message('请选择地址区域');
                return;
            }
            if(this.newCrowd.crowdPredNum == -1) {
                this.$message('请计算群体数量');
                return;
            }
            this.showCreateNewCrowdDialog = true;

        }
        private saveCrowd() {
            this.newCrowd.crowdManager = this.newCrowd.crowdManagerList.join(",");

            Object.assign(this.newCrowd, {
                crowdDsType: 11,
                crowdType: 6,
                subjectId: this.curSubject?.id,
                crowdDefine: JSON.stringify(this.crowdDefine),
                crowdDefineDesc: JSON.stringify(this.crowdDefine)
            });



            // console.log(this.newCrowd);
            this.$bus.$emit('main-loading', true);
            this.$api
                .post('/api/ava/crowd/addOrUpdate/geo', this.newCrowd)
                .then(res => {
                    this.$bus.$emit('main-loading', false);
                    this.showCreateNewCrowdDialog = false;
                    this.backToCM();
                })
                .catch(err => {
                    this.$bus.$emit('main-loading', false);
                });

        }
        private crowdNumber(expression: any) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/crowd/geoNumber';
                const data = {
                    expression: JSON.stringify(expression)
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

        private getCrowdDetail(crowdCode: string) {
            return new Promise((resolve, reject) => {
                const url = '/api/ava/crowd/detail';
                const data = {
                    crowdCode: crowdCode
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
    }
</script>
<style lang="scss" scoped>
    .map-to-crowd {
        width: 100%;
        height: 100%;
        background-color: #f9fafd;
        position: relative;
        overflow: hidden;
        .header {
            width: 100%;
            height: 60px;
            border-top: 1px solid #EAF0F9;
            padding:0 15px;
            line-height: 40px;
            .search-tag-btn {
                width: 100%;
                text-align: right;
            }
        }
        .footer {
            width: 100%;
            height: 60px;
            border-top: 1px solid #eee;
            padding:0 15px;
            line-height: 52px;
            text-align: right;
            .search-tag-btn {
                width: 100%;
                text-align: right;
            }
        }
        .save-dia{
            width: 90%;
        }
        .body {
            width: 100%;
            height: calc(100% - 120px);
            margin-top: 4px;
            overflow: auto;
            background: #f8f8f8;

            .tag-select-list {
                flex: 0 0 auto;
                width: 250px;
                height: 100%;
                background-color: #fff;
            }
            .expression {
                flex: 0 0 auto;
                width: 550px;
                height: 100%;
                background-color: #fff;
            }
            .portrait-preview {
                flex: 0 0 auto;
                width: 500px;
                height: 100%;
                background-color: #fff;
            }
        }
        .ipt-wapper{
            display: flex;
            padding: 10px 0;
            .item{
                display: flex;
                align-items: center;
                margin-right: 10px;

                .ipt-width{
                    width: 160px;
                }
                .pos-select{
                    width: 160px;
                }
                span{
                    font-size: 12px;
                    color: #333;
                    margin-right: 10px;
                    white-space: nowrap;
                }
                em{
                    margin-left: 10px;
                    font-size: 12px;
                    color: #333;
                }
            }
        }
        .map-content{
            width: 100%;
            height: 100%;
            overflow: hidden;
            flex: 1;
            position: relative;
            img{
                display: block!important;
            }
        }
        .icon-xuanze{
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 999;
            font-size: 30px;
            color: #333;
            cursor: pointer;
            &:hover{
                color: #f00;
            }
        }
    }
    /deep/.leaflet-pane{
        position: absolute!important;
        left: 0!important;
        top: 0!important;
    }
</style>
