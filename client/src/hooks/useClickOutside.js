import { useEffect, useRef } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 * @param {Function} handler - The function to call when a click outside is detected
 * @param {boolean} listen - Whether the listener should be active (optional, default true)
 */
const useClickOutside = (handler, listen = true) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click was outside the referenced element
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    if (listen) {
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      // Unbind the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [handler, listen]);

  return ref;
};

export default useClickOutside;