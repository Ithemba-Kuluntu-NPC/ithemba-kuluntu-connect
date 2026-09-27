import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDirectory = "public/assets/generated-performance";

const jpegJobs = [
  ["public/assets/photos/partners/partners-beautiful-team-photo-with-sa-harvest.jpg", "partners-beautiful-team-photo-with-sa-harvest-web.jpg", 2400],
  ["public/assets/photos/home/main-ecd-project-title-2.jpg", "home-main-ecd-project-title-2-web.jpg", 1600],
  ["public/assets/photos/project-overview/main-ecd-project-title-2.jpg", "project-overview-main-ecd-project-title-2-web.jpg", 1600],
  ["public/assets/photos/about/about-full-team-jumping-high-res-awesome.jpg", "about-full-team-jumping-high-res-awesome-web.jpg", 1600],
  ["public/assets/photos/projects/ECD/ECD-close-up-boy-eating-breakfast-porrdige.jpg", "ECD-close-up-boy-eating-breakfast-porrdige-web.jpg", 1600],
  ["public/assets/photos/projects/ECD/ECD-children-playing-with-ring.jpg", "ECD-children-playing-with-ring-web.jpg", 1600],
  ["public/assets/photos/projects/ECD/ECD-group-photo-with-children-and-teacher.jpg", "ECD-group-photo-with-children-and-teacher-web.jpg", 1600],
  ["public/assets/photos/projects/pureflow/pureflow-ecd-handout-event-smiling-mom-at-training-station.jpg", "pureflow-ecd-handout-event-smiling-mom-at-training-station-web.jpg", 1600],
  ["public/assets/photos/projects/pureflow/pureflow-home-visit-filter-installation-family-01.jpg", "pureflow-home-visit-filter-installation-family-01-web.jpg", 1600],
  ["public/assets/photos/projects/pureflow/pureflow-step-01-structural-problem-3.jpg", "pureflow-step-01-structural-problem-3-web.jpg", 1600],
  ["public/assets/photos/projects/pureflow/pureflow-community-engagement-sibonda-outdoor-meeting-team-and-filter-01.jpg", "pureflow-community-engagement-sibonda-outdoor-meeting-team-and-filter-01-web.jpg", 1600],
  ["public/assets/photos/projects/pureflow/pureflow-happy-dancing-recipients-of-filter-after-event.jpg", "pureflow-happy-dancing-recipients-of-filter-after-event-web.jpg", 1600],
  ["public/assets/photos/projects/pureflow/pureflow-handout-event-01-assembly-components-table-01.jpg", "pureflow-handout-event-01-assembly-components-table-01-web.jpg", 1600],
  ["public/assets/photos/projects/pureflow/pureflow-community-engagement-royal-house-large-community-meeting-01.jpg", "pureflow-community-engagement-royal-house-large-community-meeting-01-web.jpg", 1600],
  ["public/assets/photos/projects/foodsecurity/food-security-community-meals-mother-and-child-eating-community-meal-30.jpg", "food-security-community-meals-mother-and-child-eating-community-meal-30-web.jpg", 1920],
  ["public/assets/photos/projects/foodsecurity/food-security-greenhouse-harvest-close-up-of-spinach-leaves-01.jpg", "food-security-greenhouse-harvest-close-up-of-spinach-leaves-01-web.jpg", 1600],
  ["public/assets/photos/projects/foodsecurity/food-security-partner-support-woman-seated-with-rise-against-hunger-box-05.jpg", "food-security-partner-support-woman-seated-with-rise-against-hunger-box-05-web.jpg", 1600],
  ["public/assets/photos/projects/greenhouse/Greenhouse-wide-angle-beautiful-light.jpg", "Greenhouse-wide-angle-beautiful-light-web.jpg", 1920],
  ["public/assets/photos/projects/pondodogs/20251009_155233(0).jpg", "20251009_155233(0)-web.jpg", 1600],
  ["public/assets/photos/projects/pondodogs/20251102_133018.jpg", "20251102_133018-web.jpg", 1600],
  ["public/assets/photos/projects/pondodogs/20260130_163511.jpg", "20260130_163511-web.jpg", 1600],
  ["public/assets/photos/projects/pondodogs/20260401_113020.jpg", "20260401_113020-web.jpg", 1600],
  ["public/assets/photos/partners/partners-training-gift-of-the-givers-pureflow.jpg", "partners-training-gift-of-the-givers-pureflow-web.jpg", 1600],
  ["public/assets/photos/partners/partners-beautiful-team-photo-with-giftofthegivers.jpg", "partners-beautiful-team-photo-with-giftofthegivers-web.jpg", 1600],
  ["public/assets/photos/donate/donate-adult-hand-holding-kids-hand.jpg", "donate-adult-hand-holding-kids-hand-web.jpg", 1920],
];

await mkdir(outputDirectory, { recursive: true });

for (const [source, filename, maxLongEdge] of jpegJobs) {
  const destination = path.join(outputDirectory, filename);
  await sharp(source)
    .autoOrient()
    .resize({
      width: maxLongEdge,
      height: maxLongEdge,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 85, mozjpeg: true, chromaSubsampling: "4:2:0" })
    .toFile(destination);
}

await sharp("public/assets/logos/pondo-dogs-logo.png")
  .autoOrient()
  .resize({ width: 512, height: 512, fit: "inside", withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: false })
  .toFile(path.join(outputDirectory, "pondo-dogs-logo-web.png"));

console.log(`Generated ${jpegJobs.length + 1} Phase 1 media derivatives in ${outputDirectory}.`);
