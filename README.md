Transcoding a .opus audio and .webm video files into one .mp4 video using [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm).

Using FFmpeg requires using [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) which needs some cross-origin settings, so [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware) is being used to set up a proxy server.

If the Audio and video files aren't the same length, then, with the current settings, the result will be the same length as the shortest of them.
