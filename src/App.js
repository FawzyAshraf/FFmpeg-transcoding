import React, { useState } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./App.css";

function App() {
    const [videoSrc, setVideoSrc] = useState();
    const [audioSrc, setAudioSrc] = useState();
    const [transcoding, setTranscoding] = useState(false);
    const [result, setResult] = useState();
    const ffmpeg = createFFmpeg({
        log: true,
    });
    const doTranscode = async (e) => {
        e.preventDefault();
        if (!videoSrc || !audioSrc) return;
        setTranscoding(true);
        await ffmpeg.load();
        ffmpeg.FS("writeFile", "video.webm", await fetchFile(videoSrc));
        ffmpeg.FS("writeFile", "audio.opus", await fetchFile(audioSrc));
        await ffmpeg.run(
            "-i",
            "video.webm",
            "-i",
            "audio.opus",
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            "-strict",
            "experimental",
            "-map",
            "0:v:0",
            "-map",
            "1:a:0",
            "-shortest",
            "out.mp4"
        );
        const data = ffmpeg.FS("readFile", "out.mp4");
        const url = URL.createObjectURL(
            new Blob([data.buffer], { type: "video/mp4" })
        );
        console.log(url);
        setResult(url);
        setTranscoding(false);
    };
    return (
        <div className="app">
            <h2>Merge a Video and an Audio File</h2>
            <form
                onSubmit={(e) => {
                    doTranscode(e);
                }}
            >
                <div className="form-fields">
                    <div className="file-field">
                        <label htmlFor="video-file" className="file-upload">
                            Upload Video
                        </label>
                        <input
                            type="file"
                            onChange={(e) => {
                                setVideoSrc(e.target.files.item(0));
                            }}
                            accept=".webm"
                            id="video-file"
                        ></input>
                        {videoSrc && (
                            <video
                                src={URL.createObjectURL(videoSrc)}
                                controls
                            ></video>
                        )}
                    </div>
                    <div className="file-field">
                        <label htmlFor="audio-file" className="file-upload">
                            Upload Audio
                        </label>
                        <input
                            type="file"
                            onChange={(e) => {
                                setAudioSrc(e.target.files.item(0));
                            }}
                            accept=".opus"
                            id="audio-file"
                        ></input>
                        {audioSrc && (
                            <video
                                src={URL.createObjectURL(audioSrc)}
                                controls
                            ></video>
                        )}
                    </div>
                </div>
                <button type="submit">Merge</button>
            </form>
            <div className="result">
                {transcoding && <h2>Transcoding... </h2>}
                {result && (
                    <div>
                        <video src={result} controls></video>
                        <a href={result} download="video.mp4">
                            Download
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
