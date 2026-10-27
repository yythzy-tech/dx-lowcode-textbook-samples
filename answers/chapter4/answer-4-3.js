(() => {
  'use strict';

  // 日付と時刻から、"20261130-153045" の形の文字列を作る
  function formatStamp(date) {
    const pad = (n) => String(n).padStart(2, '0');
    const ymd = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
    const hms = `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
    return `${ymd}-${hms}`;
  }

  // 保存するとき：受注になったら、受注番号を自動で入れる
  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit'
  ], (event) => {
    const record = event.record;

    // 🟩 すでに受注番号があるときは、上書きしない
    if (record['status'].value === '受注' && !record['order_no'].value) {
      record['order_no'].value = `ORD-${formatStamp(new Date())}`;
    }
    return event;
  });

  // 🟥 画面を開いたとき：受注番号を、手入力できないようにする
  kintone.events.on([
    'app.record.create.show',
    'app.record.edit.show'
  ], (event) => {
    event.record['order_no'].disabled = true;
    return event;
  });
})();
