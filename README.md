# 概要
## 内容
1. マイク使用を許可いただきます
2. 録音開始を押下し、言葉を話していただきます。
3. 喋り終わった時点で、録音停止を押下します。
4. バックエンドからの結果が画面上に表示され、結果をCSVとして出力可能です。


# 環境情報
- macOS 12.0.1
- Chrome 95.0.4638.69
- docker 4.1.1
- Java (Spring Boot)
- JavaScript
- HTML5
- GCP Speech-to-Text


# 環境構築手順
## 作業ディレクトリについて
### docker
docker-composeで使う設定ファルを置いています。

### document
テスト仕様書を入れています。

### frontpage
フロントのページの実装を格納しています。
フロントの操作はこのディレクトリに入れています。
index.htmlをChromeで開いていただく形になります。

### spring_project
バックエンドのプログラムが入っています。
こちらを後で記述する方法でビルドいただき、javaコマンドで実行いただきます。

### vue_project
はじめこちらでフロントを実装しようと思いましたが記載の言語にないためやめました。

## 環境構築手順
1. Docker,Docker-Composeをインストールいただきます。
　　- https://docs.docker.com/get-docker/ このURLから該当のOSのDockr Desktopをインストールいただきます。
　　- インストーラー手順通りにやっていただければ、インストール可能です。Docker,Docker-Composeもインストールされた状態になります。
2. 作業ディレクトリ(docker-compose.yml)にターミナルアプリで移動いただき以下のコマンドを実行します。

```bash
$ docker-compose up -d
```

3. dockerが立ち上がるので、バックエンドサーバへ以下のコマンドで入ります。
   
```bash
$ docker-compose exec backend bash
```
4. バックエンドサーバに３のコマンドで入りますので、javaのビルド及びjarの実行を行います。
   
```bash
# sh gradlew build
# java -jar build/libs/spring_project-0.0.1-SNAPSHOT.jar
```

5. これでバックエンドの準備ができるのであとはfrontpageのindex.htmlをChromeで開いていただき、[内容]の手順通りに進行いただければOKです

## プログラムについて
- 今回、バックエンドの設定ファイルに「おはよう」「こんにちは」「こんばんは」を検索文字列として設定しております。
- 口頭で録音いただいた内容に上記文字列のいずれかが該当すればリストアップする形になっております。
