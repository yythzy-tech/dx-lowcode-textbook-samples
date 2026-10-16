(() => {
  'use strict';
 
  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit'
  ], (event) => {
    const record = event.record;
 
    const total = Number(record['total_amount'].value) || 0;
    const discount = Number(record['discount'].value) || 0;
 
    if (discount > total) {
      record['discount'].error = 'エラー！';
    }
 
    return event;
  });
})();
