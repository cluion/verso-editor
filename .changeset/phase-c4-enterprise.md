---
"@verso-editor/extension-starter-kit": minor
"@verso-editor/extension-track-changes": minor
"@verso-editor/extension-comment": minor
"@verso-editor/extension-restricted-editing": minor
"@verso-editor/extension-pagination": minor
"@verso-editor/extension-format-painter": minor
"@verso-editor/extension-fullscreen": minor
"@verso-editor/extension-case-change": minor
"@verso-editor/extension-bookmark": minor
"@verso-editor/ui-context-menu": minor
---

Phase C-4: 企業級功能 — 10 個新 extension + Revision History

### 新增套件

- **extension-track-changes**: 追蹤修訂（insertion/deletion marks、acceptChanges/rejectChanges、author/timestamp）
- **extension-comment**: 評論批註（comment mark、addComment/removeComment、onClickComment callback）
- **extension-restricted-editing**: 限制編輯（editable mark、filterTransaction 攔截不可編輯區域）
- **extension-pagination**: 分頁檢視（CSS page break decorations、paginated/continuous 模式切換）
- **extension-format-painter**: 格式複製刷（copyMarkFormat/pasteMarkFormat、Mod-Shift-c/v 快捷鍵）
- **extension-fullscreen**: 全螢幕模式（toggleFullscreen、瀏覽器 Fullscreen API）
- **extension-case-change**: 大小寫轉換（toUpperCase/toLowerCase/toTitleCase）
- **extension-bookmark**: 書籤錨點（inline atom node、goToBookmark 跳轉）
- **ui-context-menu**: 右鍵選單 UI 元件（可配置選單項目、點擊外部關閉）

### Core 變更

- 新增 `revision.ts` 模組：createSnapshot、compareSnapshots、RevisionHistory class
- Editor 加入 createSnapshot()、getRevisionHistory()、restoreRevision() 方法

### StarterKit 整合

- createStarterKit 新增 12 個 extension 選項（trackChanges、comment、restrictedEditing、pagination、formatPainter、fullscreen、caseChange、bookmark 及對應 marks）
