import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player'

function Test() {
    const [videoFile, setVideoFile] = useState(null);
    const [loader, setloader] = useState(false)
    const playerRef = useRef(null);

    const handleVideoChange = (event) => {
        setVideoFile(event.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        let data = new FormData();
        data.append("file", videoFile);
        data.append("upload_preset", "vidify_image_preset");

        try {
            const res = await axios.post(`https://api.cloudinary.com/v1_1/dsq6bfksv/image/upload`, data);
            console.log(res);
        }
        catch (err) {
            console.log(err);
        }
    }


    // https://res.cloudinary.com/dsq6bfksv/image/upload/v1711337711/vidify_images/qjyp1bmb5dcc4efefdck.png

    // https://res.cloudinary.com/dsq6bfksv/image/upload/v1711337781/vidify_images/av1dxoqeyhfbftwhtg62.jpg

    // const getVideo = async () => {
    //     const res = await axios.post("http://localhost:3000/Image", { public_id: "vidify_videos/arckqdlceauea5zmqbqn" })
    //     console.log(res);
    // }
    // useEffect(() => {
    //     getVideo()
    // }, [])


    // vidify_videos/higwughxxaxlrgykscah
    // https://res.cloudinary.com/dsq6bfksv/video/upload/v1711202492/vidify_videos/higwughxxaxlrgykscah.mp4 --small
    // https://res.cloudinary.com/dsq6bfksv/video/upload/v1711204894/vidify_videos/arckqdlceauea5zmqbqn.mp4
    // https://res.cloudinary.com/dsq6bfksv/video/upload/v1/vidify_videos/higwughxxaxlrgykscah?_a=BAMHUyP80 --small
    // https://res.cloudinary.com/dsq6bfksv/video/upload/v1/vidify_videos/arckqdlceauea5zmqbqn?_a=BAMHUyP80

    return (
        <div>
            {loader ? " uplading" : <><input type="file" accept="image/*" onChange={handleVideoChange} />
                <button onClick={handleUpload}>Upload</button> </>}
            {/* <ReactPlayer
                url="https://res.cloudinary.com/dsq6bfksv/video/upload/v1/vidify_videos/arckqdlceauea5zmqbqn?_a=BAMHUyP80"
                controls={true}
                width="50%"
                height="400px"
                playing={true}
                config={{
                    youtube: {
                        controls: 1,
                        modestbranding: 1,
                        showinfo: 1,
                        rel: 0
                    },
                }}
            /> */}

        </div>
    );
}

export default Test;
