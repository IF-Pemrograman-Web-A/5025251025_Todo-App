<?php
require 'config.php';
$scope=($_GET['scope'] ?? 'personal')==='shared'?'shared':'personal';
$pageTitle=ucfirst($scope).' Todos | My To Do List';
$selectedId=(int)($_GET['selected'] ?? 0);
if($scope==='shared') $stmt=$pdo->query("SELECT * FROM todos WHERE scope='shared' ORDER BY completed, created_at DESC");
else { $stmt=$pdo->prepare("SELECT * FROM todos WHERE scope='personal' AND owner_id=? ORDER BY completed, created_at DESC"); $stmt->execute([demo_user_id()]); }
$todos=$stmt->fetchAll();
$selected=null; foreach($todos as $t) if((int)$t['id']===$selectedId) $selected=$t;
if(!$selected && $todos) $selected=$todos[0];
require 'header.php';
?>
<main id="main-content" class="workspace">
<?php require 'menubar.php'; ?>
<section class="todo-panel" aria-labelledby="list-title">
<div class="panel-header"><div><span class="eyebrow"><?= $scope==='shared'?'TEAM WORKSPACE':'YOUR WORKSPACE' ?></span><h2 id="list-title"><?=ucfirst($scope)?> Todos</h2><p><?=count(array_filter($todos,fn($t)=>!$t['completed']))?> tasks remaining</p></div><span class="todo-count"><?=count(array_filter($todos,fn($t)=>!$t['completed']))?></span></div>
<?php if(!$todos): ?><div class="empty-state">No todos here yet 🌱<br>Add a task using the form.</div><?php else: ?><div class="todo-list">
<?php foreach($todos as $t): ?><article class="todo-item <?=$selected && $selected['id']===$t['id']?'active':''?> <?=$t['completed']?'completed':''?>">
<form method="post" action="actions.php" class="inline-form"><input type="hidden" name="csrf_token" value="<?=e(csrf_token())?>"><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?=$t['id']?>"><input type="hidden" name="scope" value="<?=e($scope)?>"><button class="checkbox-button <?=$t['completed']?'checked':''?>" aria-label="Toggle <?=e($t['title'])?>"><?=$t['completed']?'✓':''?></button></form>
<a class="todo-content" href="index.php?scope=<?=e($scope)?>&selected=<?=$t['id']?>"><h3><?=e($t['title'])?></h3><p>Deadline: <?=$t['due_date']?e(date('d F Y',strtotime($t['due_date']))):'No deadline'?></p><span class="tag"><?=e($t['category'])?></span></a><span class="priority <?=e($t['priority'])?>"><?=e(ucfirst($t['priority']))?></span></article><?php endforeach; ?></div><?php endif; ?>
</section>
<aside class="detail-panel">
<?php if($selected): ?><span class="detail-label">TO DO DETAILS</span><h2><?=e($selected['title'])?></h2><p class="detail-date">Deadline: <?=$selected['due_date']?e(date('d F Y',strtotime($selected['due_date']))):'No deadline'?></p>
<div class="detail-info"><div class="info-item"><span>Status</span><strong><?=$selected['completed']?'Completed':'Not Started'?></strong></div><div class="info-item"><span>Priority</span><strong><?=e(ucfirst($selected['priority']))?></strong></div><div class="info-item"><span>Category</span><strong><?=e($selected['category'])?></strong></div><div class="info-item"><span>Visibility</span><strong><?=e(ucfirst($selected['scope']))?></strong></div></div>
<div class="description"><h3>Description</h3><p><?=nl2br(e($selected['description'])) ?: 'No description.'?></p></div>
<?php if($selected['image_path']): ?><div class="description"><h3>Attachment</h3><img class="detail-image" src="<?=e($selected['image_path'])?>" alt="Image attached to todo"></div><?php endif; ?>
<?php if($selected['notification_time']): ?><div class="description"><h3>Reminder time</h3><p><?=e(date('d M Y, H:i',strtotime($selected['notification_time'])))?></p></div><?php endif; ?>
<div class="actions"><form method="post" action="actions.php"><input type="hidden" name="csrf_token" value="<?=e(csrf_token())?>"><input type="hidden" name="action" value="toggle"><input type="hidden" name="id" value="<?=$selected['id']?>"><input type="hidden" name="scope" value="<?=e($scope)?>"><button class="btn complete-btn"><?=$selected['completed']?'Mark Incomplete':'Mark Complete'?></button></form>
<form method="post" action="actions.php" onsubmit="return confirm('Delete this todo?')"><input type="hidden" name="csrf_token" value="<?=e(csrf_token())?>"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?=$selected['id']?>"><input type="hidden" name="scope" value="<?=e($scope)?>"><button class="btn delete-btn">Delete Todo</button></form></div>
<?php else: ?><h2>No Todo Selected</h2><?php endif; ?>
</aside>
<section class="new-todo-section"><form class="todo-form" method="post" action="actions.php" enctype="multipart/form-data"><input type="hidden" name="csrf_token" value="<?=e(csrf_token())?>"><input type="hidden" name="action" value="create"><input type="hidden" name="scope" value="<?=e($scope)?>"><span class="eyebrow">NEW TASK</span><h2>Create a New To Do</h2>
<div class="form-group"><label for="title">To Do Title</label><input id="title" name="title" maxlength="150" required placeholder="Enter your task..."></div>
<div class="form-group"><label for="description">Description</label><textarea id="description" name="description" rows="3" placeholder="Describe your task..."></textarea></div>
<div class="form-row"><div class="form-group"><label for="priority">Priority</label><select id="priority" name="priority"><option value="high">High</option><option value="medium" selected>Medium</option><option value="low">Low</option></select></div><div class="form-group"><label for="due_date">Due Date</label><input id="due_date" type="date" name="due_date"></div></div>
<div class="form-row"><div class="form-group"><label for="category">Category</label><select id="category" name="category"><option>Kuliah</option><option>Personal</option><option>Organization</option></select></div><div class="form-group"><label for="notification_time">Reminder Time (optional)</label><input id="notification_time" type="datetime-local" name="notification_time"></div></div>
<div class="form-group"><label for="attachment">Image attachment (optional)</label><input id="attachment" type="file" name="attachment" accept="image/png,image/jpeg,image/webp"><small>Maximum 2 MB. PNG, JPG, or WEBP.</small></div><button class="add-btn" type="submit">+ Add Todo</button></form></section>
</main><footer class="footer">© 2026 My To Do List · The Iron Citadel</footer><script src="script.js"></script></body></html>
