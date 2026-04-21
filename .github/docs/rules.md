# ブランチ戦略

## ブランチの種類

| タイプ | 役割 | 派生元 |
|--------|------|--------|
| `main` | Production環境との同期 | 無し |
| `develop` | dev環境との同期 | `main` |
| `feature` 等 | 機能追加・変更用のブランチ | `develop` |

## フロー

```
main
 └── develop
      └── feature/xxx  →（PR）→  develop  →（PR）→  main
```

## ルール

- 機能開発やバグ修正は `main` / `develop` ブランチで直接行わない
- `develop` → `main`、`feature` → `develop` へのマージはPRのみとする


# ブランチ命名規則

## 基本フォーマット

```
<type>/<short-description>
```

- `<type>`: ブランチの種類（下記参照）
- `<short-description>`: 内容を簡潔に表す英語のケバブケース

## ブランチタイプ一覧

| タイプ | 用途 | 例 |
|--------|------|----|
| `feature/` | 新機能の追加 | `feature/add-login-screen` |
| `fix/` | バグ修正 | `fix/crash-on-startup` |
| `style/` | UI変更・見た目 | `style/add-home-screen` |
| `chore/` | 設定・ツール・ドキュメントなどの整備 | `chore/set-up-claude-md` |
| `refactor/` | 機能変更を伴わないリファクタリング | `refactor/simplify-nav-logic` |
| `docs/` | ドキュメントのみの変更 | `docs/update-readme` |

## ルール

- 英語・小文字・ケバブケース（`kebab-case`）を使う
- 動詞から始める（`add-`, `fix-`, `update-` など）
- 短く明確に（3〜5単語程度）
- `main` / `develop` ブランチへの直接pushは禁止


# コミット命名規則

## 基本フォーマット

```
<type>: <summary>
```

- `<type>`: コミットの種類（下記参照）
- `<summary>`: 内容を簡潔に表す英語の要約

## コミットタイプ一覧

| タイプ | 用途 | 例 |
|--------|------|----|
| `feat` | 新機能の追加 | `feat: add user registration` |
| `fix` | バグ修正 | `fix: validate login parameters` |
| `style` | UI変更・見た目 | `style: add card components` |
| `chore` | 設定・ツール・ドキュメントなどの整備 | `chore: add authentication rules` |
| `refactor` | 機能変更を伴わないリファクタリング | `refactor: simplify navigation logic` |
| `docs` | ドキュメントのみの変更 | `docs: change ci/cd docs` |

## ルール

- 英語・小文字を使う
- 動詞から始める（`add`, `fix`, `update` など）
- 短く明確に（3〜5単語程度）、50文字以内に収める
- 1コミットにつき、1変更

# Issueの作成

- Issueを作成する際は、以下のテンプレートをdescriptionに記載してください。
- IssueのタイトルはPascalCaseで記載してください。（例：ホーム画面実装）

## Issueのテンプレート
```
## 概要
Issueの内容を簡潔に記載する

## 目的
なぜこのIssueを実装するのかを記載する

## 実装タスク
- [ ] タスク1
- [ ] タスク2
- [ ] タスク3

## 参考
関連するドキュメント・画面設計・外部リンクがあれば記載する
```

## ラベルの種類

| ラベル | 用途 |
|--------|------|
| `feature` | 新機能の実装 |
| `chore` | 環境構築・ライブラリ導入・設定 |
| `bug` | バグ修正 |
| `premium` | プレミアム機能 |
| `docs` | ドキュメントのみの変更 |

## ルール
- 1つのIssueは1つの機能・目的に絞る
- 実装タスクはチェックボックス形式で記載し、作業の進捗を追えるようにする
- 関連するIssueやPRがあれば本文中にリンクを記載する（例：close #1）


# PRの作成

- PRを作成する際は、以下のテンプレートをdescriptionに記載してください。
- PRのtitleは実装したブランチ名を元を記載してください。

## PRのテンプレート
```
## 概要
何を変更したかを記載する

## 確認方法
動作確認手順を記載する

## 影響反映
機能追加・変更に伴い、関連する機能があれば記載する。

## 関連Issue
関連するissueがあれば記載する。
```

## ルール
- 直接developやmainブランチにpushをしないこと
