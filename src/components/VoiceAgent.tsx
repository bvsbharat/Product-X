import React, { useState, useEffect, useRef } from "react";
import { useConversation } from "@elevenlabs/react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface VoiceAgentProps {
  className?: string;
}

const VoiceAgent: React.FC<VoiceAgentProps> = ({ className = "" }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const conversation = useConversation();

  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID;
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const videoUrl =
    "https://cdn.dribbble.com/userupload/15697531/file/original-0242acdc69146d4472fc5e69b48616dc.mp4";

  // Get signed URL for ElevenLabs conversation
  const getSignedUrl = async () => {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
        {
          headers: {
            "xi-api-key": apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get signed URL");
      }

      const data = await response.json();
      return data.signed_url;
    } catch (error) {
      console.error("Error getting signed URL:", error);
      return null;
    }
  };

  // Initialize conversation
  const handleStartConversation = async () => {
    try {
      const url = await getSignedUrl();
      if (url && conversation) {
        await conversation.startSession({
          signedUrl: url,
        });
        setSignedUrl(url);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  // Handle conversation events
  const handleConversationConnect = () => {
    setIsConnected(true);
    console.log("Conversation connected");
  };

  const handleConversationDisconnect = () => {
    setIsConnected(false);
    setIsListening(false);
    console.log("Conversation disconnected");
  };

  // Monitor conversation status
  useEffect(() => {
    if (conversation) {
      // Set up listeners for conversation events
      const checkStatus = () => {
        if (conversation.status === "connected") {
          setIsConnected(true);
        } else if (conversation.status === "disconnected") {
          setIsConnected(false);
          setIsListening(false);
        }

        // Check if agent is speaking or listening
        setIsListening(conversation.isSpeaking || false);
      };

      const interval = setInterval(checkStatus, 100);
      return () => clearInterval(interval);
    }
  }, [conversation]);

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (conversation) {
      conversation.setVolume({ volume: isMuted ? 1 : 0 });
    }
  };

  const handleEndConversation = async () => {
    if (conversation) {
      await conversation.endSession();
    }
    setIsConnected(false);
    setSignedUrl(null);
    setIsListening(false);
  };

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Circular Video Avatar */}
      <div className="relative w-24 h-24 mx-auto">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg relative">
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Status Indicator */}
          <div className="absolute top-1 right-1">
            <div
              className={`w-3 h-3 rounded-full border-2 border-white ${
                isConnected
                  ? isListening
                    ? "bg-red-500 animate-pulse"
                    : "bg-green-500"
                  : "bg-gray-400"
              }`}
            />
          </div>

          {/* Listening Animation */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-75" />
          )}

          {/* Start Chat Icon */}
          {!isConnected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handleStartConversation}
                className="w-full h-full rounded-full flex items-center justify-center transition-colors"
                aria-label="Start chat"
              >
                <svg
                  className="w-6 h-6 text-blue-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4C11.4477 4 11 4.44772 11 5V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V5C13 4.44772 12.5523 4 12 4Z"
                    fill="currentColor"
                  />
                  <path
                    d="M7 9C7 8.44772 6.55228 8 6 8C5.44772 8 5 8.44772 5 9V12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12V9C19 8.44772 18.5523 8 18 8C17.4477 8 17 8.44772 17 9V12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12V9Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 20C11.4477 20 11 20.4477 11 21V22C11 22.5523 11.4477 23 12 23C12.5523 23 13 22.5523 13 22V21C13 20.4477 12.5523 20 12 20Z"
                    fill="currentColor"
                  />
                  <path
                    d="M8 21C7.44772 21 7 21.4477 7 22C7 22.5523 7.44772 23 8 23H16C16.5523 23 17 22.5523 17 22C17 21.4477 16.5523 21 16 21H8Z"
                    fill="currentColor"
                  />
                  <path
                    d="M15 2C14.4477 2 14 2.44772 14 3V4C14 4.55228 14.4477 5 15 5C15.5523 5 16 4.55228 16 4V3C16 2.44772 15.5523 2 15 2Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9 2C8.44772 2 8 2.44772 8 3V4C8 4.55228 8.44772 5 9 5C9.55228 5 10 4.55228 10 4V3C10 2.44772 9.55228 2 9 2Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-2 mt-2">
        {isConnected && (
          <>
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-lg transition-colors ${
                isMuted
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </button>

            <button
              onClick={handleEndConversation}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <MicOff className="w-3 h-3" />
            </button>
          </>
        )}
      </div>

      {/* Status Text */}
      <div className="text-center mt-1">
        <p className="text-xs text-gray-600 leading-tight">
          {!isConnected
            ? " Assistant"
            : isListening
            ? "Listening..."
            : "Ready to chat"}
        </p>
      </div>
    </div>
  );
};

export default VoiceAgent;
