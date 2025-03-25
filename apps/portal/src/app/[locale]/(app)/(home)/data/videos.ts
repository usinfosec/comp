import type { TrainingVideo } from "../types";

export const securityVideos: TrainingVideo[] = [
  {
    id: "1",
    title: "Security Awareness Training - Part 1",
    description: "Training Video from YouTube",
    youtubeId: "N-sBS3uCWB4",
    url: "https://www.youtube.com/watch?v=N-sBS3uCWB4",
  },
  {
    id: "2",
    title: "Security Awareness Training - Part 2",
    description: "Another Training Video",
    youtubeId: "JwQNwhDyXig",
    url: "https://www.youtube.com/watch?v=JwQNwhDyXig",
  },
  {
    id: "3",
    title: "Security Awareness Training - Part 3",
    description: "Another Training Video",
    youtubeId: "fzMNw_-KEGE",
    url: "https://www.youtube.com/watch?v=fzMNw_-KEGE",
  },
  {
    id: "4",
    title: "Security Awareness Training - Part 4",
    description: "Another Training Video",
    youtubeId: "WbpqjH9kI2Y",
    url: "https://www.youtube.com/watch?v=WbpqjH9kI2Y",
  },
  {
    id: "5",
    title: "Security Awareness Training - Part 5",
    description: "Another Training Video",
    youtubeId: "Clvfkm6azDs",
    url: "https://www.youtube.com/watch?v=Clvfkm6azDs",
  },
];

export const trainingVideos: TrainingVideo[] = [...securityVideos];
