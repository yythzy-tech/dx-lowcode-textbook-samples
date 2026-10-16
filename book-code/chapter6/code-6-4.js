(() => {
  'use strict';
 
  // PCとモバイルの両方で動かす
  kintone.events.on([
    'app.record.create.change.zip_code',
    'app.record.edit.change.zip_code',
    'mobile.app.record.create.change.zip_code',
    'mobile.app.record.edit.change.zip_code',
  ], async (event) => {
    const zip = event.record['zip_code'].value;
    if (zip?.length !== 7) return event;
 
    // イベント名が mobile. で始まれば、モバイルの画面
    const isMobile = event.type.startsWith('mobile.');
    // PCとモバイルで、使うAPIの入り口を切り替える
    const kApp = isMobile ? kintone.mobile.app : kintone.app;
 
    const [body] = await kintone.proxy(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`,
      'GET', {}, {});
    const response = JSON.parse(body);
 
    if (response.results) {
      const res = response.results[0];
      const record = kApp.record.get();
      const full = res.address1 + res.address2 + res.address3;
      record.record['address'].value = full;
      kApp.record.set(record);
    }
    return event;
  });
})();
