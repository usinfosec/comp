"use client";

import type { Session } from "@/app/lib/auth";
import type {
	OrganizationTrainingVideos,
	PortalTrainingVideos,
} from "@comp/db/types";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { markVideoAsCompleted } from "../../actions/markVideoAsCompleted";
import { CarouselControls } from "./CarouselControls";
import { YoutubeEmbed } from "./YoutubeEmbed";

interface VideoCarouselProps {
	videos: (OrganizationTrainingVideos & {
		trainingVideo: PortalTrainingVideos;
	})[];
	user: Session["user"];
}

export function VideoCarousel({ videos, user }: VideoCarouselProps) {
	// Find the last completed video index or default to 0
	const lastCompletedIndex = (() => {
		const completedIndices = videos
			.map((video, index) => ({
				index,
				completed: video.completedBy.includes(user.id),
			}))
			.filter((item) => item.completed)
			.map((item) => item.index);

		return completedIndices.length > 0
			? completedIndices[completedIndices.length - 1]
			: 0;
	})();

	const [currentIndex, setCurrentIndex] = useState(lastCompletedIndex);

	// Initialize completedVideos based on user's completedBy status
	const initialCompletedVideos = new Set(
		videos
			.filter((video) => video.completedBy.includes(user.id))
			.map((video) => video.id),
	);

	const [completedVideos, setCompletedVideos] = useState<Set<string>>(
		initialCompletedVideos,
	);

	const { execute } = useAction(markVideoAsCompleted, {
		onSuccess: () => {
			setCompletedVideos((prev) => new Set([...prev, videos[currentIndex].id]));
		},
		onError: (error) => {
			console.error("Failed to mark video as completed:", error);
		},
	});

	// Update completedVideos when video completion status changes
	useEffect(() => {
		const newCompletedVideos = new Set(
			videos
				.filter((video) => video.completedBy.includes(user.id))
				.map((video) => video.id),
		);
		setCompletedVideos(newCompletedVideos);
	}, [videos, user.id]);

	const goToPrevious = () => {
		const isFirstVideo = currentIndex === 0;
		const newIndex = isFirstVideo ? videos.length - 1 : currentIndex - 1;
		setCurrentIndex(newIndex);
	};

	const goToNext = () => {
		const currentVideoId = videos[currentIndex].id;
		if (!completedVideos.has(currentVideoId)) return;
		const isLastVideo = currentIndex === videos.length - 1;
		const newIndex = isLastVideo ? 0 : currentIndex + 1;
		setCurrentIndex(newIndex);
	};

	const handleVideoComplete = async () => {
		const currentVideoId = videos[currentIndex].id;
		if (completedVideos.has(currentVideoId)) return;

		execute({ videoId: currentVideoId });
	};

	const isCurrentVideoCompleted = completedVideos.has(videos[currentIndex].id);
	const hasNextVideo = currentIndex < videos.length - 1;
	const allVideosCompleted = videos.every((video) =>
		completedVideos.has(video.id),
	);

	return (
		<div className="space-y-4">
			{allVideosCompleted && (
				<div className="w-full flex flex-col items-center justify-center py-8 space-y-2">
					<h2 className="text-2xl font-semibold">
						All Training Videos Completed!
					</h2>
					<p className="text-muted-foreground text-center">
						You're all done, now your manager won't pester you!
					</p>
				</div>
			)}
			{
				<>
					<YoutubeEmbed
						video={videos[currentIndex]}
						isCompleted={isCurrentVideoCompleted}
						onComplete={handleVideoComplete}
						onNext={
							isCurrentVideoCompleted && hasNextVideo ? goToNext : undefined
						}
						allVideosCompleted={allVideosCompleted}
						onWatchAgain={() => {
							setCurrentIndex(lastCompletedIndex);
						}}
					/>
					<CarouselControls
						currentIndex={currentIndex}
						total={videos.length}
						onPrevious={goToPrevious}
						onNext={
							isCurrentVideoCompleted && hasNextVideo ? goToNext : undefined
						}
					/>
				</>
			}
		</div>
	);
}
