# 1. Define the path to your current .txt file
$inputFile = "C:\Users\nicks\OneDrive\JobApps\WEB\drugs.txt"

# 2. Define where you want the new .csv to be saved
$outputFile = "C:\Users\nicks\OneDrive\JobApps\WEB\drug_inventory.csv"

# 3. Read the content and export it
# We use -Raw to ensure the formatting stays intact, then convert from CSV strings
$data = Get-Content -Path $inputFile | ConvertFrom-Csv

# 4. Save to CSV (NoTypeInformation prevents the extra line at the top of the file)
$data | Export-Csv -Path $outputFile -NoTypeInformation -Encoding UTF8

Write-Host "Success! Your file has been converted to: $outputFile" -ForegroundColor Cyan