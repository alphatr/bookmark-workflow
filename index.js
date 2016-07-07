const Alfred = require('alfred-workflow-nodejs');
const common = require('./common');

const actionHandler = Alfred.actionHandler;
const workflow = Alfred.workflow;
const Item = Alfred.Item;

workflow.setName('bookmark-workflow');

(function main() {
    actionHandler.onAction('mark', query => {
        common.query(query).then(list => {
            list.forEach(each => workflow.addItem(new Item(each)));

            if (!list.length) {
                workflow.addItem(new Item({
                    uid: 'markerror',
                    title: '糟糕...',
                    arg: `https://amark.baipan.me/`,
                    icon: Alfred.ICONS.WARNING,
                    subtitle: '没找到符合条件的书签, 去网站看看？',
                    valid: true
                }));
            }

            workflow.feedback();
        });
    });

    Alfred.run();
}());
