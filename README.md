# マンホールカード・コレクター (Manhole Card Collector)

全国のマンホールカードをコレクション・管理するためのモダンなWebアプリケーションです。
公式サイトから取得した最新の正確なデータに基づき、美しいUIでカードの収集状況を管理できます。

### 🌍 公開サイト
**[https://manhole-card-collector.web.app](https://manhole-card-collector.web.app)**

## 🌟 主な特徴

- **正確なデータ**: 公式サイトを直接スクレイピングすることで、全1,222件（現時点）の正確な都道府県・自治体情報・弾数を反映。
- **高画質画像**: 公式のオリジナル画像へリンクしており、細部までクリアに確認可能。
- **クラウド同期**: Googleアカウントでログインすることで、複数の端末間でコレクション状況を同期可能。
- **オフライン体験**: PWA技術を採用。未ログイン状態でもブラウザのローカルストレージにデータを保存し、後からログインした際にクラウドへ自動移行します。
- **モダンなUI**: ダークテーマ、グラスモーフィズム、Framer Motionによるスムーズなアニメーションを採用したプレミアムなデザイン。

## 🚀 技術スタック

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Infrastructure**: [Google Cloud Platform (GCP)](https://cloud.google.com/), [Firebase](https://firebase.google.com/) (Hosting, Auth, Firestore)
- **IaC**: [Terraform](https://www.terraform.io/)
- **CI/CD**: [GitHub Actions](https://github.com/features/actions)
- **Data Scraping**: Python 3.11, [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/)

## 🛠 セットアップと実行

### 開発サーバーの起動
```bash
npm install
npm run dev
```

### インフラデプロイ (Terraform)
```bash
cd terraform
terraform init
terraform apply
```

## 📂 プロジェクト構造

- `src/`: Reactアプリケーションのソースコード
  - `contexts/`: 認証状態などのグローバル状態管理
  - `hooks/`: データ同期ロジックなどのカスタムフック
  - `components/`: UIコンポーネント
  - `lib/`: Firebase設定等の初期化コード
- `terraform/`: インフラ構成定義 (IaC)
- `.github/workflows/`: 自動デプロイ定義 (CI/CD)
- `scripts/`: データ抽出・スクレイピング用Pythonスクリプト
- `docs/`: 設計・構成情報の詳細ドキュメント
- `public/`: 静的アセット（PDFマニュアル等）

## 🤝 貢献について
不具合の報告や機能改善の提案は、GitHubのIssueまたはPull Requestで受け付けています。

## 📄 ライセンス
個人開発プロジェクトです。

