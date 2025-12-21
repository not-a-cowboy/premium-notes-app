import { useState, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
    onRecordingComplete: (audioBlob: Blob, transcript: string) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return null; // Or render a fallback/error
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                // We'll pass the transcript immediately or after a slight delay?
                // Transcript might still be finalizing.
                // React-speech-recognition handles final results well.
                onRecordingComplete(blob, transcript);
                resetTranscript();

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            SpeechRecognition.startListening({ continuous: true });
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            SpeechRecognition.stopListening();
            setIsRecording(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center gap-2 p-3 rounded-full transition-all shadow-lg ${isRecording
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-gta-purple text-white hover:bg-gta-pink'
                    }`}
                title={isRecording ? "Stop Recording" : "Start Voice Note"}
            >
                {isRecording ? <Square size={24} fill="currentColor" /> : <Mic size={24} />}
            </button>
            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-full mb-4 right-0 bg-black/80 backdrop-blur text-white p-3 rounded-xl w-64 text-sm"
                    >
                        <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs uppercase font-bold tracking-wider">
                            <span className={`w-2 h-2 rounded-full ${listening ? 'bg-red-500 animate-ping' : 'bg-gray-500'}`} />
                            {listening ? 'Listening...' : 'Processing...'}
                        </div>
                        <p className="line-clamp-3 italic">
                            {transcript || "Speak now..."}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
