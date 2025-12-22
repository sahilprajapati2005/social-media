import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const usePreviewImg = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const [file, setFile] = useState(null);
  const { addToast } = useToast();

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Validation: Check file type
      if (!selectedFile.type.startsWith('image/')) {
        addToast('Please select an image file', 'error');
        setFile(null);
        setImgUrl(null);
        return;
      }

      // Validation: Check file size (e.g., 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        addToast('File size must be less than 10MB', 'error');
        setFile(null);
        setImgUrl(null);
        return;
      }

      setFile(selectedFile);
      setImgUrl(URL.createObjectURL(selectedFile));
    }
  };

  const clearImage = () => {
    setFile(null);
    setImgUrl(null);
  };

  // Cleanup memory URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imgUrl) {
        URL.revokeObjectURL(imgUrl);
      }
    };
  }, [imgUrl]);

  return { handleImageChange, imgUrl, file, clearImage, setImgUrl };
};

export default usePreviewImg;