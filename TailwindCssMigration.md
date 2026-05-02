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

### Шаг 11.1: Admin Page Container ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/page.tsx`
- [x] `.new-admin-page` → inline Tailwind классы
- [x] `.new-admin-header` → inline Tailwind классы
- [x] `.admin-title` → inline Tailwind классы
- [x] `.back-to-payload` → inline Tailwind классы

### Шаг 11.2: Admin Tabs ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/AdminTabs.tsx`
- [x] `.new-admin-content` → inline Tailwind классы
- [x] `.new-admin-tabs` → inline Tailwind классы
- [x] `.new-admin-tab` → inline Tailwind классы
- [x] `.new-admin-tab.active` → inline Tailwind классы (условный класс)
- [x] `.new-admin-tab-content` → inline Tailwind классы

---

## Этап 12: Миграция Files Tab

### Шаг 12.1: Files Tab ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/FilesTab.tsx`
- [x] `.files-tab` → inline Tailwind классы
- [x] `.files-header` → inline Tailwind классы
- [x] `.files-list` → inline Tailwind классы
- [x] `.file-item` → inline Tailwind классы
- [x] `.file-info` → inline Tailwind классы
- [x] `.file-name` → inline Tailwind классы
- [x] `.file-meta` → inline Tailwind классы
- [x] `.file-actions` → inline Tailwind классы
- [x] `.file-btn` → inline Tailwind классы
- [x] `.pagination-btn` → inline Tailwind классы
- [x] `.files-loading` → inline Tailwind классы
- [x] `.files-error` → inline Tailwind классы
- [x] `.files-empty` → inline Tailwind классы

---

## Этап 13: Миграция Materials Tab

### Шаг 13.1: Materials Tab ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/MaterialsTab.tsx`
- [x] `.materials-tab` → inline Tailwind классы
- [x] `.materials-header` → inline Tailwind классы
- [x] `.create-material-btn` → inline Tailwind классы
- [x] `.materials-loading` → inline Tailwind классы
- [x] `.materials-empty` → inline Tailwind классы
- [x] `.materials-error` → inline Tailwind классы

### Шаг 13.2: Material Form ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/MaterialsTab.tsx`
- [x] `.material-form` → inline Tailwind классы
- [x] `.form-group` → inline Tailwind классы
- [x] `.submit-btn` → inline Tailwind классы
- [x] `.upload-progress` → inline Tailwind классы

### Шаг 13.3: Student Select ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/MaterialsTab.tsx`
- [x] `.students-actions` → inline Tailwind классы
- [x] `.select-all-btn` → inline Tailwind классы
- [x] `.students-list` → inline Tailwind классы
- [x] `.student-checkbox` → inline Tailwind классы

### Шаг 13.4: Materials List ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/MaterialsTab.tsx`
- [x] `.materials-list` → inline Tailwind классы (space-y-4)
- [x] `.material-item` → inline Tailwind классы
- [x] `.material-main` → inline Tailwind классы
- [x] `.material-assigned` → inline Tailwind классы
- [x] `.material-actions` → inline Tailwind классы
- [x] `.material-btn` → inline Tailwind классы

---

## Этап 14: Миграция Tests Tab

### Шаг 14.1: Tests Tab Container ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/TestsTab.tsx`
- [x] `.tests-tab` → inline Tailwind классы
- [x] `.tests-header` → inline Tailwind классы
- [x] `.create-test-btn` → inline Tailwind классы
- [x] `.tests-loading` → inline Tailwind классы
- [x] `.tests-empty` → inline Tailwind классы
- [x] `.tests-error` → inline Tailwind классы

### Шаг 14.2: Test Form ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/TestsTab.tsx`
- [x] `.test-form` → inline Tailwind классы
- [x] `.questions-section` → inline Tailwind классы
- [x] `.questions-header` → inline Tailwind классы
- [x] `.add-question-btn` → inline Tailwind классы
- [x] `.no-questions` → inline Tailwind классы

### Шаг 14.3: Question Block ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/TestsTab.tsx`
- [x] `.question-block` → inline Tailwind классы
- [x] `.question-header` → inline Tailwind классы
- [x] `.question-number` → inline Tailwind классы
- [x] `.remove-btn` → inline Tailwind классы
- [x] `.question-content` → inline Tailwind классы
- [x] `.question-input` → inline Tailwind классы
- [x] `.question-type-select` → inline Tailwind классы

### Шаг 14.4: Options ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/TestsTab.tsx`
- [x] `.options-list` → inline Tailwind классы
- [x] `.option-row` → inline Tailwind классы
- [x] `.option-input` → inline Tailwind классы
- [x] `.remove-option-btn` → inline Tailwind классы
- [x] `.add-option-btn` → inline Tailwind классы
- [x] `.correct-answer-input` → inline Tailwind классы

### Шаг 14.5: Tests List ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/TestsTab.tsx`
- [x] `.tests-list` → inline Tailwind классы
- [x] `.test-item` → inline Tailwind классы
- [x] `.test-main` → inline Tailwind классы
- [x] `.test-meta` → inline Tailwind классы
- [x] `.test-questions` → inline Tailwind классы
- [x] `.test-assigned` → inline Tailwind классы
- [x] `.test-actions` → inline Tailwind классы
- [x] `.delete-test-btn` → inline Tailwind классы

---

## Этап 15: Миграция Students Tab

### Шаг 15.1: Students Tab Container ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/StudentsTab.tsx`
- [x] `.students-tab` → inline Tailwind классы
- [x] `.students-header` → inline Tailwind классы
- [x] `.students-count` → inline Tailwind классы
- [x] `.students-loading` → inline Tailwind классы
- [x] `.students-empty` → inline Tailwind классы
- [x] `.students-error` → inline Tailwind классы

### Шаг 15.2: Students Grid ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/StudentsTab.tsx`
- [x] `.students-grid` → inline Tailwind классы
- [x] `.student-card` → inline Tailwind классы
- [x] `.student-avatar` → inline Tailwind классы
- [x] `.student-info` → inline Tailwind классы
- [x] `.student-name` → inline Tailwind классы
- [x] `.student-email` → inline Tailwind классы
- [x] `.view-profile` → inline Tailwind классы

### Шаг 15.3: Student Profile ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/StudentsTab.tsx`
- [x] `.student-profile` → inline Tailwind классы
- [x] `.back-btn` → inline Tailwind классы
- [x] `.profile-header` → inline Tailwind классы
- [x] `.profile-avatar` → inline Tailwind классы
- [x] `.profile-info` → inline Tailwind классы
- [x] `.profile-email` → inline Tailwind классы

### Шаг 15.4: Profile Stats ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/StudentsTab.tsx`
- [x] `.profile-stats` → inline Tailwind классы
- [x] `.stat-card` → inline Tailwind классы
- [x] `.stat-value` → inline Tailwind классы
- [x] `.stat-label` → inline Tailwind классы

### Шаг 15.5: Profile Tests ✅ ВЫПОЛНЕНО
**Файл:** `src/app/(frontend)/new-admin/StudentsTab.tsx`
- [x] `.profile-tests` → inline Tailwind классы
- [x] `.tests-results-list` → inline Tailwind классы (space-y-3)
- [x] `.test-result-card` → inline Tailwind классы
- [x] `.test-result-info` → inline Tailwind классы
- [x] `.result-score` → inline Tailwind классы (с условными цветами)
- [x] `.result-date` → inline Tailwind классы
- [x] `.test-result-status` → inline Tailwind классы
- [x] `.status-completed` → inline Tailwind классы
- [x] `.status-pending` → inline Tailwind классы

---

## Этап 16: Миграция вспомогательных компонентов

### Шаг 16.1: File Viewer ✅ ВЫПОЛНЕНО (ранее)
**Файл:** `src/components/FileViewer.tsx`
- [x] `.file-viewer-overlay` → inline Tailwind классы
- [x] `.file-viewer` → inline Tailwind классы
- [x] `.file-viewer-header` → inline Tailwind классы
- [x] `.file-viewer-content` → inline Tailwind классы
- [x] `.file-viewer-close` → inline Tailwind классы

### Шаг 16.2: Material Upload
**Файл:** `src/components/MaterialUpload.tsx`
- [x] Не требуется миграция - функционал встроен в MaterialsTab

### Шаг 16.3: Logout Button ✅ ВЫПОЛНЕНО (ранее)
**Файл:** `src/components/auth/LogoutButton.tsx`
- [x] `.logout-btn` → inline Tailwind классы

---

## Этап 17: Финальная очистка ✅ ЗАВЕРШЕНО

### Шаг 17.1: Удаление CSS файла ✅ ВЫПОЛНЕНО
- [x] Убедиться что все компоненты работают
- [x] Удалить `src/app/(frontend)/styles.css`

### Шаг 17.2: Удаление импортов ✅ ВЫПОЛНЕНО
- [x] Удалить `import './styles.css'` из layout.tsx (уже использует globals.css)

### Шаг 17.3: Проверка и тестирование
- [x] Все страницы мигрированы на inline Tailwind классы
- [x] Сохранены кастомные цвета и анимации в globals.css
- [x] Адаптивность поддерживается через Tailwind responsive prefixes

### Шаг 17.4: Итоги миграции
- **globals.css** - содержит @theme с кастомными переменными, @layer base со стилями сброса
- **Все компоненты** - используют inline Tailwind классы
- **Удалено** - styles.css (~2850 строк)
- **Tailwind v4** - CSS-first подход через @theme вместо tailwind.config.ts

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
