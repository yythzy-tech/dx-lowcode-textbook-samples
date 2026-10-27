(() => {
  'use strict';

  // 日付と時刻から、"20261130-153045" の形の文字列を作る
  function formatStamp(date) {
    const pad = (n) => String(n).padStart(2, '0');
    const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
    const hms = `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    return `${ymd}-${hms}`;
  }

  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit'
  ], (event) => {
    const record = event.record;

    if (record['status'].value === '受注') {
      record['order_no'].value = `ORD-${formatStamp(new Date())}`;
    }
    return event;
  });
})();
