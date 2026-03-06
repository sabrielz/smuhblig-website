try {
    $url = 'https://github.com/ezyang/htmlpurifier/archive/refs/tags/v4.17.0.zip'
    $out = 'D:\smuhblig-website\htmlpurifier.zip'
    Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing
    $size = (Get-Item $out).Length
    Write-Host "SUCCESS: $size bytes downloaded"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
