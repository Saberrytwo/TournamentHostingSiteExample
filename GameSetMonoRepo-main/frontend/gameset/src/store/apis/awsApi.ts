import { toast } from "react-toastify";

const BASE_URL =
  import.meta.env.VITE_ENVIRONMENT === "Development" ? import.meta.env.VITE_API_DEV : import.meta.env.VITE_API_PROD;

const getS3PresignedUrl = async (keyName: string): Promise<string> => {
  let s3PresignedUrl;
  const url = `${BASE_URL}/Aws/GetS3PresignedUrl?keyName=${keyName}`;
  await fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      s3PresignedUrl = data.url;
    })
    .catch((error) => {
      toast.error("Something went wrong trying to prepare the image upload.", {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    });
  return s3PresignedUrl;
};

const sendImageToS3 = async (url: string, image: File): Promise<Response> => {
  return await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": image.type, // Set a generic Content-Type header for any image type
    },
    body: image,
  });
};

export { getS3PresignedUrl, sendImageToS3 };
