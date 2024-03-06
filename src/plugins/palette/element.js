const paletteElement = {
    // 工具
    tool: {
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
    },
    // 开始事件
    start: {
        // 开始事件
        'create.start-event': createAction(
            'bpmn:StartEvent',
            'startEvent',
            'bpmn-icon-start-event-none',
            translate('Create StartEvent'),
            { name: translate('Start') }
        ),
        // 开始信号事件
        'create.start-signal-event': createAction(
            'bpmn:StartEvent',
            'startEvent',
            'bpmn-icon-start-event-signal',
            translate('Signal Start Event'),
            { eventDefinitionType: 'bpmn:SignalEventDefinition' }
        ),
        // 开始定时事件
        'create.start-timer-event': createAction(
            'bpmn:StartEvent',
            'startEvent',
            'bpmn-icon-start-event-timer',
            translate('Timer Start Event'),
            { eventDefinitionType: 'bpmn:TimerEventDefinition' }
        ),
    },
    // 中间事件
    intermediate: {
        // 中间事件
        'create.throw-none-event': createAction(
            'bpmn:IntermediateThrowEvent',
            'intermediateEvent',
            'bpmn-icon-intermediate-event-none',
            translate('Intermediate Throw Event')
        ),
        // 中间定时捕获事件
        'create.catch-timer-event': createAction(
            'bpmn:IntermediateCatchEvent',
            'intermediateEvent',
            'bpmn-icon-intermediate-event-catch-timer',
            translate('Timer Intermediate Catch Event'),
            { eventDefinitionType: 'bpmn:TimerEventDefinition' }
        ),
        // 中间信号捕获事件
        'create.catch-signal-event': createAction(
            'bpmn:IntermediateCatchEvent',
            'intermediateEvent',
            'bpmn-icon-intermediate-event-catch-signal',
            translate('Signal Intermediate Catch Event'),
            { eventDefinitionType: 'bpmn:SignalEventDefinition' }
        ),
        // 中间信号抛出事件
        'create.throw-signal-event': createAction(
            'bpmn:IntermediateThrowEvent',
            'intermediateEvent',
            'bpmn-icon-intermediate-event-throw-signal',
            translate('Signal Intermediate Throw Event'),
            { eventDefinitionType: 'bpmn:SignalEventDefinition' }
        ),
    },
    // 边界事件
    boundary: {
        // 边界错误事件
        'create.error-boundary-event': createAction(
            'bpmn:BoundaryEvent',
            'boundaryEvent',
            'bpmn-icon-intermediate-event-catch-error',
            translate('Error Boundary Event'),
            { eventDefinitionType: 'bpmn:ErrorEventDefinition' }
        ),
        // 边界修正事件
        'create.compensation-boundary-event': createAction(
            'bpmn:BoundaryEvent',
            'boundaryEvent',
            'bpmn-icon-intermediate-event-catch-compensation',
            translate('Compensation Boundary Event'),
            { eventDefinitionType: 'bpmn:CompensateEventDefinition' }
        ),
    },
    // 结束事件
    end: {
        // 结束事件
        'create.end-event': createAction(
            'bpmn:EndEvent',
            'endEvent',
            'bpmn-icon-end-event-none',
            translate('End Event'),
            { name: translate('End') }
        ),
        // 结束错误事件
        'create.end-error-event': createAction(
            'bpmn:EndEvent',
            'endEvent',
            'bpmn-icon-end-event-error',
            translate('Error End Event'),
            { eventDefinitionType: 'bpmn:ErrorEventDefinition' }
        ),
    },
    // 网关
    gateway: {
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
        // 事件网关
        'create.event-gateway': createAction(
            'bpmn:EventBasedGateway',
            'gateway',
            'bpmn-icon-gateway-eventbased',
            translate('Event based Gateway')
        ),
    },
    // 任务
    task: {
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
            'task',
            'bpmn-icon-send-task',
            translate('Send Task'),
            { height: 40 }
        ),
    },
    // 子流程
    subprocess: {
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
    },
    // 数据
    data: {
        // 数据对象
        'create.data-object': createAction(
            'bpmn:DataObjectReference',
            'data-object',
            'bpmn-icon-data-object',
            translate('Create DataObjectReference')
        ),
        // 数据存储
        'create.data-store': createAction(
            'bpmn:DataStoreReference',
            'data-store',
            'bpmn-icon-data-store',
            translate('Create DataStoreReference')
        ),
    },
    // 池
    pool: {
        // 创建池/参与者
        'create.participant-expanded': {
            group: 'pool',
            className: 'bpmn-icon-participant', // bpmn-icon-lane
            title: translate('Create Pool/Participant'),
            action: {
                dragstart: createParticipant,
                click: createParticipant,
            },
        },
    },
    // 组
    group: {
        // 组
        'create.group': createAction(
            'bpmn:Group',
            'group',
            'bpmn-icon-group',
            translate('Create Group')
        ),
    },
};

// 避免代码报错
let actions = {},
    create = this._create,
    elementFactory = this._elementFactory,
    spaceTool = this._spaceTool,
    lassoTool = this._lassoTool,
    handTool = this._handTool,
    globalConnect = this._globalConnect,
    translate = this._translate,
    createAction = this._createAction,
    createSubprocess = this.createSubprocess,
    createParticipant = this.createParticipant;
