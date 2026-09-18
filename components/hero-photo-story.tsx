"use client";

import { useEffect, useRef, useState } from "react";

const moments = [
  {
    src: "/assets/hero-south-indian-joy.png",
    alt: "A young South Indian couple laughing together in a modern courtyard",
    mood: "Spark",
    title: "Laughter can find its way back.",
    detail: "A joyful new connection that respects the life already lived",
  },
  {
    src: "/assets/hero-south-indian-elegant.png",
    alt: "An elegant South Indian couple sharing a warm look at a celebration",
    mood: "Warmth",
    title: "Someone who understands the life you already carry.",
    detail: "Shared experience, mutual respect and a future welcomed together",
  },
  {
    src: "/assets/hero-south-indian-date.png",
    alt: "A South Indian couple enjoying a relaxed rooftop date at sunset",
    mood: "Possibility",
    title: "The years ahead can still be shared.",
    detail: "Easy laughter, steady companionship and new moments to look forward to",
  },
];

export function HeroPhotoStory() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStart = useRef<number | null>(null);
  const wasSwiped = useRef(false);

  const showPrevious = () => setActive((current) => (current - 1 + moments.length) % moments.length);
  const showNext = () => setActive((current) => (current + 1) % moments.length);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(showNext, 4800);
    return () => window.clearInterval(timer);
  }, [paused]);

  const previous = (active - 1 + moments.length) % moments.length;
  const next = (active + 1) % moments.length;

  const positionFor = (index: number) => {
    if (index === active) return "active";
    if (index === previous) return "previous";
    if (index === next) return "next";
    return "hidden";
  };

  return (
    <div
      className="hero-photo-story"
      role="region"
      aria-roledescription="carousel"
      aria-label="Stories of companionship"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") showPrevious();
        if (event.key === "ArrowRight") showNext();
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onPointerDown={(event) => {
        pointerStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        if (pointerStart.current === null) return;
        const distance = event.clientX - pointerStart.current;
        pointerStart.current = null;
        if (Math.abs(distance) < 44) return;
        wasSwiped.current = true;
        window.setTimeout(() => {
          wasSwiped.current = false;
        }, 0);
        if (distance > 0) showPrevious();
        else showNext();
      }}
      onPointerCancel={() => {
        pointerStart.current = null;
      }}
    >
      <div className="hero-catalogue-stage">
        {moments.map((moment, index) => {
          const position = positionFor(index);
          return (
            <button
              className={`hero-catalogue-card ${position}`}
              type="button"
              onClick={() => {
                if (!wasSwiped.current) setActive(index);
              }}
              aria-label={index === active ? moment.title : `Show ${moment.mood.toLowerCase()} story`}
              aria-current={index === active ? "true" : undefined}
              key={moment.src}
            >
              <img
                src={moment.src}
                alt={index === active ? moment.alt : ""}
                loading={index === 0 ? "eager" : "lazy"}
                draggable="false"
              />
              <span className="hero-card-shade" />
              <span className="hero-moment-caption">
                <small>{moment.mood}</small>
                <strong>{moment.title}</strong>
                <em>{moment.detail}</em>
              </span>
            </button>
          );
        })}

        <button className="hero-arrow hero-arrow-left" type="button" onClick={showPrevious} aria-label="Show previous photo">‹</button>
        <button className="hero-arrow hero-arrow-right" type="button" onClick={showNext} aria-label="Show next photo">›</button>
      </div>

      <div className="hero-photo-controls" aria-label="Choose a photographic story">
        <span className="hero-slide-count"><b>0{active + 1}</b> / 0{moments.length}</span>
        <div className="hero-progress" aria-hidden="true">
          {moments.map((moment, index) => <i className={index === active ? "active" : ""} key={moment.mood} />)}
        </div>
        <button
          className="hero-pause"
          type="button"
          onClick={() => setPaused((current) => !current)}
          aria-label={paused ? "Resume photo carousel" : "Pause photo carousel"}
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}
