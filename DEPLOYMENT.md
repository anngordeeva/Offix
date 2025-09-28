# Инструкция по развертыванию SPA

## Проблема
При прямом переходе на URL типа `/contacts` сервер возвращал 404 ошибку, потому что физически такой страницы не существует (из за самописного роутинга).

---

## Развертывание на Vercel

### Файл `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Инструкция
1. **Соберите проект:**
   ```bash
   npm run build
   ```

2. **Разверните на Vercel:**
   ```bash
   vercel --prod
   ```

---

## Развертывание через Nginx

### Конфигурация Nginx
Создайте файл конфигурации для вашего сайта (например, `/etc/nginx/sites-available/offix`):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Корневая директория с собранным проектом
    root /var/www/offix/dist;
    index index.html;
    
    # Обработка статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # Обработка SPA роутинга
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Дополнительные настройки безопасности
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
```

### Инструкция по развертыванию

1. **Соберите проект:**
   ```bash
   npm run build
   ```

2. **Скопируйте файлы на сервер:**
   ```bash
   # Скопируйте содержимое папки dist на сервер
   scp -r dist/* user@your-server:/var/www/offix/dist/
   ```

3. **Настройте Nginx:**
   ```bash
   # Создайте конфигурацию
   sudo nano /etc/nginx/sites-available/offix
   
   # Включите сайт
   sudo ln -s /etc/nginx/sites-available/offix /etc/nginx/sites-enabled/
   
   # Проверьте конфигурацию
   sudo nginx -t
   
   # Перезагрузите Nginx
   sudo systemctl reload nginx
   ```

4. **Настройте SSL (опционально):**
   ```bash
   # Установите Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Получите SSL сертификат
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

### Проверка работы
- Перейдите на главную страницу: `http://your-domain.com/`
- Попробуйте прямой переход: `http://your-domain.com/contacts`
- Проверьте другие страницы: `/about-us`, `/offices`, `/virtual-office`
- Убедитесь, что кнопка "Назад" работает корректно

---

## Ожидаемое поведение
- Все прямые переходы по URL должны работать корректно
- SPA роутинг должен функционировать без перезагрузки страницы
- Кнопка "Назад" браузера должна работать правильно
- 404 страница должна показываться для несуществующих маршрутов
