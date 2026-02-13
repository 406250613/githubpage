const CACHE_NAME = 'cat-pwa-v2-pantry';
const APP_SHELL_URL = new URL('./litter-box-tracker-pantry_cloud.html', self.location).toString();

const ASSETS_TO_CACHE = [
  APP_SHELL_URL,
  new URL('./manifest.json', self.location).toString(),
  new URL('./icon-192.png', self.location).toString(),
  new URL('./icon-512.png', self.location).toString(),
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Push Event - 核心推送逻辑
self.addEventListener('push', (event) => {
  const PANTRY_ID = '96939943-4217-4861-9031-c42385153248';
  const BASKET_NAME = 'litter_box_data';

  // 等待异步数据获取
  event.waitUntil(
    // 1. 从 Pantry 获取最新数据
    fetch(`https://getpantry.cloud/apiv1/pantry/${PANTRY_ID}/basket/${BASKET_NAME}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        // 2. 计算显示内容
        let title = '今天该谁铲？';
        let body = '点击查看详情';
        
        if (data && data.currentTurn) {
            const name = data.currentTurn === 'A' ? '文弘' : '玉梅';
            title = `今天轮到 ${name} 铲屎`;
            
            // 计算预计结束时间
            const days = data[data.currentTurn] || 0;
            if (days > 0 && data.currentTurnDate) {
                const parts = data.currentTurnDate.split('-');
                if (parts.length === 3) {
                    const baseDate = new Date(parts[0], parts[1] - 1, parts[2]);
                    const endTimestamp = baseDate.getTime() + (days - 1) * 24 * 60 * 60 * 1000;
                    const endDate = new Date(endTimestamp);
                    const endStr = `${endDate.getMonth() + 1}月${endDate.getDate()}日`;
                    body = `预计 ${endStr} 结束 (剩余 ${days} 天)`;
                }
            } else {
                body = '暂无惩罚天数';
            }
        }

        // 3. 显示通知
        return self.registration.showNotification(title, {
          body: body,
          icon: './icon-192.png',
          badge: './icon-192.png',
          vibrate: [100, 50, 100],
          data: {
            url: APP_SHELL_URL
          }
        });
      })
      .catch(err => {
        console.error('Push fetch error:', err);
        // 降级显示
        return self.registration.showNotification('铲屎官提醒', {
            body: '点击查看今天该谁铲',
            icon: './icon-192.png'
        });
      })
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 如果已经打开，聚焦
      for (const client of clientList) {
        if (client.url.includes('litter-box-tracker') && 'focus' in client) {
          return client.focus();
        }
      }
      // 否则打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || './litter-box-tracker-pantry_cloud.html');
      }
    })
  );
});