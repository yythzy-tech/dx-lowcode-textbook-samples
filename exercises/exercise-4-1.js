(() => {
  'use strict';
 
  kintone.events.on([
    'app.record.create.show',
    'app.record.edit.show',
    'app.record.create.change.status',
    'app.record.edit.change.status'
  ], (event) => {
    const record = event.record;
    const status = record['status'].value;
 
    if (status !== '作成中') {                 // 🟩
      record['quote_date'].disabled = true;
      record['？？？？？？'].disabled = true;   // 🟦
    }
 
    if (status === '失注') {                   // 🟥
      kintone.app.record.setFieldShown('reason', true);
    } else {
      kintone.app.record.setFieldShown('reason', false);
    }
 
    return event;
  });
})();
