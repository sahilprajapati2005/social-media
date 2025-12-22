import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineImage, AiOutlineVideoCamera, AiOutlineClose } from 'react-icons/ai';

// App Logic
import { addPost } from '../feedSlice';
import api from '../../../utils/axios';
import { useToast } from '../../../context/ToastContext';

// Components
import Avatar from '../../../components/ui/Avatar';
import Button from '../../../components/ui/Button';

const CreatePostWidget = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const fileInputRef = useRef();

  const [desc, setDesc] = useState('');
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' or 'video'
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Basic validation
      const sizeLimit = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > sizeLimit) {
        return addToast('File size too large (Max 10MB)', 'error');
      }
      setFile(selectedFile);
      setMediaType(type);
    }
  };

  const clearFile = () => {
    setFile(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc.trim() && !file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('desc', desc);
    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // Update Redux Feed immediately
      dispatch(addPost(res.data));
      
      // Reset Form
      setDesc('');
      clearFile();
      addToast('Post published successfully!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to post. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      
      {/* Top Section: Avatar & Input */}
      <div className="flex gap-3">
        <Avatar src={user?.profilePicture} size="md" />
        <textarea
          className="flex-1 resize-none border-none bg-transparent py-2 text-gray-700 placeholder-gray-400 outline-none focus:ring-0"
          placeholder={`What's on your mind, ${user?.username}?`}
          rows={2}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      {/* Media Preview */}
      {file && (
        <div className="relative mt-3 rounded-lg bg-gray-100 p-2">
          <button 
            onClick={clearFile}
            className="absolute right-2 top-2 z-10 rounded-full bg-gray-800/70 p-1 text-white hover:bg-gray-900"
          >
            <AiOutlineClose />
          </button>
          
          {mediaType === 'image' ? (
            <img 
              src={URL.createObjectURL(file)} 
              alt="preview" 
              className="max-h-64 w-full rounded-md object-contain" 
            />
          ) : (
            <video 
              src={URL.createObjectURL(file)} 
              controls 
              className="max-h-64 w-full rounded-md" 
            />
          )}
        </div>
      )}

      {/* Bottom Section: Actions & Submit */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex gap-4">
          <label className="flex cursor-pointer items-center gap-2 text-gray-500 transition hover:text-green-600">
            <AiOutlineImage className="text-xl" />
            <span className="hidden text-sm font-medium sm:block">Photo</span>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleFileChange(e, 'image')}
            />
          </label>
          
          <label className="flex cursor-pointer items-center gap-2 text-gray-500 transition hover:text-red-600">
            <AiOutlineVideoCamera className="text-xl" />
            <span className="hidden text-sm font-medium sm:block">Video</span>
            <input 
              type="file" 
              accept="video/*" 
              className="hidden" 
              onChange={(e) => handleFileChange(e, 'video')}
            />
          </label>
        </div>

        <Button 
          onClick={handleSubmit} 
          isLoading={isLoading}
          disabled={!desc.trim() && !file}
          size="sm"
          className="rounded-full px-6"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CreatePostWidget;