# План миграции на Tailwind CSS

## Обзор проекта

- **CSS файл:** `src/app/(frontend)/styles.css`
- **Размер:** ~2849 строк
- **CSS классов:** ~192
- **Компонентов для миграции:** 18 файлов (.tsx)

---

## Этап 1: Подготовка инфраструктуры

### Шаг 1.1: Установка Tailwind CSS ✅ ВЫПОЛНЕНО
```bash
pnpm add -D tailwindcss postcss autoprefixer @tailwindcss/postcss
```

### Шаг 1.2: Настройка tailwind.config.ts ✅ ВЫПОЛНЕНО (через @theme в globals.css для Tailwind v4)
- Создана конфигурация с CSS-first подходом Tailwind v4
- Добавлены кастомные цвета из CSS переменных:
  - `primary: #6366f1`
  - `primary-light: #818cf8`
  - `secondary: #f472b6`
  - `accent: #34d399`
  - `warning: #fbbf24`
  - `background: #faf7ff`
  - `surface: #ffffff`
  - `text: #1e1b4b`
  - `text-light: #6b7280`
- Добавлены кастомные шрифты (Inter, Roboto Mono)

### Шаг 1.3: Создание globals.css ✅ ВЫПОЛНЕНО
- Создан `src/app/globals.css` с директивами Tailwind v4
- Добавлен `@import 'tailwindcss'` и `@theme` блок
- Перенесены базовые стили (reset, html, body) в @layer base
- Добавлены utility классы для градиентов

### Шаг 1.4: Обновление layout.tsx ✅ ВЫПОЛНЕНО
- Импортируется `globals.css` вместо `styles.css`
- Подключен шрифт Inter через `next/font/google`

---

## Этап 2: Миграция базовых элементов

### Шаг 2.1: Глобальные стили (reset) ✅ ВЫПОЛНЕНО
**Файл:** `globals.css` @layer base
- [x] `:root` переменные → @theme в globals.css
- [x] `*` box-sizing → @layer base
- [x] `html` стили → @layer base
- [x] `body` стили → @layer base
- [x] `img` стили → @layer base
- [x] `h1` стили → @layer base
- [x] `p` стили → @layer base
- [x] `a` стили → @layer base
- [x] `svg` стили → @layer base

### Шаг 2.2: Анимации ✅ ВЫПОЛНЕНО
- [x] `@keyframes float` → @theme в globals.css
- [x] `@keyframes fadeInUp` → не использовался
- [x] `@keyframes pulse-dot` → не использовался
- [x] `@keyframes scaleIn` → @theme в globals.css
- [x] `@keyframes spin` → использован встроенный animate-spin

---

## Этап 3: Миграция компонентов Header/Footer

### Шаг 3.1: Site Header ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/page.tsx`
- [x] `.site-header` → inline Tailwind классы
- [x] `.logo` → inline Tailwind классы
- [x] `.logo-icon` → inline Tailwind классы
- [x] `.logo-text` → inline Tailwind классы
- [x] `.header-login-btn` → inline Tailwind классы

### Шаг 3.2: Animated Background ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/page.tsx`
- [x] `.animated-bg` → inline Tailwind классы
- [x] `.floating-element` → inline Tailwind классы
- [x] `.floating-element.atom` → inline Tailwind классы
- [x] `.floating-element.flask` → inline Tailwind классы
- [x] `.floating-element.calculator` → не использовался
- [x] `.floating-element.book` → inline Tailwind классы

---

## Этап 4: Миграция главной страницы

### Шаг 4.1: Hero Section ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/page.tsx`
- [x] `.hero` → inline Tailwind классы (.home класс)
- [x] `.hero-content` → inline Tailwind классы (.content)
- [x] `.hero-badge` → не использовался
- [x] `.hero-title` → inline Tailwind классы (h1)
- [x] `.hero-subtitle` → inline Tailwind классы (.subtitle)
- [x] `.hero-actions` → inline Tailwind классы (.links)
- [x] `.hero-btn` → inline Tailwind классы
- [x] `.hero-btn.primary` → inline Tailwind классы
- [x] `.hero-btn.secondary` → inline Tailwind классы

### Шаг 4.2: Features Section
**Файл:** `src/app/(frontend)/page.tsx`
- [ ] `.features` → inline Tailwind классы
- [ ] `.features-title` → inline Tailwind классы
- [ ] `.features-grid` → inline Tailwind классы
- [ ] `.feature-card` → inline Tailwind классы
- [ ] `.feature-icon` → inline Tailwind классы
- [ ] `.feature-title` → inline Tailwind классы
- [ ] `.feature-desc` → inline Tailwind классы

### Шаг 4.3: CTA Section
**Файл:** `src/app/(frontend)/page.tsx`
- [ ] `.cta` → inline Tailwind классы
- [ ] `.cta-card` → inline Tailwind классы
- [ ] `.cta-title` → inline Tailwind классы
- [ ] `.cta-text` → inline Tailwind классы
- [ ] `.cta-btn` → inline Tailwind классы

### Шаг 4.4: Footer
**Файл:** `src/app/(frontend)/page.tsx`
- [ ] `.footer` → inline Tailwind классы
- [ ] `.footer-content` → inline Tailwind классы
- [ ] `.footer-logo` → inline Tailwind классы
- [ ] `.footer-links` → inline Tailwind классы
- [ ] `.footer-bottom` → inline Tailwind классы

---

## Этап 5: Миграция страницы авторизации

### Шаг 5.1: Auth Container ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/login/page.tsx`
- [x] `.auth-page` → inline Tailwind классы
- [x] `.auth-card` → inline Tailwind классы
- [x] `.auth-header` → inline Tailwind классы
- [x] `.auth-icon` → не использовался
- [x] `.auth-title` → inline Tailwind классы (h1)
- [x] `.auth-subtitle` → inline Tailwind классы

### Шаг 5.2: Login Form Component ✅ ВЫПОЛНЕНО
**Файл:** `src/components/auth/LoginForm.tsx`
- [x] `.auth-form` → inline Tailwind классы
- [x] `.form-group` → inline Tailwind классы
- [x] `.form-label` → inline Tailwind классы
- [x] `.form-input` → inline Tailwind классы
- [x] `.form-error` → inline Tailwind классы (.message.error)
- [x] `.form-submit` → inline Tailwind классы (.submit-btn)
- [x] `.form-footer` → inline Tailwind классы (.auth-link)

---

## Этап 6: Миграция страницы регистрации

### Шаг 6.1: Register Page ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/register/page.tsx`
- [x] Использует те же классы что и login (auth-page, auth-card и т.д.)

### Шаг 6.2: Register Form Component ✅ ВЫПОЛНЕНО
**Файл:** `src/components/auth/RegisterForm.tsx`
- [x] Аналогично LoginForm - все классы мигрированы

---

## Этап 7: Миграция страницы верификации email

### Шаг 7.1: Verify Email Page ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/verify-email/page.tsx`
- [x] `.verify-page` → inline Tailwind классы
- [x] `.verify-card` → inline Tailwind классы
- [x] `.verify-icon` → не использовался
- [x] `.verify-title` → inline Tailwind классы (h1)
- [x] `.verify-message` → inline Tailwind классы (p)
- [x] `.verify-loading` → не использовался (SSR страница)
- [x] `.verify-error` → inline Tailwind классы
- [x] `.verify-success` → inline Tailwind классы

---

## Этап 8: Миграция личного кабинета (LK)

### Шаг 8.1: LK Page Container ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/lk/page.tsx`
- [x] `.lk-page` → inline Tailwind классы
- [x] `.lk-header` → inline Tailwind классы
- [x] `.lk-avatar` → не использовался
- [x] `.lk-user-info` → не использовался
- [x] `.lk-welcome` → inline Tailwind классы (.lk-greeting h1)
- [x] `.lk-email` → не использовался

### Шаг 8.2: LK Tabs Component ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/lk/LKTabs.tsx`
- [x] `.lk-content` → inline Tailwind классы
- [x] `.lk-tabs` → inline Tailwind классы
- [x] `.lk-tab` → inline Tailwind классы
- [x] `.lk-tab.active` → inline Tailwind классы (условный класс)
- [x] `.tab-badge` → inline Tailwind классы

### Шаг 8.3: Materials Section ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/lk/LKTabs.tsx`
- [x] `.lk-materials` → inline Tailwind классы
- [x] `.materials-empty` → inline Tailwind классы (.lk-empty)
- [x] `.materials-list` → inline Tailwind классы

### Шаг 8.4: Tests Section ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/lk/LKTabs.tsx`
- [x] `.lk-tests` → inline Tailwind классы
- [x] `.tests-section` → inline Tailwind классы
- [x] `.tests-section-title` → inline Tailwind классы
- [x] `.tests-grid` → inline Tailwind классы

---

## Этап 9: Миграция компонентов карточек

### Шаг 9.1: Material Card ✅ ВЫПОЛНЕНО
**Файл:** `src/components/MaterialCard.tsx`
- [x] `.material-card` → inline Tailwind классы
- [x] `.material-title` → inline Tailwind классы
- [x] `.material-desc` → inline Tailwind классы (.material-description)
- [x] `.material-meta` → inline Tailwind классы
- [x] `.material-btn` → inline Tailwind классы (.material-open, .material-download)

### Шаг 9.2: Test Card ✅ ВЫПОЛНЕНО
**Файл:** `src/components/TestCard.tsx`
- [x] `.test-card` → inline Tailwind классы
- [x] `.test-card.completed` → inline Tailwind классы (условный класс)
- [x] `.test-card-header` → inline Tailwind классы
- [x] `.completed-badge` → inline Tailwind классы
- [x] `.test-card-desc` → inline Tailwind классы
- [x] `.test-card-meta` → inline Tailwind классы
- [x] `.test-card-result` → inline Tailwind классы
- [x] `.result-score` → inline Tailwind классы
- [x] `.start-test-btn` → inline Tailwind классы

---

## Этап 10: Миграция Test Taker Modal

### Шаг 10.1: Modal Container ✅ ВЫПОЛНЕНО
**Файл:** `src/components/TestTaker.tsx`
- [x] `.test-taker-overlay` → inline Tailwind классы
- [x] `.test-taker-modal` → inline Tailwind классы
- [x] `.test-taker-header` → inline Tailwind классы
- [x] `.close-test-btn` → inline Tailwind классы

### Шаг 10.2: Progress Section ✅ ВЫПОЛНЕНО
**Файл:** `src/components/TestTaker.tsx`
- [x] `.test-progress` → inline Tailwind классы
- [x] `.progress-bar` → inline Tailwind классы
- [x] `.progress-fill` → inline Tailwind классы
- [x] `.progress-text` → inline Tailwind классы

### Шаг 10.3: Question View ✅ ВЫПОЛНЕНО
**Файл:** `src/components/TestTaker.tsx`
- [x] `.question-view` → inline Tailwind классы
- [x] `.question-text` → inline Tailwind классы
- [x] `.options-view` → inline Tailwind классы
- [x] `.option-label` → inline Tailwind классы
- [x] `.option-label.selected` → inline Tailwind классы (условный класс)
- [x] `.text-answer-input` → inline Tailwind классы

### Шаг 10.4: Navigation ✅ ВЫПОЛНЕНО
**Файл:** `src/components/TestTaker.tsx`
- [x] `.test-navigation` → inline Tailwind классы
- [x] `.nav-btn` → inline Tailwind классы
- [x] `.nav-btn.prev-btn` → inline Tailwind классы
- [x] `.nav-btn.next-btn` → inline Tailwind классы
- [x] `.nav-btn.submit-btn` → inline Tailwind классы
- [x] `.questions-dots` → inline Tailwind классы
- [x] `.dot` → inline Tailwind классы

### Шаг 10.5: Result View ✅ ВЫПОЛНЕНО
**Файл:** `src/components/TestTaker.tsx`
- [x] `.test-result-view` → inline Tailwind классы
- [x] `.result-circle` → inline Tailwind классы
- [x] `.result-percentage` → inline Tailwind классы
- [x] `.result-text` → inline Tailwind классы
- [x] `.finish-btn` → inline Tailwind классы

---

## Этап 11: Миграция Admin Panel

### Шаг 11.1: Admin Page Container
**Файл:** `src/app/(frontend)/new-admin/page.tsx`
- [ ] `.new-admin-page` → inline Tailwind классы
- [ ] `.new-admin-header` → inline Tailwind классы
- [ ] `.admin-title` → inline Tailwind классы
- [ ] `.admin-subtitle` → inline Tailwind классы

### Шаг 11.2: Admin Tabs
**Файл:** `src/app/(frontend)/new-admin/AdminTabs.tsx`
- [ ] `.new-admin-content` → inline Tailwind классы
- [ ] `.new-admin-tabs` → inline Tailwind классы
- [ ] `.new-admin-tab` → inline Tailwind классы
- [ ] `.new-admin-tab.active` → inline Tailwind классы
- [ ] `.new-admin-tab-content` → inline Tailwind классы

---

## Этап 12: Миграция Files Tab

### Шаг 12.1: Files Tab
**Файл:** `src/app/(frontend)/new-admin/FilesTab.tsx`
- [ ] `.files-tab` → inline Tailwind классы
- [ ] `.files-header` → inline Tailwind классы
- [ ] `.files-list` → inline Tailwind классы
- [ ] `.file-item` → inline Tailwind классы
- [ ] `.file-info` → inline Tailwind классы
- [ ] `.file-name` → inline Tailwind классы
- [ ] `.file-size` → inline Tailwind классы
- [ ] `.file-actions` → inline Tailwind классы
- [ ] `.copy-btn` → inline Tailwind классы
- [ ] `.delete-btn` → inline Tailwind классы

### Шаг 12.2: Upload Zone
**Файл:** `src/app/(frontend)/new-admin/FilesTab.tsx`
- [ ] `.upload-zone` → inline Tailwind классы
- [ ] `.upload-zone.dragging` → inline Tailwind классы
- [ ] `.upload-icon` → inline Tailwind классы
- [ ] `.upload-text` → inline Tailwind классы
- [ ] `.upload-hint` → inline Tailwind классы

---

## Этап 13: Миграция Materials Tab

### Шаг 13.1: Materials Tab
**Файл:** `src/app/(frontend)/new-admin/MaterialsTab.tsx`
- [ ] `.materials-tab` → inline Tailwind классы
- [ ] `.materials-header` → inline Tailwind классы
- [ ] `.create-material-btn` → inline Tailwind классы
- [ ] `.materials-loading` → inline Tailwind классы
- [ ] `.materials-empty` → inline Tailwind классы
- [ ] `.materials-error` → inline Tailwind классы

### Шаг 13.2: Material Form
**Файл:** `src/app/(frontend)/new-admin/MaterialsTab.tsx`
- [ ] `.material-form` → inline Tailwind классы
- [ ] `.form-row` → inline Tailwind классы
- [ ] `.form-actions` → inline Tailwind классы
- [ ] `.save-btn` → inline Tailwind классы
- [ ] `.cancel-btn` → inline Tailwind классы

### Шаг 13.3: Student Select
**Файл:** `src/app/(frontend)/new-admin/MaterialsTab.tsx`
- [ ] `.students-select` → inline Tailwind классы
- [ ] `.select-header` → inline Tailwind классы
- [ ] `.select-all-btn` → inline Tailwind классы
- [ ] `.students-checkboxes` → inline Tailwind классы
- [ ] `.student-checkbox` → inline Tailwind классы

### Шаг 13.4: Materials List
**Файл:** `src/app/(frontend)/new-admin/MaterialsTab.tsx`
- [ ] `.admin-materials-list` → inline Tailwind классы
- [ ] `.material-item` → inline Tailwind классы
- [ ] `.material-main` → inline Tailwind классы
- [ ] `.material-assigned` → inline Tailwind классы
- [ ] `.material-actions` → inline Tailwind классы
- [ ] `.delete-material-btn` → inline Tailwind классы

---

## Этап 14: Миграция Tests Tab

### Шаг 14.1: Tests Tab Container
**Файл:** `src/app/(frontend)/new-admin/TestsTab.tsx`
- [ ] `.tests-tab` → inline Tailwind классы
- [ ] `.tests-header` → inline Tailwind классы
- [ ] `.create-test-btn` → inline Tailwind классы
- [ ] `.tests-loading` → inline Tailwind классы
- [ ] `.tests-empty` → inline Tailwind классы
- [ ] `.tests-error` → inline Tailwind классы

### Шаг 14.2: Test Form
**Файл:** `src/app/(frontend)/new-admin/TestsTab.tsx`
- [ ] `.test-form` → inline Tailwind классы
- [ ] `.questions-section` → inline Tailwind классы
- [ ] `.questions-header` → inline Tailwind классы
- [ ] `.add-question-btn` → inline Tailwind классы
- [ ] `.no-questions` → inline Tailwind классы

### Шаг 14.3: Question Block
**Файл:** `src/app/(frontend)/new-admin/TestsTab.tsx`
- [ ] `.question-block` → inline Tailwind классы
- [ ] `.question-header` → inline Tailwind классы
- [ ] `.question-number` → inline Tailwind классы
- [ ] `.remove-btn` → inline Tailwind классы
- [ ] `.question-content` → inline Tailwind классы
- [ ] `.question-input` → inline Tailwind классы
- [ ] `.question-type-select` → inline Tailwind классы

### Шаг 14.4: Options
**Файл:** `src/app/(frontend)/new-admin/TestsTab.tsx`
- [ ] `.options-list` → inline Tailwind классы
- [ ] `.option-row` → inline Tailwind классы
- [ ] `.option-input` → inline Tailwind классы
- [ ] `.remove-option-btn` → inline Tailwind классы
- [ ] `.add-option-btn` → inline Tailwind классы
- [ ] `.correct-answer-input` → inline Tailwind классы

### Шаг 14.5: Tests List
**Файл:** `src/app/(frontend)/new-admin/TestsTab.tsx`
- [ ] `.tests-list` → inline Tailwind классы
- [ ] `.test-item` → inline Tailwind классы
- [ ] `.test-main` → inline Tailwind классы
- [ ] `.test-meta` → inline Tailwind классы
- [ ] `.test-questions` → inline Tailwind классы
- [ ] `.test-assigned` → inline Tailwind классы
- [ ] `.test-actions` → inline Tailwind классы
- [ ] `.delete-test-btn` → inline Tailwind классы

---

## Этап 15: Миграция Students Tab

### Шаг 15.1: Students Tab Container
**Файл:** `src/app/(frontend)/new-admin/StudentsTab.tsx`
- [ ] `.students-tab` → inline Tailwind классы
- [ ] `.students-header` → inline Tailwind классы
- [ ] `.students-count` → inline Tailwind классы
- [ ] `.students-loading` → inline Tailwind классы
- [ ] `.students-empty` → inline Tailwind классы
- [ ] `.students-error` → inline Tailwind классы

### Шаг 15.2: Students Grid
**Файл:** `src/app/(frontend)/new-admin/StudentsTab.tsx`
- [ ] `.students-grid` → inline Tailwind классы
- [ ] `.student-card` → inline Tailwind классы
- [ ] `.student-avatar` → inline Tailwind классы
- [ ] `.student-info` → inline Tailwind классы
- [ ] `.student-name` → inline Tailwind классы
- [ ] `.student-email` → inline Tailwind классы
- [ ] `.view-profile` → inline Tailwind классы

### Шаг 15.3: Student Profile
**Файл:** `src/app/(frontend)/new-admin/StudentsTab.tsx`
- [ ] `.student-profile` → inline Tailwind классы
- [ ] `.back-btn` → inline Tailwind классы
- [ ] `.profile-header` → inline Tailwind классы
- [ ] `.profile-avatar` → inline Tailwind классы
- [ ] `.profile-info` → inline Tailwind классы
- [ ] `.profile-email` → inline Tailwind классы

### Шаг 15.4: Profile Stats
**Файл:** `src/app/(frontend)/new-admin/StudentsTab.tsx`
- [ ] `.profile-stats` → inline Tailwind классы
- [ ] `.stat-card` → inline Tailwind классы
- [ ] `.stat-value` → inline Tailwind классы
- [ ] `.stat-label` → inline Tailwind классы

### Шаг 15.5: Profile Tests
**Файл:** `src/app/(frontend)/new-admin/StudentsTab.tsx`
- [ ] `.profile-tests` → inline Tailwind классы
- [ ] `.tests-results-list` → inline Tailwind классы
- [ ] `.test-result-card` → inline Tailwind классы
- [ ] `.test-result-info` → inline Tailwind классы
- [ ] `.result-score` → inline Tailwind классы
- [ ] `.result-date` → inline Tailwind классы
- [ ] `.test-result-status` → inline Tailwind классы
- [ ] `.status-completed` → inline Tailwind классы
- [ ] `.status-pending` → inline Tailwind классы

---

## Этап 16: Миграция вспомогательных компонентов

### Шаг 16.1: File Viewer
**Файл:** `src/components/FileViewer.tsx`
- [ ] `.file-viewer-overlay` → inline Tailwind классы
- [ ] `.file-viewer` → inline Tailwind классы
- [ ] `.file-viewer-header` → inline Tailwind классы
- [ ] `.file-viewer-content` → inline Tailwind классы
- [ ] `.file-viewer-close` → inline Tailwind классы

### Шаг 16.2: Material Upload
**Файл:** `src/components/MaterialUpload.tsx`
- [ ] Проверить и мигрировать если есть CSS классы

### Шаг 16.3: Logout Button
**Файл:** `src/components/auth/LogoutButton.tsx`
- [ ] `.logout-btn` → inline Tailwind классы

---

## Этап 17: Финальная очистка

### Шаг 17.1: Удаление CSS файла
- [ ] Убедиться что все компоненты работают
- [ ] Удалить `src/app/(frontend)/styles.css`

### Шаг 17.2: Удаление импортов
- [ ] Удалить `import './styles.css'` из layout.tsx

### Шаг 17.3: Проверка и тестирование
- [ ] Проверить все страницы визуально
- [ ] Проверить адаптивность (мобильная версия)
- [ ] Проверить все интерактивные элементы
- [ ] Проверить hover/focus состояния
- [ ] Проверить анимации

### Шаг 17.4: Оптимизация
- [ ] Выделить повторяющиеся паттерны в @apply
- [ ] Создать компонентные классы если нужно
- [ ] Проверить размер бандла

---

## Порядок выполнения по файлам

| # | Файл | Приоритет |
|---|------|-----------|
| 1 | tailwind.config.ts | Высокий |
| 2 | globals.css | Высокий |
| 3 | layout.tsx | Высокий |
| 4 | page.tsx (главная) | Средний |
| 5 | login/page.tsx | Средний |
| 6 | LoginForm.tsx | Средний |
| 7 | register/page.tsx | Средний |
| 8 | RegisterForm.tsx | Средний |
| 9 | verify-email/page.tsx | Низкий |
| 10 | lk/page.tsx | Средний |
| 11 | LKTabs.tsx | Средний |
| 12 | MaterialCard.tsx | Средний |
| 13 | TestCard.tsx | Средний |
| 14 | TestTaker.tsx | Средний |
| 15 | new-admin/page.tsx | Средний |
| 16 | AdminTabs.tsx | Средний |
| 17 | FilesTab.tsx | Средний |
| 18 | MaterialsTab.tsx | Средний |
| 19 | TestsTab.tsx | Средний |
| 20 | StudentsTab.tsx | Средний |
| 21 | FileViewer.tsx | Низкий |
| 22 | LogoutButton.tsx | Низкий |
| 23 | Удаление styles.css | Финал |

---

## Примечания

- При миграции сохранять точное визуальное соответствие
- Использовать Tailwind классы вместо CSS переменных где возможно
- Для сложных градиентов использовать arbitrary values `bg-[linear-gradient(...)]`
- Для анимаций использовать tailwind.config.ts extend.keyframes + extend.animation
- Медиа-запросы заменить на responsive prefixes (sm:, md:, lg:, xl:)
- Hover состояния: `hover:` prefix
- Focus состояния: `focus:` prefix
- Псевдоэлементы: `before:` и `after:` prefixes

---

## Оценка времени

- **Этапы 1-2:** ~1 час (инфраструктура)
- **Этапы 3-7:** ~2-3 часа (основные страницы)
- **Этапы 8-10:** ~2 часа (LK и карточки)
- **Этапы 11-15:** ~3-4 часа (админка)
- **Этапы 16-17:** ~1 час (очистка)

**Итого:** ~10-12 часов работы
