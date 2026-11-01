import { PrismaClient, Platform } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding platforms metadata...");

  const platformsData: {
    platform: Platform;
    displayName: string;
    description: string;
    state: string;
    capabilities: string[];
    iconSvg?: string;
  }[] = [
    {
      platform: "YOUTUBE",
      displayName: "YouTube",
      description:
        "Follow YouTube creators, channels, and playlists with rich embeds.",
      state: "SUPPORTED",
      capabilities: [
        "PROFILE_LOOKUP",
        "PUBLIC_POST_DISCOVERY",
        "EMBED_PLAYBACK",
        "PAGINATION",
      ],
    },
    {
      platform: "REDDIT",
      displayName: "Reddit",
      description: "Subscribe to subreddits and creator user feeds.",
      state: "SUPPORTED",
      capabilities: [
        "PROFILE_LOOKUP",
        "PUBLIC_POST_DISCOVERY",
        "EMBED_PLAYBACK",
        "PAGINATION",
      ],
    },
    {
      platform: "RSS",
      displayName: "RSS / Atom",
      description: "Follow open web feeds, newsletters, and publication blogs.",
      state: "SUPPORTED",
      capabilities: [
        "PROFILE_LOOKUP",
        "RSS_DISCOVERY",
        "PUBLIC_POST_DISCOVERY",
        "PAGINATION",
      ],
    },
    {
      platform: "X",
      displayName: "X (Twitter)",
      description: "Follow verified public profiles and creators on X.",
      state: "AUTH_REQUIRED",
      capabilities: ["PROFILE_LOOKUP", "EMBED_PLAYBACK"],
    },
    {
      platform: "TIKTOK",
      displayName: "TikTok",
      description: "Follow TikTok creators with sandboxed video embeds.",
      state: "AUTH_REQUIRED",
      capabilities: ["PROFILE_LOOKUP", "EMBED_PLAYBACK"],
    },
    {
      platform: "INSTAGRAM",
      displayName: "Instagram",
      description: "Follow Instagram creators via official Graph API.",
      state: "AUTH_REQUIRED",
      capabilities: ["PROFILE_LOOKUP", "EMBED_PLAYBACK"],
    },
    {
      platform: "FACEBOOK",
      displayName: "Facebook Pages",
      description: "Follow public Facebook creator and news pages.",
      state: "AUTH_REQUIRED",
      capabilities: ["PROFILE_LOOKUP"],
    },
    {
      platform: "LINKEDIN",
      displayName: "LinkedIn",
      description: "Follow professional creator articles and updates.",
      state: "AUTH_REQUIRED",
      capabilities: ["PROFILE_LOOKUP"],
    },
  ];

  for (const p of platformsData) {
    await prisma.platformMeta.upsert({
      where: { platform: p.platform },
      update: p,
      create: p,
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
