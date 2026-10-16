// モバイル用：イベント名とAPIを、モバイル用に置き換えています。
// 「JavaScript / CSSでカスタマイズ」画面の、「スマートフォン用のJavaScript / CSSファイル」の欄に追加してください。
(() => {
  'use strict';
 
  kintone.events.on([
    'mobile.app.record.create.show',
    'mobile.app.record.edit.show',
    'mobile.app.record.create.change.status',
    'mobile.app.record.edit.change.status'
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
 
    kintone.mobile.app.record.setFieldShown('reason', status === '失注');  // 🟥
 
    return event;
  });
})();
