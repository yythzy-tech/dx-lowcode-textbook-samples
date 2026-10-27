// PC・モバイル両対応：イベント名を両方に登録し、APIは画面に応じて切り替えます。
// PC用とスマートフォン用の、両方の欄に同じファイルを追加してください。
(() => {
  'use strict';

  // PC／モバイルで、APIの入り口を切り替える（イベント名が mobile. で始まるかで判定する）
  const kApp = (event) => (event.type.startsWith('mobile.') ? kintone.mobile.app : kintone.app);

  // 🟥 住所が未入力なら、保存前にエラーを表示して保存を止める
  kintone.events.on([
    'app.record.create.submit',
    'mobile.app.record.create.submit',
    'app.record.edit.submit',
    'mobile.app.record.edit.submit',
  ], (event) => {
    if (!event.record['address'].value) {
      event.record['address'].error =
        '住所を入力してください（QRコードの生成に必要です）';
    }
    return event;
  });

  kintone.events.on([
    'app.record.create.submit.success',
    'mobile.app.record.create.submit.success'
  ], async (event) => {
    // 🟩 alert() を削除し、SweetAlert2だけを表示する
    await Swal.fire({
      title: "作成成功",
      text: "QRコードを作成しました",
      icon: "success"
    });
    return event;
  });

  // QRコード生成（詳細表示時）
  kintone.events.on([
    'app.record.detail.show',
    'mobile.app.record.detail.show'
  ], (event) => {
    const el = kApp(event).record.getSpaceElement('qr_space');
    if (!el) return event;

    const address = event.record['address'].value;
    if (!address) return event;

    const mapUrl = `https://www.google.com/maps/search/?api=1&query=`
      + encodeURIComponent(address);

    if (window.QRCode) {
      new QRCode(el, { text: mapUrl, width: 128, height: 128 });
    }
    return event;
  });
})();
