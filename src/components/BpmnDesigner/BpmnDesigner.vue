<template>
    <div class="containers">
        <div class="canvas" ref="canvas"></div>
    </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler';
import DefaultXML from '@/entity/defaultXml';
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
            });
            debugger;
            this.createNewDiagram();
        },
        // 创建新的流程图
        async createNewDiagram(xmlStr) {
            // 将字符串转换成图显示出来
            let newId = this.processId || `Process_${new Date().getTime()}`;
            let newName = this.processName || `业务流程_${new Date().getTime()}`;
            let xmlString = xmlStr || DefaultXML(newId, newName, this.prefix);
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
.containers {
    background-color: #ffffff;
    width: 100%;
    height: calc(100vh - 52px);
}
.canvas {
    width: 100%;
    height: 100%;
}
</style>
