export type LearningMaterial = {
  id: string;
  title: string;
  description: string;
  url: string;
};

export const learningMaterials: LearningMaterial[] = [
  {
    id: "recorded-walkthroughs",
    title: "Recorded walkthroughs and resources",
    description: "Customer onboarding walkthrough and supporting resources.",
    url: "https://coparto365.sharepoint.com/:b:/r/sites/all-it/GroupDrive/DOMAINS/Data%20%26%20AI/Reporting/MiHub%206.0/Omni%20Documentation/Omni%20developer%20knowledge%20base/Omni%20Customer%20Onboarding%201.pdf?d=we49a2e56ad0c4deda6333e8647afdbbc&csf=1&web=1&e=kiKktp",
  },
  {
    id: "user-training",
    title: "User Training slides",
    description: "Training slides for end users of the platform.",
    url: "https://coparto365.sharepoint.com/:b:/r/sites/all-it/GroupDrive/DOMAINS/Data%20%26%20AI/Reporting/MiHub%206.0/Omni%20Documentation/Omni%20developer%20knowledge%20base/Omni%20User%20Training_5966.pdf?d=w514c35dab332407e92d8baa0a8a06b8b&csf=1&web=1&e=H2Orz0",
  },
  {
    id: "developer-training",
    title: "Developer Training slides",
    description: "Training slides for developers building on the platform.",
    url: "https://coparto365.sharepoint.com/:b:/r/sites/all-it/GroupDrive/DOMAINS/Data%20%26%20AI/Reporting/MiHub%206.0/Omni%20Documentation/Omni%20developer%20knowledge%20base/Omni%20Developer%20Training_5616.pdf?d=w2cd6e6392927471a9250477ceaa3d17a&csf=1&web=1&e=ETT57U",
  },
];
