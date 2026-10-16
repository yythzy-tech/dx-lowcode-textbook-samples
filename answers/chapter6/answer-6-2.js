(() => {
  'use strict';

  // 🟥 祝日データは、一度取得したら変数に保持して使い回す
  let holidaysCache = null;
  const loadHolidays = async () => {
    if (holidaysCache) return holidaysCache;
    const csvUrl =
      'https://www8.cao.go.jp/chosei/shukujitsu/syukujitsu.csv';
    const [body] = await kintone.proxy(csvUrl, 'GET', {}, {});
    holidaysCache = body.split('\n').map(line => line.split(',')[0]);
    return holidaysCache;
  };

  // 🟩 点検の種類（check_type）ごとに、次回までの間隔を切り替える
  const addInterval = (baseDate, checkType) => {
    const d = new Date(baseDate);
    switch (checkType) {
      case '2週間点検':
        d.setDate(d.getDate() + 14);
        break;
      case '3ヶ月点検':
        d.setMonth(d.getMonth() + 3);
        break;
      default:                      // 月次点検（未選択の場合も同じ）
        d.setMonth(d.getMonth() + 1);
    }
    return d;
  };

  kintone.events.on([
    'app.record.create.change.check_date',
    'app.record.edit.change.check_date',
    'app.record.create.change.check_type',  // 🟩 種類を変えた時も再計算
    'app.record.edit.change.check_type',
  ], async (event) => {
    const checkDate = event.record['check_date'].value;
    const checkType = event.record['check_type'].value;
    if (!checkDate) return event;

    try {
      const holidays = await loadHolidays();
      const nextDate = addInterval(checkDate, checkType);

      // 土日・祝日を避けるループ
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

      const record = kintone.app.record.get();
      record.record['next_check'].value =
        nextDate.toISOString().split('T')[0];
      kintone.app.record.set(record);
    } catch (e) {
      console.error('祝日データの取得に失敗しました', e);
    }
    return event;
  });
})();
