import React, { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ImageIcon, SendHorizonal, Mic, Square } from 'lucide-react'
import assets from '../assets/assets'
import AudioPreview from '../component/shared/AudioPreview'
import "../styles/ui.css"

const ChatBox = () => {
  const { userId } = useParams()
  const currentConversation = assets.dummyMessageData[0]
  const [messages, setMessages] = useState(currentConversation.messages)
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(assets.currentUser)
  const [audioURL, setAudioURL] = useState(null)
  const [recording, setRecording] = useState(false)
  const [recordTime, setRecordTime] = useState(0)
  const [typingUser, setTypingUser] = useState(null) // NEW
  let sentByUser = null;
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordTimerRef = useRef(null)
  const startTimeRef = useRef(null)
  const messagesEndRef = useRef(null)

  const MAX_RECORD_TIME = 60
  const placeholders = [
    "Say hi 👋", "Send a quick note...", "Type your message...",
    "What's on your mind?", "Write a reply...", "Drop a message..."
  ]
  const [placeholder, setPlaceholder] = useState(
    placeholders[Math.floor(Math.random() * placeholders.length)]
  )

  // Simulate other user typing (For testing)
  useEffect(() => {
    const typingSimulation = setInterval(() => {
      setTypingUser(currentConversation.full_name)
      setTimeout(() => setTypingUser(null), 7000)
    }, 8000) // every 8s they "type"

    return () => clearInterval(typingSimulation)
  }, [])

  // Send message
  const sendMessage = () => {
    if (!text && !image && !audioURL) return
    const newMessage = {
      from_user_id: user._id,
      to_user_id: "u2",
      createdAt: new Date().toISOString(),
      message_type: audioURL ? 'audio' : image ? 'image' : 'text',
      media_url: audioURL || (image ? URL.createObjectURL(image) : null),
      text: text || ""
    }
    setMessages(prev => [...prev, newMessage])
    setText('')
    setImage(null)
    setAudioURL(null)
  }

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      setRecordTime(0)
      startTimeRef.current = Date.now()

      mediaRecorderRef.current.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }
      mediaRecorderRef.current.onstop = () => {
        clearInterval(recordTimerRef.current)
        const duration = (Date.now() - startTimeRef.current) / 1000
        if (duration < 0.5) {
          setAudioURL(null)
          return
        }
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
      }
      mediaRecorderRef.current.start()
      setRecording(true)
      recordTimerRef.current = setInterval(() => {
        setRecordTime(prev => {
          if (prev + 1 >= MAX_RECORD_TIME) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } catch (err) {
      console.error("Error accessing microphone:", err)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  // Scroll & placeholder rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(prev => {
        const idx = placeholders.indexOf(prev)
        return placeholders[(idx + 1) % placeholders.length]
      })
    }, 10000)
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    return () => {
      clearInterval(interval)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className='flex flex-col h-screen'>
      {/* Top bar */}
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-multi-gradient' style={{overflow : 'hidden'}}>
        <img src={user.profile_image} className='size-8 rounded-full' alt='User' />
        <div>
          <p className="font-medium">{user.full_name}</p>
          <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className='p-5 md:px-10 h-full overflow-y-scroll bg-multi-gradient'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {messages
            .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((msg, i) => {
              sentByUser = msg.from_user_id === user._id
              return (
                <div key={i} className={`flex flex-col ${sentByUser ? 'items-end' : 'items-start'}`}>
                  {msg.message_type === 'audio' && msg.media_url ? (
                    <AudioPreview audioURL={msg.media_url} isUser={sentByUser} />
                  ) : (
                    <div className={`p-2 text-sm max-w-sm rounded-xl shadow ${sentByUser ? 'bg-white text-black rounded-br-none' : 'bg-[var(--accent)] text-white rounded-bl-none'}`}>
                      {msg.message_type === 'image' && msg.media_url && (
                        <img src={msg.media_url} alt='Sent media' className='w-full max-w-sm rounded-lg mb-1' />
                      )}
                      {msg.text && <p>{msg.text}</p>}
                    </div>
                  )}
                </div>
              )
            })}

          {/* Typing animation */}
        {typingUser && (
        <div
          className={`bg-gray-300 h-8 px-3 py-2 inline-flex items-center gap-1
            ${sentByUser
              ? 'rounded-tl-md rounded-bl-md rounded-br-md rounded-tr-none' // User’s bubble shape
              : 'rounded-tr-md rounded-br-md rounded-bl-md rounded-tl-none' // Other person’s bubble shape
            }
          `}
        >
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      )}

          {audioURL && <AudioPreview audioURL={audioURL} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className='px-4 bg-multi-gradient' style={{overflow : 'hidden'}}>
        <div className='flex items-center p-2 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
          <input
            type='text'
            className='flex-1 outline-none text-slate-700 px-3'
            placeholder={placeholder}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />

          <div className='flex items-center gap-2'>
            {/* Image Upload */}
            <label htmlFor='image' className='cursor-pointer'>
              {image ? <img src={URL.createObjectURL(image)} className='h-8 rounded' alt='Preview' /> : <ImageIcon className='size-7 text-gray-400' />}
              <input type='file' id='image' accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />
            </label>

            {/* Mic Button */}
            <div className='flex flex-col items-center'>
              <button
                onClick={recording ? stopRecording : startRecording}
                className={`p-3 rounded-full shadow-lg transition-all duration-300 ${recording ? 'bg-red-500 hover:bg-red-600 scale-105' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {recording ? <Square size={20} className="text-white" /> : <Mic size={20} className="text-gray-700" />}
              </button>
              {recording && (
                <div className="relative w-16 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner mt-1">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-100 ease-linear"
                    style={{ width: `${(recordTime / MAX_RECORD_TIME) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              className="bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)] hover:from-[var(--primary)] hover:to-[var(--secondary)] active:scale-95 cursor-pointer text-white p-2 rounded-full"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ChatBox