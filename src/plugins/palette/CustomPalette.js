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
                // shape.businessObject.di.isExpanded = options.isExpanded; // di 是只读的
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
        // 创建开始事件
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
        // 发送任务
        'create.send-task': createAction(
            'bpmn:SendTask',
            'more',
            'bpmn-icon-send-task',
            translate('Send Task'),
            { height: 40 }
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
        // 包容性网关
        'create.inclusive-gateway': createAction(
            'bpmn:InclusiveGateway',
            'gateway',
            'bpmn-icon-gateway-or',
            translate('Inclusive Gateway')
        ),
        // 'create.start-signal-event': createAction(
        //     'bpmn:StartEvent',
        //     'more',
        //     'bpmn-icon-start-event-signal',
        //     translate('Signal Start Event'), // 信号开始事件
        //     { eventDefinitionType: 'bpmn:SignalEventDefinition' }
        // ),
        // 'create.start-timer-event': createAction(
        //     'bpmn:StartEvent',
        //     'event',
        //     'bpmn-icon-start-event-timer',
        //     translate('Timer Start Event'), // 定时开始事件
        //     { eventDefinitionType: "bpmn:TimerEventDefinition" }
        // ),
        // 'create.catch-timer-event': createAction(
        //     'bpmn:IntermediateCatchEvent',
        //     'intermediate',
        //     'bpmn-icon-intermediate-event-catch-timer',
        //     translate('Timer Intermediate Catch Event'), // 中间定时器捕获事件
        //     { eventDefinitionType: 'bpmn:TimerEventDefinition' }
        // ),
        // 'create.catch-signal-event': createAction(
        //     'bpmn:IntermediateCatchEvent',
        //     'intermediate',
        //     'bpmn-icon-intermediate-event-catch-signal',
        //     translate('Signal Intermediate Catch Event'), // 中间信号捕获事件
        //     { eventDefinitionType: 'bpmn:SignalEventDefinition' }
        // ),
        // 'create.throw-signal-event': createAction(
        //     'bpmn:IntermediateThrowEvent',
        //     'intermediate',
        //     'bpmn-icon-intermediate-event-throw-signal',
        //     translate('Signal Intermediate Throw Event'), // 中间信号抛出事件
        //     { eventDefinitionType: "bpmn:SignalEventDefinition" }
        // ),
        // 'create.end-error-event': createAction(
        //     'bpmn:EndEvent',
        //     'end',
        //     'bpmn-icon-end-event-error',
        //     translate('Error End Event'), // 结束错误事件
        //     { eventDefinitionType: "bpmn:ErrorEventDefinition" }
        // ),
        // 'create.sub-process': {
        //     group: 'structure',
        //     className: 'bpmn-icon-subprocess-expanded',
        //     title: translate('Sub Process'), // 子流程
        //     action: {
        //         dragstart: createSubprocess,
        //         click: createSubprocess,
        //     },
        // },
        // 'create.call-activity': createAction(
        //     'bpmn:CallActivity',
        //     'structure',
        //     'bpmn-icon-call-activity',
        //     translate('Call Activity') // 调动活动
        // ),
        // 'create.pool': {
        //     group: 'lane',
        //     className: 'bpmn-icon-participant',
        //     title: translate('Pool'), // 池
        //     action: {
        //         dragstart: createParticipant,
        //         click: createParticipant,
        //     },
        // },
        // 'create.lane': {
        //     group: 'lane',
        //     className: 'bpmn-icon-lane',
        //     title: translate('Lane'), // 道
        //     action: {
        //         dragstart: createParticipant,
        //         click: createParticipant,
        //     },
        // }
        // 'create.event-gateway': createAction(
        //     'bpmn:EventBasedGateway',
        //     'more',
        //     'bpmn-icon-gateway-eventbased',
        //     translate('Event based Gateway') // 事件网关
        // ),
        // 'create.error-boundary-event': createAction(
        //     'bpmn:BoundaryEvent',
        //     'more',
        //     'bpmn-icon-intermediate-event-catch-error',
        //     translate('Error Boundary Event'), // 边界错误事件
        //     { eventDefinitionType: 'bpmn:ErrorEventDefinition' }
        // ),
        // 'create.compensation-boundary-event': createAction(
        //     'bpmn:BoundaryEvent',
        //     'more',
        //     'bpmn-icon-intermediate-event-catch-compensation',
        //     translate('Compensation Boundary Event'), // 边界修正事件
        //     { eventDefinitionType: "bpmn:CompensateEventDefinition" }
        // ),
    });

    return actions;
};

CustomPalette.$inject = ['palette', 'create', 'elementFactory', 'translate'];

CustomPalette.prototype = new F(); // 核心，将 F的实例赋值给子类；
CustomPalette.prototype.constructor = CustomPalette; // 修复子类CustomPalette的构造器指向，防止原型链的混乱；
