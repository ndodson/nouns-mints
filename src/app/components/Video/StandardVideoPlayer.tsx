"use client";
import {
    MediaController,
    MediaTimeRange,
    MediaTimeDisplay,
    MediaPlayButton,
    MediaMuteButton,
    MediaFullscreenButton,
    MediaLoadingIndicator,
} from "media-chrome/dist/react";
import { VolumeX, Volume2 } from 'lucide-react'
import { transformVideoAsset } from './index'
import { useRef, useEffect } from 'react';

const StandardVideoPlayer = ({ videoUrl, posterUrl }: { videoUrl: string, posterUrl: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isVideoObjectURL = !videoUrl.startsWith('http')
    const isPosterObjectURL = !posterUrl.startsWith('http')


    useEffect(() => {
        if (!videoRef.current) return
        videoRef.current.addEventListener("error", () => {
            console.log('error loading video, switching to unoptimized url')
            if (!videoRef.current) return
            videoRef.current.src = videoUrl
        })
    }, [])

    return (
        <MediaController className="w-full h-fit animate-fadeIn rounded-2xl">
            <video
                ref={videoRef}
                autoPlay={false}
                playsInline
                slot="media"
                src={videoUrl ? isVideoObjectURL ? videoUrl : transformVideoAsset(videoUrl, 'video', 600) : undefined}
                preload="auto"
                crossOrigin=""
                className="rounded-2xl aspect-video"
                poster={posterUrl ? isPosterObjectURL ? posterUrl : transformVideoAsset(posterUrl, 'image', 600) : undefined}
            />
            <MediaLoadingIndicator slot="centered-chrome" />

            <div className="flex flex-col items-end justify-end w-full m-auto bg-gradient-to-t from-black rounded-b-xl">
                <div className="flex w-full h-8 cursor-pointer">
                    <MediaTimeRange className="bg-transparent w-full"></MediaTimeRange>
                </div>
                <div className="flex w-full">
                    <MediaPlayButton className="bg-transparent"></MediaPlayButton>
                    <MediaMuteButton className="bg-transparent">
                        <span slot="high">
                            <Volume2 className="h-6 w-6 text-t1" />
                        </span>
                        <span slot="off">
                            <VolumeX className="h-6 w-6 text-t1" />
                        </span>
                    </MediaMuteButton>
                    <MediaTimeDisplay
                        showDuration
                        noToggle
                        className="bg-transparent"
                    />
                    <MediaFullscreenButton className="bg-transparent ml-auto" />
                </div>
            </div>
        </MediaController>
    );
};

export default StandardVideoPlayer;
