(() => {
  'use strict';

  // PC用のAPIの入り口（モバイル版では kintone.mobile.app になる）
  const kApp = kintone.app;

  kintone.events.on([
    'app.record.create.change.check_date',
    'app.record.edit.change.check_date',
  ], async (event) => {
    const checkDate = event.record['check_date'].value;
    if (!checkDate) return event;

    try {
      const csvUrl =
        'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';
      const [body] = await kintone.proxy(csvUrl, 'GET', {}, {});
      const holidays = body.split('\n').map(line => line.split(',')[0]);

      const nextDate = new Date(checkDate);
      nextDate.setMonth(nextDate.getMonth() + 1);

      while (true) {
        const day = nextDate.getDay();
        const dateStr = nextDate.getFullYear() + '/'
          + (nextDate.getMonth() + 1) + '/' + nextDate.getDate();
        if (day === 0 || day === 6 || holidays.includes(dateStr)) {
          nextDate.setDate(nextDate.getDate() + 1);
        } else {
          break;
        }
      }

      // 現在の画面のレコードを取得して、値をセットする
      const record = kApp.record.get();
      record.record['next_check'].value =
        nextDate.toISOString().split('T')[0];
      kApp.record.set(record);
    } catch (e) {
      console.error('祝日データの取得に失敗しました', e);
    }
    return event;
  });
})();
