import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import assets from '../assets/assets';
import moment from 'moment';

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);

  const fetchRecentMessages = async () => {
    setMessages(assets.dummyRecentMessageData);
  };

  useEffect(() => {
    fetchRecentMessages();
  }, []);

  return (
    <div className="bg-white max-w-xs mt-4 min-h-20 rounded-md shadow text-slate-800">
      <h3 className="font-semibold text-slate-800 mb-4 px-2 pt-2">
        Recent Messages
      </h3>

      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => (
          <Link
            key={index}
            to={`/chatbox/${message.conversation_id}`}
            className="flex items-start gap-2 px-2 py-2 hover:bg-slate-100"
          >
            {/* Sender's profile image */}
            <div className="flex-shrink-0">
              <img
                src={message.sender.profile_image_url}
                className="w-10 h-10 object-cover rounded-full"
                alt={message.sender.full_name}
              />
            </div>

            <div className="flex-1 border-b border-gray-100 pb-2">
              {/* Name & Timestamp */}
<div className="flex items-center justify-between gap-2">
  <p className="font-medium truncate max-w-[50%]">
    {message.sender.full_name}
  </p>
  <p className="text-[11px] text-slate-500 whitespace-nowrap flex-shrink-0">
    {moment(message.last_message.timestamp).calendar(null, {
      sameDay: 'h:mm A',
      lastDay: '[Yesterday]',
      lastWeek: 'ddd',
      sameElse: 'MMM D',
    })}
  </p>
</div>

              {/* Message text / media & Unread count */}
              <div className="flex justify-between items-center mt-1">
                <p className="text-[14px] text-gray-500 truncate max-w-[80%]">
                  {message.last_message.type === "text" && message.last_message.text
                    ? <p>{message.last_message.text.slice(0, 30)}...</p>
                    : "Media"}
                </p>
                {message.unread_count > 0 && (
                  <p className="bg-[var(--primary)] text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                    {message.unread_count}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;