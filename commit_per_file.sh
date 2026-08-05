#!/bin/bash

# Pastikan internal field separator hanya newline untuk iterasi baris
IFS=$'\n'

for line in $(git status --porcelain); do
  # Ambil status (2 karakter pertama)
  status=${line:0:2}
  # Ambil nama file (mulai dari karakter ke-4)
  file=${line:3}
  filename=$(basename "$file")
  
  if [[ "$status" == *"D"* ]]; then
    git rm "$file"
    git commit -m "Menghapus $filename yang tidak lagi digunakan"
  elif [[ "$status" == "??" ]]; then
    git add "$file"
    git commit -m "Menambahkan file baru: $filename"
  else
    git add "$file"
    git commit -m "Memperbarui pengaturan/kode pada $filename"
  fi
done
