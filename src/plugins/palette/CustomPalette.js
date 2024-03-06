import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';
import { assign } from 'min-dash';

export default function CustomPalette(
    palette,
    create,
    elementFactory,
    spaceTool,
    lassoTool,
    handTool,
    globalConnect,
    translate
) {
    PaletteProvider.call(
        this,
        palette,
        create,
        elementFactory,
        spaceTool,
        lassoTool,
        handTool,
        globalConnect,
        translate,
        2000
    );
}

const F = function () {}; // 核心，利用空对象作为中介；
F.prototype = PaletteProvider.prototype; // 核心，将父类的原型赋值给空对象F；

// 利用中介函数重写原型链方法
F.prototype.getPaletteEntries = function () {
    let actions = {},
        create = this._create,
        elementFactory = this._elementFactory,
        spaceTool = this._spaceTool,
        lassoTool = this._lassoTool,
        handTool = this._handTool,
        globalConnect = this._globalConnect,
        translate = this._translate;

    /**
     * 创建一个元素
     * @param {string} type 所属元素
     * @param {string} group 分组
     * @param {string} className 样式
     * @param {string} title 国际化
     * @param {object} options 配置项
     * @returns {object}
     */
    function createAction(type, group, className, title, options) {
        function createListener(event) {
            let shape = elementFactory.createShape(
                assign({ type: type }, options)
            );

            if (options) {
                shape.businessObject.di.isExpanded = options.isExpanded; // di只能通过diagram元素使用
                shape.businessObject.name = options.name;
            }

            create.start(event, shape);
        }

        let shortType = type.replace(/^bpmn:/, '');

        return {
            group: group,
            className: className,
            title: title || translate('Create {type}', { type: shortType }),
            action: {
                dragstart: createListener,
                click: createListener,
            },
        };
    }

    function createSubprocess(event) {
        const subProcess = elementFactory.createShape({
            type: 'bpmn:SubProcess',
            x: 0,
            y: 0,
            isExpanded: true,
        });

        const startEvent = elementFactory.createShape({
            type: 'bpmn:StartEvent',
            x: 40,
            y: 82,
            parent: subProcess,
        });

        create.start(event, [subProcess, startEvent], {
            hints: {
                autoSelect: [startEvent],
            },
        });
    }

    function createParticipant(event) {
        create.start(event, elementFactory.createParticipantShape());
    }

    assign(actions, {
        // 工具
        'hand-tool': {
            group: 'tools',
            className: 'bpmn-icon-hand-tool',
            title: translate('Activate the hand tool'),
            action: {
                click: function (event) {
                    handTool.activateHand(event);
                },
            },
        },
        'lasso-tool': {
            group: 'tools',
            className: 'bpmn-icon-lasso-tool',
            title: translate('Activate the lasso tool'),
            action: {
                click: function (event) {
                    lassoTool.activateSelection(event);
                },
            },
        },
        'space-tool': {
            group: 'tools',
            className: 'bpmn-icon-space-tool',
            title: translate('Activate the create/remove space tool'),
            action: {
                click: function (event) {
                    spaceTool.activateSelection(event);
                },
            },
        },
        'global-connect-tool': {
            group: 'tools',
            className: 'bpmn-icon-connection-multi',
            title: translate('Activate the global connect tool'),
            action: {
                click: function (event) {
                    globalConnect.toggle(event);
                },
            },
        },
        'tool-separator': {
            group: 'tools',
            separator: true,
        },
        // 开始事件
        'create.start-event': createAction(
            'bpmn:StartEvent',
            'event',
            'bpmn-icon-start-event-none',
            translate('Create StartEvent'),
            { name: translate('Start') }
        ),
        // 中间事件
        'create.throw-none-event': createAction(
            'bpmn:IntermediateThrowEvent',
            'event',
            'bpmn-icon-intermediate-event-none',
            translate('Intermediate Throw Event')
        ),
        // 结束事件
        'create.end-event': createAction(
            'bpmn:EndEvent',
            'event',
            'bpmn-icon-end-event-none',
            translate('End Event'),
            { name: translate('End') }
        ),
        // 互斥网关
        'create.exclusive-gateway': createAction(
            'bpmn:ExclusiveGateway',
            'gateway',
            'bpmn-icon-gateway-xor',
            translate('Exclusive Gateway')
        ),
        // 并行网关
        'create.parallel-gateway': createAction(
            'bpmn:ParallelGateway',
            'gateway',
            'bpmn-icon-gateway-parallel',
            translate('Parallel Gateway')
        ),
        // 用户任务
        'create.user-task': createAction(
            'bpmn:UserTask',
            'task',
            'bpmn-icon-user-task',
            translate('User Task'),
            { height: 40 }
        ),
        // 服务任务
        'create.service-task': createAction(
            'bpmn:ServiceTask',
            'task',
            'bpmn-icon-service-task',
            translate('Service Task'),
            { height: 40 }
        ),
        // 子流程
        'create.subprocess': {
            group: 'structure',
            className: 'bpmn-icon-subprocess-expanded',
            title: translate('Sub Process'),
            action: {
                dragstart: createSubprocess,
                click: createSubprocess,
            },
        },
        'create.data-object': createAction(
            'bpmn:DataObjectReference',
            'data-object',
            'bpmn-icon-data-object',
            translate('Create DataObjectReference')
        ),
        'create.data-store': createAction(
            'bpmn:DataStoreReference',
            'data-store',
            'bpmn-icon-data-store',
            translate('Create DataStoreReference')
        ),
        'create.participant-expanded': {
            group: 'collaboration',
            className: 'bpmn-icon-participant',
            title: translate('Create Pool/Participant'),
            action: {
                dragstart: createParticipant,
                click: createParticipant,
            },
        },
        'create.group': createAction(
            'bpmn:Group',
            'artifact',
            'bpmn-icon-group',
            translate('Create Group')
        ),
    });

    return actions;
};

CustomPalette.$inject = ['palette', 'create', 'elementFactory', 'translate'];

CustomPalette.prototype = new F(); // 核心，将 F的实例赋值给子类；
CustomPalette.prototype.constructor = CustomPalette; // 修复子类CustomPalette的构造器指向，防止原型链的混乱；
