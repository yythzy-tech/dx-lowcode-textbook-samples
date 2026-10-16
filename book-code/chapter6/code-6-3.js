(() => {
  'use strict';
 
  // SweetAlert2で、見栄えのよいダイアログを表示
  kintone.events.on(
    'app.record.create.submit.success', async (event) => {
    // 比較用に、従来の alert() で表示
    alert('QRコードを作成しました');
 
    // ライブラリ/CSS が読み込まれている前提
    await Swal.fire({
      title: "作成成功",
      text: "QRコードを作成しました",
      icon: "success"
    })
 
    return event;
  });
 
  // QRコード生成（詳細表示時）
  kintone.events.on('app.record.detail.show', (event) => {
    // レコード詳細画面の「QRコード」領域を取得
    const el = kintone.app.record.getSpaceElement('qr_space');
    if (!el) return event;
 
    // 住所フィールドから住所を取得
    const address = event.record['address'].value;
    if (!address) return;
 
    // その住所から、Google MapへのURLを構築
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=`
      + encodeURIComponent(address);
 
    // ライブラリ qrcode.js が読み込まれている前提
    if (window.QRCode) {
      // QRコード領域に、ライブラリ関数を使って作成した画像をセットする
      new QRCode(el, {
        text: mapUrl, // Google Mapへのリンクを指定
        width: 128,
        height: 128
      });
    }
 
    return event;
  });
})();
