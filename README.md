# DK 89-6184-60 花意配色票選

同事用部門與姓名，從六款不同花種的刺繡設計選出一款。每張卡提供花名、花語或文化象徵、DK 設計寓意，以及查核來源。

網站：https://rhk9003.github.io/dk-flower-vote/

## 六款設計

| ID | 名稱 | 花種 | DK 設計寓意 |
| --- | --- | --- | --- |
| sakura | 初櫻 | 粉櫻 | 重新開始 |
| forgetmenot | 相伴 | 勿忘我 | 珍惜相伴 |
| daisy | 小晴 | 白雛菊 | 日常小快樂 |
| lavender | 留白 | 薰衣草 | 從容留白 |
| osmanthus | 桂謝 | 金桂 | 收穫與感謝 |
| plum | 冬晴 | 白梅 | 韌性 |

花卉象徵因地域與文獻不同。文化象徵與品牌原創文案分開呈現。圖片為內建 imagegen 製作的 AI 開發示意，實際皮料、繡線與鞋型細節以打樣為準。

## 投票紀錄

- GitHub Pages 提供靜態前台。config.js 指向獨立 Sites Worker API，紀錄持久儲存於私人 D1 資料庫。
- 公開 API 只有匿名彙總與投票提交，不回傳姓名、部門或修改憑證。
- 後端以正規化後的部門與姓名判斷重複；這是內部記名意向調查，不是員工身分認證。
- 原瀏覽器保留隨機修改憑證，允許改票；另一裝置不可直接覆寫同名紀錄。
- 前端只有收到可讀且符合請求的伺服器確認才顯示成功；網路不明時重送同一請求。
- 管理匯出需管理者憑證，未放入 GitHub 或前端。私人資料也可由網站擁有者透過 Sites 資料工具讀取。
- 正式投票與測試 pollId 分離。正式投票不含功能測試票。

## 更新與檢查

編輯 index.html、styles.css、app.js、config.js 或 assets 後推送 main。GitHub Pages 使用 main 根目錄發布。

前端功能檢查：`node --test tests/frontend.test.js`。

本機 backend/ 是未部署的 Apps Script 備用實作，不會上傳到這個公開程式庫。實際 Worker 原始碼位於兄弟目錄 dk-flower-vote-api，並有獨立私人來源庫。
