import { useState } from 'react';
import { generateVideoThumbnails } from "@rajesh896/video-thumbnails-generator";
import toast from 'react-hot-toast';

export class MediaUploadError {
    code: number;
    message: string;
    constructor({ code, message }: { code: number, message: string }) {
        this.code = code;
        this.message = message;
    }
}


export const IpfsUpload = async (file: File | Blob) => {

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            },
            body: formData
        });

        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            return ""
        }

        const responseData = await response.json();
        return `https://ipfs.cork.wtf/ipfs/${responseData.IpfsHash}`;
    } catch (err) {
        console.error("Fetch error:", err);
        return "";
    }
};

const calculateDuration = (objectURL: string): Promise<number> =>
    new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = objectURL;

        video.onloadedmetadata = () => resolve(video.duration);
        video.onerror = () => reject(new MediaUploadError({ code: 4, message: "Invalid video. Please select a video file." }));
    });

const isVideo = (mimeType: string) => {
    return mimeType.includes("video");
}

export const useMediaUpload = (acceptedFormats: string[], maxDuration?: number) => {
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isThumbnailUploading, setIsThumbnailUploading] = useState<boolean>(false)
    const [animationObjectURL, setAnimationObjectURL] = useState<string>("");
    const [imageObjectURL, setImageObjectURL] = useState<string>("");
    const [thumbnailOptions, setThumbnailOptions] = useState<Array<string>>([])
    const [thumbnailBlobIndex, setThumbnailBlobIndex] = useState<number>(-1)
    const [mimeType, setMimeType] = useState<string | null>(null)
    const [fileSize, setFileSize] = useState<number | null>(null)
    const [imageURI, setImageURI] = useState<string>("")
    const [animationURI, setAnimationURI] = useState<string>("")

    const clearFields = () => {
        setIsUploading(false);
        setIsThumbnailUploading(false);
        URL.revokeObjectURL(animationObjectURL);
        URL.revokeObjectURL(imageObjectURL);
        setAnimationObjectURL("");
        setImageObjectURL("");
        setImageURI("");
        setAnimationURI("");
        setThumbnailOptions([]);
        setThumbnailBlobIndex(-1);
        setMimeType(null);
        setFileSize(null);

    }

    const upload = async (file: File) => {
        try {
            setIsUploading(true);

            if (!file) {
                clearFields();
                throw new MediaUploadError({ code: 1, message: 'No file selected' })
            }

            const __mimeType = file.type;
            const __fileSize = file.size;
            const __isVideo = isVideo(__mimeType);

            if (!acceptedFormats.includes(__mimeType)) {
                clearFields();
                throw new MediaUploadError({ code: 3, message: 'Invalid file format.' });
            }

            setMimeType(__mimeType);
            setFileSize(__fileSize);

            if (__isVideo) {
                setIsThumbnailUploading(true);
                const thumbnails = await generateVideoThumbnails(file, 3, 'jpeg');
                setThumbnailOptions(thumbnails);
                setThumbnailBlobIndex(0);
                const blob = await fetch(thumbnails[0])
                    .then(res => res.blob())
                const thumbURI = await IpfsUpload(blob);
                setImageURI(thumbURI ?? "");
                setIsThumbnailUploading(false);
            }
            else {
                if (fileSize && fileSize > 15000000) {
                    clearFields();
                    throw new MediaUploadError({ code: 2, message: 'Images must be less than 15MB' });
                }
            }

            const objectURL = URL.createObjectURL(file);
            if (__isVideo) {
                const duration = await calculateDuration(objectURL);
                if (maxDuration && duration > maxDuration) {
                    clearFields();
                    throw new MediaUploadError({ code: 2, message: `Videos must be less than ${maxDuration} seconds` });
                }
                setAnimationObjectURL(objectURL);
            }
            else setImageObjectURL(objectURL);

            const response = await IpfsUpload(file);
            if (!response) {
                clearFields();
                throw new MediaUploadError({ code: 5, message: 'Error uploading to IPFS' })
            }

            if (__isVideo) setAnimationURI(response)
            else setImageURI(response)
            setIsUploading(false)
        } catch (err) {
            if (err instanceof MediaUploadError) {
                toast.error(err.message)
            } else {
                toast.error("an unknown error occurred. Please try again later")
            }
        }
    }


    const handleThumbnailChoice = async (index: number) => {
        setIsThumbnailUploading(true);
        setThumbnailBlobIndex(index)
        const blob = await fetch(thumbnailOptions[index])
            .then(res => res.blob())
        const thumbURI = await IpfsUpload(blob);
        setImageURI(thumbURI ?? "");
        setIsThumbnailUploading(false);
    }


    return {
        upload,
        isVideo: Boolean(animationObjectURL),
        removeMedia: clearFields,
        isUploading: isUploading || isThumbnailUploading,
        animationObjectURL,
        imageObjectURL,
        thumbnailOptions,
        thumbnailBlobIndex,
        handleThumbnailChoice,
        imageURI,
        animationURI,
        mimeType
    }

}