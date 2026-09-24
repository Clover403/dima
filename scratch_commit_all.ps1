$status = git status --porcelain
foreach ($line in $status) {
    if (-not $line) { continue }
    $file = $line.Substring(3).Trim().Trim('"')
    if (-not $file) { continue }
    
    git add -A -- "$file"
    
    $msg = "chore: update $file"
    if ($file -like 'src/*') { $msg = "feat: update $file" }
    elseif ($file -like 'public/*') { $msg = "assets: update $file" }
    elseif ($file -like 'scripts/*') { $msg = "scripts: add or update $file" }
    elseif ($file -like '*.md') { $msg = "docs: update $file" }
    elseif ($file -like '.*') { $msg = "config: update $file" }
    
    git commit -m "$msg"
}
