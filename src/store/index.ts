import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        loadingSate: false,
        selectedData: JSON.parse(window.sessionStorage.getItem('selectedData') as string) || [],
        expression: window.sessionStorage.getItem('expression') ? JSON.parse(window.sessionStorage.getItem('expression') as string) : ({} as any),
        expressionCode: window.sessionStorage.getItem('expressionCode') ? JSON.parse(window.sessionStorage.getItem('expressionCode') as string) : ({} as any),
        expressionTwo: window.sessionStorage.getItem('expressionTwo') ? JSON.parse(window.sessionStorage.getItem('expressionTwo') as string) : ({} as any),
        portrait: window.sessionStorage.getItem('portrait') ? JSON.parse(window.sessionStorage.getItem('portrait') as string) : ({} as any),
        portraitCode: window.sessionStorage.getItem('portraitCode') ? JSON.parse(window.sessionStorage.getItem('portraitCode') as string) : ({} as any),
        portraitFile: window.sessionStorage.getItem('portraitFile') ? JSON.parse(window.sessionStorage.getItem('portraitFile') as string) : ({} as any),
        fileInfo: window.sessionStorage.getItem('fileInfo') ? JSON.parse(window.sessionStorage.getItem('fileInfo') as string) : ({} as any),
        userInfo: {
            role: '',
            erp: '',
            state: ''
        },
        crowdInfo: {},
        curSubject: JSON.parse(window.localStorage.getItem('curSubject') as string) || null,
        crowdShowType: 'me',
        crowdShowMode: 'card',

        btnLoading: false,
        tagDetail: {},
        tagClassify: 0,
        upDateSubjectList: false, // 主体List更新
        idPoolList: [], // ID池列表
        tagListEx: [],
        dataTypeOptions: [
            { label: 'Int32', value: 'Int32' },
            { label: 'Float32', value: 'Float32' },
            { label: 'String', value: 'String' }
        ],
        nameAndTime: {
            creator: '',
            modifier: '',
            createdTime: '',
            modifiedTime: ''
        },
        // curSubject: {
        //     id: ''
        // },
        crowdMode: 'card',
        menus: [] // 左侧菜单，为空则无权限
    },
    mutations: {
        changeLoadingStatus(state, value) {
            state.loadingSate = value;
        },
        setSelectedData(state, value) {
            state.selectedData = value;
            window.sessionStorage.setItem('selectedData', JSON.stringify(value));
        },
        setExpression(state, payload) {
            state.expression[payload.subjectId] = {
                expression: payload.expression,
                expLogic: payload.expLogic
            };
            window.sessionStorage.setItem('expression', JSON.stringify(state.expression));
        },
        setExpressionCode(state, payload) {
            state.expressionCode[payload.subjectId] = {
                expression: payload.expression,
                expLogic: payload.expLogic
            };
            window.sessionStorage.setItem('expressionCode', JSON.stringify(state.expressionCode));
        },
        setExpressionTwo(state, payload) {
            state.expressionTwo[payload.subjectId] = {
                expression: payload.expression,
                logic: payload.logic,
                logicCrowd: payload.logicCrowd,
                crowd: payload.crowd,
                valueType: payload.valueType
            };
            window.sessionStorage.setItem('expressionTwo', JSON.stringify(state.expressionTwo));
        },
        setPortrait(state, payload) {
            state.portrait[payload.subjectId] = payload.portraitList;
            window.sessionStorage.setItem('portrait', JSON.stringify(state.portrait));
        },
        setPortraitCode(state, payload) {
            state.portraitCode[payload.subjectId] = payload.portraitList;
            window.sessionStorage.setItem('portraitCode', JSON.stringify(state.portraitCode));
        },
        setPortraitFile(state, payload) {
            state.portraitFile[payload.subjectId] = payload.portraitList;
            window.sessionStorage.setItem('portraitFile', JSON.stringify(state.portraitFile));
        },

        setFileInfo(state, payload) {
            state.fileInfo[payload.subjectId] = payload.portraitList;
            window.sessionStorage.setItem('fileInfo', JSON.stringify(state.fileInfo));
        },
        saveUserInfo(state, value) {
            state.userInfo = value;
            state.userInfo.role = value.roleCode;
        },
        saveCrowdInfo(state, value) {
            state.crowdInfo = value;
        },
        updateCurSubject(state, value) {
            state.curSubject = value;
            window.localStorage.setItem('curSubject', JSON.stringify(value));
        },
        updateCrowdShowType(state, value){
            state.crowdShowType = value;
        },
        updateCrowdShowMode(state, value){
            state.crowdShowMode = value;
        },
        changeCrowdMode(state, value) {
            state.crowdMode = value;
        },
        changeCurSubject(state, value) {
            state.curSubject = value;
        },
        chagneBtnLoading(state, value) {
            state.btnLoading = value;
        },
        changeidPoolList(state, value) {
            state.idPoolList = value;
        },
        setTagListEx(state, value) {
            state.tagListEx = value;
        },
        saveMenus(state, value) {
            state.menus = value;
        }
    },
    getters: {
        loadingSate: state => state.loadingSate,
        selectedData: state => state.selectedData,
        expression: state => state.expression,
        expressionCode: state => state.expressionCode,
        expressionTwo: state => state.expressionTwo,
        portraitCode: state => state.portraitCode,
        portrait: state => state.portrait,
        fileInfo: state => state.fileInfo,
        portraitFile: state => state.portraitFile,
        userInfo: state => state.userInfo,
        crowdInfo: state => state.crowdInfo,
        curSubject: status => status.curSubject,
        crowdShowType: status => status.crowdShowType,
        crowdShowMode: status => status.crowdShowMode,

        idPoolList: state => state.idPoolList,
        tagListEx: state => state.tagListEx,
        crowdMode: state => state.crowdMode
    }
});
