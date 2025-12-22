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
        return null;
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
                onRecordingComplete(blob, transcript);
                resetTranscript();
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            SpeechRecognition.startListening({ continuous: true });
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("ERR: MIC_ACCESS_DENIED");
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
        <div className="relative font-mono">
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center justify-center w-12 h-12 border-2 transition-all ${isRecording
                    ? 'bg-m-red border-m-red text-black animate-pulse'
                    : 'bg-transparent border-m-white text-m-white hover:border-m-red hover:text-m-red'
                    }`}
                title={isRecording ? "STOP_RECORDING" : "INIT_VOICE_LOG"}
            >
                {isRecording ? (
                    <div className="flex flex-col items-center">
                        <Square size={16} fill="currentColor" />
                        <span className="text-[8px] font-black mt-1">REC</span>
                    </div>
                ) : (
                    <Mic size={20} />
                )}
            </button>

            <AnimatePresence>
                {isRecording && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute bottom-full mb-4 right-0 bg-black border border-m-red text-m-white w-72 shadow-[0_0_20px_rgba(255,42,42,0.2)]"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-2 px-3 py-1 bg-m-red/20 border-b border-m-red/50 text-m-red text-[10px] uppercase font-bold tracking-widest">
                            <span className={`w-2 h-2 rounded-full ${listening ? 'bg-m-red animate-ping' : 'bg-gray-500'}`} />
                            {listening ? 'AUDIO_INPUT_ACTIVE' : 'PROCESSING_BUFFER...'}
                        </div>

                        {/* Content */}
                        <div className="p-3 text-xs leading-relaxed opacity-80 min-h-[60px]">
                            {transcript ? (
                                <>
                                    <span className="text-m-red mr-2">&gt;&gt;</span>
                                    {transcript}
                                    <span className="animate-pulse inline-block w-2 h-4 bg-m-red ml-1 align-middle" />
                                </>
                            ) : (
                                <span className="text-gray-600 italic">WAITING_FOR_INPUT...</span>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-m-red text-black text-[8px] px-2 py-0.5 font-bold text-right uppercase">
                            WAVEFORM_ANALYSIS // ENCRYPTED
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
