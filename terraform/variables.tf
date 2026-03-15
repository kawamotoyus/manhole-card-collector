# =============================================================================
# Terraform 変数定義
# Firebase Hosting + Auth + Firestore のインフラ構成に必要な変数
# =============================================================================

variable "project_id" {
  description = "GCPプロジェクトID（Firebase用に新規作成するプロジェクト）"
  type        = string
}

variable "project_name" {
  description = "GCPプロジェクトの表示名"
  type        = string
  default     = "Manhole Card Collector"
}

variable "region" {
  description = "Firestoreのリージョン（東京）"
  type        = string
  default     = "asia-northeast1"
}

variable "billing_account" {
  description = "Blazeプラン用のGCP Billing Account ID"
  type        = string
}

variable "budget_amount" {
  description = "月額予算上限額（JPY）"
  type        = number
  default     = 1000
}

variable "alert_email" {
  description = "予算アラートの通知先メールアドレス"
  type        = string
}
