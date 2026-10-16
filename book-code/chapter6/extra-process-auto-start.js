(() => {
  'use strict';
 
  kintone.events.on('app.record.index.show', async (event) => {
    const appId = kintone.app.getId();
    const today = new Date().toISOString().split('T')[0];
 
    // 次回点検予定の日を迎えたのに「点検予定」のままのレコードを検索
    const getResponse = await kintone.api(
      kintone.api.url('/k/v1/records', true),
      'GET',
      {
        app: appId,
        query: `next_check <= "${today}" and ステータス = "点検予定"`
      }
    );
 
    // 該当レコードを1件ずつ「点検中」へ進める
    for (const record of getResponse.records) {
      await kintone.api(
        kintone.api.url('/k/v1/record/status', true),
        'PUT',
        {
          app: appId,
          id: record['$id'].value,
          action: '点検開始',
          revision: record['$revision'].value
        }
      );
    }
 
    return event;
  });
})();
