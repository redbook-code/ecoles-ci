import { prisma } from "@/lib/prisma";

export default async function AdBanner({ placement }: { placement: string }) {
  const ad = await prisma.ad.findFirst({
    where: {
      placement,
      isActive: true,
      OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
    },
    orderBy: { createdAt: "desc" },
  });

  if (!ad) {
    return null;
  }

  await prisma.ad.update({
    where: { id: ad.id },
    data: { impressions: { increment: 1 } },
  });

  return (
    <div className="w-full">
      <p className="text-xs text-zinc-400 mb-1 text-center">Publicite</p>
      
        <a href={`/api/ads/${ad.id}/click`} target="_blank" rel="noopener noreferrer" className="block rounded-xl overflow-hidden border border-zinc-200 hover:opacity-90 transition">
        <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto" />
      </a>
    </div>
  );
}