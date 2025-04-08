"use client";

import { useState, useEffect, useRef } from "react";
import NumberFlow, { continuous } from "@number-flow/react";
import { useDebounce } from "use-debounce";

interface FullScreenNumberAnimationProps {
	total: number;
}

export function FullScreenNumberAnimation({
	total,
}: FullScreenNumberAnimationProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [animationValue, setAnimationValue] = useState(total);
	const prevTotalRef = useRef(total);
	const animationCompleteRef = useRef(false);

	// Debounce value changes to handle rapid updates
	const [debouncedTotal] = useDebounce(total, 300);

	// When debounced total changes, trigger the animation sequence
	useEffect(() => {
		if (debouncedTotal === prevTotalRef.current) return;

		// Reset animation state
		animationCompleteRef.current = false;

		// Step 1: Show the fullscreen with previous value
		setAnimationValue(prevTotalRef.current);
		setIsVisible(true);

		// Step 2: After a delay, start the number transition
		const startTransitionTimer = setTimeout(() => {
			setIsTransitioning(true);
			setAnimationValue(debouncedTotal);
		}, 500);

		// Step 3: Hide fullscreen after animation and a brief pause
		const hideTimer = setTimeout(() => {
			// Only hide if animation has completed
			if (animationCompleteRef.current) {
				setIsVisible(false);
				setIsTransitioning(false);
				prevTotalRef.current = debouncedTotal;
			}
		}, 2500);

		return () => {
			clearTimeout(startTransitionTimer);
			clearTimeout(hideTimer);
		};
	}, [debouncedTotal]);

	// Do not render anything if not visible
	if (!isVisible) {
		return null;
	}

	// Render the full-screen animation overlay
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-300">
			<div className="text-9xl font-bold text-primary font-variant-numeric-tabular">
				<NumberFlow
					value={animationValue}
					plugins={[continuous]}
					animated={isTransitioning}
					transformTiming={{
						duration: 1200,
						easing: "cubic-bezier(0.25, 1, 0.5, 1)",
					}}
					spinTiming={{
						duration: 1500,
						easing: "cubic-bezier(0.16, 1, 0.3, 1)",
					}}
					willChange={true}
					respectMotionPreference={true}
					onAnimationsFinish={(e) => {
						// Mark animation as complete
						if (isTransitioning && animationValue === debouncedTotal) {
							animationCompleteRef.current = true;

							// If we're past the hide timer duration, hide now
							const timeElapsed =
								Date.now() -
								(prevTotalRef.current !== debouncedTotal
									? Date.now() - 2500
									: 0);
							if (timeElapsed >= 2500) {
								setIsVisible(false);
								setIsTransitioning(false);
								prevTotalRef.current = debouncedTotal;
							}
						}
					}}
				/>
			</div>
		</div>
	);
}
