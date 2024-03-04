<template>
    <div class="bpmn-designer__container">
        <div ref="canvas" :class="['bpmn-designer__canvas', bgCanvas]"></div>
    </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler';
import defaultXML from '@/entity/defaultXml';
import customPalette from '@/plugins/palette';

export default {
    name: 'BpmnDesigner',
    props: {
        processId: String,
        processName: String,
        prefix: {
            type: String,
            default: "activiti"
        },
    },
    data() {
        return {
            bpmnModeler: null,
        };
    },
    computed: {
        // 网状背景
        bgCanvas() {
            return 'nets-canvas';
        },
        // 自定义功能扩展
        additionalModules() {
            return [];
        },
        // 自定义模型定制扩展
        moddleExtensions() {
            return {};
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            // 获取到属性ref为“canvas”的dom节点
            const canvas = this.$refs.canvas;
            // 建模
            this.bpmnModeler = new BpmnModeler({
                container: canvas,
                additionalModules: this.additionalModules,
                moddleExtensions: this.moddleExtensions,
                customModule: customPalette
            });
            this.createNewDiagram();
        },
        // 创建新的流程图
        async createNewDiagram(xmlStr) {
            // 将字符串转换成图显示出来
            let newId = this.processId || `Process_${new Date().getTime()}`;
            let newName = this.processName || `业务流程_${new Date().getTime()}`;
            let xmlString = xmlStr || defaultXML(newId, newName, this.prefix);
            try {
                let { warnings } = await this.bpmnModeler.importXML(xmlString);
                if (warnings && warnings?.length) {
                    warnings.forEach(warn => console.warn(warn));
                }
            } catch (e) {
                console.error(`[Process Designer Warn]: ${e.message || e}`);
            }
            // this.bpmnModeler.importXML(xmlString, (err) => {
            //     if (err) {
            //         console.error(err);
            //     } else {
            //         // 这里是成功之后的回调, 可以在这里做一系列事情
            //         console.log('创建成功!');
            //     }
            // });
        }
    }
};
</script>

<style scoped>
.bpmn-designer__container {
    background-color: #ffffff;
    width: 100%;
    height: 100vh;
}
.bpmn-designer__canvas {
    width: 100%;
    height: 100%;
}
.nets-canvas {
    background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMTBoNDBNMTAgMHY0ME0wIDIwaDQwTTIwIDB2NDBNMCAzMGg0ME0zMCAwdjQwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlMGUwZTAiIG9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTQwIDBIMHY0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+") repeat !important;
}
</style>
