// モバイル用：イベント名とAPIを、モバイル用に置き換えています。
// 「JavaScript / CSSでカスタマイズ」画面の、「スマートフォン用のJavaScript / CSSファイル」の欄に追加してください。
(() => {
  'use strict';

  const PREFIX = 'ORD-';
  const pad = (n, len = 2) => String(n).padStart(len, '0');
  const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

  // 同じ受注番号のレコードが、すでにあるか（自分自身は除く）
  async function existsOrderNo(orderNo, ownId) {
    let query = `order_no = "${orderNo}"`;
    if (ownId) query += ` and $id != ${ownId}`;
    const resp = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
      app: kintone.mobile.app.getId(),
      query: `${query} limit 1`,
      fields: ['$id']
    });
    return resp.records.length > 0;
  }

  // 🟥 当日の受注番号のうち、最大の連番を取得して、+1 した番号を返す
  async function nextOrderNo(date) {
    const head = `${PREFIX}${ymd(date)}-`;
    const resp = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
      app: kintone.mobile.app.getId(),
      query: `order_no like "${head}" order by order_no desc limit 1`,
      fields: ['order_no']
    });
    const last = resp.records.length
      ? Number(resp.records[0].order_no.value.slice(head.length))
      : 0;
    return `${head}${pad(last + 1, 3)}`;
  }

  kintone.events.on([
    'mobile.app.record.create.submit',
    'mobile.app.record.edit.submit'
  ], async (event) => {
    const record = event.record;

    // 🟩 受注以外は、確認しない（無駄な通信を減らす）
    if (record['status'].value !== '受注') return event;

    try {
      if (!record['order_no'].value) {
        record['order_no'].value = await nextOrderNo(new Date());
      } else if (await existsOrderNo(record['order_no'].value, event.recordId)) {
        event.error = '受注番号が重複しています。';
        record['order_no'].error = '同じ受注番号が、すでに使われています。';
      }
    } catch (error) {
      // 🟩 通信に失敗したときは、保存を止めて、理由を伝える
      console.error(error);
      event.error = '受注番号の確認に失敗しました。時間をおいて、もう一度、お試しください。';
    }
    return event;
  });
})();
