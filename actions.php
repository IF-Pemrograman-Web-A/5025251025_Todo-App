<?php
require 'config.php';
if($_SERVER['REQUEST_METHOD']!=='POST') go('index.php');
verify_csrf();
$action=$_POST['action'] ?? ''; $scope=($_POST['scope'] ?? 'personal')==='shared'?'shared':'personal'; $id=(int)($_POST['id'] ?? 0); $uid=demo_user_id();
function getTodo(PDO $pdo,int $id,string $scope,int $uid): ?array {
 if($scope==='shared') $s=$pdo->prepare("SELECT * FROM todos WHERE id=? AND scope='shared'");
 else { $s=$pdo->prepare("SELECT * FROM todos WHERE id=? AND scope='personal' AND owner_id=?"); }
 $scope==='shared'?$s->execute([$id]):$s->execute([$id,$uid]); $r=$s->fetch(); return $r?:null;
}
if($action==='create') {
 $title=trim((string)($_POST['title'] ?? '')); if($title==='') go('index.php?scope='.$scope);
 $desc=trim((string)($_POST['description'] ?? '')); $priority=$_POST['priority'] ?? 'medium';
 if(!in_array($priority,['high','medium','low'],true)) $priority='medium';
 $category=$_POST['category'] ?? 'Kuliah'; if(!in_array($category,['Kuliah','Personal','Organization'],true)) $category='Kuliah';
 $due=$_POST['due_date'] ?: null; $nt=$_POST['notification_time'] ?? ''; $nt=$nt?str_replace('T',' ',$nt).':00':null; $image=null;
 if(isset($_FILES['attachment']) && $_FILES['attachment']['error']!==UPLOAD_ERR_NO_FILE) {
  $f=$_FILES['attachment'];
  if($f['error']!==UPLOAD_ERR_OK || $f['size']>2*1024*1024) go('index.php?scope='.$scope);
  $mime=(new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']); $types=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
  if(!isset($types[$mime])) go('index.php?scope='.$scope);
  $name=bin2hex(random_bytes(16)).'.'.$types[$mime];
  if(move_uploaded_file($f['tmp_name'],__DIR__.'/uploads/'.$name)) $image='uploads/'.$name;
 }
 $s=$pdo->prepare("INSERT INTO todos(owner_id,title,description,priority,due_date,category,scope,image_path,notification_time) VALUES(?,?,?,?,?,?,?,?,?)");
 $s->execute([$uid,$title,$desc,$priority,$due,$category,$scope,$image,$nt]); go('index.php?scope='.$scope);
}
$t=getTodo($pdo,$id,$scope,$uid); if(!$t) go('index.php?scope='.$scope);
if($action==='toggle') { $s=$pdo->prepare("UPDATE todos SET completed=IF(completed=1,0,1) WHERE id=?"); $s->execute([$id]); }
elseif($action==='delete') {
 if($t['image_path']) { $path=realpath(__DIR__.'/'.$t['image_path']); $uploads=realpath(__DIR__.'/uploads'); if($path && $uploads && str_starts_with($path,$uploads.DIRECTORY_SEPARATOR) && is_file($path)) unlink($path); }
 $s=$pdo->prepare("DELETE FROM todos WHERE id=?"); $s->execute([$id]);
}
go('index.php?scope='.$scope);
