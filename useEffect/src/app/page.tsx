"use client";

import { useEffect, useRef, useState } from "react";
import {
  FaBackward,
  FaForward,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

const videos = [
  {
    id: 1,
    title: "Video 0",
    artist: "Música Relaxante",
    src: "/assets/video.mp4", 
    thumbnail: "/assets/video_cover.png",

  },
  {
    id: 2,
    title: "Video 1",
    artist: "Música Relaxante",
    src: "/assets/video1.mp4",
    thumbnail: "/assets/video1_cover.png", 
  },
  {
    id: 3,
    title: "Video 2",
    artist: "Música Relaxante",
    src: "/assets/video2.mp4",
    thumbnail: "/assets/video2_cover.png",
  },
];

export default function Home() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videos[currentIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setCurrentTime(video.currentTime);
    };

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setMuted(video.muted);
    };

    const handleEnded = () => {
      const nextIndex = (currentIndex + 1) % videos.length;
      selectAndPlayVideo(nextIndex);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex]);

  const selectAndPlayVideo = (index: number) => {
    setCurrentIndex(index);
    requestAnimationFrame(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {
          console.warn("Autoplay bloqueado pelo navegador");
        });
      }
    });
  };

  const configCurrentTime = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(time, duration));
  };

  const playPause = () => {
    if (!videoRef.current) return;
    playing ? videoRef.current.pause() : videoRef.current.play();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (muted) {
      videoRef.current.volume = prevVolume;
      videoRef.current.muted = false;
    } else {
      setPrevVolume(videoRef.current.volume);
      videoRef.current.muted = true;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    videoRef.current.volume = Number(e.target.value);
  };

  const formatTime = (time: number) =>
    `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

  return (
    <div className="w-full h-screen bg-purple-800 flex justify-center items-center p-4 space-x-4">
      <div className="w-[40vw] max-w-lg bg-purple-900 rounded-xl shadow-lg flex flex-col p-4">
        <div className="w-full relative rounded-lg overflow-hidden mb-2" style={{ paddingTop: "56.25%" }}>
          <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover" src={currentVideo.src}>
            Seu navegador não suporta a tag de vídeo.
          </video>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-white text-2xl font-bold">{currentVideo.title}</h2>
          <p className="text-lg">{currentVideo.artist}</p>
        </div>

        <div className="w-full flex items-center space-x-2 mb-4">
          <span className="text-white text-sm">{formatTime(currentTime)}</span>
          <input
            className="flex-grow h-1 bg-purple-600 rounded-lg appearance-none cursor-pointer"
            type="range"
            min={0}
            max={duration}
            step={0.01}
            value={currentTime}
            onChange={(e) => configCurrentTime(Number(e.target.value))}
          />
          <span className="text-white text-sm">
            {duration > 0 ? `-${formatTime(Math.max(0, duration - currentTime))}` : formatTime(duration)}
          </span>
        </div>

        <div className="w-full flex justify-around items-center mb-4">
          <button onClick={() => configCurrentTime(currentTime - 10)} className="hover:text-white text-xl p-2">
            <FaBackward />
          </button>
          <button onClick={playPause} className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            {playing ? <FaPause className="text-pink-300 text-3xl" /> : <FaPlay className="text-pink-300 text-3xl" />}
          </button>
          <button onClick={() => configCurrentTime(currentTime + 10)} className="hover:text-white text-xl p-2">
            <FaForward />
          </button>
        </div>

        <div className="w-full flex items-center space-x-2 mb-2">
          <button onClick={toggleMute} className="hover:text-white text-xl p-2">
            {muted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={muted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-grow h-1 bg-purple-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="w-[25vw] max-w-sm bg-purple-900 rounded-xl shadow-lg flex flex-col p-4 overflow-y-auto max-h-[80vh]">
        <h3 className="text-white text-xl font-bold mb-4">Lista de Vídeos</h3>
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={`flex items-center space-x-4 p-3 mb-3 rounded-lg cursor-pointer transition-colors duration-200 ${
              currentIndex === index ? "bg-pink-300" : "bg-purple-700 hover:bg-purple-600"
            }`}
            onClick={() => selectAndPlayVideo(index)}
          >
            <img src={video.thumbnail} alt={video.title} className="w-16 h-16 rounded-md object-cover" />
            <div>
              <p className="text-white font-semibold">{video.title}</p>
              <p className="text-white text-sm">{video.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
