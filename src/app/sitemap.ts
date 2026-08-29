import { prisma } from "@/lib/prisma";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ecoles-ci.com"; // à remplacer par ton vrai nom de domaine plus tard

  const ecoles = await prisma.school.findMany({
    select: { slug: true, updatedAt: true },
  });

  const pagesEcoles: MetadataRoute.Sitemap = ecoles.map((ecole) => ({
    url: `${baseUrl}/ecole/${ecole.slug}`,
    lastModified: ecole.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const pagesStatiques: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/recherche`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/carte`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  return [...pagesStatiques, ...pagesEcoles];
}