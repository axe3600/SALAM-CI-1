import {
    FaPlayCircle,
    FaClock
} from "react-icons/fa";

function VideoPlayer({ video, getFileUrl }) {

    if (!video) {
        return null;
    }

    const videoUrl = getFileUrl(video.video);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

            <div className="flex items-center gap-3 p-5 border-b border-gray-100">

                <FaPlayCircle className="text-purple-600 text-xl" />

                <div>
                    <h4 className="font-bold text-gray-800">
                        {video.title}
                    </h4>

                    {video.duration && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <FaClock />
                            {video.duration}
                        </div>
                    )}
                </div>

            </div>

            <div className="bg-black aspect-video">

                <video
                    controls
                    preload="metadata"
                    className="w-full h-full"
                    src={videoUrl}
                >
                    Votre navigateur ne supporte pas la lecture vidéo.
                </video>

            </div>

            {video.description && (
                <div className="p-5">

                    <p className="text-gray-600 leading-7 whitespace-pre-line">
                        {video.description}
                    </p>

                </div>
            )}

        </div>
    );
}

export default VideoPlayer;