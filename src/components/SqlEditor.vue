<template>
    <div class="sql-editor" ref="editor"></div>
</template>

<script lang="ts">
/**
 * @name SqlEditor
 * @author niuzhiwei3
 * @namespace
 * @property
 * @param
 * @computed
 * @function
 * @description 组件书写模板
 */
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

// mixin引入

// 第三方库引入
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { format } from 'sql-formatter';
// 静态配置引入

// 公共组件引入

// 公共类引入

// 私有组件引入

// 私有类引入

// 本地定义和声明
import { monacoSqlAutocomplete } from './lib/sqlEditor/monaco-plugin';

@Component({
    components: {}
})
export default class SqlEditor extends Vue {
    // @Prop() private sql!: string;
    @Prop({ type: Boolean, default: false })
    private preview?: boolean;
    @Prop() private value!: string;

    //private editor: any = null;
    private mounted() {
        // this.addMonitor();
        // this.addItemMonitor();
        this.init();
    }

    // private addMonitor() {}

    // private addItemMonitor() {}

    private editor: any = null;

    get formatValue() {
        if (!this.value) return '';
        try {
            return format(this.value, {
                language: 'spark',
                uppercase: true
            });
        } catch (error) {
            console.log('sql格式化出错');
            return '';
        }
    }
    private init() {
        const $el: any = this.$el;
        this.editor = monaco.editor.create($el, {
            value: this.formatValue,
            readOnly: this.preview,
            language: 'sql'
            // theme: 'vs-dark',
        });
        this.editor.onDidChangeModelContent(() => {
            // 更新value
            this.$emit('input', this.editor.getValue());
        });
        this.editor.addAction({
            id: 'sql-format', // 菜单项 id
            label: 'SQL Format', // 菜单项名称
            //keybindings: [], // 绑定快捷键
            contextMenuGroupId: '1_modification', // 所属菜单的分组
            run: () => {
                this.format(this.formatValue);
            } // 点击后执行的操作
        });
        monacoSqlAutocomplete(monaco, this.editor);
    }

    private getValidate() {
        const error = monaco.editor.getModelMarkers({});
        return error.length === 0;
    }

    private format(value: string) {
        if (value) {
            this.editor.setValue(value);
        } else {
            // 外部格式化
            this.editor.setValue(this.formatValue);
        }
    }
}
</script>
<style lang="scss" scoped>
.sql-editor {
    height: 100%;
    width: 100%;
    box-sizing: border-box;

    ::v-deep {
        .margin-view-overlays {
            background-color: rgba(153, 204, 255, 0.207843137254902);
        }
        .minimap-decorations-layer {
            background-color: rgba(153, 204, 255, 0.207843137254902);
        }

        a {
            color: #4775fe;
        }
    }
}
</style>

