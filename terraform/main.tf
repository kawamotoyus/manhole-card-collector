# =============================================================================
# Terraform メイン構成ファイル
# Firebase Hosting + Auth + Firestore + 予算アラート
# =============================================================================

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.0"
    }
  }
}

# -----------------------------------------------------------------------------
# プロバイダー設定
# -----------------------------------------------------------------------------
provider "google" {
  project               = var.project_id
  region                = var.region
  billing_project       = var.project_id
  user_project_override = true
}

provider "google-beta" {
  project               = var.project_id
  region                = var.region
  billing_project       = var.project_id
  user_project_override = true
}

# -----------------------------------------------------------------------------
# GCPプロジェクト作成
# -----------------------------------------------------------------------------
resource "google_project" "default" {
  project_id      = var.project_id
  name            = var.project_name
  billing_account = var.billing_account

  # プロジェクト削除時の自動リソースクリーンアップ
  deletion_policy = "DELETE"

  labels = {
    firebase = "enabled"
    app      = "manhole-card-collector"
  }
}

# -----------------------------------------------------------------------------
# 必要なAPIの有効化
# -----------------------------------------------------------------------------
resource "google_project_service" "firebase" {
  project = google_project.default.project_id
  service = "firebase.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "firestore" {
  project = google_project.default.project_id
  service = "firestore.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "identity_toolkit" {
  project = google_project.default.project_id
  service = "identitytoolkit.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "hosting" {
  project = google_project.default.project_id
  service = "firebasehosting.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "cloudbilling" {
  project = google_project.default.project_id
  service = "cloudbilling.googleapis.com"

  disable_dependent_services = true
}

resource "google_project_service" "budget" {
  project = google_project.default.project_id
  service = "billingbudgets.googleapis.com"

  disable_dependent_services = true
}

# -----------------------------------------------------------------------------
# Firebaseプロジェクトの有効化
# -----------------------------------------------------------------------------
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  depends_on = [google_project_service.firebase]
}

# -----------------------------------------------------------------------------
# Firebase Web App の登録
# -----------------------------------------------------------------------------
resource "google_firebase_web_app" "default" {
  provider     = google-beta
  project      = google_project.default.project_id
  display_name = "Manhole Card Collector Web"

  depends_on = [google_firebase_project.default]
}

# Web Appの設定値（apiKey等）を取得するデータソース
data "google_firebase_web_app_config" "default" {
  provider   = google-beta
  project    = google_project.default.project_id
  web_app_id = google_firebase_web_app.default.app_id
}

# -----------------------------------------------------------------------------
# Firebase Hosting
# -----------------------------------------------------------------------------
resource "google_firebase_hosting_site" "default" {
  provider = google-beta
  project  = google_project.default.project_id
  site_id  = var.project_id

  depends_on = [google_firebase_project.default]
}

# -----------------------------------------------------------------------------
# Firestore Database（Native mode）
# -----------------------------------------------------------------------------
resource "google_firestore_database" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  name        = "(default)"
  location_id = var.region
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.firestore]
}

# Firestoreセキュリティルール: ログインユーザーが自分のデータのみ読み書き可能
resource "google_firebaserules_ruleset" "firestore" {
  provider = google-beta
  project  = google_project.default.project_id

  source {
    files {
      name    = "firestore.rules"
      content = <<-EOT
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            // ユーザーは自分のコレクションデータのみ読み書き可能
            match /users/{userId}/{document=**} {
              allow read, write: if request.auth != null && request.auth.uid == userId;
            }
            // その他のドキュメントへのアクセスは全て拒否
            match /{document=**} {
              allow read, write: if false;
            }
          }
        }
      EOT
    }
  }

  depends_on = [google_firestore_database.default]
}

resource "google_firebaserules_release" "firestore" {
  provider = google-beta
  project  = google_project.default.project_id

  name         = "cloud.firestore"
  ruleset_name = google_firebaserules_ruleset.firestore.name

  depends_on = [google_firestore_database.default]
}

# -----------------------------------------------------------------------------
# Firebase Authentication（Google認証の有効化）
# -----------------------------------------------------------------------------
resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  sign_in {
    allow_duplicate_emails = false

    email {
      enabled           = false
      password_required = false
    }
  }

  # 承認済みドメインの設定
  authorized_domains = [
    "localhost",
    "${var.project_id}.firebaseapp.com",
    "${var.project_id}.web.app",
  ]

  depends_on = [
    google_project_service.identity_toolkit,
    google_firebase_project.default,
  ]
}# -----------------------------------------------------------------------------
# 予算アラート（月額1,000円上限）
# -----------------------------------------------------------------------------
resource "google_billing_budget" "monthly" {
  provider        = google-beta
  billing_account = var.billing_account
  display_name    = "Manhole Card Collector 月額予算"

  budget_filter {
    projects = ["projects/${google_project.default.number}"]
  }

  amount {
    specified_amount {
      currency_code = "JPY"
      units         = tostring(var.budget_amount)
    }
  }

  # 50%, 80%, 100% で通知
  threshold_rules {
    threshold_percent = 0.5
    spend_basis       = "CURRENT_SPEND"
  }

  threshold_rules {
    threshold_percent = 0.8
    spend_basis       = "CURRENT_SPEND"
  }

  threshold_rules {
    threshold_percent = 1.0
    spend_basis       = "CURRENT_SPEND"
  }

  depends_on = [
    google_project_service.budget,
    google_project_service.cloudbilling,
  ]
}
