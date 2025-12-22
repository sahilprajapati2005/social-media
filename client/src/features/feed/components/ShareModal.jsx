import React from 'react';
import { AiOutlineClose, AiOutlineLink, AiFillFacebook, AiOutlineTwitter, AiOutlineWhatsApp } from 'react-icons/ai';
import { useToast } from '../../../context/ToastContext';
import useClickOutside from '../../../hooks/useClickOutside'; // Import the hook

const ShareModal = ({ post, onClose }) => {
  const { addToast } = useToast();
  
  // 1. Use the hook to detect clicks outside the modal content
  const modalRef = useClickOutside(() => {
    onClose();
  });
  
  const postUrl = `${window.location.origin}/post/${post._id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      addToast('Link copied to clipboard!', 'success');
    } catch (err) {
      addToast('Failed to copy link', 'error');
    }
  };

  const handleSocialShare = (platform) => {
    let url = '';
    const text = `Check out this post by ${post.username}`;

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(text)}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + postUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      {/* 2. Attach the ref to the actual modal card */}
      <div 
        ref={modalRef} 
        className="w-full max-w-sm rounded-xl bg-white shadow-2xl animate-fade-in"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-bold text-gray-800">Share Post</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <AiOutlineClose />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          <div className="flex justify-around">
            <button onClick={() => handleSocialShare('facebook')} className="flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600">
              <div className="rounded-full bg-blue-50 p-3"><AiFillFacebook className="text-2xl text-blue-600" /></div>
              <span className="text-xs">Facebook</span>
            </button>

            <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-2 text-gray-600 hover:text-blue-400">
              <div className="rounded-full bg-sky-50 p-3"><AiOutlineTwitter className="text-2xl text-sky-500" /></div>
              <span className="text-xs">Twitter</span>
            </button>

            <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-2 text-gray-600 hover:text-green-500">
              <div className="rounded-full bg-green-50 p-3"><AiOutlineWhatsApp className="text-2xl text-green-500" /></div>
              <span className="text-xs">WhatsApp</span>
            </button>
          </div>

          <div className="rounded-lg bg-gray-100 p-3 flex items-center justify-between border border-gray-200">
            <p className="truncate text-sm text-gray-500 w-48">{postUrl}</p>
            <button onClick={handleCopyLink} className="flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
              <AiOutlineLink /> Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;