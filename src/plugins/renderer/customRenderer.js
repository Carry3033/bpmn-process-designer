import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer'; // 引入默认的renderer
const HIGH_PRIORITY = 1500; // 把自定义文件设置更高的优先级 默认优先级为1000

export default class CustomRenderer extends BaseRenderer {
    constructor(eventBus, bpmnRenderer) {
        super(eventBus, HIGH_PRIORITY);
        this.bpmnRenderer = bpmnRenderer;
    }

    canRender(element) {
        // ignore labels
        return !element.labelTarget;
    }

    // 核心函数就是绘制shape
    drawShape(parentNode, element) {
        // 获取到类型
        const type = element.type;
        if (/Task$/.test(type)) {
            // 任务类型高度自定义为40 默认80
            element.height = 40;
        }

        if (['bpmn:EndEvent'].includes(type)) {
            if (element.businessObject.eventDefinitions && element.businessObject.eventDefinitions.length) {
                element.businessObject.terminateEventDefinition = element.businessObject.eventDefinitions[0];
                delete element.businessObject.eventDefinitions;
            }
        }

        return this.bpmnRenderer.drawShape(parentNode, element);
    }

    getShapePath(shape) {
        return this.bpmnRenderer.getShapePath(shape);
    }
}

CustomRenderer.$inject = ['eventBus', 'bpmnRenderer'];
