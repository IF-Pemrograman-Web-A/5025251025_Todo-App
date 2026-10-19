E04 - THE IRON CITADEL
======================

SETUP (XAMPP / Windows)
1. Extract this folder into C:\xampp\htdocs\iron_citadel_e04
2. Start Apache and MySQL from XAMPP Control Panel.
3. Open http://localhost/phpmyadmin
4. Import data.sql (it creates the todo_app database and dummy data).
5. Open http://localhost/iron_citadel_e04/index.php
6. Default MySQL config is root with an empty password. Edit config.php if yours differs.

FILES
config.php: PDO database connection, output escaping, CSRF helpers
header.php: shared page header
menubar.php: Personal / Shared sidebar
index.php: reads database rows and assembles page
content.php: not used in this compact build; page content is in index.php
actions.php: create, toggle status, delete
data.sql: database schema and dummy data
style.css: Strawberry Matcha theme
script.js: persistent light/dark theme
uploads/: optional uploaded images

NOTES
The demo uses a fixed demo identity (user id 1), not real login/authentication.
Shared tasks are visible to anyone who can open this local demo. Add login and
authorization before deployment. Reminder time is stored in MySQL, but no server
scheduler is included to send notifications.
