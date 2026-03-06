$zipPath = 'D:\smuhblig-website\htmlpurifier.zip'
$extractPath = 'D:\smuhblig-website\htmlpurifier-tmp'
$vendorDest = 'D:\smuhblig-website\vendor\ezyang\htmlpurifier'

# Extract
Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

# Create vendor dir
$null = New-Item -ItemType Directory -Path $vendorDest -Force

# Copy library contents (the extracted folder name has version in it)
$sourceDir = Get-ChildItem $extractPath | Select-Object -First 1
Copy-Item -Path "$($sourceDir.FullName)\*" -Destination $vendorDest -Recurse -Force

Write-Host "Installed to: $vendorDest"
Write-Host "Files: $((Get-ChildItem $vendorDest -Recurse -File).Count)"

# Cleanup
Remove-Item $extractPath -Recurse -Force
Remove-Item $zipPath -Force
Write-Host "Cleanup done."
