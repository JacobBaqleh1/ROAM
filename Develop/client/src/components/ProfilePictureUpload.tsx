import { useState } from "react";
import { useMutation } from "@apollo/client";
import { GENERATE_SIGNED_URL } from "../utils/queries";

const ProfilePictureUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [generateSignedUrl] = useMutation(GENERATE_SIGNED_URL);

    const handleFileChange = (event: any) => {
        setFile(event.target.files[0]);
    };

    const uploadFile = async () => {
        if (!file) return;

        // 1. Get signed URL from the server
        const { data } = await generateSignedUrl({
            variables: { fileType: file.type },
        });

        const signedUrl = data.generateSignedUrl.url;

        // 2. Upload file to S3
        const uploadResponse = await fetch(signedUrl, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
                "x-amz-acl": "public-read"
            },
            body: file,
        });

        if (uploadResponse.ok) {
            console.log("File uploaded successfully!");
        } else {
            console.error("Upload failed");
        }
    };

    return (
        <div>
            <h1>hi thereeeeeeeeeee</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={uploadFile}>Upload</button>
        </div>
    );
};

export default ProfilePictureUpload;
