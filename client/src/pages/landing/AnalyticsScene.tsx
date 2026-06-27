/**
 * Scene 4 — THE MIRROR
 * Cinematic redesign using Wanderful prompt reference for background & fonts.
 * Uses GSAP mouse parallax on video.
 */
import { useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import gsap from 'gsap';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260510_060007_60275ce7-030c-4668-a160-8f364ec537d3.mp4';

export default function AnalyticsScene() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bottomBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax setup
    const video = videoRef.current;
    if (!video) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = ((e.clientX - cx) / cx) * 20;
      targetY = ((e.clientY - cy) / cy) * 20;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      gsap.set(video, { x: currentX, y: currentY });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const onLoaded = () => {
      if (video) video.playbackRate = 1.25;
    };
    if (video) {
      video.addEventListener('loadedmetadata', onLoaded);
      if (video.readyState >= 1) onLoaded();
    }
    return () => video?.removeEventListener('loadedmetadata', onLoaded);
  }, []);

  // Fade in content using GSAP scroll trigger or IntersectionObserver
  // We'll just use a simple IntersectionObserver so it plays when in view
  useEffect(() => {
    const headline = headlineRef.current;
    const bottomBlock = bottomBlockRef.current;
    if (!headline || !bottomBlock) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              headline,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            );
            gsap.fromTo(
              bottomBlock,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power2.out' }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(containerRef.current!);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      id="analytics"
      className="relative min-h-screen w-full bg-black text-white overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src={BG_VIDEO}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover origin-center scale-[1.08]"
        />
        {/* Dark overlay to ensure text legibility */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Eyebrow */}
      <div className="absolute top-8 left-8 z-20">
        <p className="text-[11px] font-medium tracking-[0.14em] text-white/50 uppercase">
          Act IV — The Mirror
        </p>
      </div>

      {/* Headline */}
      <div
        ref={headlineRef}
        className="absolute top-[120px] w-full flex flex-col items-center justify-center z-20 text-center px-4 opacity-0"
      >
        <h2
          className="font-normal"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(40px, 5.4vw, 72px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          <span className="text-white block">DATA</span>
          <span className="text-white/55 block">DOESN'T LIE.</span>
        </h2>
      </div>

      {/* Bottom Block */}
      <div
        ref={bottomBlockRef}
        className="absolute bottom-14 w-full flex flex-col items-center justify-center z-20 gap-8 px-6 opacity-0"
      >
        <p className="max-w-[620px] text-[15px] leading-relaxed text-center">
          <span className="text-white">
            HabitFlow gives you a mirror — raw, unfiltered, and honest.
          </span>
          <span className="text-white/55">
            {' '}
            Here's what the numbers say about people who commit.
          </span>
        </p>

        {/* Stats Row in liquid glass */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="liquid-glass rounded-2xl px-6 py-4 flex flex-col items-center min-w-[140px]">
            <p className="text-3xl font-medium tracking-tight text-white" style={{ fontFamily: 'Dirtyline' }}>87%</p>
            <p className="text-[10px] font-medium tracking-[0.1em] text-white/70 uppercase mt-1 text-center">Completion</p>
          </div>
          <div className="liquid-glass rounded-2xl px-6 py-4 flex flex-col items-center min-w-[140px]">
            <p className="text-3xl font-medium tracking-tight text-white" style={{ fontFamily: 'Dirtyline' }}>30d</p>
            <p className="text-[10px] font-medium tracking-[0.1em] text-white/70 uppercase mt-1 text-center">Median Streak</p>
          </div>
          <div className="liquid-glass rounded-2xl px-6 py-4 flex flex-col items-center min-w-[140px]">
            <p className="text-3xl font-medium tracking-tight text-white" style={{ fontFamily: 'Dirtyline' }}>4×</p>
            <p className="text-[10px] font-medium tracking-[0.1em] text-white/70 uppercase mt-1 text-center">More Likely</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Lock size={13} strokeWidth={1.5} className="text-white/70" />
          <span className="text-[11px] font-medium tracking-[0.14em] text-white/70">
            SECURE BY DESIGN. ZERO DATA LEAKS.
          </span>
        </div>
      </div>
    </section>
  );
}
