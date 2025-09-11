import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  prettier,
  {
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Глобальные переменные для браузера
        document: "readonly",
        window: "readonly",
        console: "readonly",
        alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
      },
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [["~", "./src"]],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      // Prettier правила (имеют приоритет)
      "prettier/prettier": "error",
      // Основные правила для vanilla JavaScript
      "no-console": "warn",
      "no-debugger": "error",
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-duplicate-case": "error",
      "no-empty": "warn",
      "no-extra-semi": "error",
      "no-func-assign": "error",
      "no-invalid-regexp": "error",
      "no-irregular-whitespace": "error",
      "no-obj-calls": "error",
      "no-sparse-arrays": "error",
      "no-unexpected-multiline": "error",
      "use-isnan": "error",
      "valid-typeof": "error",

      // Правила стиля кода (удалены - используются настройки Prettier)
      // Все правила форматирования теперь обрабатывает Prettier

      // Правила для переменных
      "no-var": "error",
      "prefer-const": "warn",
      "no-const-assign": "error",
      "prefer-arrow-callback": "warn",
      "prefer-template": "warn",

      // Правила для функций
      "no-return-assign": "error",
      "no-return-await": "error",
      "prefer-promise-reject-errors": "error",
      "no-async-promise-executor": "error",
      "no-await-in-loop": "warn",
      "no-promise-executor-return": "error",
      "require-atomic-updates": "error",

      // Правила для объектов и массивов
      "no-array-constructor": "error",
      "no-new-object": "error",
      "object-shorthand": "warn",
      "prefer-object-spread": "warn",

      // Правила для строк
      "no-template-curly-in-string": "error",
      "prefer-regex-literals": "error",

      // Правила для циклов
      "no-constant-condition": "error",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",

      // Правила для классов (если используются)
      "constructor-super": "error",
      "no-class-assign": "error",
      "no-dupe-class-members": "error",
      "no-new-symbol": "error",
      "no-this-before-super": "error",
      "require-yield": "error",

      // Правила для модулей
      "no-duplicate-imports": "error",
      "no-useless-rename": "error",

      // Правила для импортов
      "import/no-unresolved": [
        "error",
        {
          ignore: ["^/"],
        },
      ],
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],

      // Дополнительные правила безопасности
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",
      "no-alert": "warn",
      "no-caller": "error",
      "no-iterator": "error",
      "no-proto": "error",
      "no-with": "error",
    },
  },
  {
    ignores: [
      // Зависимости
      "node_modules/",

      // Сборка
      "dist/",
      "build/",

      // Кэш
      ".cache/",
      ".parcel-cache/",

      // Логи
      "*.log",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",

      // Временные файлы
      ".tmp/",
      ".temp/",
      "temp_*",

      // IDE файлы
      ".vscode/",
      ".idea/",
      "*.swp",
      "*.swo",

      // OS файлы
      ".DS_Store",
      "Thumbs.db",

      // Конфигурационные файлы, которые не нужно линтить
      "vite.config.js",
      "*.config.js",

      // Статические ресурсы
      "public/",
      "*.svg",
      "*.png",
      "*.jpg",
      "*.jpeg",
      "*.gif",
      "*.ico",
      "*.woff",
      "*.woff2",
      "*.ttf",
      "*.eot",

      // Стили
      "*.css",
      "*.scss",
      "*.sass",
      "*.less",

      // HTML файлы
      "*.html",

      // Документация
      "*.md",
      "README*",

      // Lock файлы
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
    ],
  },
];
