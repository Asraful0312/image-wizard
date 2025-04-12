import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from "./motion-primitives/image-comparison";

export function ImageComparisonSpring({
  preview,
  converted,
}: {
  preview: string;
  converted: string;
}) {
  return (
    <ImageComparison
      className="aspect-16/10 w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
      enableHover
      springOptions={{
        bounce: 0.3,
      }}
    >
      <ImageComparisonImage
        src={preview}
        alt="Motion Primitives Dark"
        position="left"
      />
      <ImageComparisonImage
        src={converted}
        alt="Motion Primitives Light"
        position="right"
      />
      <ImageComparisonSlider className="w-0.5 bg-white/30 backdrop-blur-xs" />
    </ImageComparison>
  );
}
