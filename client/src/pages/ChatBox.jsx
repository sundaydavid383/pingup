import React, { useRef, useState, useEffect } from 'react'
import assets from '../assets/assets'
import "../styles/ui.css"
import { useParams } from 'react-router-dom'
import { ImageIcon, SendHorizonal, Mic, Square } from 'lucide-react'

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

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recordTimerRef = useRef(null)

  const MAX_RECORD_TIME = 60 // seconds (Instagram style)

  const messagesEndRef = useRef(null)

  const placeholders = [
    "Say hi 👋",
    "Send a quick note...",
    "Type your message...",
    "What's on your mind?",
    "Write a reply...",
    "Drop a message..."
  ]
  const [placeholder, setPlaceholder] = useState(placeholders[Math.floor(Math.random()*placeholders.length)])

const sendMessage = () => {
  if (!text && !image && !audioURL) return

  const newMessage = {
    from_user_id: user._id,
    to_user_id: "u2", // or the other chat userId
    createdAt: new Date().toISOString(),
    message_type: audioURL ? 'audio' : image ? 'image' : 'text',
    media_url: audioURL || (image ? URL.createObjectURL(image) : null),
    text: text || ""
  }

  setMessages(prev => [...prev, newMessage])

  // reset inputs
  setText('')
  setImage(null)
  setAudioURL(null)
}

  // 🎙 Start recording with timer
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      setRecordTime(0)

      mediaRecorderRef.current.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        clearInterval(recordTimerRef.current)
        if (recordTime < 1) {
          console.log("Recording too short, discarded")
          setAudioURL(null)
          return
        }
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
      }

      mediaRecorderRef.current.start()
      setRecording(true)

      // Timer logic
      recordTimerRef.current = setInterval(() => {
        setRecordTime(prev => {
          if (prev + 1 >= MAX_RECORD_TIME) {
            stopRecording() // Auto stop when max time reached
            return prev
          }
          return prev + 1
        })
      }, 1000)

    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(prev => {
        const currentIndex = placeholders.indexOf(prev)
        const nextIndex = (currentIndex + 1) % placeholders.length
        return placeholders[nextIndex]
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
      <div className='flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-multi-gradient'>
        <img src={user.profile_image} className='size-8 rounded-full' alt='User' />
        <div>
          <p className="font-medium">{user.full_name}</p>
          <p className="text-sm text-gray-500 -mt-1.5">@{user.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div className='p-5 md:px-10 h-full overflow-y-scroll'>
        <div className='space-y-4 max-w-4xl mx-auto'>
          {messages
            .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((message, index) => {
              const isSentByCurrentUser = message.from_user_id === user._id
              return (
                <div key={index} className={`flex flex-col ${isSentByCurrentUser ? 'items-end' : 'items-start'}`}>
                  <div className={`p-2 text-sm max-w-sm rounded-lg shadow 
                    ${isSentByCurrentUser 
                      ? 'bg-white text-black rounded-br-none' 
                      : 'bg-[var(--accent)] text-white rounded-bl-none'
                    }`}>
                    
                    {message.message_type === 'image' && message.media_url && (
                      <img src={message.media_url} alt='Sent media'
                        className='w-full max-w-sm rounded-lg mb-1'
                      />
                    )}

                    {message.message_type === 'audio' && message.media_url && (
                      <audio controls className='mb-1'>
                        <source src={message.media_url} type='audio/mpeg' />
                        Your browser does not support the audio element.
                      </audio>
                    )}

                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              )
            })}

        {/* Preview unsent audio before sending */}
{audioURL && (+
  <div className="flex justify-end">
    <audio controls src={audioURL} className="mt-2 border border-gray-300 rounded-lg" />
    <span className="ml-2 text-xs text-gray-500">Preview before sending</span>
  </div>
)}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className='px-4'>
        <div className='flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
          <input
            type='text'
            className='flex-1 outline-none text-slate-700'
            placeholder={placeholder}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            onChange={(e) => setText(e.target.value)}
            value={text}
          />

          {/* Image Upload */}
          <label htmlFor='image'>
            {image
              ? <img src={URL.createObjectURL(image)} className='h-8 rounded' alt='Preview' />
              : <ImageIcon className='size-7 text-gray-400 cursor-pointer' />
            }
            <input
              type='file'
              id='image'
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

{/* Voice Note Button + Progress */}
<div className="flex flex-col items-center gap-2 w-28"> 
  {/* Mic Button */}
  <button
    onClick={recording ? stopRecording : startRecording}
    className={`p-3 rounded-full shadow-lg transition-all duration-300 
      ${recording 
        ? 'bg-red-500 hover:bg-red-600 scale-105' 
        : 'bg-gray-100 hover:bg-gray-200'
      }`}
  >
    {recording 
      ? <Square size={20} className="text-white" /> 
      : <Mic size={20} className="text-gray-700" />
    }
  </button>

  {/* Progress Bar */}
  {recording && (
    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
      <div 
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-100 ease-linear"
        style={{ width: `${(recordTime / MAX_RECORD_TIME) * 100}%` }}
      ></div>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-red-600">
        {recordTime}s / {MAX_RECORD_TIME}s
      </span>
    </div>
  )}
</div>

          {/* Send Button */}
        <button
  onClick={sendMessage}
  className="bg-gradient-to-br from-[var(--secondary)] to-[var(--primary)]
             hover:from-[var(--primary)] hover:to-[var(--secondary)]
             active:scale-95 cursor-pointer text-white p-2 rounded-full"
>
  <SendHorizonal size={18} />
</button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
