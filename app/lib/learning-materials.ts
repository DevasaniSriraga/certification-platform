export type AdditionalResource = {
  id: string;
  title: string;
  description: string;
  url: string;
};

export const additionalResources: AdditionalResource[] = [
  {
    id: "docs",
    title: "Docs",
    description: "Check out our docs for all the technical details of the Omni platform.",
    url: "https://docs.omni.co/",
  },
  {
    id: "community",
    title: "Community",
    description: "Browse our community site for how-to articles and best practices.",
    url: "https://community.omni.co/",
  },
  {
    id: "eng-demos",
    title: "Eng demos",
    description: "Watch our weekly engineering demos to see what we're building.",
    url: "https://docs.omni.co/demos",
  },
];
