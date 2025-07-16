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

export default function Home() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        setCurrentTime(0);
      };

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, []);

  const configCurrentTime = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, Math.min(time, duration));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const playPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-[#222222] flex justify-center items-center">
      <div className="w-[20vw] max-w-sm bg-purple-900 rounded-xl shadow-lg flex flex-col p-4">
        <div
          className="w-full relative rounded-lg overflow-hidden mb-2"
          style={{ paddingTop: "56%" }}
        >
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-[20vh] object-cover"
            src="./assets/video.mp4"
            loop
          >
            Seu navegador não suporta a tag de vídeo.
          </video>
          <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 rounded-md text-white text-xs z-10 font-bold">
            {" "}
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-white text-2xl font-bold">Danilo e Davi</h2>
          <p className="text-purple-400 text-lg">Apaga Apaga Apaga</p>
        </div>

        <div className="w-full flex items-center space-x-2 mb-8">
          <span className="text-white text-sm">{formatTime(currentTime)}</span>
          <input
            className="flex-grow h-1 bg-purple-500 atividade3/public/assets/video.mp4rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
            type="range"
            min={0}
            max={duration}
            step={0.01}
            value={currentTime}
            // onChange={(e) => configCurrentTime(Number(e.target.value))}
          />
          <span className="text-white text-sm">{formatTime(duration)}</span>
        </div>

        <div className="w-full flex justify-around items-center">
          {" "}
          {/* Usei justify-around para espaçamento uniforme */}
          <button
            //onClick={() => configCurrentTime(currentTime - 10)}
            className=" bg-purple-500 hover:text-white transition-colors duration-200 focus:outline-none text-xl p-2" // Menor, com padding
            aria-label="Voltar 10 segundos"
          >
            <FaBackward />
          </button>
          <button
            onClick={playPause}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-transform duration-150 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50" // Levemente menor
            aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
          >
            {playing ? (
              <FaPause className="text-red-500 text-3xl" />
            ) : (
              <FaPlay className="text-red-500 text-3xl" />
            )}
          </button>
          <button
            // onClick={() => configCurrentTime(currentTime + 10)}
            className=" bg-purple-500 hover:text-white transition-colors duration-200 focus:outline-none text-xl p-2" // Menor, com padding
            aria-label="Avançar 10 segundos"
          >
            <FaForward />
          </button>
          <div className=" bg-purple-500 text-xl p-2">
            {" "}
            {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
          </div>
        </div>
      </div>
    </div>
  );
}
