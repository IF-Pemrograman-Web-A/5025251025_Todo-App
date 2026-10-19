const CACHE_NAME =
    "todo-app-cache-v1";


const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./service-worker.js"
];


self.addEventListener(
    "install",
    function(event) {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(
                function(cache) {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                }
            )

        );


        self.skipWaiting();

    }
);

self.addEventListener(
    "activate",
    function(event) {

        event.waitUntil(

            caches.keys()
                .then(
                    function(cacheNames) {

                        return Promise.all(

                            cacheNames
                                .filter(
                                    function(cacheName) {

                                        return (
                                            cacheName !==
                                            CACHE_NAME
                                        );

                                    }
                                )
                                .map(
                                    function(cacheName) {

                                        return caches.delete(
                                            cacheName
                                        );

                                    }
                                )

                        );

                    }
                )

        );


        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    function(event) {

        event.respondWith(

            caches.match(
                event.request
            )
            .then(
                function(cachedResponse) {

                    if (cachedResponse) {

                        return cachedResponse;

                    }


                    return fetch(
                        event.request
                    );

                }
            )

        );

    }
);


self.addEventListener(
    "message",
    function(event) {

        if (
            !event.data
            ||
            event.data.type !==
                "TODO_NOTIFICATION"
        ) {

            return;

        }


        const title =
            event.data.title ||
            "Todo Reminder";


        const body =
            event.data.body ||
            "You have a Todo reminder.";


        event.waitUntil(

            self.registration.showNotification(
                title,
                {
                    body: body,

                    icon: "./favicon.ico",

                    badge: "./favicon.ico",

                    tag:
                        `todo-${event.data.todoId}`,

                    requireInteraction: false,

                    data: {
                        todoId:
                            event.data.todoId
                    }
                }
            )

        );

    }
);

self.addEventListener(
    "notificationclick",
    function(event) {

        event.notification.close();


        event.waitUntil(

            clients.matchAll(
                {
                    type: "window",
                    includeUncontrolled: true
                }
            )
            .then(
                function(clientList) {

                    for (
                        const client of clientList
                    ) {

                        if (
                            "focus" in client
                        ) {

                            return client.focus();

                        }

                    }


                    if (
                        clients.openWindow
                    ) {

                        return clients.openWindow(
                            "./"
                        );

                    }

                }
            )

        );

    }
);

