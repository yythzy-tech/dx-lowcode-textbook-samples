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
 
    if (status !== '作成中') {
      record['quote_date'].disabled = true;
      record['customer_name'].disabled = true;   // 🟦
    } else {                                     // 🟩
      record['quote_date'].disabled = false;
      record['customer_name'].disabled = false;
    }
    /** 🟥 => こうとも書けるけど、何度も判定させるのを嫌う人もいるので臨機応変に
     * record['quote_date'].disabled = (status !== '作成中');
     * record['customer_name'].disabled = (status !== '作成中');
     */
 
    kintone.app.record.setFieldShown('reason', status === '失注');  // 🟥
 
    return event;
  });
})();
