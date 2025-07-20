ffmpeg -i bbb_1080p.mov \
  -c:v libx264 -crf 23 -preset fast \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
  -c:a aac -b:a 128k \
  -movflags frag_keyframe+empty_moov+default_base_moof \
  -f mp4 bbb_1080p.mp4
