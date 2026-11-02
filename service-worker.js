
const CACHE_NAME = "todo-app-cache-v2";

const FILES_TO_CACHE = [
    "./offline.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(function() {
                return self.skipWaiting();
            })
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys()
            .then(function(cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter(function(cacheName) {
                            return cacheName.startsWith("todo-app-") &&
                                   cacheName !== CACHE_NAME;
                        })
                        .map(function(cacheName) {
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(function() {
                return self.clients.claim();
            })
    );
});

self.addEventListener("fetch", function(event) {
    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then(function(response) {
                    if (response.ok) {
                        return response;
                    }

                    return caches.match("./offline.html");
                })
                .catch(function() {
                    return caches.match("./offline.html");
                })
        );

        return;
    }

    event.respondWith(
        caches.match(request)
            .then(function(cachedResponse) {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request);
            })
    );
});

self.addEventListener("message", function(event) {
    if (
        !event.data ||
        event.data.type !== "TODO_NOTIFICATION"
    ) {
        return;
    }

    const title = event.data.title || "Todo Reminder";
    const body = event.data.body || "You have a Todo reminder.";

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: "./icons/icon-192.png",
            badge: "./icons/icon-192.png",
            tag: `todo-${event.data.todoId}`,
            requireInteraction: false,
            data: {
                todoId: event.data.todoId
            }
        })
    );
});

self.addEventListener("notificationclick", function(event) {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({
            type: "window",
            includeUncontrolled: true
        })
        .then(function(clientList) {
            for (const client of clientList) {
                if ("focus" in client) {
                    return client.focus();
                }
            }

            if (clients.openWindow) {
                return clients.openWindow("./index.php");
            }
        })
    );
});
