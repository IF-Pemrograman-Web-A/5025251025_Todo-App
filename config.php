<?php
session_start();
$host='localhost'; $db='todo_app'; $user='root'; $pass='';
try {
 $pdo=new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4",$user,$pass,[
  PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,
  PDO::ATTR_EMULATE_PREPARES=>false
 ]);
} catch(PDOException $e) { http_response_code(500); exit('Database connection failed. Import data.sql and check config.php.'); }
function e($v): string { return htmlspecialchars((string)($v ?? ''), ENT_QUOTES, 'UTF-8'); }
function csrf_token(): string { if(empty($_SESSION['csrf'])) $_SESSION['csrf']=bin2hex(random_bytes(32)); return $_SESSION['csrf']; }
function verify_csrf(): void { if(!hash_equals(csrf_token(), (string)($_POST['csrf_token'] ?? ''))) { http_response_code(403); exit('Invalid request token. Refresh and retry.'); } }
function go(string $url): never { header('Location: '.$url); exit; }
function demo_user_id(): int { return 1; } // Demo identity; add login for real users.
