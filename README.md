# マンホールカード・コレクター (Manhole Card Collector)

全国のマンホールカードをコレクション・管理するためのモダンなWebアプリケーションです。
公式サイトから取得した最新の正確なデータに基づき、美しいUIでカードの収集状況を管理できます。

### 🌍 公開サイト
**[https://manhole-card-collector.web.app](https://manhole-card-collector.web.app)**

## 🌟 主な特徴

- **正確なデータ**: 公式サイトを直接スクレイピングすることで、全1,222件（現時点）の正確な都道府県・自治体情報・弾数を反映。
- **高画質画像**: 公式のオリジナル画像へリンクしており、細部までクリアに確認可能。
- **直感的な操作**: 検索機能や都道府県別の絞り込み。
- **オフライン体験**: PWA対応。収集データはブラウザのローカルストレージに安全に保存されます。
- **モダンなUI**: ダークテーマ、グラスモーフィズム、スムーズなアニメーションを採用。

## 🚀 技術スタック

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, Lucide React
- **Backend/Infra**: Firebase (Hosting, Auth, Firestore), Terraform
- **CI/CD**: GitHub Actions
- **Data Scraping**: Python (BeautifulSoup)

## 🛠 セットアップと実行

### 開発サーバーの起動
```bash
npm install
npm run dev
```

### データの更新（スクレイピング）
```bash
python scripts/scrape_official_web.py
```

## 📂 プロジェクト構造

- `src/`: Reactアプリケーションのソースコード
- `scripts/`: データ抽出・スクレイピング用Pythonスクリプト
- `public/`: 静的アセット（PDFマニュアル等）
- `legacy/v1/`: 以前のNext.jsバージョンのバックアップ（Git非追跡）

## 🤝 貢献について
不具合の報告や機能改善の提案は、GitHubのIssueまたはPull Requestで受け付けています。

## 📄 ライセンス
個人開発プロジェクトです。
