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
      // 🟦
      event.error = '入力内容を確認してください。赤字になる値引きは設定できません。';
      record['discount'].error = '値引き額が合計金額を超えています！';
    } else if (discount > total * 0.3) {
      // 🟩
      event.error = '入力内容を確認してください。値引きの上限ルールに抵触しています';
      record['discount'].error = '値引き額が合計金額の３割を超えています！';
    }
 
    // 🟥
    const status = record['status'].value;
    const quoteDate = record['quote_date'].value;
    if (status === '受注' && !quoteDate) {
      event.error = '入力内容に不備があります。見積日が未入力です';
      record['quote_date'].error = '受注する際は、見積日の入力が必要です。';
    }
 
    return event;
  });
})();
