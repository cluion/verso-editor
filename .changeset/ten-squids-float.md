---
"@verso-editor/extension-autolink": minor
"@verso-editor/extension-mention": minor
"@verso-editor/extension-video": minor
"@verso-editor/extension-file-embed": minor
"@verso-editor/extension-typography": minor
"@verso-editor/extension-drop-cursor": minor
"@verso-editor/extension-gap-cursor": minor
"@verso-editor/extension-image": minor
"@verso-editor/extension-table": minor
"@verso-editor/extension-placeholder": minor
"@verso-editor/extension-starter-kit": minor
"@verso-editor/core": patch
---

Add 7 new extensions and enhance existing ones

**New extensions:**
- autolink — auto-detect URLs and apply link marks
- mention — inline mention nodes with `@` trigger
- video — embed YouTube/Vimeo videos with paste-to-embed
- file-embed — file attachment cards with download links
- typography — smart quotes, em dashes, ellipsis, arrows
- drop-cursor — visual drop indicator during drag
- gap-cursor — cursor in otherwise unreachable positions

**Updates:**
- image: caption support (`figure > img + figcaption`)
- table: header row/column toggle (`<th>` support)
- placeholder: full implementation with configurable options
- starter-kit: now bundles 33 extensions
- core: sanitize whitelist updated for iframe, figcaption, mention attrs
