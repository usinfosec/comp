"use client";

import { Button } from "@bubba/ui/button";
import { Check, ArrowRight } from "lucide-react";
import type {
	OrganizationTrainingVideos,
	PortalTrainingVideos,
} from "@bubba/db/types";
import { useState } from "react";

interface YoutubeEmbedProps {
	video: OrganizationTrainingVideos & {
		trainingVideo: PortalTrainingVideos;
	};
	isCompleted: boolean;
	onComplete: () => void;
	onNext?: () => void;
	allVideosCompleted: boolean;
	onWatchAgain: () => void;
}

export function YoutubeEmbed({
	video,
	isCompleted,
	onComplete,
	onNext,
	allVideosCompleted,
	onWatchAgain,
}: YoutubeEmbedProps) {
	const [isRewatching, setIsRewatching] = useState(false);

	const handleVideoEnded = () => {
		setIsRewatching(false);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				{!allVideosCompleted && (
					<Button
						variant={isCompleted ? "secondary" : "default"}
						onClick={onComplete}
						disabled={isCompleted}
						className="gap-2"
					>
						<Check className="h-4 w-4" />
						{isCompleted ? "Completed" : "Mark as Complete"}
					</Button>
				)}
			</div>
			<div className="relative aspect-video w-full">
				{isCompleted && !isRewatching && (
					<div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
						<div className="text-center space-y-4">
							<Check className="h-12 w-12 text-primary mx-auto" />
							<h3 className="text-xl font-semibold">Video Completed</h3>
							<div className="flex gap-2 justify-center">
								<Button
									variant="outline"
									onClick={() => setIsRewatching(true)}
									className="gap-2"
								>
									Watch Again
								</Button>
								{onNext && (
									<Button onClick={onNext} className="gap-2">
										Next Video
										<ArrowRight className="h-4 w-4" />
									</Button>
								)}
							</div>
						</div>
					</div>
				)}
				<iframe
					className="w-full h-full"
					src={`https://www.youtube.com/embed/${video.trainingVideo.youtubeId}?enablejsapi=1`}
					title={video.trainingVideo.title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					onEnded={handleVideoEnded}
				/>
			</div>
		</div>
	);
}
