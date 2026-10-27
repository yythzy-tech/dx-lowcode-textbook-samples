// モバイル用：イベント名とAPIを、モバイル用に置き換えています。
// 「JavaScript / CSSでカスタマイズ」画面の、「スマートフォン用のJavaScript / CSSファイル」の欄に追加してください。
(() => {
  'use strict';

  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const UUID_DIGITS = 4; // 🟥 受注番号に付ける、UUIDの先頭の桁数

  // 追加画面を開いたとき
  kintone.events.on('mobile.app.record.create.show', (event) => {
    // 🟥 「再利用」で複製したときは、受注番号とUUIDを空にして、保存時に付け直す
    if (event.reuse) {
      event.record['order_no'].value = '';
      event.record['order_uuid'].value = '';
    }
    // 🟩 UUIDは、人が読むものではないので、見えなくする
    kintone.mobile.app.record.setFieldShown('order_uuid', false);
    return event;
  });

  // 詳細画面を開いたとき
  kintone.events.on('mobile.app.record.detail.show', (event) => {
    kintone.mobile.app.record.setFieldShown('order_uuid', false);
    return event;
  });

  // 保存するとき：受注になったら、UUIDと受注番号を付ける
  kintone.events.on([
    'mobile.app.record.create.submit',
    'mobile.app.record.edit.submit'
  ], (event) => {
    const record = event.record;
    if (record['status'].value !== '受注') return event;

    // 🟦 UUIDを付ける（すでにあれば、そのまま）
    if (!record['order_uuid'].value) {
      record['order_uuid'].value = crypto.randomUUID();
    }
    // 🟥 受注番号は、日付 ＋ UUIDの先頭の数桁
    if (!record['order_no'].value) {
      record['order_no'].value =
        `ORD-${ymd(new Date())}-${record['order_uuid'].value.slice(0, UUID_DIGITS)}`;
    }
    return event;
  });
})();
