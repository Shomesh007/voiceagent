import React from 'react';
import { vapi, ASSISTANT_ID } from '../../lib/vapi';
import { Phone, PhoneOff, Mic, MessageSquare } from 'lucide-react';


const SaifStatusCard: React.FC = () => {
  const [isCalling, setIsCalling] = React.useState(false);
  const [transcript, setTranscript] = React.useState<string>("");
  const [lastTranscript, setLastTranscript] = React.useState<string>("");
  const [showOutcome, setShowOutcome] = React.useState(false);

  React.useEffect(() => {
    const onCallStart = () => {
      setIsCalling(true);
      setShowOutcome(false);
    };
    const onCallEnd = () => {
      setIsCalling(false);
      setLastTranscript(transcript);
      if (transcript) setShowOutcome(true);
      setTranscript("");
    };
    const onMessage = (message: any) => {
      if (message.type === 'transcript' && message.transcriptType === 'partial') {
        setTranscript(message.transcript);
      }
    };

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
    };
  }, [transcript]);

  const handleToggleCall = () => {
    if (isCalling) {
      vapi.stop();
    } else {
      if (!ASSISTANT_ID) {
        console.error("VITE_VAPI_ASSISTANT_ID is not configured in .env.local");
        return;
      }
      vapi.start(ASSISTANT_ID);
    }
  };

  return (
    <div className="relative min-h-[500px] rounded-[2.5rem] bg-[var(--bg-low)] p-10 overflow-hidden cinematic-shadow group border border-[var(--gold-primary)]/5 flex flex-col">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[120%] bg-[var(--gold-primary)]/10 blur-[120px] rounded-full rotate-12" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isCalling ? 'bg-green-500 saif-pulse' : 'bg-[var(--text-muted)]'}`} />
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.4em] font-bold">
              {isCalling ? 'On the phone' : showOutcome ? 'Call Finished' : 'Waiting'}
            </span>
          </div>
          
          <h2 className="text-4xl font-serif text-[var(--gold-primary)] leading-tight max-w-xl">
            <span className="text-[var(--text-primary)]">Saif</span>
          </h2>
          
          <p className="text-[var(--text-secondary)] text-base max-w-md font-light leading-relaxed">
            An AI phone agent. He calls your customers, answers their questions, and finds out if they want to buy a house.
          </p>
        </div>

        <div className="space-y-6">
          {isCalling && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-4 text-[var(--gold-primary)]">
                <MessageSquare size={16} />
                <span className="text-[10px] uppercase tracking-widest font-bold">What He's Saying</span>
              </div>
              <div className="bg-[var(--bg-mid)]/50 backdrop-blur-md p-6 rounded-3xl border border-white/5 min-h-[80px] flex items-center">
                <p className="text-xl font-serif text-[var(--text-primary)] italic leading-snug">
                  "{transcript || "Listening..."}"
                </p>
              </div>
            </div>
          )}

          {showOutcome && !isCalling && (
            <div className="space-y-4 animate-in zoom-in-95 fade-in duration-700">
              <div className="flex items-center gap-3 text-green-400">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Call Complete</span>
              </div>
              <div className="bg-[var(--gold-primary)]/5 p-6 rounded-3xl border border-[var(--gold-primary)]/10">
                <p className="text-base text-[var(--text-secondary)] font-serif italic mb-2 opacity-60">What Was Said:</p>
                <p className="text-lg font-serif text-[var(--text-primary)] leading-snug">
                  "...{lastTranscript.slice(-150)}"
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <button 
              onClick={handleToggleCall}
              className={`flex items-center gap-4 px-10 py-5 rounded-full font-bold transition-all duration-500 scale-100 hover:scale-105 active:scale-95 shrink-0 ${
                isCalling 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                : 'bg-[var(--gold-primary)] text-black cinematic-shadow hover:bg-[var(--gold-light)]'
              }`}
            >
              {isCalling ? (
                <>
                  <PhoneOff size={20} />
                  <span className="uppercase tracking-widest text-xs">End Call</span>
                </>
              ) : (
                <>
                  <Phone size={20} />
                  <span className="uppercase tracking-widest text-xs">{showOutcome ? 'Try Again' : 'Start Call'}</span>
                </>
              )}
            </button>

            {!isCalling && showOutcome && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-1000">
                <div className="h-4 w-px bg-white/10" />
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">Saved</span>
              </div>
            )}

            {isCalling && (
              <div className="flex items-center gap-6 px-8 py-5 bg-[var(--bg-mid)]/30 rounded-full border border-white/5">
                <div className="flex items-center gap-3 text-[var(--text-muted)]">
                  <Mic size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Input</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-1.5 h-6 rounded-full bg-[var(--gold-primary)]/20 ${isCalling ? 'animate-bounce' : ''}`} style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Floating Animated Ring */}
      <div className="absolute top-1/2 right-[-10%] w-[400px] h-[400px] border border-[var(--gold-primary)]/10 rounded-full -translate-y-1/2 animate-[spin_20s_linear_infinite]" />
      <div className="absolute top-1/2 right-[-12%] w-[450px] h-[450px] border border-[var(--gold-primary)]/5 rounded-full -translate-y-1/2 animate-[spin_30s_linear_infinite_reverse]" />
    </div>
  );
};

export default SaifStatusCard;


