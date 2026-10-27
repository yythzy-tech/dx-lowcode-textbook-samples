(() => {
  'use strict';

  kintone.events.on([
    'app.record.create.submit',
    'app.record.edit.submit'
  ], async (event) => {
    const record = event.record;
    const orderNo = record['order_no'].value;
    if (!orderNo) return event;

    // 同じ受注番号のレコードが、すでにないかを確認する（自分自身は除く）
    let query = `order_no = "${orderNo}"`;
    if (event.recordId) query += ` and $id != ${event.recordId}`;
    const resp = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
      app: kintone.app.getId(),
      query: `${query} limit 1`,
      fields: ['$id']
    });

    if (resp.records.length > 0) {
      event.error = '受注番号が重複しています。';
    }
    return event;
  });
})();
