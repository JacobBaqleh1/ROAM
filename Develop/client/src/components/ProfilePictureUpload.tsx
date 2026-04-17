// Profile picture upload — integrates with AWS S3 via a server-signed URL

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { GENERATE_SIGNED_URL } from "../utils/queries";
import Button from "./ui/Button";

const ProfilePictureUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generateSignedUrl] = useMutation(GENERATE_SIGNED_URL);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0] ?? null;
        setFile(selected);
        setSuccess(false);
        setError(null);
    };

    const uploadFile = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);

        try {
            const { data } = await generateSignedUrl({ variables: { fileType: file.type } });
            const signedUrl: string = data.generateSignedUrl.url;

            const response = await fetch(signedUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type, "x-amz-acl": "public-read" },
                body: file,
            });

            if (response.ok) {
                setSuccess(true);
                setFile(null);
            } else {
                setError("Upload failed. Please try again.");
            }
        } catch {
            setError("An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl bg-white shadow-card max-w-sm">
            <h3 className="font-semibold text-gray-800">Profile Picture</h3>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-forest-50 file:text-forest-600 hover:file:bg-forest-100 cursor-pointer"
            />

            {file && (
                <p className="text-xs text-gray-500 truncate">Selected: {file.name}</p>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}
            {success && <p className="text-xs text-forest-600 font-medium">Photo uploaded successfully!</p>}

            <Button
                variant="primary"
                size="sm"
                loading={uploading}
                disabled={!file}
                onClick={uploadFile}
            >
                Upload Photo
            </Button>
        </div>
    );
};

export default ProfilePictureUpload;
