ffmpeg -i input.mp4 \
  # 1080p variant
  -map 0 -c:v libx264 -crf 22 -preset fast -vf "scale=min(iw\,1920):min(ih\,1080)" -b:v 5000k -maxrate 5000k -bufsize 10000k \
  # 720p variant
  -map 0 -c:v libx264 -crf 23 -preset fast -vf "scale=min(iw\,1280):min(ih\,720)" -b:v 2500k -maxrate 2500k -bufsize 5000k \
  # Audio (common for all variants)
  -map 0:a -c:a aac -b:a 128k \
  # DASH output
  -f dash -seg_duration 4 -adaptation_sets "id=0,streams=v id=1,streams=a" \
  manifest.mpd
