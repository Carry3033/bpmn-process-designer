import { assign, forEach, isArray } from 'min-dash';

import { is } from 'bpmn-js/lib/util/ModelUtil';

import { isExpanded, isEventSubProcess } from 'bpmn-js/lib/util/DiUtil';

import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import { getChildLanes } from 'bpmn-js/lib/features/modeling/util/LaneUtil';

import { hasPrimaryModifier } from 'diagram-js/lib/util/Mouse';

import ReplaceMenuProvider from "bpmn-js/lib/features/popup-menu/ReplaceMenuProvider";

/**
 * A provider for BPMN 2.0 elements context pad
 */
export default function ContextPadProvider(
    config,
    injector,
    eventBus,
    contextPad,
    modeling,
    elementFactory,
    connect,
    create,
    popupMenu,
    canvas,
    rules,
    translate,
    elementRegistry
) {
    config = config || {};

    contextPad.registerProvider(this);

    this._contextPad = contextPad;

    this._modeling = modeling;

    this._elementFactory = elementFactory;
    this._connect = connect;
    this._create = create;
    this._popupMenu = popupMenu;
    this._canvas = canvas;
    this._rules = rules;
    this._translate = translate;

    if (config.autoPlace !== false) {
        this._autoPlace = injector.get('autoPlace', false);
    }

    eventBus.on('create.end', 250, function (event) {
        const context = event.context,
            shape = context.shape;

        if (!hasPrimaryModifier(event) || !contextPad.isOpen(shape)) {
            return;
        }

        const entries = contextPad.getEntries(shape);

        if (entries.replace) {
            entries.replace.action.click(event, shape);
        }
    });
}

ContextPadProvider.$inject = [
    'config.contextPad',
    'injector',
    'eventBus',
    'contextPad',
    'modeling',
    'elementFactory',
    'connect',
    'create',
    'popupMenu',
    'canvas',
    'rules',
    'translate',
    'elementRegistry',
];

ContextPadProvider.prototype.getContextPadEntries = function (element) {
    const contextPad = this._contextPad,
        modeling = this._modeling,
        elementFactory = this._elementFactory,
        connect = this._connect,
        create = this._create,
        popupMenu = this._popupMenu,
        canvas = this._canvas,
        rules = this._rules,
        autoPlace = this._autoPlace,
        translate = this._translate,
        deleteEntries = [
            // 开始事件
            'replace-with-conditional-start',
            'replace-with-message-start',
            'replace-with-timer-start',
            'replace-with-none-intermediate-throwing',
            'replace-with-signal-start', // 信号事件
            // 中间事件
            'replace-with-none-intermediate-throw',
            'replace-with-compensation-intermediate-throw',
            'replace-with-conditional-intermediate-catch',
            'replace-with-escalation-intermediate-throw',
            'replace-with-link-intermediate-catch',
            'replace-with-link-intermediate-throw',
            'replace-with-message-intermediate-catch',
            'replace-with-message-intermediate-throw',
            'replace-with-signal-intermediate-throw',
            // 边界事件
            'replace-with-compensation-boundary', // 边界修正事件
            'replace-with-conditional-boundary',
            'replace-with-error-boundary', // 边界错误事件
            'replace-with-escalation-boundary',
            'replace-with-message-boundary',
            'replace-with-non-interrupting-conditional-boundary',
            'replace-with-non-interrupting-escalation-boundary',
            'replace-with-non-interrupting-message-boundary',
            'replace-with-non-interrupting-signal-boundary',
            'replace-with-non-interrupting-timer-boundary',
            'replace-with-timer-boundary',
            // 结束事件
            'replace-with-compensation-end',
            'replace-with-error-end',
            'replace-with-escalation-end',
            'replace-with-message-end',
            'replace-with-signal-end',
            'replace-with-terminate-end',
            // 任务
            'replace-with-call-activity',
            'replace-with-collapsed-subprocess',
            'replace-with-expanded-subprocess',
            'replace-with-manual-task',
            'replace-with-receive-task',
            'replace-with-rule-task',
            'replace-with-script-task',
            'replace-with-send-task', // 发送任务 邮件任务
            'replace-with-task',
            // 网关
            'replace-with-complex-gateway',
            'replace-with-event-based-gateway', // 事件网关
            'replace-with-inclusive-gateway',
        ];

    const actions = {};

    if (element.type === 'label') {
        return actions;
    }

    const businessObject = element.businessObject;

    function startConnect(event, element) {
        connect.start(event, element);
    }

    function removeElement() {
        modeling.removeElements([element]);
    }

    function getReplaceMenuPosition(element) {
        const Y_OFFSET = 5;

        const diagramContainer = canvas.getContainer(),
            pad = contextPad.getPad(element).html;

        const diagramRect = diagramContainer.getBoundingClientRect(),
            padRect = pad.getBoundingClientRect();

        const top = padRect.top - diagramRect.top;
        const left = padRect.left - diagramRect.left;

        const pos = {
            x: left,
            y: top + padRect.height + Y_OFFSET,
        };

        return pos;
    }

    /**
     * Create an append action
     *
     * @param {string} type
     * @param {string} className
     * @param {string} [title]
     * @param {Object} [options]
     *
     * @return {Object} descriptor
     */
    function appendAction(type, className, title, options) {
        if (typeof title !== 'string') {
            options = title;
            title = translate('Append {type}', {
                type: type.replace(/^bpmn:/, ''),
            });
        }

        function appendStart(event, element) {
            const shape = elementFactory.createShape(
                assign({ type: type }, options)
            );

            if (options) {
                shape.businessObject.name = options.name;
            }

            create.start(event, shape, {
                source: element,
            });
        }

        const append = autoPlace
            ? function (event, element) {
                  const shape = elementFactory.createShape(
                      assign({ type: type }, options)
                  );

                  if (options) {
                      shape.businessObject.name = options.name;
                  }

                  autoPlace.append(element, shape);
              }
            : appendStart;

        return {
            group: 'model',
            className: className,
            title: title,
            action: {
                dragstart: appendStart,
                click: append,
            },
        };
    }

    function splitLaneHandler(count) {
        return function (event, element) {
            // actual split
            modeling.splitLane(element, count);

            // refresh context pad after split to
            // get rid of split icons
            contextPad.open(element, true);
        };
    }

    // 删除标题条目
    // ReplaceMenuProvider.prototype._getLoopEntries = function () {
    //     return [];
    // }

    if (
        isAny(businessObject, ['bpmn:Lane', 'bpmn:Participant']) &&
        isExpanded(businessObject)
    ) {
        const childLanes = getChildLanes(element);

        assign(actions, {
            'lane-insert-above': {
                group: 'lane-insert-above',
                className: 'bpmn-icon-lane-insert-above',
                title: translate('Add Lane above'),
                action: {
                    click: function (event, element) {
                        modeling.addLane(element, 'top');
                    },
                },
            },
        });

        if (childLanes.length < 2) {
            if (element.height >= 120) {
                assign(actions, {
                    'lane-divide-two': {
                        group: 'lane-divide',
                        className: 'bpmn-icon-lane-divide-two',
                        title: translate('Divide into two Lanes'),
                        action: {
                            click: splitLaneHandler(2),
                        },
                    },
                });
            }

            if (element.height >= 180) {
                assign(actions, {
                    'lane-divide-three': {
                        group: 'lane-divide',
                        className: 'bpmn-icon-lane-divide-three',
                        title: translate('Divide into three Lanes'),
                        action: {
                            click: splitLaneHandler(3),
                        },
                    },
                });
            }
        }

        assign(actions, {
            'lane-insert-below': {
                group: 'lane-insert-below',
                className: 'bpmn-icon-lane-insert-below',
                title: translate('Add Lane below'),
                action: {
                    click: function (event, element) {
                        modeling.addLane(element, 'bottom');
                    },
                },
            },
        });
    }

    if (is(businessObject, 'bpmn:FlowNode')) {
        if (is(businessObject, 'bpmn:EventBasedGateway')) {
            assign(actions, {
                'append.receive-task': appendAction(
                    'bpmn:ReceiveTask',
                    'bpmn-icon-receive-task',
                    translate('Append ReceiveTask')
                ),
                'append.message-intermediate-event': appendAction(
                    'bpmn:IntermediateCatchEvent',
                    'bpmn-icon-intermediate-event-catch-message',
                    translate('Append MessageIntermediateCatchEvent'),
                    { eventDefinitionType: 'bpmn:MessageEventDefinition' }
                ),
                'append.timer-intermediate-event': appendAction(
                    'bpmn:IntermediateCatchEvent',
                    'bpmn-icon-intermediate-event-catch-timer',
                    translate('Append TimerIntermediateCatchEvent'),
                    { eventDefinitionType: 'bpmn:TimerEventDefinition' }
                ),
                'append.condition-intermediate-event': appendAction(
                    'bpmn:IntermediateCatchEvent',
                    'bpmn-icon-intermediate-event-catch-condition',
                    translate('Append ConditionIntermediateCatchEvent'),
                    { eventDefinitionType: 'bpmn:ConditionalEventDefinition' }
                ),
                'append.signal-intermediate-event': appendAction(
                    'bpmn:IntermediateCatchEvent',
                    'bpmn-icon-intermediate-event-catch-signal',
                    translate('Append SignalIntermediateCatchEvent'),
                    { eventDefinitionType: 'bpmn:SignalEventDefinition' }
                ),
            });
        } else if (
            isEventType(
                businessObject,
                'bpmn:BoundaryEvent',
                'bpmn:CompensateEventDefinition'
            )
        ) {
            assign(actions, {
                'append.compensation-activity': appendAction(
                    'bpmn:UserTask',
                    'bpmn-icon-user-task',
                    translate('Append compensation activity'),
                    {
                        isForCompensation: true,
                        height: 40
                    }
                ),
            });
        } else if (
            !is(businessObject, 'bpmn:EndEvent') &&
            !businessObject.isForCompensation &&
            !isEventType(
                businessObject,
                'bpmn:IntermediateThrowEvent',
                'bpmn:LinkEventDefinition'
            ) &&
            !isEventSubProcess(businessObject)
        ) {
            assign(actions, {
                'append.end-event': appendAction(
                    'bpmn:EndEvent',
                    'bpmn-icon-end-event-none',
                    translate('Append EndEvent'),
                    { name: translate('End') }
                ),
                'append.gateway': appendAction(
                    'bpmn:ExclusiveGateway',
                    'bpmn-icon-gateway-none',
                    translate('Append Gateway')
                ),
                'append.append-task': appendAction(
                    'bpmn:UserTask',
                    'bpmn-icon-user-task',
                    translate('Append Task'),
                    { height: 40 }
                ),
                'append.intermediate-event': appendAction(
                    'bpmn:IntermediateThrowEvent',
                    'bpmn-icon-intermediate-event-none',
                    translate('Append Intermediate/Boundary Event')
                ),
            });
        }
    }

    // 用来隐藏部分可替换元素 deleteEntries
    popupMenu.registerProvider('bpmn-replace', {
        getPopupMenuEntries () {
            return function (_entries) {
                const entries = Object.assign({}, _entries);
                deleteEntries.forEach(palette => delete entries[palette]);
                return entries;
            }
        }
    })

    if (!popupMenu.isEmpty(element, 'bpmn-replace')) {
        // Replace menu entry
        assign(actions, {
            replace: {
                group: 'edit',
                className: 'bpmn-icon-screw-wrench',
                title: translate('Change type'),
                action: {
                    click: function (event, element) {
                        var position = assign(getReplaceMenuPosition(element), {
                            cursor: { x: event.x, y: event.y },
                        });

                        popupMenu.open(element, 'bpmn-replace', position);
                    },
                },
            },
        });
    }

    if (
        isAny(businessObject, [
            'bpmn:FlowNode',
            'bpmn:InteractionNode',
            'bpmn:DataObjectReference',
            'bpmn:DataStoreReference',
        ])
    ) {
        assign(actions, {
            'append.text-annotation': appendAction(
                'bpmn:TextAnnotation',
                'bpmn-icon-text-annotation'
            ),

            connect: {
                group: 'connect',
                className: 'bpmn-icon-connection-multi',
                title: translate(
                    'Connect using ' +
                        (businessObject.isForCompensation
                            ? ''
                            : 'Sequence/MessageFlow or ') +
                        'Association'
                ),
                action: {
                    click: startConnect,
                    dragstart: startConnect,
                },
            },
        });
    }

    if (
        isAny(businessObject, [
            'bpmn:DataObjectReference',
            'bpmn:DataStoreReference',
        ])
    ) {
        assign(actions, {
            connect: {
                group: 'connect',
                className: 'bpmn-icon-connection-multi',
                title: translate('Connect using DataInputAssociation'),
                action: {
                    click: startConnect,
                    dragstart: startConnect,
                },
            },
        });
    }

    if (is(businessObject, 'bpmn:Group')) {
        assign(actions, {
            'append.text-annotation': appendAction(
                'bpmn:TextAnnotation',
                'bpmn-icon-text-annotation'
            ),
        });
    }

    // delete element entry, only show if allowed by rules
    var deleteAllowed = rules.allowed('elements.delete', {
        elements: [element],
    });

    if (isArray(deleteAllowed)) {
        // was the element returned as a deletion candidate?
        deleteAllowed = deleteAllowed[0] === element;
    }

    if (deleteAllowed) {
        assign(actions, {
            delete: {
                group: 'edit',
                className: 'bpmn-icon-trash',
                title: translate('Remove'),
                action: {
                    click: removeElement,
                },
            },
        });
    }

    return actions;
};

// helpers /////////

function isEventType(eventBo, type, definition) {
    var isType = eventBo.$instanceOf(type);
    var isDefinition = false;

    var definitions = eventBo.eventDefinitions || [];
    forEach(definitions, function (def) {
        if (def.$type === definition) {
            isDefinition = true;
        }
    });

    return isType && isDefinition;
}
