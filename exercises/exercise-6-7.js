(() => {
  'use strict';

  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit'
  ], (event) => {
    const record = event.record;

    if (record['status'].value === '受注' && !record['order_uuid'].value) {
      record['order_uuid'].value = crypto.randomUUID();
    }
    return event;
  });
})();
