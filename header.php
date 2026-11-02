<?php $pageTitle=$pageTitle ?? 'My To Do List'; ?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="manifest" href="./manifest.json">
<meta name="theme-color" content="#789875">
<title><?=e($pageTitle)?></title><link rel="stylesheet" href="style.css"></head><body>
<a class="skip-link" href="#main-content">Skip to main content</a>
<header class="header"><div class="header-content"><div><h1>My To Do List</h1><p>Stay organized and complete your tasks.</p></div><div class="header-buttons">
    <button id="install-btn" class="theme-btn" type="button" hidden>
        📲 Install App
    </button>

    <button id="theme-btn" class="theme-btn" type="button">
        🌙 Dark Mode
    </button>
</div></div></header>
