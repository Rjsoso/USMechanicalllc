import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));

Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  rotateZ: i * 4,            // <-- NEW diagonal angle
  zIndex: total - i
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    rotateZ: slot.rotateZ,    // <-- ADD THIS
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = ({
  width = 750,
  height = 580,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  enableHoverSpread = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);

      // IMMEDIATELY set z-index to back so it goes behind other cards right away
      tl.set(elFront, { zIndex: backSlot.zIndex });

      // STEP 1 — Drop front card slightly down and backwards (not out of view)
      tl.to(elFront, {
        y: '+=120',
        z: '-=150',
        rotateX: 10,
        duration: config.durDrop,
        ease: config.ease
      });

      // STEP 2 — Move all other cards up like usual
      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);

        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            rotateZ: slot.rotateZ,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      // STEP 3 — Slide old front card to the *back* slot
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);

      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z + 20,
          rotateZ: backSlot.rotateZ,
          rotateX: 0,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    const node = container.current;
    const cleanupFunctions = [];

    if (pauseOnHover) {
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      cleanupFunctions.push(() => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
      });
    }

    if (enableHoverSpread) {
      const onEnter = () => {
        refs.forEach((ref, i) => {
          gsap.to(ref.current, {
            x: i * (cardDistance + 45),
            rotateZ: -2 + i * 1.5,
            duration: 0.4,
            ease: 'power2.out'
          });
        });
      };

      const onLeave = () => {
        refs.forEach((ref, i) => {
          const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
          gsap.to(ref.current, {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            rotateZ: slot.rotateZ,
            duration: 0.4,
            ease: 'power2.inOut'
          });
        });
      };

      node.addEventListener('mouseenter', onEnter);
      node.addEventListener('mouseleave', onLeave);
      cleanupFunctions.push(() => {
        node.removeEventListener('mouseenter', onEnter);
        node.removeEventListener('mouseleave', onLeave);
      });
    }

    return () => {
      clearInterval(intervalRef.current);
      cleanupFunctions.forEach(cleanup => cleanup());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, enableHoverSpread, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: () => onCardClick && onCardClick(i)
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;

