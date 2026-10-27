// PC・モバイル両対応：イベント名を両方に登録し、APIは画面に応じて切り替えます。
// PC用とスマートフォン用の、両方の欄に同じファイルを追加してください。
(() => {
  'use strict';
  // 画面（PC／モバイル）に応じて、使うAPIを切り替える
  const setFieldShown = (code, isShown) => {
    const api = kintone.isMobilePage() ? kintone.mobile.app.record : kintone.app.record;
    api.setFieldShown(code, isShown);
  };


  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const UUID_DIGITS = 4; // 🟥 受注番号に付ける、UUIDの先頭の桁数

  // 追加画面を開いたとき
  kintone.events.on([
    'app.record.create.show',
    'mobile.app.record.create.show'
  ], (event) => {
    // 🟥 「再利用」で複製したときは、受注番号とUUIDを空にして、保存時に付け直す
    if (event.reuse) {
      event.record['order_no'].value = '';
      event.record['order_uuid'].value = '';
    }
    // 🟩 UUIDは、人が読むものではないので、見えなくする
    setFieldShown('order_uuid', false);
    return event;
  });

  // 詳細画面を開いたとき
  kintone.events.on([
    'app.record.detail.show',
    'mobile.app.record.detail.show'
  ], (event) => {
    setFieldShown('order_uuid', false);
    return event;
  });

  // 保存するとき：受注になったら、UUIDと受注番号を付ける
  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit',
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
