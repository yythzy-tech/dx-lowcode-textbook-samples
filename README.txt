解答例 JavaScriptファイル一式
「DXを加速するローコード開発」

■ ファイル名の規則
  解答例X-Y.js          PC向け
                        →「JavaScript / CSSでカスタマイズ」画面の「PC用のJavaScript / CSSファイル」の欄に追加
  解答例X-Y_mobile.js   モバイル向け
                        →「スマートフォン用のJavaScript / CSSファイル」の欄に追加
  解答例X-Y_both.js     PC・モバイル両対応
                        → PC用とスマートフォン用の、両方の欄に、同じファイルを追加

  フォルダは、章ごとに分けています（第3章〜第6章）。
  文字コードは、UTF-8（BOMなし）です。

■ 試す前の準備（アプリとフィールド）
  3-1  見積管理アプリ（status）
  4-1  見積管理アプリ（status, quote_date, customer_name, reason）
  4-2  見積管理アプリ（total_amount, discount, status, quote_date）
  5-1  見積管理アプリ ＋ 在庫管理アプリ
  5-3  （コード中の inventAppId = 9999 を、ご自身の在庫管理アプリのアプリIDに書き換える）
  6-1  現場メンテナンスアプリ（zip_code, address）
  6-2  現場メンテナンスアプリ（check_date, next_check）
       ＋ ドロップダウン「点検の種類」（check_type：2週間点検／月次点検／3ヶ月点検）を追加
  6-3  現場メンテナンスアプリ（address, qr_space）
       ＋ 本書6.6節の手順で、SweetAlert2とqrcode.jsを先に追加しておく
  6-4  現場メンテナンスアプリ（check_date, next_check）
  6-5  議事録管理アプリ（minutes, summary_textrank, summary_ai）
       ※ kintoneの生成AI用API（kintone.ai.generateText()）を使います。開発を検討中のAPI（APIラボ）のため、
         ①「アップデートオプション」の「検討中の新機能」で、「kintone AI：生成AIでテキストを生成する
           JavaScript API」を有効にする
         ②kintone AIを有効にし、AI機能一覧の「生成AIでテキストを生成するJavaScript API」を有効にする
         の両方が必要です。APIキーは不要です。実行すると、AIクレジットを消費します。
         仕様は、正式版で変わる可能性があります。
  6-6  現場メンテナンスアプリ（プロセス管理を設定済み、photo）
       ＋ 文字列（複数行）「対応内容」（action_note）を追加

■ 注意
  ・解答例5-1・5-3・6-5は、本書では「差分」だけを載せています。
    このファイル一式は、演習のコードに、差分を適用した完全版です。
  ・解答例6-4のPC版（解答例6-4.js）は、コード6-2のPC版と同じ考え方です。
    両対応版（解答例6-4_both.js）が、本書に載っているコードです。
  ・モバイル向けと両対応のファイルは、PC版から、次の規則で機械的に作っています。
      イベント名：app.record.… → mobile.app.record.…
      API       ：kintone.app.… → kintone.mobile.app.…
      両対応版  ：イベント名を両方に登録し、APIは kintone.isMobilePage() で切り替える
  ・全33ファイルについて、kintoneの動作を模した環境で、分岐や計算結果などを217項目確認しています
    （PC版がモバイル用のAPIを、モバイル版がPC用のAPIを、使っていないことも含みます）。
    ただし、実際のkintone（特にスマートフォン）での動作確認は、していません。
    ご自身の環境で、一度、動かしてからお使いください。
