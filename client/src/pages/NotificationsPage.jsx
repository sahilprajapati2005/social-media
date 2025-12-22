import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fetchNotifications, markRead } from '../features/notifications/notificationSlice';
import { AiFillHeart, AiFillMessage, AiOutlineUserAdd } from 'react-icons/ai';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleNotificationClick = (id, isRead) => {
    if (!isRead) {
      dispatch(markRead(id));
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <AiFillHeart className="text-2xl text-red-500" />;
      case 'comment': return <AiFillMessage className="text-2xl text-blue-500" />;
      case 'follow': return <AiOutlineUserAdd className="text-2xl text-green-500" />;
      default: return null;
    }
  };

  const getMessage = (notification) => {
    const { type } = notification;
    if (type === 'like') return 'liked your post.';
    if (type === 'comment') return 'commented on your post.';
    if (type === 'follow') return 'started following you.';
    return '';
  };

  if (loading && items.length === 0) return <div className="mt-10"><Spinner size="lg" /></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Notifications</h1>

      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-gray-500">
            No notifications yet.
          </div>
        ) : (
          items.map((n) => (
            <Link 
              key={n._id}
              to={n.postId ? `/post/${n.postId}` : `/profile/${n.sender._id}`}
              onClick={() => handleNotificationClick(n._id, n.isRead)}
              className={`flex items-center gap-4 rounded-xl p-4 transition-colors ${
                n.isRead ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'
              }`}
            >
              <div className="flex-shrink-0">
                {getIcon(n.type)}
              </div>

              <Avatar src={n.sender.profilePicture} size="md" />

              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <span className="font-bold">{n.sender.username}</span>{' '}
                  {getMessage(n)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>

              {!n.isRead && (
                <div className="h-3 w-3 rounded-full bg-blue-600"></div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;