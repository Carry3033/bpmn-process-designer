<template>
    <div class="containers">
        <div class="canvas" ref="canvas"></div>
    </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/lib/Modeler';
// 这里是直接引用了xml字符串
import { xmlStr } from '@/mock/xmlStr'
export default {
    name: 'BpmnDesigner',
    data() {
        return {
            bpmnModeler: null
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init () {
            // 获取到属性ref为“canvas”的dom节点
            const canvas = this.$refs.canvas
            // 建模
            this.bpmnModeler = new BpmnModeler({
                container: canvas
            })
            debugger
            this.createNewDiagram()
        },
        createNewDiagram () {
            // 将字符串转换成图显示出来
            this.bpmnModeler.importXML(xmlStr, (err) => {
                if (err) {
                    console.error(err)
                }
                else {
                    // 这里是成功之后的回调, 可以在这里做一系列事情
                    this.success()
                }
            })
        },
        success () {
            console.log('创建成功!')
        }
    }
}
</script>

<style scoped>
.containers{
    background-color: #ffffff;
    width: 100%;
    height: calc(100vh - 52px);
}
.canvas{
    width: 100%;
    height: 100%;
}
</style>
