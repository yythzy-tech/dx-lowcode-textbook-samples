// PC・モバイル両対応：イベント名を両方に登録し、APIは画面に応じて切り替えます。
// PC用とスマートフォン用の、両方の欄に同じファイルを追加してください。
(() => {
  'use strict';

  // PC／モバイルで、APIの入り口を切り替える
  const kApp = () => (kintone.isMobilePage() ? kintone.mobile.app : kintone.app);
 
  kintone.events.on([
    'app.record.create.show',
    'mobile.app.record.create.show',
    'app.record.edit.show',
    'mobile.app.record.edit.show',
    'app.record.create.change.status',
    'mobile.app.record.create.change.status',
    'app.record.edit.change.status',
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
 
    kApp().record.setFieldShown('reason', status === '失注');  // 🟥
 
    return event;
  });
})();
