# =============================================================================
# Terraform 出力定義
# デプロイ後に確認が必要な情報を出力
# =============================================================================

output "project_id" {
  description = "GCPプロジェクトID"
  value       = google_project.default.project_id
}

output "hosting_url" {
  description = "Firebase Hostingの公開URL"
  value       = "https://${var.project_id}.web.app"
}

output "firestore_database" {
  description = "Firestoreデータベース名"
  value       = google_firestore_database.default.name
}

# Firebase Web Appの設定値（フロントエンドの.envに転記する）
output "firebase_config" {
  description = "Firebase Web Appの設定値（.envファイルに転記してください）"
  value = {
    api_key             = data.google_firebase_web_app_config.default.api_key
    auth_domain         = "${var.project_id}.firebaseapp.com"
    project_id          = var.project_id
    storage_bucket      = "${var.project_id}.firebasestorage.app"
    messaging_sender_id = data.google_firebase_web_app_config.default.messaging_sender_id
    app_id              = google_firebase_web_app.default.app_id
  }
  sensitive = true
}
