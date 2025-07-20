ffmpeg -i bbb_1080p.mov \
  -c:v libx264 -crf 28 -preset slower -profile:v high -tune film \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1" \
  -movflags frag_keyframe+empty_moov+default_base_moof \
  -x264-params ref=4:bframes=3:b-adapt=1 \
  -c:a aac -b:a 96k -ac 2 \
  bbb_720p_fragmented.mp4
